import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { generateCode } from "@/lib/utils";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "CITIZEN") {
      return NextResponse.json({ error: "Unauthorized. Citizens only." }, { status: 401 });
    }

    const { rewardId } = await req.json();
    if (!rewardId) {
      return NextResponse.json({ error: "Reward ID is required." }, { status: 400 });
    }

    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
      include: { sampleStore: true },
    });

    if (!reward || !reward.isActive) {
      return NextResponse.json({ error: "Selected reward is currently unavailable." }, { status: 404 });
    }

    if (reward.stock <= 0) {
      return NextResponse.json({ error: "This reward is out of stock." }, { status: 400 });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.id },
    });

    if (!wallet || wallet.balance < reward.coinCost) {
      return NextResponse.json(
        {
          error: `Insufficient Green Coins. You have ${wallet?.balance || 0} GC, but this reward requires ${
            reward.coinCost
          } GC.`,
        },
        { status: 400 }
      );
    }

    const redemptionCode = generateCode("ECO-RED");
    const txnCode = generateCode("ECO-TXN");
    const qrSecret = crypto.randomBytes(16).toString("hex");

    const redemption = await prisma.$transaction(async (tx) => {
      // 1. Decrement reward stock
      await tx.reward.update({
        where: { id: reward.id },
        data: { stock: { decrement: 1 } },
      });

      // 2. Deduct coins from citizen wallet
      const updatedWallet = await tx.wallet.update({
        where: { userId: session.id },
        data: {
          balance: { decrement: reward.coinCost },
          totalSpent: { increment: reward.coinCost },
        },
      });

      // 3. Record transaction
      await tx.walletTransaction.create({
        data: {
          transactionCode: txnCode,
          walletId: updatedWallet.id,
          type: "REWARD_REDEMPTION",
          amount: -reward.coinCost,
          balanceAfter: updatedWallet.balance,
          description: `Redeemed ${reward.title} (${redemptionCode})`,
          referenceId: redemptionCode,
        },
      });

      // 4. Create Redemption Record
      const newRedemption = await tx.redemption.create({
        data: {
          redemptionCode,
          userId: session.id,
          rewardId: reward.id,
          coinCost: reward.coinCost,
          status: "PENDING",
          qrSecret,
        },
        include: {
          reward: {
            include: { sampleStore: true },
          },
        },
      });

      // 5. Create notification
      await tx.notification.create({
        data: {
          userId: session.id,
          title: "Reward Redeemed! 🎉",
          message: `Your voucher for '${reward.title}' (${redemptionCode}) is ready. Present code at ${
            reward.sampleStore?.name || "the designated hub"
          } to collect.`,
          type: "REWARD_REDEEMED",
          link: `/citizen/rewards`,
        },
      });

      // 6. Check 'reward-redeemer' badge
      const badge = await tx.badge.findUnique({ where: { slug: "reward-redeemer" } });
      if (badge) {
        const existingBadge = await tx.citizenBadge.findUnique({
          where: { userId_badgeId: { userId: session.id, badgeId: badge.id } },
        });
        if (!existingBadge) {
          await tx.citizenBadge.create({
            data: { userId: session.id, badgeId: badge.id },
          });
          await tx.notification.create({
            data: {
              userId: session.id,
              title: "Badge Unlocked: Reward Collector! 🎖️",
              message: "You redeemed your first reward in the EcoSort marketplace.",
              type: "BADGE_UNLOCKED",
            },
          });
        }
      }

      return newRedemption;
    });

    return NextResponse.json({
      success: true,
      redemption,
      remainingBalance: wallet.balance - reward.coinCost,
    });
  } catch (error: any) {
    console.error("Redemption error:", error);
    return NextResponse.json({ error: "Failed to redeem reward." }, { status: 500 });
  }
}
