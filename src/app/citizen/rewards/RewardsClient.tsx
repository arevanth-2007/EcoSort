"use client";

import React, { useState } from "react";
import { formatDate } from "@/lib/utils";
import {
  Gift,
  Coins,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Sparkles,
  QrCode,
  ArrowRight,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import CitizenIdBadge from "@/components/CitizenIdBadge";

interface RewardsClientProps {
  rewards: any[];
  stores: any[];
  userBalance: number;
  redemptions: any[];
  citizenId?: string | null;
}

export default function RewardsClient({
  rewards,
  stores,
  userBalance: initialBalance,
  redemptions: initialRedemptions,
  citizenId,
}: RewardsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"catalog" | "history">("catalog");
  const [userBalance, setUserBalance] = useState(initialBalance);
  const [redemptions, setRedemptions] = useState(initialRedemptions);

  const [selectedReward, setSelectedReward] = useState<any | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);

  const handleRedeem = async () => {
    if (!selectedReward) return;
    setRedeeming(true);
    setError(null);

    try {
      const res = await fetch("/api/rewards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId: selectedReward.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to redeem reward");

      setUserBalance(data.remainingBalance);
      setRedemptions([data.redemption, ...redemptions]);
      setSelectedReward(null);
      setActiveReceipt(data.redemption);
    } catch (err: any) {
      setError(err.message || "Failed to redeem reward.");
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Gift className="w-6 h-6 text-primary" />
              Rewards Marketplace
            </h1>
            <CitizenIdBadge citizenId={citizenId} />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Exchange your earned Green Coins for plant saplings, sustainable products, and vouchers.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-lightGreen border border-green-200 self-start sm:self-auto">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
            <Coins className="w-3.5 h-3.5 text-secondary" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase block leading-tight">Your Balance</span>
            <span className="text-sm font-black text-primary">{userBalance} GC</span>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "catalog"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Gift className="w-4 h-4" />
          Available Rewards ({rewards.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Clock className="w-4 h-4" />
          My Redemptions & Receipts ({redemptions.length})
        </button>
      </div>

      {/* TAB 1: REWARDS CATALOG */}
      {activeTab === "catalog" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((rew) => {
            const canAfford = userBalance >= rew.coinCost;
            const inStock = rew.stock > 0;

            return (
              <div key={rew.id} className="eco-card overflow-hidden flex flex-col justify-between group">
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={rew.imageUrl}
                    alt={rew.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black bg-white/95 text-primary shadow-xs flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-secondary" />
                    <span>{rew.coinCost} GC</span>
                  </div>
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                    {rew.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {rew.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed line-clamp-2">
                      {rew.description}
                    </p>

                    <div className="mt-3 text-xs text-gray-500 pt-3 border-t border-gray-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate max-w-[180px]">
                          {rew.sampleStore ? rew.sampleStore.name : "Digital Fulfillment"}
                        </span>
                        <span
                          className={`font-semibold ${
                            inStock ? "text-emerald-700" : "text-red-600"
                          }`}
                        >
                          {inStock ? `${rew.stock} in stock` : "Out of stock"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedReward(rew);
                      setError(null);
                    }}
                    disabled={!canAfford || !inStock}
                    className={`mt-4 w-full py-2.5 rounded-xl font-bold text-xs transition-colors shadow-xs ${
                      !inStock
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : canAfford
                        ? "bg-primary hover:bg-primary-900 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {!inStock
                      ? "Out of Stock"
                      : canAfford
                      ? `Redeem for ${rew.coinCost} GC`
                      : `Need ${rew.coinCost - userBalance} more GC`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: REDEMPTION HISTORY */}
      {activeTab === "history" && (
        <div className="eco-card p-6 bg-white">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900">Redemption History & Receipts</h3>
            <p className="text-xs text-gray-500">Present your unique redemption code at the collection desk</p>
          </div>

          {redemptions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Redemption Code</th>
                    <th className="pb-3 font-semibold">Reward Item</th>
                    <th className="pb-3 font-semibold">Cost</th>
                    <th className="pb-3 font-semibold">Redemption Hub</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {redemptions.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/70">
                      <td className="py-3 font-mono font-bold text-gray-900">{r.redemptionCode}</td>
                      <td className="py-3 font-medium text-gray-800">{r.reward?.title || "Reward"}</td>
                      <td className="py-3 font-black text-primary">{r.coinCost} GC</td>
                      <td className="py-3 text-gray-600 truncate max-w-xs">
                        {r.reward?.sampleStore?.name || "Digital Hub"}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === "REDEEMED"
                              ? "bg-green-100 text-green-800"
                              : r.status === "PENDING"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setActiveReceipt(r)}
                          className="px-2.5 py-1 text-xs font-bold text-primary hover:bg-lightGreen rounded-lg transition-colors"
                        >
                          View Voucher
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 text-xs">
              No rewards redeemed yet. Spend your Green Coins in the marketplace!
            </div>
          )}
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Confirm Redemption</h3>
              <button
                onClick={() => setSelectedReward(null)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <img
                src={selectedReward.imageUrl}
                alt={selectedReward.title}
                className="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0"
              />
              <div>
                <p className="text-sm font-bold text-gray-900">{selectedReward.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Pick-up: {selectedReward.sampleStore?.name || "Campus Desk"}
                </p>
                <span className="text-sm font-black text-primary mt-1 block">
                  {selectedReward.coinCost} Green Coins
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-semibold">Redemption Details:</p>
              <p>
                {selectedReward.coinCost} GC will be deducted from your wallet balance ({userBalance} GC &rarr;{" "}
                {userBalance - selectedReward.coinCost} GC).
              </p>
              <p className="text-[11px] text-amber-700">
                You will receive a unique voucher code to present at the collection point.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedReward(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRedeem}
                disabled={redeeming}
                className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-900 text-white text-xs font-bold transition-colors disabled:opacity-60"
              >
                {redeeming ? "Processing..." : "Confirm & Deduct Coins"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIGITAL RECEIPT / VOUCHER MODAL */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 border-2 border-primary/20">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Digital Redemption Voucher
              </span>
              <button
                onClick={() => setActiveReceipt(null)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voucher Card Inner */}
            <div className="p-4 rounded-2xl bg-lightGreen border border-green-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white mx-auto shadow-sm">
                <QrCode className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-xs text-gray-500 font-medium">Unique Redemption Code</p>
              <p className="text-2xl font-mono font-black text-gray-900 tracking-wider">
                {activeReceipt.redemptionCode}
              </p>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeReceipt.status === "REDEEMED"
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                Status: {activeReceipt.status}
              </span>
            </div>

            <div className="text-left text-xs space-y-1.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Reward:</span>
                <span className="font-bold text-gray-900">{activeReceipt.reward?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Coins Deducted:</span>
                <span className="font-bold text-primary">{activeReceipt.coinCost} GC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Redeem Hub:</span>
                <span className="font-bold text-gray-900">
                  {activeReceipt.reward?.sampleStore?.name || "EcoSort Regional Hub"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Citizen ID:</span>
                <span className="font-mono font-bold text-slate-800">{citizenId || "ECO-CIT-000000"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Issued On:</span>
                <span className="text-gray-700">{formatDate(activeReceipt.createdAt)}</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 leading-tight">
              Present this voucher code at the verified partner store or regional redemption center to collect your reward.
            </p>

            <button
              onClick={() => setActiveReceipt(null)}
              className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-900 transition-colors"
            >
              Close Voucher
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
