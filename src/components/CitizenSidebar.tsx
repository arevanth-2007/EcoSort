"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import EcoSortLogo from "@/components/EcoSortLogo";
import {
  LayoutDashboard,
  UploadCloud,
  History,
  Coins,
  Gift,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";

interface CitizenSidebarProps {
  unreadCount?: number;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function CitizenSidebar({
  unreadCount = 0,
  mobileOpen,
  setMobileOpen,
}: CitizenSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const mainNav = [
    {
      name: "Dashboard",
      href: "/citizen/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Upload Waste",
      href: "/citizen/upload",
      icon: UploadCloud,
      highlight: true,
    },
    {
      name: "My Submissions",
      href: "/citizen/submissions",
      icon: History,
    },
    {
      name: "Green Coins Wallet",
      href: "/citizen/wallet",
      icon: Coins,
    },
    {
      name: "Rewards Marketplace",
      href: "/citizen/rewards",
      icon: Gift,
    },
    {
      name: "Notifications",
      href: "/citizen/notifications",
      icon: Bell,
      badge: unreadCount,
    },
  ];

  const accountNav = [
    {
      name: "My Profile",
      href: "/citizen/profile",
      icon: User,
    },
    {
      name: "Settings",
      href: "/citizen/settings",
      icon: Settings,
    },
    {
      name: "Help & Support",
      href: "/citizen/help",
      icon: HelpCircle,
    },
  ];

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/auth/citizen/login");
      router.refresh();
    } catch {
      router.push("/auth/citizen/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const NavItem = ({ item }: { item: any }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <a
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
          isActive
            ? "bg-primary text-white shadow-sm font-semibold"
            : item.highlight
            ? "bg-lightGreen text-primary hover:bg-green-100 font-semibold"
            : "text-gray-600 hover:text-primary hover:bg-gray-100/80"
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon
            className={`w-4 h-4 transition-transform group-hover:scale-110 ${
              isActive
                ? "text-secondary"
                : item.highlight
                ? "text-primary"
                : "text-gray-400 group-hover:text-primary"
            }`}
          />
          <span>{item.name}</span>
        </div>
        {item.badge > 0 && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              isActive
                ? "bg-white text-primary"
                : "bg-red-500 text-white"
            }`}
          >
            {item.badge}
          </span>
        )}
      </a>
    );
  };

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200/80 min-h-screen sticky top-0 h-screen overflow-y-auto shrink-0 select-none">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <EcoSortLogo
            variant="light"
            size="sm"
            withLink={false}
          />
        </div>

        <div className="flex-1 px-3 py-4 space-y-6">
          <div>
            <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Main Menu
            </p>
            <div className="space-y-1">
              {mainNav.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Account
            </p>
            <div className="space-y-1">
              {accountNav.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                />
              ))}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>{loggingOut ? "Logging out..." : "Log Out"}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 m-3 bg-lightGreen/70 rounded-xl border border-green-200 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-primary mb-1">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            Gemini Vision Assisted
          </div>
          <p className="text-[11px] text-gray-600 leading-snug">
            Submissions are verified by administration with Gemini Vision AI assistance.
          </p>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <EcoSortLogo
            variant="light"
            size="sm"
            withLink={false}
          />
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-md text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Menu
            </p>
            <div className="space-y-1">
              {mainNav.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Account
            </p>
            <div className="space-y-1">
              {accountNav.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                />
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 text-left"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}