"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { ShieldCheck, LogIn, AlertCircle, KeyRound } from "lucide-react";
import EcoSortLogo from "@/components/EcoSortLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Admin authentication failed");

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to authenticate administrator");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail("admin@ecosort.com");
    setPassword("AdminPass123!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full eco-card p-6 sm:p-8 bg-white shadow-elevated border border-slate-200 border-t-4 border-t-slate-900">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <EcoSortLogo variant="mark-only" size="md" withLink={false} />
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">Admin Portal</h1>
            <p className="text-xs text-slate-500 mt-1">Platform Governance, Audits &amp; Analyzer Verification</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Administrator Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ecosort.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all duration-150 shadow-subtle flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98]"
            >
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>{loading ? "Verifying Credentials..." : "Authenticate as Admin"}</span>
            </button>
          </form>

          <div className="mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Demo Administrator</span>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-slate-900 font-bold hover:underline"
            >
              Autofill Credentials
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Are you a citizen?{" "}
            <Link href="/auth/citizen/login" className="text-emerald-700 font-bold hover:underline">
              Switch to citizen login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
