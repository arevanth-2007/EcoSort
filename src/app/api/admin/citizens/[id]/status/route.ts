import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await req.json();

  if (!["ACTIVE", "BLOCKED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { status },
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action: status === "BLOCKED" ? "CITIZEN_BLOCKED" : "CITIZEN_UNBLOCKED",
        details: `Citizen ${user.name} (${user.email}) status changed to ${status}.`,
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update citizen status." }, { status: 500 });
  }
}
