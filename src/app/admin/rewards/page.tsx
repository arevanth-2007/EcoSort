import React from "react";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminRewardsClient from "./AdminRewardsClient";

export const dynamic = "force-dynamic";

export default async function AdminRewardsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/auth/admin/login");

  const rewards = await prisma.reward.findMany({
    include: {
      sampleStore: true,
      _count: { select: { redemptions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const stores = await prisma.sampleStore.findMany({
    where: { isActive: true },
  });

  return <AdminRewardsClient initialRewards={rewards} stores={stores} />;
}
