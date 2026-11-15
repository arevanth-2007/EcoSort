import React from "react";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNotificationsClient from "./AdminNotificationsClient";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/auth/admin/login");

  const [activeCitizenCount, initialCampaigns] = await Promise.all([
    prisma.user.count({
      where: { role: "CITIZEN", status: "ACTIVE" },
    }),
    prisma.adminNotificationCampaign.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        sentBy: {
          select: { name: true, email: true },
        },
      },
    }),
  ]);

  return (
    <AdminNotificationsClient
      activeCitizenCount={activeCitizenCount}
      initialCampaigns={initialCampaigns}
      adminUser={admin}
    />
  );
}
