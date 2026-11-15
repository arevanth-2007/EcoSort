"use client";

import React, { useState } from "react";
import { formatDate } from "@/lib/utils";
import {
  QrCode,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Coins,
  ShieldCheck,
  AlertCircle,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminRedemptionsProps {
  initialRedemptions: any[];
}

export default function AdminRedemptionsClient({
  initialRedemptions,
}: AdminRedemptionsProps) {
  const router = useRouter();
  const [redemptions, setRedemptions] = useState(initialRedemptions);
  const [searchCode, setSearchCode] = useState("");
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [lookupError, setLookupError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    setLookupError("");
    setLookupResult(null);

    try {
      const res = await fetch(`/api/admin/redemptions/verify?code=${encodeURIComponent(searchCode.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Redemption code not found.");

      setLookupResult(data.redemption);
    } catch (err: any) {
      setLookupError(err.message || "Failed to find redemption code.");
    }
  };

  const handleAction = async (redemptionId: string, action: "VERIFY_REDEEM" | "CANCEL") => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/redemptions/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          redemptionId,
          action,
          notes: adminNotes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Update state
      setRedemptions((prev) =>
        prev.map((r) => (r.id === redemptionId ? data.redemption : r))
      );
      if (lookupResult?.id === redemptionId) {
        setLookupResult(data.redemption);
      }
      setAdminNotes("");
      alert(
        action === "VERIFY_REDEEM"
          ? "Redemption successfully fulfilled and marked as REDEEMED!"
          : "Redemption cancelled and Green Coins refunded to citizen."
      );
    } catch (err: any) {
      alert(err.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <QrCode className="w-6 h-6 text-primary" />
          Verify & Fulfill Redemptions
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Simulated partner desk scanner. Enter citizen voucher code to verify authenticity and complete fulfillment.
        </p>
      </div>

      {/* Quick Lookup Bar */}
      <div className="eco-card p-6 bg-white space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Lookup Citizen Redemption Voucher
        </h3>

        <form onSubmit={handleLookup} className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Enter voucher code (e.g. ECO-RED-00001 or QR secret)..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-gray-900 focus:outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors shadow-xs"
          >
            Verify Voucher
          </button>
        </form>

        {lookupError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{lookupError}</span>
          </div>
        )}

        {/* Lookup Detail Result Card */}
        {lookupResult && (
          <div className="p-5 rounded-2xl bg-lightGreen/50 border border-green-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-gray-600 block">
                  VOUCHER: {lookupResult.redemptionCode}
                </span>
                <h4 className="text-lg font-bold text-gray-900 mt-0.5">
                  {lookupResult.reward?.title}
                </h4>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  lookupResult.status === "REDEEMED"
                    ? "bg-green-100 text-green-800"
                    : lookupResult.status === "PENDING"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {lookupResult.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-3.5 rounded-xl border border-green-100">
              <div>
                <span className="text-gray-400 block font-semibold">Citizen Name</span>
                <strong className="text-gray-900">{lookupResult.user?.name}</strong>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold">Citizen Email</span>
                <span className="text-gray-700">{lookupResult.user?.email}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold">Coins Deducted</span>
                <strong className="text-primary">{lookupResult.coinCost} GC</strong>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold">Redemption Point</span>
                <span className="text-gray-700">
                  {lookupResult.reward?.sampleStore?.name || "Campus Desk"}
                </span>
              </div>
            </div>

            {lookupResult.status === "PENDING" && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Store Desk Verification Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="e.g. Handed physical item to citizen at Central Hub Desk #1"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(lookupResult.id, "VERIFY_REDEEM")}
                    disabled={actionLoading}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Mark Redeemed</span>
                  </button>
                  <button
                    onClick={() => handleAction(lookupResult.id, "CANCEL")}
                    disabled={actionLoading}
                    className="px-5 py-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs transition-colors"
                  >
                    Cancel & Refund Coins
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Complete Redemptions Stream Table */}
      <div className="eco-card p-6 bg-white">
        <h3 className="text-base font-bold text-gray-900 mb-4">
          All Platform Redemptions ({redemptions.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Code</th>
                <th className="pb-3 font-semibold">Citizen</th>
                <th className="pb-3 font-semibold">Item</th>
                <th className="pb-3 font-semibold">Cost</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {redemptions.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/70">
                  <td className="py-3.5 font-mono font-bold text-gray-900">{r.redemptionCode}</td>
                  <td className="py-3.5 text-gray-800 font-semibold">{r.user?.name}</td>
                  <td className="py-3.5 text-gray-700">{r.reward?.title}</td>
                  <td className="py-3.5 font-bold text-primary">{r.coinCost} GC</td>
                  <td className="py-3.5 text-gray-500">{formatDate(r.createdAt)}</td>
                  <td className="py-3.5">
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
                  <td className="py-3.5 text-right">
                    {r.status === "PENDING" && (
                      <button
                        onClick={() => {
                          setSearchCode(r.redemptionCode);
                          setLookupResult(r);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-black text-white font-bold text-xs"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
