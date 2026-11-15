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

    const campaigns = await prisma.adminNotificationCampaign.findMany({
      orderBy: { createdAt: "desc" },
      take: 60,
      include: {
        sentBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ campaigns });
  } catch (error: any) {
    console.error("Admin notification history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification history." },
      { status: 500 }
    );
  }
}
