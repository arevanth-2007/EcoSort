import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await prisma.systemSettings.upsert({
      where: { id: "global" },
      update: {},
      create: { id: "global" },
    });
    return NextResponse.json({ settings });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch settings." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const body = await req.json();
    const {
      confidenceThreshold,
      plasticRate,
      paperRate,
      cardboardRate,
      glassRate,
      metalRate,
      organicRate,
      ewasteRate,
      maxWeightPerSubmission,
      demoMode,
      aiModelId,
    } = body;

    const updated = await prisma.systemSettings.update({
      where: { id: "global" },
      data: {
        confidenceThreshold: confidenceThreshold !== undefined ? parseFloat(confidenceThreshold) : undefined,
        plasticRate: plasticRate !== undefined ? parseInt(plasticRate) : undefined,
        paperRate: paperRate !== undefined ? parseInt(paperRate) : undefined,
        cardboardRate: cardboardRate !== undefined ? parseInt(cardboardRate) : undefined,
        glassRate: glassRate !== undefined ? parseInt(glassRate) : undefined,
        metalRate: metalRate !== undefined ? parseInt(metalRate) : undefined,
        organicRate: organicRate !== undefined ? parseInt(organicRate) : undefined,
        ewasteRate: ewasteRate !== undefined ? parseInt(ewasteRate) : undefined,
        maxWeightPerSubmission: maxWeightPerSubmission !== undefined ? parseFloat(maxWeightPerSubmission) : undefined,
        aiModelId: aiModelId || undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action: "SETTINGS_UPDATED",
        details: `Updated AI threshold to ${updated.confidenceThreshold}, rates: [P:${updated.plasticRate}, C:${updated.cardboardRate}, M:${updated.metalRate}]`,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update settings." }, { status: 500 });
  }
}
