import React from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";
import CitizenLayoutClient from "./CitizenLayoutClient";

export default async function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();

  if (!session || session.role !== "CITIZEN") {
    redirect("/auth/citizen/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      citizenProfile: true,
      wallet: true,
      _count: {
        select: {
          notifications: { where: { isRead: false } },
        },
      },
    },
  });

  if (!dbUser || dbUser.status === "BLOCKED") {
    redirect("/auth/citizen/login?blocked=true");
  }

  const userData = {
    id: dbUser.id,
    citizenId: dbUser.citizenId,
    name: dbUser.name,
    email: dbUser.email,
    avatarUrl: dbUser.avatarUrl,
    balance: dbUser.wallet?.balance ?? 0,
    ecoLevel: dbUser.citizenProfile?.ecoLevel ?? 1,
    ecoTitle: dbUser.citizenProfile?.ecoTitle ?? "Eco Beginner",
    unreadCount: dbUser._count.notifications,
  };

  return (
    <CitizenLayoutClient user={userData}>
      {children}
    </CitizenLayoutClient>
  );
}
