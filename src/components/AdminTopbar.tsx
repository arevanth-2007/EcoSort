"use client";

import React from "react";
import { ShieldCheck, Menu, User, Sparkles } from "lucide-react";

interface AdminTopbarProps {
  admin: {
    name: string;
    email: string;
  };
  onOpenMobileMenu: () => void;
}

export default function AdminTopbar({ admin, onOpenMobileMenu }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-3 shadow-subtle flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          aria-label="Open navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span>EcoSort Administration Portal</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white">
              Verified Production
            </span>
          </h2>
          <p className="text-[11px] text-gray-500">
            Smart Waste Segregation &amp; Green Rewards Platform &bull; Adjudication Active
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
          <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">
            A
          </div>
          <div className="hidden sm:block text-left">
            <span className="font-bold text-gray-800 block text-xs">{admin.name}</span>
            <span className="text-[10px] text-gray-400 font-medium">{admin.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
