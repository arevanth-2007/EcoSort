import React from "react";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminRedemptionsClient from "./AdminRedemptionsClient";

export const dynamic = "force-dynamic";

export default async function AdminRedemptionsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/auth/admin/login");

  const redemptions = await prisma.redemption.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, mobile: true } },
      reward: { include: { sampleStore: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return <AdminRedemptionsClient initialRedemptions={redemptions} />;
}
