import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyPassword, signSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    const admin = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }

    const isMatch = await verifyPassword(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action: "ADMIN_LOGIN",
        details: `Administrator ${admin.name} logged into management portal.`,
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    const token = await signSessionToken({
      id: admin.id,
      citizenId: admin.citizenId,
      name: admin.name,
      email: admin.email,
      role: "ADMIN",
      mobile: admin.mobile,
      avatarUrl: admin.avatarUrl,
    });

    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "ADMIN",
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
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Admin login failed." }, { status: 500 });
  }
}
