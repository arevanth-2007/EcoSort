"use client";

import React, { useState } from "react";
import { formatDate } from "@/lib/utils";
import {
  Users,
  Search,
  ShieldAlert,
  ShieldCheck,
  Eye,
  X,
  History,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminCitizensProps {
  initialCitizens: any[];
  initialSearch?: string;
}

export default function AdminCitizensClient({
  initialCitizens,
  initialSearch = "",
}: AdminCitizensProps) {
  const router = useRouter();
  const [citizens, setCitizens] = useState(initialCitizens);
  const [search, setSearch] = useState(initialSearch);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedCitizen, setSelectedCitizen] = useState<any | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/citizens?search=${encodeURIComponent(search)}`);
  };

  const handleStatusToggle = async (citizen: any) => {
    const nextStatus = citizen.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    const confirmPrompt =
      nextStatus === "BLOCKED"
        ? `Are you sure you want to suspend citizen account ${citizen.name}? They will be blocked from logging in.`
        : `Unblock citizen account ${citizen.name}?`;

    if (!confirm(confirmPrompt)) {
      return;
    }

    setUpdatingId(citizen.id);
    try {
      const res = await fetch(`/api/admin/citizens/${citizen.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      setCitizens((prev) =>
        prev.map((c) =>
          c.id === citizen.id ? { ...c, status: nextStatus } : c
        )
      );
      if (selectedCitizen?.id === citizen.id) {
        setSelectedCitizen({
          ...selectedCitizen,
          status: nextStatus,
        });
      }
    } catch (err: any) {
      alert(err.message || "Error updating citizen status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Manage Registered Citizens
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Search, inspect activity, view wallet holdings, and govern citizen access status.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="relative w-full sm:w-72"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search citizen name, email, phone..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </form>
      </div>

      <div className="eco-card p-6 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Citizen</th>
                <th className="pb-3 font-semibold">Contact</th>
                <th className="pb-3 font-semibold">Eco Level</th>
                <th className="pb-3 font-semibold text-right">Recycled Mass</th>
                <th className="pb-3 font-semibold text-right">Wallet Balance</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {citizens.map((c) => {
                const isBlocked = c.status === "BLOCKED";
                const isCurrentUpdating = updatingId === c.id;

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            c.avatarUrl ||
                            "https://api.dicebear.com/7.x/bottts/svg?seed=" +
                              encodeURIComponent(c.name)
                          }
                          alt=""
                          className="w-8 h-8 rounded-full bg-gray-100 object-cover"
                        />
                        <div>
                          <strong className="text-gray-900 block">{c.name}</strong>
                          <span className="text-[10px] text-gray-400">
                            Joined {formatDate(c.createdAt)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 text-gray-600">
                      <div>{c.email}</div>
                      <div className="text-[10px] text-gray-400">
                        {c.mobile || "No phone"}
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-lightGreen text-primary">
                        {c.citizenProfile?.ecoTitle || "Eco Beginner"}
                      </span>
                    </td>

                    <td className="py-3.5 text-right font-black text-gray-900">
                      {c.citizenProfile?.totalApprovedWeightKg?.toFixed(1) || 0} kg
                    </td>

                    <td className="py-3.5 text-right font-black text-primary">
                      {c.wallet?.balance || 0} GC
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isBlocked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="py-3.5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedCitizen(c)}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 inline mr-1" />
                        Inspect
                      </button>
                      <button
                        onClick={() => handleStatusToggle(c)}
                        disabled={isCurrentUpdating}
                        className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition-colors ${
                          isBlocked
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                      >
                        {isCurrentUpdating ? (
                          "Updating..."
                        ) : isBlocked ? (
                          <>
                            <ShieldCheck className="w-3 h-3 inline mr-1" />
                            Unblock
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3 h-3 inline mr-1" />
                            Suspend
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCitizen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedCitizen(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                Citizen Detailed Profile
              </h3>
              <button
                onClick={() => setSelectedCitizen(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={
                  selectedCitizen.avatarUrl ||
                  "https://api.dicebear.com/7.x/bottts/svg?seed=" +
                    encodeURIComponent(selectedCitizen.name)
                }
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <strong className="text-sm text-gray-900 block">
                  {selectedCitizen.name}
                </strong>
                <span className="text-xs text-gray-500">
                  {selectedCitizen.email} &bull; {selectedCitizen.mobile}
                </span>
                <span className="text-xs font-semibold text-primary block mt-0.5">
                  {selectedCitizen.citizenProfile?.ecoTitle} &bull; {selectedCitizen.wallet?.balance} GC Balance
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-primary" />
                Recent Submissions Evaluated by AI ({selectedCitizen.submissions?.length || 0})
              </h4>

              {selectedCitizen.submissions && selectedCitizen.submissions.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedCitizen.submissions.map((s: any) => (
                    <div
                      key={s.id}
                      className="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-gray-800">
                          {s.submissionCode}
                        </span>{" "}
                        <span className="text-gray-500">
                          ({s.userSelectedCategory}, {s.weightKg} kg)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            s.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {s.status}
                        </span>
                        <span className="font-black text-primary">
                          +{s.coinsAwarded} GC
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No submissions on file.</p>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedCitizen(null)}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}