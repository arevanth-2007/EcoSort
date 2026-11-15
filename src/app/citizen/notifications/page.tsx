import React from "react";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import NotificationsClient from "./NotificationsClient";

export const dynamic = "force-dynamic";

export default async function CitizenNotificationsPage() {
  const session = await getSessionUser();
  if (!session) redirect("/auth/citizen/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return <NotificationsClient initialNotifications={notifications} />;
}
