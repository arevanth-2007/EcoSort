"use client";

import React, { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";
import CitizenIdBadge from "@/components/CitizenIdBadge";
import {
  Bell,
  Send,
  Users,
  User,
  Search,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  Clock,
  Eye,
  X,
  RefreshCw,
  Info,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminNotificationsClientProps {
  activeCitizenCount: number;
  initialCampaigns: any[];
  adminUser: any;
}

export default function AdminNotificationsClient({
  activeCitizenCount,
  initialCampaigns,
  adminUser,
}: AdminNotificationsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"compose" | "history">("compose");

  const [targetAudience, setTargetAudience] = useState<
    "ALL_CITIZENS" | "INDIVIDUAL"
  >("ALL_CITIZENS");
  const [selectedCitizen, setSelectedCitizen] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const [notificationType, setNotificationType] = useState<string>(
    "GENERAL_ANNOUNCEMENT"
  );
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");

  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [campaigns, setCampaigns] = useState<any[]>(initialCampaigns);
  const [inspectCampaign, setInspectCampaign] = useState<any | null>(null);

  useEffect(() => {
    if (targetAudience !== "INDIVIDUAL") {
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setSearching(true);
        const res = await fetch(
          `/api/admin/citizens/search?q=${encodeURIComponent(searchQuery)}`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.citizens || []);
        }
      } catch (err) {
        console.error("Citizen search error:", err);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, targetAudience]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (targetAudience === "INDIVIDUAL" && !selectedCitizen) {
      setFeedback({
        type: "error",
        message: "Please search and select a recipient citizen.",
      });
      return;
    }

    if (!title.trim() || title.trim().length < 3) {
      setFeedback({
        type: "error",
        message: "Title must be at least 3 characters long.",
      });
      return;
    }

    if (!message.trim() || message.trim().length < 5) {
      setFeedback({
        type: "error",
        message: "Message must be at least 5 characters long.",
      });
      return;
    }

    setIsSending(true);

    try {
      const payload = {
        title: title.trim(),
        message: message.trim(),
        type: notificationType,
        targetAudience,
        recipientId:
          targetAudience === "INDIVIDUAL" ? selectedCitizen.id : undefined,
        link: link.trim() || undefined,
      };

      const res = await fetch("/api/admin/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch notification.");
      }

      setFeedback({
        type: "success",
        message: data.message || "Notification successfully dispatched!",
      });

      if (data.campaign) {
        setCampaigns([data.campaign, ...campaigns]);
      }

      setTitle("");
      setMessage("");
      setLink("");
      if (targetAudience === "INDIVIDUAL") {
        setSelectedCitizen(null);
        setSearchQuery("");
      }

      setTimeout(() => {
        setActiveTab("history");
      }, 1500);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "ACCOUNT":
        return {
          label: "Account & ID",
          bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
      case "IMPORTANT":
        return {
          label: "Important",
          bg: "bg-red-100 text-red-800 border-red-200",
        };
      case "GENERAL_ANNOUNCEMENT":
      case "SYSTEM_ANNOUNCEMENT":
        return {
          label: "Announcement",
          bg: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "ECOSORT_UPDATE":
        return {
          label: "Platform Update",
          bg: "bg-purple-100 text-purple-800 border-purple-200",
        };
      case "REWARD":
        return {
          label: "Reward & Coins",
          bg: "bg-amber-100 text-amber-800 border-amber-200",
        };
      default:
        return {
          label: type,
          bg: "bg-slate-100 text-slate-700 border-slate-200",
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 font-heading">
              <Bell className="w-6 h-6 text-emerald-700" />
              Admin Notification Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Live Broadcast Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch certified announcements to all registered citizens or send targeted notifications to individual accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>
              Active Citizens: <strong>{activeCitizenCount}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab("compose")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "compose"
              ? "border-emerald-700 text-emerald-800 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800 font-semibold"
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Compose &amp; Dispatch</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "history"
              ? "border-emerald-700 text-emerald-800 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800 font-semibold"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Broadcast History ({campaigns.length})</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-start gap-3 border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-red-50 text-red-900 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 font-semibold">{feedback.message}</div>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {activeTab === "compose" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 eco-card p-6 bg-white border border-slate-200 space-y-5">
            <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-emerald-700" />
              <span>Compose Campaign</span>
            </h2>

            <form
              onSubmit={handleSend}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Target Audience *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTargetAudience("ALL_CITIZENS");
                      setSelectedCitizen(null);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      targetAudience === "ALL_CITIZENS"
                        ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                      <Users className="w-4 h-4 text-emerald-700" />
                      <span>All Citizens</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Broadcast to all {activeCitizenCount} registered citizen accounts
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetAudience("INDIVIDUAL")}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      targetAudience === "INDIVIDUAL"
                        ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                      <User className="w-4 h-4 text-emerald-700" />
                      <span>Individual Citizen</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Send to a specific citizen by Name or Citizen ID
                    </p>
                  </button>
                </div>
              </div>

              {targetAudience === "INDIVIDUAL" && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Recipient Citizen *
                  </label>

                  {selectedCitizen ? (
                    <div className="p-3 rounded-lg bg-white border border-emerald-300 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            selectedCitizen.avatarUrl ||
                            "https://api.dicebear.com/7.x/bottts/svg?seed=" +
                              encodeURIComponent(selectedCitizen.email)
                          }
                          alt=""
                          className="w-9 h-9 rounded-full bg-slate-100 object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-xs text-slate-900">
                              {selectedCitizen.name}
                            </strong>
                            <CitizenIdBadge
                              citizenId={selectedCitizen.citizenId}
                              variant="compact"
                            />
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {selectedCitizen.email}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedCitizen(null)}
                        className="text-xs text-slate-500 hover:text-red-600 font-semibold px-2 py-1 rounded hover:bg-slate-100"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search citizen by Name, Email, or Citizen ID (e.g. ECO-REV-482731)..."
                          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                        {searching && (
                          <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin absolute right-3 top-3" />
                        )}
                      </div>

                      {searchResults.length > 0 && (
                        <div className="mt-1 max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg divide-y divide-slate-100 text-xs">
                          {searchResults.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setSelectedCitizen(c);
                                setSearchResults([]);
                              }}
                              className="w-full p-2.5 text-left hover:bg-slate-50 flex items-center justify-between transition-colors"
                            >
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={
                                    c.avatarUrl ||
                                    "https://api.dicebear.com/7.x/bottts/svg?seed=" +
                                      encodeURIComponent(c.email)
                                  }
                                  alt=""
                                  className="w-7 h-7 rounded-full bg-slate-100 object-cover"
                                />
                                <div>
                                  <span className="font-bold text-slate-900 block">
                                    {c.name}
                                  </span>
                                  <span className="text-[11px] text-slate-500">
                                    {c.email}
                                  </span>
                                </div>
                              </div>
                              <CitizenIdBadge
                                citizenId={c.citizenId}
                                variant="compact"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  2. Notification Type *
                </label>
                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="GENERAL_ANNOUNCEMENT">
                    📢 General Announcement
                  </option>
                  <option value="IMPORTANT">⚠️ Important Notice</option>
                  <option value="ACCOUNT">
                    👤 Account &amp; Citizen ID Notice
                  </option>
                  <option value="ECOSORT_UPDATE">
                    ✨ EcoSort Platform Update
                  </option>
                  <option value="REWARD">
                    🎁 Green Coins &amp; Reward Incentive
                  </option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    3. Notification Title *
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {title.length} / 120
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={120}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Household Waste Collection Drive This Saturday"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    4. Message Body *
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {message.length} / 2000
                  </span>
                </div>
                <textarea
                  rows={5}
                  maxLength={2000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Compose your detailed announcement or personal account update for citizens. Line breaks are preserved."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  5. Action Link (Optional)
                </label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="e.g. /citizen/rewards or /citizen/upload"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all duration-150 shadow-subtle flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-200" />
                    <span>Dispatching Notification...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-emerald-300" />
                    <span>
                      {targetAudience === "ALL_CITIZENS"
                        ? `Broadcast to All ${activeCitizenCount} Citizens`
                        : selectedCitizen
                        ? `Send to ${selectedCitizen.name}`
                        : "Send to Selected Citizen"}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="eco-card p-6 bg-slate-900 text-white rounded-2xl shadow-elevated">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                Real-Time Citizen Preview
              </span>
              <h3 className="text-sm font-bold text-slate-200">
                How it will appear in the Citizen Notification Center:
              </h3>

              <div className="mt-4 p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      getTypeBadge(notificationType).bg
                    }`}
                  >
                    {getTypeBadge(notificationType).label}
                  </span>
                  <span className="text-[10px] text-slate-400">Just now</span>
                </div>

                <h4 className="text-sm font-bold text-white font-heading">
                  {title.trim() || "Notification Title Preview"}
                </h4>

                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                  {message.trim() ||
                    "This is an interactive preview of your message. It will reflect exact formatting, paragraphs, and timestamps for recipients."}
                </p>

                {link && (
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 underline">
                      <span>Action Link: {link}</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>
                  Audience:{" "}
                  <strong>
                    {targetAudience === "ALL_CITIZENS"
                      ? "All Citizens"
                      : "Individual"}
                  </strong>
                </span>
                <span>
                  Role: <strong>Citizens Only</strong>
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
              <strong className="block font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-700" />
                Security &amp; Policy Guard
              </strong>
              <p className="text-emerald-900/90 leading-relaxed text-[11px]">
                Administrators are strictly prohibited from messaging other administrator accounts through this tool. All dispatches are recorded in immutable audit logs.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="eco-card p-6 bg-white border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Notification Broadcast History
              </h3>
              <p className="text-xs text-slate-500">
                Audited timeline of campaigns dispatched to citizens
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {campaigns.length} Total Campaigns
            </span>
          </div>

          {campaigns.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Title &amp; Type</th>
                    <th className="pb-3 font-semibold">Target Audience</th>
                    <th className="pb-3 font-semibold text-center">
                      Recipients
                    </th>
                    <th className="pb-3 font-semibold">Dispatched By</th>
                    <th className="pb-3 font-semibold">Date &amp; Time</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {campaigns.map((c) => {
                    const typeBadge = getTypeBadge(c.type);
                    return (
                      <tr
                        key={c.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3.5 pr-3 max-w-xs">
                          <span
                            className={`inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border mb-1 ${typeBadge.bg}`}
                          >
                            {typeBadge.label}
                          </span>
                          <strong className="block text-slate-900 font-bold truncate">
                            {c.title}
                          </strong>
                        </td>

                        <td className="py-3.5">
                          {c.targetAudience === "ALL_CITIZENS" ? (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <Users className="w-3 h-3 text-emerald-600" />
                              <span>All Citizens</span>
                            </span>
                          ) : (
                            <div>
                              <span className="font-bold text-slate-900 block truncate max-w-[140px]">
                                {c.recipientName || "Individual Citizen"}
                              </span>
                              {c.recipientCitizenId && (
                                <CitizenIdBadge
                                  citizenId={c.recipientCitizenId}
                                  variant="compact"
                                />
                              )}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 text-center font-mono font-bold text-slate-800">
                          {c.recipientCount}
                        </td>

                        <td className="py-3.5 text-slate-600">
                          {c.sentBy?.name || "Administrator"}
                        </td>

                        <td className="py-3.5 text-slate-500 whitespace-nowrap">
                          {formatDate(c.createdAt)}
                        </td>

                        <td className="py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setInspectCampaign(c)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>Inspect</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No notification campaigns dispatched yet. Use the Compose tab to send your first message.
            </div>
          )}
        </div>
      )}

      {inspectCampaign && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setInspectCampaign(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span
                  className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border mb-1 ${
                    getTypeBadge(inspectCampaign.type).bg
                  }`}
                >
                  {getTypeBadge(inspectCampaign.type).label}
                </span>
                <h2 className="text-base font-bold text-slate-900 font-heading">
                  {inspectCampaign.title}
                </h2>
              </div>
              <button
                onClick={() => setInspectCampaign(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 block">Target Audience:</span>
                <strong className="text-slate-900">
                  {inspectCampaign.targetAudience === "ALL_CITIZENS"
                    ? `All Citizens (${inspectCampaign.recipientCount} recipients)`
                    : "Individual Citizen"}
                </strong>
              </div>

              <div>
                <span className="text-slate-500 block">Dispatched On:</span>
                <span className="text-slate-700">
                  {formatDate(inspectCampaign.createdAt)}
                </span>
              </div>

              {inspectCampaign.recipientName && (
                <div className="col-span-2 pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500 block">Recipient:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <strong className="text-slate-900">
                      {inspectCampaign.recipientName}
                    </strong>
                    <span className="text-slate-500">
                      ({inspectCampaign.recipientEmail})
                    </span>
                    {inspectCampaign.recipientCitizenId && (
                      <CitizenIdBadge
                        citizenId={inspectCampaign.recipientCitizenId}
                        variant="compact"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Dispatched Message Content
              </span>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                {inspectCampaign.message}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectCampaign(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}