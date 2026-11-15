import React from "react";
import prisma from "@/lib/db";
import StatCard from "@/components/StatCard";
import {
  Users,
  CheckCircle2,
  XCircle,
  Scale,
  Coins,
  Gift,
  QrCode,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCheck,
} from "lucide-react";
import AdminDashboardCharts from "./AdminDashboardCharts";
import AdminAnalyzerApprovals from "@/components/AdminAnalyzerApprovals";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const totalCitizens = await prisma.user.count({ where: { role: "CITIZEN" } });
  const activeCitizens = await prisma.user.count({ where: { role: "CITIZEN", status: "ACTIVE" } });

  const pendingApprovalsCount = await prisma.wasteSubmission.count({
    where: {
      status: { in: ["PENDING", "AI_ANALYZED", "MANUAL_INSPECTION"] },
    },
  });

  const aiApprovedCount = await prisma.wasteSubmission.count({ where: { status: "APPROVED" } });
  const aiRejectedCount = await prisma.wasteSubmission.count({ where: { status: "REJECTED" } });

  const totalApprovedWeightResult = await prisma.wasteSubmission.aggregate({
    where: { status: "APPROVED" },
    _sum: { weightKg: true },
  });
  const totalApprovedWeightKg = totalApprovedWeightResult._sum.weightKg || 0;

  const walletAggregates = await prisma.wallet.aggregate({
    _sum: {
      balance: true,
      totalEarned: true,
      totalSpent: true,
    },
  });
  const totalCoinsIssued = walletAggregates._sum.totalEarned || 0;
  const totalCoinsRedeemed = walletAggregates._sum.totalSpent || 0;

  const activeRewardsCount = await prisma.reward.count({ where: { isActive: true } });
  const pendingRedemptionsCount = await prisma.redemption.count({ where: { status: "PENDING" } });

  const settings = await prisma.systemSettings.findFirst();

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-gray-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-primary-950 font-bold shrink-0">
            <CheckCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              EcoSort Administrative Adjudication Center
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary text-primary-950">
                Live Active Queue
              </span>
            </h3>
            <p className="text-xs text-gray-300">
              Waste submissions require administrative verification. Use the centralized Analyzer below to inspect items with Google Gemini Vision AI or human review before awarding Green Coins.
            </p>
          </div>
        </div>
        <a
          href="/admin/settings"
          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold self-start sm:self-auto transition-colors shrink-0"
        >
          System Settings
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Queue"
          value={pendingApprovalsCount}
          subtitle="Awaiting analyzer inspection"
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />

        <StatCard
          title="Verified Recycled Mass"
          value={totalApprovedWeightKg.toFixed(1)}
          unit="kg"
          subtitle="Diverted from landfills"
          icon={Scale}
          iconColor="text-primary"
          iconBg="bg-lightGreen"
        />

        <StatCard
          title="Approved Submissions"
          value={aiApprovedCount}
          subtitle="Verified & coins credited"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />

        <StatCard
          title="Rejected Submissions"
          value={aiRejectedCount}
          subtitle="Did not meet requirements"
          icon={XCircle}
          iconColor="text-red-600"
          iconBg="bg-red-50"
        />

        <StatCard
          title="Registered Citizens"
          value={totalCitizens}
          subtitle={`${activeCitizens} active accounts`}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />

        <StatCard
          title="Green Coins Issued"
          value={totalCoinsIssued}
          unit="GC"
          subtitle="Earned by citizens"
          icon={Coins}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-50"
        />

        <StatCard
          title="Green Coins Redeemed"
          value={totalCoinsRedeemed}
          unit="GC"
          subtitle="Spent on rewards"
          icon={Coins}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />

        <StatCard
          title="Pending Store Pickups"
          value={pendingRedemptionsCount}
          subtitle="Awaiting desk verification"
          icon={QrCode}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
      </div>

      {/* Centralized Analyzer Pending Approvals Workspace */}
      <div id="analyzer-pending-approvals">
        <AdminAnalyzerApprovals />
      </div>

      {/* Admin Analytics Visuals */}
      <AdminDashboardCharts
        approvedKg={totalApprovedWeightKg}
        coinsIssued={totalCoinsIssued}
        coinsRedeemed={totalCoinsRedeemed}
      />
    </div>
  );
}
