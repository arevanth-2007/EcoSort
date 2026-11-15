import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        citizenProfile: true,
        wallet: true,
        _count: {
          select: {
            notifications: {
              where: { isRead: false },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        citizenId: user.citizenId,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        address: user.address,
        avatarUrl: user.avatarUrl,
        ecoLevel: user.citizenProfile?.ecoLevel ?? 1,
        ecoTitle: user.citizenProfile?.ecoTitle ?? "Eco Beginner",
        totalApprovedWeightKg: user.citizenProfile?.totalApprovedWeightKg ?? 0,
        approvedSubmissionsCount: user.citizenProfile?.approvedSubmissionsCount ?? 0,
        balance: user.wallet?.balance ?? 0,
        unreadNotifications: user._count.notifications,
      },
    });
  } catch (err: any) {
    console.error("Error in /api/auth/me:", err);
    return NextResponse.json({ error: "Failed to fetch user state" }, { status: 500 });
  }
}
