"use client";

import React, { useState } from "react";
import CitizenSidebar from "@/components/CitizenSidebar";
import CitizenTopbar from "@/components/CitizenTopbar";

interface CitizenLayoutClientProps {
  user: {
    id: string;
    citizenId?: string | null;
    name: string;
    email: string;
    avatarUrl?: string | null;
    balance?: number;
    ecoLevel?: number;
    ecoTitle?: string;
    unreadCount: number;
  };
  children: React.ReactNode;
}

export default function CitizenLayoutClient({ user, children }: CitizenLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ecoBg flex flex-col lg:flex-row antialiased">
      <CitizenSidebar
        unreadCount={user.unreadCount}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <CitizenTopbar
          user={user}
          unreadCount={user.unreadCount}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
