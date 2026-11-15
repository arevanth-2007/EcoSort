import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { classifyWasteImageBuffer } from "@/lib/ai";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const { submissionId } = body;

    if (!submissionId) {
      return NextResponse.json({ error: "Missing submissionId" }, { status: 400 });
    }

    const submission = await prisma.wasteSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    let imageBuffer: Buffer;
    if (submission.imageUrl.startsWith("/uploads/")) {
      const localPath = path.join(process.cwd(), "public", submission.imageUrl);
      if (!fs.existsSync(localPath)) {
        return NextResponse.json({ error: `Image file not found on server disk at ${localPath}` }, { status: 404 });
      }
      imageBuffer = fs.readFileSync(localPath);
    } else if (submission.imageUrl.startsWith("http://") || submission.imageUrl.startsWith("https://")) {
      const imgRes = await fetch(submission.imageUrl);
      if (!imgRes.ok) {
        return NextResponse.json(
          { error: `Failed to download image from external URL (${imgRes.status} ${imgRes.statusText})` },
          { status: 502 }
        );
      }
      const arrayBuffer = await imgRes.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    } else {
      return NextResponse.json({ error: "Unrecognized image URL format" }, { status: 400 });
    }

    // Load settings for confidence threshold
    const settings = await prisma.systemSettings.upsert({
      where: { id: "global" },
      update: {},
      create: { id: "global" },
    });

    // Call real Google Gemini Vision API
    const aiResult = await classifyWasteImageBuffer(
      imageBuffer,
      submission.userSelectedCategory,
      settings.confidenceThreshold
    );

    if (!aiResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: aiResult.error || "Google Gemini Vision failed to classify image.",
        },
        { status: 502 }
      );
    }

    // Save AIAnalysis record and update submission status
    const analysis = await prisma.$transaction(async (tx) => {
      const savedAnalysis = await tx.aIAnalysis.upsert({
        where: { submissionId: submission.id },
        update: {
          predictedCategory: aiResult.predictedCategory || "OTHER",
          confidence: aiResult.confidence || 0,
          rawLabel: aiResult.rawLabel || "unknown",
          modelUsed: aiResult.modelUsed,
          analyzedAt: new Date(),
        },
        create: {
          submissionId: submission.id,
          predictedCategory: aiResult.predictedCategory || "OTHER",
          confidence: aiResult.confidence || 0,
          rawLabel: aiResult.rawLabel || "unknown",
          modelUsed: aiResult.modelUsed,
        },
      });

      // Update submission with AI predictions and transition to AI_ANALYZED
      await tx.wasteSubmission.update({
        where: { id: submission.id },
        data: {
          aiPredictedCategory: aiResult.predictedCategory,
          aiConfidence: aiResult.confidence,
          aiModelUsed: aiResult.modelUsed,
          status: "AI_ANALYZED",
        },
      });

      return savedAnalysis;
    });

    return NextResponse.json({
      success: true,
      analysis,
      aiResult,
      message: "AI analysis completed successfully.",
    });
  } catch (err: any) {
    console.error("AI analysis error:", err);
    return NextResponse.json({ error: err.message || "Failed to analyze image with AI" }, { status: 500 });
  }
}
