import React from "react";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { FileText, Shield, ShieldAlert, KeyRound, Settings, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/auth/admin/login");

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          System Audit Logs
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Cryptographically recorded administrative activity stream for security and system governance.
        </p>
      </div>

      <div className="eco-card p-6 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Timestamp</th>
                <th className="pb-3 font-semibold">Action</th>
                <th className="pb-3 font-semibold">Admin Account</th>
                <th className="pb-3 font-semibold">Details</th>
                <th className="pb-3 font-semibold text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/70">
                  <td className="py-3 text-gray-500">{formatDate(log.createdAt)}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action.includes("LOGIN")
                          ? "bg-blue-100 text-blue-800"
                          : log.action.includes("BLOCKED")
                          ? "bg-red-100 text-red-800"
                          : log.action.includes("REWARD")
                          ? "bg-purple-100 text-purple-800"
                          : log.action.includes("SETTINGS")
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 text-gray-700">{log.adminEmail || "System"}</td>
                  <td className="py-3 font-sans text-xs text-gray-800 max-w-md">{log.details}</td>
                  <td className="py-3 text-right text-gray-400">{log.ipAddress || "127.0.0.1"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
