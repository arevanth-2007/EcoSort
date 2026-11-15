import React from "react";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSettingsClient from "./AdminSettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/auth/admin/login");

  const settings = await prisma.systemSettings.upsert({
    where: { id: "global" },
    update: {},
    create: { id: "global" },
  });

  return <AdminSettingsClient initialSettings={settings} />;
}
