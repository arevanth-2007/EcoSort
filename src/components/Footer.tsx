import React from "react";
import Link from "next/link";
import { Shield, Award, Sparkles, MapPin, ArrowUpRight } from "lucide-react";
import EcoSortLogo from "./EcoSortLogo";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="lg:col-span-2 space-y-4">
            <EcoSortLogo variant="dark" size="md" />
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-sm">
              EcoSort is an intelligent waste segregation and green rewards platform empowering citizens and municipal hubs across Indian smart cities. Powered by advanced computer vision to verify waste at source and incentivize circular economy civic habits.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400 font-medium">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-400">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Google Gemini Vision Verified
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                <MapPin className="w-3 h-3 text-slate-400" />
                PAN-India Civic Network
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">Platform</h4>
            <ul className="space-y-2.5 text-[13px] text-slate-400">
              <li>
                <Link href="/how-it-works" className="hover:text-emerald-400 transition-colors duration-150">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/waste-guide" className="hover:text-emerald-400 transition-colors duration-150">
                  Waste Segregation Guide
                </Link>
              </li>
              <li>
                <Link href="/rewards-preview" className="hover:text-emerald-400 transition-colors duration-150">
                  Rewards Marketplace
                </Link>
              </li>
              <li>
                <Link href="/auth/citizen/signup" className="hover:text-emerald-400 transition-colors duration-150">
                  Citizen Registration
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">Regional Centers</h4>
            <ul className="space-y-2 text-[12px] text-slate-400">
              <li className="flex flex-col">
                <span className="font-semibold text-slate-300">Hyderabad Central Hub</span>
                <span className="text-[11px] text-slate-500">HITEC City, Madhapur</span>
              </li>
              <li className="flex flex-col">
                <span className="font-semibold text-slate-300">Bengaluru Depot</span>
                <span className="text-[11px] text-slate-500">100 Ft Rd, Indiranagar</span>
              </li>
              <li className="flex flex-col">
                <span className="font-semibold text-slate-300">Pune Recovery Station</span>
                <span className="text-[11px] text-slate-500">Paud Road, Kothrud</span>
              </li>
              <li className="pt-1">
                <Link href="/contact" className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold">
                  <span>View All 5 Partner Cities</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">Platform Access</h4>
            <p className="text-[12px] text-slate-400 leading-relaxed mb-3.5">
              Secure authentication with server-verified JWT and role-based access.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/auth/citizen/login"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors duration-150"
              >
                <Award className="w-3.5 h-3.5" />
                Citizen Portal
              </Link>
              <Link
                href="/auth/admin/login"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors duration-150"
              >
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                Admin Portal
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} EcoSort Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-400 transition-colors">
              About
            </Link>
            <Link href="/faq" className="hover:text-slate-400 transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">
              Contact
            </Link>
            <span className="text-slate-700">|</span>
            <span className="text-emerald-400/80 font-medium">Smart Waste • Clean India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
