import React from "react";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function CitizenSettingsPage() {
  const session = await getSessionUser();
  if (!session) redirect("/auth/citizen/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
  });

  if (!user) redirect("/auth/citizen/login");

  return <SettingsClient user={user} />;
}
