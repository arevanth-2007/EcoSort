import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyPassword, signSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json({ error: "Email/Mobile and password are required." }, { status: 400 });
    }

    const cleanIdentifier = identifier.trim();

    const user = await prisma.user.findFirst({
      where: {
        role: "CITIZEN",
        OR: [
          { email: cleanIdentifier.toLowerCase() },
          { mobile: cleanIdentifier },
        ],
      },
      include: {
        citizenProfile: true,
        wallet: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email/mobile or password." }, { status: 401 });
    }

    if (user.status === "BLOCKED") {
      return NextResponse.json(
        { error: "This citizen account has been suspended by administration. Please contact support." },
        { status: 403 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email/mobile or password." }, { status: 401 });
    }

    const token = await signSessionToken({
      id: user.id,
      citizenId: user.citizenId,
      name: user.name,
      email: user.email,
      role: user.role,
      mobile: user.mobile,
      avatarUrl: user.avatarUrl,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        citizenId: user.citizenId,
        name: user.name,
        email: user.email,
        role: user.role,
        ecoLevel: user.citizenProfile?.ecoLevel || 1,
        ecoTitle: user.citizenProfile?.ecoTitle || "Eco Beginner",
        balance: user.wallet?.balance || 0,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Citizen login error:", error);
    return NextResponse.json({ error: "Authentication failed. Please try again." }, { status: 500 });
  }
}
