"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import EcoSortLogo from "@/components/EcoSortLogo";
import {
  LayoutDashboard,
  Users,
  Gift,
  Store,
  QrCode,
  FileText,
  MessageSquare,
  Sliders,
  LogOut,
  X,
  CheckCircle2,
  Bell,
} from "lucide-react";

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  mobileOpen,
  setMobileOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Pending Approvals",
      href: "/admin/approvals",
      icon: CheckCircle2,
    },
    {
      name: "Manage Citizens",
      href: "/admin/citizens",
      icon: Users,
    },
    {
      name: "Notification Center",
      href: "/admin/notifications",
      icon: Bell,
    },
    {
      name: "Manage Rewards",
      href: "/admin/rewards",
      icon: Gift,
    },
    {
      name: "Regional Hubs & Stores",
      href: "/admin/stores",
      icon: Store,
    },
    {
      name: "Verify Redemptions",
      href: "/admin/redemptions",
      icon: QrCode,
    },
    {
      name: "Audit Logs",
      href: "/admin/audit-logs",
      icon: FileText,
    },
    {
      name: "Citizen Support",
      href: "/admin/support",
      icon: MessageSquare,
    },
    {
      name: "System Settings",
      href: "/admin/settings",
      icon: Sliders,
    },
  ];

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/auth/admin/login");
      router.refresh();
    } catch {
      router.push("/auth/admin/login");
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
        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
          isActive
            ? "bg-gray-900 text-white shadow-xs font-bold"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
      >
        <Icon
          className={`w-4 h-4 ${
            isActive ? "text-secondary" : "text-gray-400"
          }`}
        />
        <span>{item.name}</span>
      </a>
    );
  };

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0 h-screen overflow-y-auto shrink-0 select-none">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <EcoSortLogo
            variant="light"
            size="sm"
            withLink={false}
          />
        </div>

        <div className="flex-1 px-3 py-4 space-y-1">
          <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Management
          </p>
          {navItems.map((item) => (
            <NavItem
              key={item.name}
              item={item}
            />
          ))}
        </div>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
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
            className="p-1 text-slate-500 hover:bg-slate-100 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.name}
              item={item}
            />
          ))}
        </div>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}