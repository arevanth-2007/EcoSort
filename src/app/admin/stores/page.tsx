import React from "react";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminStoresClient from "./AdminStoresClient";

export const dynamic = "force-dynamic";

export default async function AdminStoresPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/auth/admin/login");

  const stores = await prisma.sampleStore.findMany({
    include: {
      rewards: true,
      _count: { select: { rewards: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return <AdminStoresClient initialStores={stores} />;
}
