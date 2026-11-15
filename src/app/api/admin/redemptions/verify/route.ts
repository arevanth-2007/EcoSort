import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { generateCode } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    const redemptions = await prisma.redemption.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, mobile: true } },
        reward: { include: { sampleStore: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ redemptions });
  }

  const redemption = await prisma.redemption.findFirst({
    where: {
      OR: [
        { redemptionCode: code.trim().toUpperCase() },
        { qrSecret: code.trim() },
      ],
    },
    include: {
      user: { select: { id: true, name: true, email: true, mobile: true } },
      reward: { include: { sampleStore: true } },
    },
  });

  if (!redemption) {
    return NextResponse.json({ error: "No redemption found matching this code." }, { status: 404 });
  }

  return NextResponse.json({ redemption });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const { redemptionId, action, notes } = await req.json();

    const redemption = await prisma.redemption.findUnique({
      where: { id: redemptionId },
      include: {
        user: true,
        reward: true,
      },
    });

    if (!redemption) {
      return NextResponse.json({ error: "Redemption record not found." }, { status: 404 });
    }

    if (action === "VERIFY_REDEEM") {
      if (redemption.status !== "PENDING") {
        return NextResponse.json({ error: `Cannot fulfill redemption with status '${redemption.status}'.` }, { status: 400 });
      }

      const updated = await prisma.redemption.update({
        where: { id: redemption.id },
        data: {
          status: "REDEEMED",
          redeemedAt: new Date(),
          adminNotes: notes || "Verified and handed over at partner desk.",
        },
        include: {
          user: true,
          reward: true,
        },
      });

      await prisma.auditLog.create({
        data: {
          adminId: admin.id,
          adminEmail: admin.email,
          action: "REDEMPTION_VERIFIED",
          details: `Redemption ${redemption.redemptionCode} fulfilled for citizen ${redemption.user.name}. Item: ${redemption.reward.title}.`,
        },
      });

      // Notification
      await prisma.notification.create({
        data: {
          userId: redemption.userId,
          title: "Redemption Verified & Handed Over! 🎁",
          message: `Your reward '${redemption.reward.title}' (${redemption.redemptionCode}) was successfully verified and collected.`,
          type: "REWARD_REDEEMED",
        },
      });

      return NextResponse.json({ success: true, redemption: updated });
    } else if (action === "CANCEL") {
      if (redemption.status !== "PENDING") {
        return NextResponse.json({ error: "Only pending redemptions can be cancelled." }, { status: 400 });
      }

      // Cancel and refund coins
      const txnCode = generateCode("ECO-TXN");

      const updated = await prisma.$transaction(async (tx) => {
        // Return item to stock
        await tx.reward.update({
          where: { id: redemption.rewardId },
          data: { stock: { increment: 1 } },
        });

        // Refund wallet
        const wallet = await tx.wallet.update({
          where: { userId: redemption.userId },
          data: {
            balance: { increment: redemption.coinCost },
            totalSpent: { decrement: redemption.coinCost },
          },
        });

        // Record refund txn
        await tx.walletTransaction.create({
          data: {
            transactionCode: txnCode,
            walletId: wallet.id,
            type: "ADMIN_ADJUSTMENT",
            amount: redemption.coinCost,
            balanceAfter: wallet.balance,
            description: `Refund for cancelled redemption (${redemption.redemptionCode})`,
            referenceId: redemption.redemptionCode,
          },
        });

        // Update redemption status
        const cancelled = await tx.redemption.update({
          where: { id: redemption.id },
          data: {
            status: "CANCELLED",
            cancelledAt: new Date(),
            adminNotes: notes || "Cancelled by store administrator. Coins refunded.",
          },
          include: { user: true, reward: true },
        });

        // Notify citizen
        await tx.notification.create({
          data: {
            userId: redemption.userId,
            title: "Redemption Cancelled & Coins Refunded ↩️",
            message: `Your redemption ${redemption.redemptionCode} was cancelled. ${redemption.coinCost} Green Coins have been refunded to your wallet.`,
            type: "REDEMPTION_CANCELLED",
          },
        });

        return cancelled;
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          adminId: admin.id,
          adminEmail: admin.email,
          action: "REDEMPTION_CANCELLED",
          details: `Cancelled redemption ${redemption.redemptionCode} and refunded ${redemption.coinCost} GC to ${redemption.user.email}.`,
        },
      });

      return NextResponse.json({ success: true, redemption: updated });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err: any) {
    console.error("Redemption verify error:", err);
    return NextResponse.json({ error: "Failed to process redemption." }, { status: 500 });
  }
}
