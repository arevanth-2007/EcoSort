import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { calculateImageHash } from "@/lib/crypto";
import { generateCode } from "@/lib/utils";
import { WasteCategory } from "@/lib/types";
import { uploadWasteImage } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "CITIZEN") {
      return NextResponse.json(
        { error: "Only authenticated citizens can submit waste for verification." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const category = formData.get("category") as WasteCategory | null;
    const weightRaw = formData.get("weight") as string | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: "Please upload an image of the segregated waste item." },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Please select the waste category you are submitting." },
        { status: 400 }
      );
    }

    const weightKg = parseFloat(weightRaw || "0");
    if (isNaN(weightKg) || weightKg <= 0) {
      return NextResponse.json(
        { error: "Please enter a valid weight greater than 0 kg." },
        { status: 400 }
      );
    }

    const settings = await prisma.systemSettings.upsert({
      where: { id: "global" },
      update: {},
      create: { id: "global" },
    });

    if (weightKg > settings.maxWeightPerSubmission) {
      return NextResponse.json(
        {
          error: `Weight exceeds maximum allowed per submission (${settings.maxWeightPerSubmission} kg). Please submit in smaller batches.`,
        },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, or WebP images are supported." },
        { status: 400 }
      );
    }

    if (imageFile.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image file size exceeds the 8MB limit." },
        { status: 400 }
      );
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imageHash = calculateImageHash(buffer);

    const duplicateSubmission = await prisma.wasteSubmission.findFirst({
      where: { imageHash },
      select: { submissionCode: true, createdAt: true },
    });

    if (duplicateSubmission) {
      return NextResponse.json(
        {
          error: `Duplicate submission detected: This exact image was already submitted under ${duplicateSubmission.submissionCode}. Re-uploading previously submitted images is strictly prohibited.`,
        },
        { status: 409 }
      );
    }

    const fileExt = (imageFile.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const fileName = `eco-${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExt || "jpg"}`;
    const { imageUrl } = await uploadWasteImage(buffer, fileName, imageFile.type);

    const submissionCode = generateCode("ECO-SUB");

    const submission = await prisma.wasteSubmission.create({
      data: {
        submissionCode,
        userId: session.id,
        userSelectedCategory: category,
        imageUrl,
        imageHash,
        weightKg,
        coinsAwarded: 0,
        status: "PENDING",
        verificationMethod: "NONE",
      },
    });

    await prisma.notification.create({
      data: {
        userId: session.id,
        title: "Submission Received (Under Review)",
        message: `Your ${weightKg} kg ${category} waste submission (${submissionCode}) was received. It is awaiting verification in the administrative queue. Green Coins will be credited upon approval.`,
        type: "SYSTEM_ANNOUNCEMENT",
        link: `/citizen/submissions/${submission.id}`,
      },
    });

    return NextResponse.json({
      success: true,
      submissionCode,
      submissionId: submission.id,
      status: "PENDING",
      message: "Waste submission submitted successfully and queued for administrative analyzer verification.",
      submission: {
        id: submission.id,
        submissionCode: submission.submissionCode,
        category,
        weightKg,
        imageUrl,
        status: "PENDING",
        createdAt: submission.createdAt,
      },
    });
  } catch (err: any) {
    console.error("Waste submission error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to submit waste item. Please try again." },
      { status: 500 }
    );
  }
}
