import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (category && category !== "ALL") {
      where.userSelectedCategory = category;
    }

    if (search) {
      where.OR = [
        { submissionCode: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [total, submissions] = await Promise.all([
      prisma.wasteSubmission.count({ where }),
      prisma.wasteSubmission.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
          aiAnalysis: true,
          manualInspection: true,
          reviewedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const [pendingCount, aiAnalyzedCount, manualInspectionCount, approvedCount, rejectedCount] = await Promise.all([
      prisma.wasteSubmission.count({ where: { status: "PENDING" } }),
      prisma.wasteSubmission.count({ where: { status: "AI_ANALYZED" } }),
      prisma.wasteSubmission.count({ where: { status: "MANUAL_INSPECTION" } }),
      prisma.wasteSubmission.count({ where: { status: "APPROVED" } }),
      prisma.wasteSubmission.count({ where: { status: "REJECTED" } }),
    ]);

    return NextResponse.json({
      submissions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      counts: {
        all: total,
        pending: pendingCount,
        aiAnalyzed: aiAnalyzedCount,
        manualInspection: manualInspectionCount,
        needsReview: pendingCount + aiAnalyzedCount + manualInspectionCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
    });
  } catch (err: any) {
    console.error("Failed to fetch admin submissions:", err);
    return NextResponse.json({ error: err.message || "Failed to load submissions" }, { status: 500 });
  }
}
