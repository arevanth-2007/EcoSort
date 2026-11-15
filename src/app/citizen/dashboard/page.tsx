import React from "react";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import { getEcoLevelInfo } from "@/lib/utils";
import {
  Scale,
  CheckCircle2,
  Clock,
  Award,
  UploadCloud,
  Gift,
} from "lucide-react";
import CitizenDashboardCharts from "./CitizenDashboardCharts";
import CitizenIdBadge from "@/components/CitizenIdBadge";

export const dynamic = "force-dynamic";

export default async function CitizenDashboardPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/auth/citizen/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.id,
    },
    include: {
      citizenProfile: true,
      wallet: true,
      submissions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });

  if (!user) {
    redirect("/auth/citizen/login");
  }

  const profile = user.citizenProfile || {
    ecoLevel: 1,
    ecoTitle: "Eco Beginner",
    totalApprovedWeightKg: 0,
    approvedSubmissionsCount: 0,
  };

  const wallet = user.wallet || {
    balance: 0,
    totalEarned: 0,
    totalSpent: 0,
  };

  const totalSubmissions = await prisma.wasteSubmission.count({
    where: {
      userId: user.id,
    },
  });

  const pendingSubmissions = await prisma.wasteSubmission.count({
    where: {
      userId: user.id,
      status: {
        in: ["PENDING", "AI_ANALYZED", "MANUAL_INSPECTION"],
      },
    },
  });

  const levelInfo = getEcoLevelInfo(profile.totalApprovedWeightKg);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const last7Days: { dateStr: string; day: string }[] = [];
  const weeklyDataMap: Record<
    string,
    {
      day: string;
      Plastic: number;
      Cardboard: number;
      Metal: number;
      Organic: number;
      Paper: number;
      Glass: number;
    }
  > = {};

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split("T")[0];
    const dayLabel = dayNames[d.getDay()];
    last7Days.push({
      dateStr: dateKey,
      day: dayLabel,
    });
    weeklyDataMap[dateKey] = {
      day: dayLabel,
      Plastic: 0,
      Cardboard: 0,
      Metal: 0,
      Organic: 0,
      Paper: 0,
      Glass: 0,
    };
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  const approvedWeeklySubmissions = await prisma.wasteSubmission.findMany({
    where: {
      userId: user.id,
      status: "APPROVED",
      createdAt: {
        gte: startDate,
      },
    },
    select: {
      userSelectedCategory: true,
      weightKg: true,
      createdAt: true,
    },
  });

  for (const sub of approvedWeeklySubmissions) {
    const dateKey = sub.createdAt.toISOString().split("T")[0];
    if (weeklyDataMap[dateKey]) {
      const cat = sub.userSelectedCategory;
      if (cat === "PLASTIC") {
        weeklyDataMap[dateKey].Plastic += sub.weightKg;
      } else if (cat === "CARDBOARD") {
        weeklyDataMap[dateKey].Cardboard += sub.weightKg;
      } else if (cat === "METAL") {
        weeklyDataMap[dateKey].Metal += sub.weightKg;
      } else if (cat === "ORGANIC") {
        weeklyDataMap[dateKey].Organic += sub.weightKg;
      } else if (cat === "PAPER") {
        weeklyDataMap[dateKey].Paper += sub.weightKg;
      } else if (cat === "GLASS") {
        weeklyDataMap[dateKey].Glass += sub.weightKg;
      }
    }
  }

  const weeklyData = last7Days.map((item) => ({
    ...weeklyDataMap[item.dateStr],
    Plastic: Number(weeklyDataMap[item.dateStr].Plastic.toFixed(1)),
    Cardboard: Number(weeklyDataMap[item.dateStr].Cardboard.toFixed(1)),
    Metal: Number(weeklyDataMap[item.dateStr].Metal.toFixed(1)),
    Organic: Number(weeklyDataMap[item.dateStr].Organic.toFixed(1)),
    Paper: Number(weeklyDataMap[item.dateStr].Paper.toFixed(1)),
    Glass: Number(weeklyDataMap[item.dateStr].Glass.toFixed(1)),
  }));

  const topRewards = await prisma.reward.findMany({
    where: {
      isActive: true,
    },
    take: 3,
    orderBy: {
      coinCost: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 shadow-elevated relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-emerald-400 border border-emerald-500/30">
                Level {levelInfo.level}: {levelInfo.title}
              </span>
              <CitizenIdBadge citizenId={user.citizenId} />
            </div>

            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Available Green Coins
              </p>
              <div className="flex items-baseline gap-2.5 mt-1">
                <span className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight text-white">
                  {wallet.balance}
                </span>
                <span className="text-lg font-bold text-emerald-400 font-mono">
                  GC
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2 text-xs text-slate-400">
              <div>
                <span>Lifetime Earned:</span>{" "}
                <strong className="text-white font-bold">
                  {wallet.totalEarned} GC
                </strong>
              </div>
              <div>
                <span>Lifetime Redeemed:</span>{" "}
                <strong className="text-white font-bold">
                  {wallet.totalSpent} GC
                </strong>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/citizen/upload"
              className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs text-center transition-all duration-150 shadow-subtle flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <UploadCloud className="w-4 h-4 text-slate-950" />
              <span>Upload Waste</span>
            </Link>
            <Link
              href="/citizen/rewards"
              className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs text-center border border-slate-700 transition-all duration-150 flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4 text-emerald-400" />
              <span>Browse Rewards</span>
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-800/80 relative z-10">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400">
              Progress to {levelInfo.nextLevelTitle || "Max Level"}
            </span>
            <span className="font-bold text-emerald-400 font-mono">
              {levelInfo.progressPercent}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Recycled Waste"
          value={profile.totalApprovedWeightKg.toFixed(1)}
          unit="kg"
          subtitle="Verified segregated mass"
          icon={Scale}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-50"
        />

        <StatCard
          title="Approved Submissions"
          value={profile.approvedSubmissionsCount}
          subtitle={`Out of ${totalSubmissions} total uploads`}
          icon={CheckCircle2}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-50"
        />

        <StatCard
          title="Pending Review"
          value={pendingSubmissions}
          subtitle="In administrative analyzer"
          icon={Clock}
          iconColor="text-amber-700"
          iconBg="bg-amber-50"
        />

        <StatCard
          title="Current Eco Level"
          value={`Lvl ${levelInfo.level}`}
          subtitle={levelInfo.title}
          icon={Award}
          iconColor="text-slate-800"
          iconBg="bg-slate-100"
        />
      </div>

      <div className="eco-card p-6 bg-white border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-heading font-bold text-slate-900">
              Weekly Recycling Activity
            </h3>
            <p className="text-xs text-slate-500">
              Approved segregated weight by category (kg)
            </p>
          </div>
        </div>
        <CitizenDashboardCharts weeklyData={weeklyData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 eco-card p-6 bg-white border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-heading font-bold text-slate-900">
                Recent Waste Submissions
              </h3>
              <p className="text-xs text-slate-500">
                Live submission and verification records
              </p>
            </div>
            <Link
              href="/citizen/submissions"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              View All Submissions &rarr;
            </Link>
          </div>

          {user.submissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-2.5 font-semibold">Code</th>
                    <th className="pb-2.5 font-semibold">Category</th>
                    <th className="pb-2.5 font-semibold">Analysis</th>
                    <th className="pb-2.5 font-semibold">Weight</th>
                    <th className="pb-2.5 font-semibold">Status</th>
                    <th className="pb-2.5 font-semibold text-right">Coins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {user.submissions.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3 font-mono font-bold text-slate-900">
                        <Link
                          href={`/citizen/submissions/${s.id}`}
                          className="hover:text-emerald-700"
                        >
                          {s.submissionCode}
                        </Link>
                      </td>
                      <td className="py-3 font-medium text-slate-700">
                        {s.userSelectedCategory}
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-slate-800">
                          {s.aiPredictedCategory || "Pending Review"}
                        </span>
                        {s.aiConfidence != null && (
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {Math.round(s.aiConfidence * 100)}% confidence
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-slate-700 font-semibold">
                        {s.weightKg} kg
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : s.status === "REJECTED"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-black text-emerald-700 font-mono">
                        {s.coinsAwarded > 0 ? `+${s.coinsAwarded} GC` : "0 GC"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No waste submissions yet. Click &ldquo;Upload Waste&rdquo; to earn your first Green Coins!
            </div>
          )}
        </div>

        <div className="lg:col-span-4 eco-card p-6 bg-white border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-heading font-bold text-slate-900 flex items-center gap-2">
                <Gift className="w-4 h-4 text-emerald-600" />
                <span>Featured Rewards</span>
              </h3>
              <Link
                href="/citizen/rewards"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                Marketplace &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {topRewards.map((rew) => (
                <div
                  key={rew.id}
                  className="p-3 rounded-lg border border-slate-200/70 flex items-center gap-3"
                >
                  <img
                    src={rew.imageUrl}
                    alt={rew.title}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {rew.title}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {rew.category}
                    </p>
                    <span className="text-xs font-black text-emerald-700 font-mono">
                      {rew.coinCost} GC
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/citizen/rewards"
            className="mt-4 w-full py-2.5 rounded-lg bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs text-center transition-all duration-150 shadow-subtle active:scale-[0.98]"
          >
            Redeem Green Coins
          </Link>
        </div>
      </div>
    </div>
  );
}