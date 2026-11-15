import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const stores = await prisma.sampleStore.findMany({
      include: {
        _count: { select: { rewards: true } },
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ stores });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch stores." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const body = await req.json();
    const { name, address, city, description, phone, imageUrl } = body;

    const storeCode = `STORE-${Date.now().toString().slice(-4)}`;

    const store = await prisma.sampleStore.create({
      data: {
        storeCode,
        name,
        address,
        city: city || "Phagwara",
        description: description || "",
        phone: phone || null,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action: "STORE_CREATED",
        details: `Added new simulated store: ${store.name} (${store.storeCode}).`,
      },
    });

    return NextResponse.json({ success: true, store }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to create store." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const body = await req.json();
    const { id, name, address, city, description, phone, imageUrl, isActive } = body;

    const store = await prisma.sampleStore.update({
      where: { id },
      data: {
        name,
        address,
        city,
        description,
        phone,
        imageUrl,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
    });

    return NextResponse.json({ success: true, store });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update store." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    await prisma.sampleStore.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete store." }, { status: 500 });
  }
}
