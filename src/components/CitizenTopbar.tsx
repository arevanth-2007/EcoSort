"use client";

import React, { useState, useEffect } from "react";
import { getTimeGreeting, formatShortDate } from "@/lib/utils";
import { Bell, Coins, Menu, Sparkles, ChevronDown } from "lucide-react";
import CitizenIdBadge from "./CitizenIdBadge";

interface CitizenTopbarProps {
  user: {
    id: string;
    citizenId?: string | null;
    name: string;
    email: string;
    avatarUrl?: string | null;
    balance?: number;
    ecoLevel?: number;
    ecoTitle?: string;
  };
  unreadCount?: number;
  onOpenMobileMenu: () => void;
}

export default function CitizenTopbar({
  user,
  unreadCount = 0,
  onOpenMobileMenu,
}: CitizenTopbarProps) {
  const [greeting, setGreeting] = useState("Hello");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const { greeting } = getTimeGreeting();
    setGreeting(greeting);
    setCurrentDate(formatShortDate(new Date()));
  }, []);

  const firstName = user.name ? user.name.split(" ")[0] : "Citizen";

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-6 py-3 shadow-subtle">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-100"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              {greeting}, <span className="text-primary">{firstName}</span>! 👋
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              {currentDate || "Today"} &bull; Ready to recycle today?
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="/citizen/wallet"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lightGreen border border-green-200 hover:bg-green-100 transition-colors shadow-subtle group"
          >
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white">
              <Coins className="w-3 h-3 text-secondary" />
            </div>
            <span className="text-sm font-bold text-primary group-hover:scale-105 transition-transform">
              {user.balance ?? 0}
            </span>
            <span className="text-xs text-gray-600 font-medium hidden sm:inline">GC</span>
          </a>

          <a
            href="/citizen/notifications"
            className="relative p-2 rounded-xl text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </a>

          {user.citizenId && (
            <div className="hidden sm:block">
              <CitizenIdBadge citizenId={user.citizenId} variant="compact" />
            </div>
          )}

          <a
            href="/citizen/profile"
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <img
              src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
              alt={user.name}
              className="w-8 h-8 rounded-full border border-green-200 bg-gray-50 object-cover"
            />
            <div className="hidden md:block text-left text-xs">
              <p className="font-semibold text-gray-800 leading-tight truncate max-w-[120px]">{user.name}</p>
              <p className="text-[10px] text-primary font-medium">{user.ecoTitle || "Eco Beginner"}</p>
            </div>
          </a>
        </div>
      </div>
    </header>
  );
}
