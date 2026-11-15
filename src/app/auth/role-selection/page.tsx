import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UserCheck, ShieldCheck, ArrowRight } from "lucide-react";
import EcoSortLogo from "@/components/EcoSortLogo";

export default function RoleSelectionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="flex flex-col items-center">
            <EcoSortLogo variant="light" size="lg" withLink={false} className="mb-4" />
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
              Select Your Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md">
              Choose your role to access the appropriate EcoSort authenticated portal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <Link
              href="/auth/citizen/login"
              className="eco-card p-6 flex flex-col justify-between hover:border-emerald-500 group bg-white"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-150">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-heading font-bold text-slate-900 group-hover:text-emerald-700 transition-colors duration-150">
                  Citizen Portal
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Upload segregated waste images, receive Google Gemini AI verification, earn Green Coins, and redeem sustainable lifestyle rewards.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs font-bold text-emerald-700 pt-4 border-t border-slate-100">
                <span>Citizen Login &amp; Sign Up</span>
                <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform duration-150" />
              </div>
            </Link>

            <Link
              href="/auth/admin/login"
              className="eco-card p-6 flex flex-col justify-between hover:border-slate-800 group bg-white"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4 group-hover:bg-slate-900 group-hover:text-white transition-all duration-150">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-heading font-bold text-slate-900 group-hover:text-slate-950 transition-colors duration-150">
                  Administrator Portal
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Review pending AI submissions in the Analyzer, manage regional centers, adjust coin rates, fulfill redemptions, and inspect system audit logs.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs font-bold text-slate-800 pt-4 border-t border-slate-100">
                <span>Admin Login &amp; Approvals</span>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform duration-150" />
              </div>
            </Link>
          </div>

          <p className="text-xs text-slate-500">
            Don&apos;t have a citizen account yet?{" "}
            <Link href="/auth/citizen/signup" className="text-emerald-700 font-bold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
