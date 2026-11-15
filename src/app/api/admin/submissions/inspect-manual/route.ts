import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { WasteCategory } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const { submissionId, selectedCategory, notes } = body;

    if (!submissionId) {
      return NextResponse.json({ error: "Missing submissionId" }, { status: 400 });
    }

    if (!selectedCategory) {
      return NextResponse.json({ error: "Missing selectedCategory" }, { status: 400 });
    }

    const submission = await prisma.wasteSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const manualInspection = await prisma.$transaction(async (tx) => {
      const inspection = await tx.manualInspection.upsert({
        where: { submissionId: submission.id },
        update: {
          adminId: session.id,
          selectedCategory,
          notes: notes || null,
          inspectedAt: new Date(),
        },
        create: {
          submissionId: submission.id,
          adminId: session.id,
          selectedCategory,
          notes: notes || null,
        },
      });

      await tx.wasteSubmission.update({
        where: { id: submission.id },
        data: {
          status: "MANUAL_INSPECTION",
          adminNotes: notes || submission.adminNotes,
        },
      });

      return inspection;
    });

    return NextResponse.json({
      success: true,
      manualInspection,
      message: "Manual inspection saved successfully.",
    });
  } catch (err: any) {
    console.error("Manual inspection error:", err);
    return NextResponse.json({ error: err.message || "Failed to record manual inspection" }, { status: 500 });
  }
}
