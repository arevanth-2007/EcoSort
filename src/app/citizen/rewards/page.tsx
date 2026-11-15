import React from "react";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import RewardsClient from "./RewardsClient";

export const dynamic = "force-dynamic";

export default async function CitizenRewardsPage() {
  const session = await getSessionUser();
  if (!session) redirect("/auth/citizen/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      wallet: true,
      redemptions: {
        include: {
          reward: { include: { sampleStore: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/auth/citizen/login");

  const rewards = await prisma.reward.findMany({
    where: { isActive: true },
    include: { sampleStore: true },
    orderBy: { coinCost: "asc" },
  });

  const stores = await prisma.sampleStore.findMany({
    where: { isActive: true },
  });

  return (
    <RewardsClient
      rewards={rewards}
      stores={stores}
      userBalance={user.wallet?.balance ?? 0}
      redemptions={user.redemptions}
      citizenId={user.citizenId}
    />
  );
}
