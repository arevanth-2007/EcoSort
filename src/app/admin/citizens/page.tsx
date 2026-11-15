import React from "react";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminCitizensClient from "./AdminCitizensClient";

export const dynamic = "force-dynamic";

export default async function AdminCitizensPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/auth/admin/login");

  const resolvedParams = await searchParams;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search.trim() : "";

  const citizens = await prisma.user.findMany({
    where: {
      role: "CITIZEN",
      OR: search
        ? [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { mobile: { contains: search } },
          ]
        : undefined,
    },
    include: {
      citizenProfile: true,
      wallet: true,
      submissions: {
        take: 5,
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          submissions: true,
          redemptions: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <AdminCitizensClient initialCitizens={citizens} initialSearch={search} />;
}
