import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashPassword, signSessionToken, COOKIE_NAME } from "@/lib/auth";
import { generateUniqueCitizenId } from "@/lib/citizenId";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, mobile, password, confirmPassword, address } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanMobile = mobile ? mobile.trim() : null;

    const existingEmail = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });
    if (existingEmail) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    if (cleanMobile) {
      const existingMobile = await prisma.user.findFirst({
        where: { mobile: cleanMobile },
      });
      if (existingMobile) {
        return NextResponse.json({ error: "An account with this mobile number already exists." }, { status: 409 });
      }
    }

    const passwordHash = await hashPassword(password);
    const citizenId = await generateUniqueCitizenId(name.trim(), prisma);

    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          citizenId,
          name: name.trim(),
          email: cleanEmail,
          mobile: cleanMobile,
          passwordHash,
          role: "CITIZEN",
          status: "ACTIVE",
          address: address ? address.trim() : null,
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
        },
      });

      await tx.citizenProfile.create({
        data: {
          userId: user.id,
          ecoLevel: 1,
          ecoTitle: "Eco Beginner",
          totalApprovedWeightKg: 0,
          approvedSubmissionsCount: 0,
          city: address ? address.split(",")[0].trim() : "Hyderabad",
        },
      });

      await tx.wallet.create({
        data: {
          userId: user.id,
          balance: 0,
          totalEarned: 0,
          totalSpent: 0,
        },
      });

      // Citizen ID Notification
      await tx.notification.create({
        data: {
          userId: user.id,
          title: "Your EcoSort Citizen ID",
          message: `Welcome to EcoSort!\n\nYour permanent EcoSort Citizen ID is ${citizenId}.\n\nYou can use this ID to identify your account and view it in your profile, dashboard, wallet, and impact report.\n\nKeep your EcoSort Citizen ID safe.`,
          type: "ACCOUNT",
          link: "/citizen/profile",
        },
      });

      return user;
    });

    // 4. Create Session
    const token = await signSessionToken({
      id: newUser.id,
      citizenId: newUser.citizenId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      mobile: newUser.mobile,
      avatarUrl: newUser.avatarUrl,
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          citizenId: newUser.citizenId,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Citizen signup error:", error);
    return NextResponse.json({ error: "Failed to create account. Please try again." }, { status: 500 });
  }
}
