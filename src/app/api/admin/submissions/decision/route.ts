import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import {
  calculateGreenCoins,
  generateCode,
  getEcoLevelInfo,
} from "@/lib/utils";
import { WasteCategory } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      submissionId,
      decision,
      verificationMethod = "MANUAL",
      finalCategory,
      rejectionReason,
      adminNotes,
    } = body;

    if (!submissionId) {
      return NextResponse.json(
        { error: "Missing submissionId" },
        { status: 400 }
      );
    }

    if (decision !== "APPROVE" && decision !== "REJECT") {
      return NextResponse.json(
        { error: "Decision must be either 'APPROVE' or 'REJECT'" },
        { status: 400 }
      );
    }

    if (decision === "REJECT" && !rejectionReason?.trim()) {
      return NextResponse.json(
        { error: "A rejection reason is required when rejecting a submission." },
        { status: 400 }
      );
    }

    const submission = await prisma.wasteSubmission.findUnique({
      where: {
        id: submissionId,
      },
      include: {
        user: {
          include: {
            wallet: true,
            citizenProfile: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    if (submission.status === "APPROVED" || submission.status === "REJECTED") {
      return NextResponse.json(
        {
          error: `This submission has already been adjudicated as ${submission.status}. Duplicate decisions are prevented.`,
        },
        { status: 409 }
      );
    }

    const categoryToUse: WasteCategory =
      (finalCategory as WasteCategory) || submission.userSelectedCategory;

    const settings = await prisma.systemSettings.upsert({
      where: { id: "global" },
      update: {},
      create: { id: "global" },
    });

    let ratePerKg = 0;
    switch (categoryToUse) {
      case "PLASTIC":
        ratePerKg = settings.plasticRate;
        break;
      case "PAPER":
        ratePerKg = settings.paperRate;
        break;
      case "CARDBOARD":
        ratePerKg = settings.cardboardRate;
        break;
      case "GLASS":
        ratePerKg = settings.glassRate;
        break;
      case "METAL":
        ratePerKg = settings.metalRate;
        break;
      case "ORGANIC":
        ratePerKg = settings.organicRate;
        break;
      case "E_WASTE":
        ratePerKg = settings.ewasteRate;
        break;
      default:
        ratePerKg = 0;
    }

    const coinsToAward =
      decision === "APPROVE"
        ? calculateGreenCoins(submission.weightKg, ratePerKg)
        : 0;

    const txnCode = generateCode("ECO-TXN");

    const result = await prisma.$transaction(async (tx) => {
      const updatedSubmission = await tx.wasteSubmission.update({
        where: { id: submission.id },
        data: {
          status: decision === "APPROVE" ? "APPROVED" : "REJECTED",
          verificationMethod,
          coinsAwarded: coinsToAward,
          rejectionReason: decision === "REJECT" ? rejectionReason : null,
          adminNotes: adminNotes || submission.adminNotes,
          reviewedById: session.id,
          reviewedAt: new Date(),
        },
      });

      if (decision === "APPROVE") {
        const currentWallet = await tx.wallet.upsert({
          where: { userId: submission.userId },
          update: {
            balance: { increment: coinsToAward },
            totalEarned: { increment: coinsToAward },
          },
          create: {
            userId: submission.userId,
            balance: coinsToAward,
            totalEarned: coinsToAward,
            totalSpent: 0,
          },
        });

        await tx.walletTransaction.create({
          data: {
            transactionCode: txnCode,
            walletId: currentWallet.id,
            type: "WASTE_REWARD",
            amount: coinsToAward,
            balanceAfter: currentWallet.balance,
            description: `Recycled ${submission.weightKg} kg ${categoryToUse} (${submission.submissionCode})`,
            referenceId: submission.submissionCode,
          },
        });

        const updatedProfile = await tx.citizenProfile.upsert({
          where: { userId: submission.userId },
          update: {
            totalApprovedWeightKg: { increment: submission.weightKg },
            approvedSubmissionsCount: { increment: 1 },
          },
          create: {
            userId: submission.userId,
            totalApprovedWeightKg: submission.weightKg,
            approvedSubmissionsCount: 1,
            ecoLevel: 1,
            ecoTitle: "Eco Beginner",
          },
        });

        const levelInfo = getEcoLevelInfo(updatedProfile.totalApprovedWeightKg);
        if (levelInfo.level > updatedProfile.ecoLevel) {
          await tx.citizenProfile.update({
            where: { userId: submission.userId },
            data: {
              ecoLevel: levelInfo.level,
              ecoTitle: levelInfo.title,
            },
          });

          await tx.notification.create({
            data: {
              userId: submission.userId,
              title: `Eco Level Up! Reached ${levelInfo.title} 🌟`,
              message: `Your environmental contributions promoted you to Eco Level ${levelInfo.level}! Keep recycling to save the planet.`,
              type: "BADGE_UNLOCKED",
            },
          });
        }

        await tx.notification.create({
          data: {
            userId: submission.userId,
            title: `Submission Approved! (+${coinsToAward} GC)`,
            message: `Your ${submission.weightKg} kg of ${categoryToUse} waste (${submission.submissionCode}) has been verified and approved. ${coinsToAward} Green Coins credited to your wallet!`,
            type: "SUBMISSION_APPROVED",
            link: `/citizen/submissions/${submission.id}`,
          },
        });

        await tx.auditLog.create({
          data: {
            adminId: session.id,
            adminEmail: session.email,
            action: "SUBMISSION_APPROVED",
            details: `Approved submission ${submission.submissionCode} (${submission.weightKg} kg ${categoryToUse}) with ${coinsToAward} Green Coins via ${verificationMethod}.`,
          },
        });
      } else {
        await tx.notification.create({
          data: {
            userId: submission.userId,
            title: "Submission Not Approved",
            message: `Your waste submission (${submission.submissionCode}) could not be approved. Reason: ${rejectionReason}`,
            type: "SUBMISSION_REJECTED",
            link: `/citizen/submissions/${submission.id}`,
          },
        });

        await tx.auditLog.create({
          data: {
            adminId: session.id,
            adminEmail: session.email,
            action: "SUBMISSION_REJECTED",
            details: `Rejected submission ${submission.submissionCode}. Reason: ${rejectionReason}`,
          },
        });
      }

      return updatedSubmission;
    });

    return NextResponse.json({
      success: true,
      decision,
      coinsAwarded: coinsToAward,
      submission: result,
      message:
        decision === "APPROVE"
          ? `Submission ${submission.submissionCode} approved successfully! Awarded ${coinsToAward} Green Coins.`
          : `Submission ${submission.submissionCode} rejected. Reason logged and citizen notified.`,
    });
  } catch (err: any) {
    console.error("Adjudication error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to adjudicate submission" },
      { status: 500 }
    );
  }
}