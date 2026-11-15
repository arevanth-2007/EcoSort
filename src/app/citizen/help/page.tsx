import React from "react";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import HelpClient from "./HelpClient";

export const dynamic = "force-dynamic";

export default async function CitizenHelpPage() {
  const session = await getSessionUser();
  if (!session) redirect("/auth/citizen/login");

  const tickets = await prisma.supportTicket.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
  });

  return <HelpClient initialTickets={tickets} />;
}
