import React from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();

  if (!session || session.role !== "ADMIN") {
    redirect("/auth/admin/login");
  }

  return (
    <AdminLayoutClient admin={{ name: session.name, email: session.email }}>
      {children}
    </AdminLayoutClient>
  );
}
