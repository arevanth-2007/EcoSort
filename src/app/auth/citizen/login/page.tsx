"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { LogIn, AlertCircle, ArrowRight } from "lucide-react";
import EcoSortLogo from "@/components/EcoSortLogo";

export default function CitizenLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/citizen/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      router.push("/citizen/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setIdentifier("citizen@ecosort.com");
    setPassword("CitizenPass123!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full eco-card p-6 sm:p-8 bg-white border border-slate-200 shadow-elevated">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <EcoSortLogo variant="mark-only" size="md" withLink={false} />
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">Citizen Login</h1>
            <p className="text-xs text-slate-500 mt-1">Access your waste submissions, wallet, and rewards</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address or Mobile (+91...)
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="citizen@ecosort.com or 9849023456"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <Link href="/faq" className="text-[11px] text-emerald-700 hover:underline">
                  Need Help?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all duration-150 shadow-subtle flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
            </button>
          </form>

          <div className="mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Demo Citizen Account</span>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-emerald-700 font-bold hover:underline"
            >
              Autofill Credentials
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
            Don&apos;t have an account?{" "}
            <Link href="/auth/citizen/signup" className="text-emerald-700 font-bold hover:underline">
              Create citizen account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
