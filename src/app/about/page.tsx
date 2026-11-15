import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, Shield, Sparkles, Layers, Cpu, Database, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import EcoSortLogo from "@/components/EcoSortLogo";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Platform Mission &amp; Infrastructure
            </span>
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-slate-900 mt-3 tracking-tight">
              About EcoSort
            </h1>
            <p className="text-base text-slate-600 mt-3 max-w-2xl mx-auto leading-relaxed">
              An intelligent climate-technology platform designed to incentivize source segregation of domestic recyclable waste through automated computer vision and civic Green Coins.
            </p>
          </div>

          <div className="eco-card p-6 sm:p-8 bg-white border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <EcoSortLogo variant="mark-only" size="md" withLink={false} />
              <div>
                <h2 className="text-xl font-heading font-bold text-slate-900">
                  Empowering Indian Circular Municipal Economies
                </h2>
                <p className="text-xs text-slate-500">
                  Transforming household waste segregation into a rewarding civic habit
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              EcoSort bridges the critical gap between citizens and municipal recycling infrastructure across Hyderabad, Bengaluru, Pune, Visakhapatnam, and partner smart cities. By pairing instant visual verification with verifiable Green Coin incentives, communities divert valuable plastics, metals, paper, cardboard, and organics before materials enter landfills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="eco-card p-6 bg-white border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded">
                The Civic Challenge
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2 mb-2">Unsegregated Urban Waste</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Over 70% of municipal domestic solid waste in urban India reaches dump yards unsegregated, cross-contaminating recyclable fractions and creating severe methane emissions. Traditional civic programs lack transparent verification and immediate citizen incentives.
              </p>
            </div>

            <div className="eco-card p-6 bg-white border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                The EcoSort Solution
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2 mb-2">Source AI Verification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                EcoSort combines citizen participation with Google Gemini Vision. Submissions are visually evaluated for material purity, awarding verified Green Coins redeemable for eco-friendly lifestyle goods, tree saplings, and municipal vouchers.
              </p>
            </div>
          </div>

          <div className="eco-card p-6 sm:p-8 bg-white border border-slate-200 space-y-4">
            <h3 className="text-lg font-heading font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>Technology Architecture &amp; Engineering</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Google Gemini Vision API</span>
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Real multimodal vision inference analyzing polymer gloss, texture, and contamination with structured JSON telemetry and confidence gates.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>PostgreSQL &amp; Atomic Ledger</span>
                </p>
                <p className="text-slate-600 leading-relaxed">
                  ACID-compliant relational database with atomic transactions for Green Coin balance updates and SHA-256 duplicate submission hashes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Role-Based Security &amp; JWT</span>
                </p>
                <p className="text-slate-600 leading-relaxed">
                  HMAC SHA-256 session tokens with strict isolation between citizen profiles and administrative review adjudicators.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>PAN-India Regional Hubs</span>
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Federated municipal stations in Hyderabad, Bengaluru, Pune, Visakhapatnam, and Ludhiana for physical drop-off and reward redemptions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
