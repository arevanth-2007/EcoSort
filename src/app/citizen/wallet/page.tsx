import React from "react";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import CitizenIdBadge from "@/components/CitizenIdBadge";
import {
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  Trophy,
  History,
  ShieldCheck,
  Download,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CitizenWalletPage() {
  const session = await getSessionUser();
  if (!session) redirect("/auth/citizen/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { citizenId: true },
  });

  const wallet = await prisma.wallet.findUnique({
    where: { userId: session.id },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const currentBalance = wallet?.balance ?? 0;
  const totalEarned = wallet?.totalEarned ?? 0;
  const totalSpent = wallet?.totalSpent ?? 0;
  const txns = wallet?.transactions ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Coins className="w-6 h-6 text-primary" />
              Green Coins Wallet
            </h1>
            <CitizenIdBadge citizenId={user?.citizenId || session.citizenId} />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Audited financial ledger of your environmental earnings and reward redemptions.
          </p>
        </div>
        <a
          href="/citizen/rewards"
          className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-900 text-white text-xs font-bold transition-colors shadow-xs self-start sm:self-auto flex items-center gap-1.5"
        >
          <Gift className="w-4 h-4 text-secondary" />
          Redeem Rewards
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="eco-card p-6 bg-gradient-to-br from-primary to-primary-950 text-white shadow-elevated">
          <span className="text-xs text-green-200 font-semibold uppercase tracking-wider block mb-1">
            Available Balance
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-secondary drop-shadow-xs">{currentBalance}</span>
            <span className="text-xl font-bold text-secondary">GC</span>
          </div>
          <p className="text-xs text-green-300 mt-3">
            Ready to spend across partner eco-stores & digital vouchers.
          </p>
        </div>

        <div className="eco-card p-6 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Lifetime Earned
            </span>
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-gray-900">+{totalEarned}</span>
            <span className="text-sm font-bold text-gray-500">GC</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Cumulative earnings from verified waste</p>
        </div>

        <div className="eco-card p-6 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Redeemed
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-gray-900">{totalSpent}</span>
            <span className="text-sm font-bold text-gray-500">GC</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Spent on rewards & sapling vouchers</p>
        </div>
      </div>

      <div className="eco-card p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              Transaction Ledger
            </h3>
            <p className="text-xs text-gray-500">Immutable ledger entries with balance tracking</p>
          </div>
          <span className="text-xs font-medium text-gray-400">
            {txns.length} total transactions
          </span>
        </div>

        {txns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Txn Code</th>
                  <th className="pb-3 font-semibold">Date & Time</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Description</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                  <th className="pb-3 font-semibold text-right">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {txns.map((t) => {
                  const isEarning = t.amount > 0;
                  return (
                    <tr key={t.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 font-mono font-bold text-gray-800">{t.transactionCode}</td>
                      <td className="py-3.5 text-gray-500">{formatDate(t.createdAt)}</td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            t.type === "WASTE_REWARD"
                              ? "bg-green-100 text-green-800"
                              : t.type === "REWARD_REDEMPTION"
                              ? "bg-amber-100 text-amber-800"
                              : t.type === "CHALLENGE_BONUS"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {t.type.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 text-gray-700 max-w-xs truncate">{t.description}</td>
                      <td
                        className={`py-3.5 text-right font-black ${
                          isEarning ? "text-emerald-600" : "text-amber-600"
                        }`}
                      >
                        {isEarning ? `+${t.amount}` : t.amount} GC
                      </td>
                      <td className="py-3.5 text-right font-bold text-gray-900">{t.balanceAfter} GC</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400 text-xs">
            No transactions yet. Start submitting segregated waste to earn Green Coins!
          </div>
        )}
      </div>
    </div>
  );
}
