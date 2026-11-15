import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const rewards = await prisma.reward.findMany({
      include: {
        sampleStore: true,
        _count: { select: { redemptions: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ rewards });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch rewards." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, description, category, coinCost, stock, imageUrl, sampleStoreId, expiryDate } = body;

    if (!title || !coinCost || !imageUrl) {
      return NextResponse.json({ error: "Title, coin cost, and image URL are required." }, { status: 400 });
    }

    const rewardCode = `REW-${Date.now().toString().slice(-6)}`;

    const reward = await prisma.reward.create({
      data: {
        rewardCode,
        title,
        description: description || "",
        category: category || "Eco-Product",
        coinCost: parseInt(coinCost),
        stock: parseInt(stock || "50"),
        imageUrl,
        sampleStoreId: sampleStoreId || null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      },
      include: { sampleStore: true },
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action: "REWARD_CREATED",
        details: `Created reward ${reward.title} (${reward.rewardCode}) with cost ${reward.coinCost} GC.`,
      },
    });

    return NextResponse.json({ success: true, reward }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to create reward." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, title, description, category, coinCost, stock, imageUrl, isActive, sampleStoreId, expiryDate } = body;

    const reward = await prisma.reward.update({
      where: { id },
      data: {
        title,
        description,
        category,
        coinCost: coinCost !== undefined ? parseInt(coinCost) : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        imageUrl,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        sampleStoreId: sampleStoreId || null,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action: "REWARD_UPDATED",
        details: `Updated reward ${reward.title} (${reward.rewardCode}).`,
      },
    });

    return NextResponse.json({ success: true, reward });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update reward." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    const reward = await prisma.reward.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action: "REWARD_DELETED",
        details: `Deleted reward ${reward.title} (${reward.rewardCode}).`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete reward." }, { status: 500 });
  }
}
