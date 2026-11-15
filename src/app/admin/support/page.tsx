import React from "react";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSupportClient from "./AdminSupportClient";

export const dynamic = "force-dynamic";

export default async function AdminSupportPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/auth/admin/login");

  const tickets = await prisma.supportTicket.findMany({
    include: {
      user: { select: { name: true, email: true, mobile: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const contactMessages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminSupportClient initialTickets={tickets} initialMessages={contactMessages} />;
}
