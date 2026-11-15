import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  try {
    const citizens = await prisma.user.findMany({
      where: {
        role: "CITIZEN",
        OR: search
          ? [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { mobile: { contains: search } },
            ]
          : undefined,
      },
      include: {
        citizenProfile: true,
        wallet: true,
        _count: {
          select: {
            submissions: true,
            redemptions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ citizens });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch citizens." }, { status: 500 });
  }
}
