import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").trim();

    if (!query) {
      const recentCitizens = await prisma.user.findMany({
        where: { role: "CITIZEN" },
        select: {
          id: true,
          name: true,
          email: true,
          citizenId: true,
          avatarUrl: true,
          status: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
      return NextResponse.json({ citizens: recentCitizens });
    }

    const citizens = await prisma.user.findMany({
      where: {
        role: "CITIZEN",
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { citizenId: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        citizenId: true,
        avatarUrl: true,
        status: true,
      },
      take: 15,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ citizens });
  } catch (error: any) {
    console.error("Citizen search error:", error);
    return NextResponse.json({ error: "Failed to search citizens." }, { status: 500 });
  }
}
