"use client";

import React, { useState } from "react";
import { formatDate } from "@/lib/utils";
import CitizenIdBadge from "@/components/CitizenIdBadge";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Coins,
  Gift,
  Trophy,
  Award,
  Sparkles,
  CheckCheck,
  ArrowRight,
  AlertTriangle,
  Megaphone,
  UserCheck,
  ShieldCheck,
  Clock,
  X,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface NotificationsClientProps {
  initialNotifications: any[];
}

export default function NotificationsClient({
  initialNotifications,
}: NotificationsClientProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      await fetch("/api/notifications/mark-all", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setMarkingAll(false);
    }
  };

  const markSingleRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenNotification = (n: any) => {
    setSelectedNotification(n);
    if (!n.isRead) {
      markSingleRead(n.id);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ACCOUNT":
        return <UserCheck className="w-5 h-5 text-emerald-400" />;
      case "IMPORTANT":
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case "GENERAL_ANNOUNCEMENT":
      case "SYSTEM_ANNOUNCEMENT":
        return <Megaphone className="w-5 h-5 text-sky-400" />;
      case "ECOSORT_UPDATE":
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case "REWARD":
      case "COINS_CREDITED":
        return <Coins className="w-5 h-5 text-secondary" />;
      case "REWARD_REDEEMED":
        return <Gift className="w-5 h-5 text-emerald-300" />;
      case "SUBMISSION_APPROVED":
        return <CheckCircle2 className="w-5 h-5 text-secondary" />;
      case "SUBMISSION_REJECTED":
        return <XCircle className="w-5 h-5 text-red-300" />;
      case "BADGE_UNLOCKED":
        return <Award className="w-5 h-5 text-amber-300" />;
      case "CHALLENGE_COMPLETED":
        return <Trophy className="w-5 h-5 text-secondary" />;
      default:
        return <Bell className="w-5 h-5 text-slate-300" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "ACCOUNT":
        return "Account & Identity";
      case "IMPORTANT":
        return "Important Notice";
      case "GENERAL_ANNOUNCEMENT":
      case "SYSTEM_ANNOUNCEMENT":
        return "Announcement";
      case "ECOSORT_UPDATE":
        return "EcoSort Update";
      case "REWARD":
      case "COINS_CREDITED":
        return "Green Coins & Rewards";
      case "SUBMISSION_APPROVED":
        return "Waste Approved";
      case "SUBMISSION_REJECTED":
        return "Submission Review";
      default:
        return type.replace(/_/g, " ");
    }
  };

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  const extractCitizenIdFromText = (text: string) => {
    const match = text.match(/ECO-[A-Z]{3}-\d{6}/);
    return match ? match[0] : null;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 font-heading">
              <Bell className="w-6 h-6 text-emerald-700" />
              Citizen Notification Center
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time feed of your permanent Citizen ID updates, AI validations, and Green Coin credits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              disabled={markingAll}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 active:scale-[0.98] disabled:opacity-50"
            >
              <CheckCheck className="w-4 h-4 text-emerald-700" />
              <span>{markingAll ? "Marking..." : "Mark All as Read"}</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              filter === "unread"
                ? "bg-emerald-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-white text-emerald-800">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <span className="text-xs text-slate-400">
          Click any notification to view full details
        </span>
      </div>

      {/* Notifications Feed */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((n) => {
            const isRead = n.isRead;
            const citizenIdMatch = extractCitizenIdFromText(n.message);

            return (
              <div
                key={n.id}
                onClick={() => handleOpenNotification(n)}
                className={`eco-card p-4 transition-all duration-150 flex items-start gap-3.5 cursor-pointer border hover:border-emerald-400/80 group ${
                  isRead
                    ? "bg-white border-slate-200 opacity-90 hover:opacity-100"
                    : "bg-emerald-50/40 border-emerald-300 shadow-xs"
                }`}
              >
                {/* Icon Container */}
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs group-hover:scale-105 transition-transform">
                  {getNotificationIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {getTypeLabel(n.type)}
                      </span>
                      <h3
                        className={`text-sm tracking-tight ${
                          isRead ? "font-semibold text-slate-900" : "font-black text-slate-950 font-heading"
                        }`}
                      >
                        {n.title}
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {formatDate(n.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {n.message}
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    {citizenIdMatch && (
                      <CitizenIdBadge citizenId={citizenIdMatch} variant="compact" />
                    )}
                    {n.link && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 group-hover:underline">
                        <span>Action &rarr;</span>
                      </span>
                    )}
                  </div>
                </div>

                {!isRead && (
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0 mt-2 shadow-xs"
                    title="Unread notification"
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="eco-card p-12 text-center bg-white border border-slate-200">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            {filter === "unread" ? "No unread notifications" : "No notifications yet"}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {filter === "unread"
              ? "You are all caught up! Switch to 'All' to review your past alerts."
              : "Updates regarding your Citizen ID, waste submissions, and Green Coins will appear here."}
          </p>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedNotification && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedNotification(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-xs">
                  {getNotificationIcon(selectedNotification.type)}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {getTypeLabel(selectedNotification.type)}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5 font-heading">
                    {selectedNotification.title}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setSelectedNotification(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Date */}
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Received on {formatDate(selectedNotification.createdAt)}</span>
            </div>

            {/* If contains Citizen ID, render prominent card */}
            {extractCitizenIdFromText(selectedNotification.message) && (
              <CitizenIdBadge
                citizenId={extractCitizenIdFromText(selectedNotification.message)}
                variant="card"
              />
            )}

            {/* Full Message Body */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
              {selectedNotification.message}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              {selectedNotification.link ? (
                <a
                  href={selectedNotification.link}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>Open Related Section</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <div />
              )}

              <button
                onClick={() => setSelectedNotification(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
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
