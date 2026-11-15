import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  UploadCloud,
  Cpu,
  Coins,
  Gift,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Camera,
  CheckCircle2,
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Domestic Segregation & High-Quality Photo Capture",
      desc: "Citizens segregate domestic recyclables into standardized categories: Plastic, Paper, Cardboard, Glass, Metal, Organic, or E-waste. Capture a clear, well-lit photo of the segregated batch.",
      icon: Camera,
      points: [
        "Keep materials segregated without cross-contamination",
        "Rinse food residues from plastic containers and metal cans",
        "Estimated weight in kilograms is entered directly in the portal",
      ],
    },
    {
      num: "02",
      title: "Cryptographic SHA-256 Anti-Tampering Engine",
      desc: "To guarantee integrity and eliminate fraud, every image buffer generates an immutable SHA-256 cryptographic hash. Duplicate uploads of previously submitted photos are blocked instantly.",
      icon: ShieldCheck,
      points: [
        "Prevents duplicate submissions of the same item batch",
        "Guarantees security and trust across the Green Coin economy",
        "Assigns permanent audit tracking code (ECO-SUB-XXXXX)",
      ],
    },
    {
      num: "03",
      title: "Google Gemini Vision Multimodal Inspection",
      desc: "The photograph is processed by Google Gemini Vision. The neural network detects material composition, assesses image clarity, flags potential contamination, and computes a visual confidence score.",
      icon: Cpu,
      points: [
        "Evaluates visual confidence against configured system thresholds",
        "Returns item-level classification and detailed visual reasoning",
        "Streams telemetry directly into the Admin Analyzer workspace",
      ],
    },
    {
      num: "04",
      title: "Atomic Green Coin Crediting to Wallet",
      desc: "Upon passing review, Green Coins are calculated using the batch weight and the category's active multiplier, credited atomically to the citizen's secure wallet.",
      icon: Coins,
      points: [
        "Weight (kg) × Category Multiplier = Green Coins Credited",
        "Instant wallet transaction ledger record generated",
        "Eco Level badges and citizen statistics updated in real time",
      ],
    },
    {
      num: "05",
      title: "Marketplace Redemption at Regional Hubs",
      desc: "Citizens spend their Green Coins on tree saplings, jute bags, stainless steel bottles, and sustainable partner discounts across our network in Hyderabad, Bengaluru, Pune, and partner cities.",
      icon: Gift,
      points: [
        "Cryptographic digital redemption QR voucher generated",
        "Redemption counters at regional municipal hubs fulfill pickup",
        "Audited transaction history recorded in your citizen profile",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              End-to-End Operational Pipeline
            </span>
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-slate-900 mt-3 tracking-tight">
              How EcoSort Works
            </h1>
            <p className="text-base text-slate-600 mt-3 leading-relaxed">
              Explore our automated verification pipeline combining computer vision, anti-tampering cryptography, and verified civic rewards.
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="eco-card p-6 sm:p-8 bg-white border border-slate-200 flex flex-col md:flex-row gap-6 items-start"
                >
                  <div className="flex items-center gap-4 md:flex-col md:items-center shrink-0">
                    <span className="text-2xl font-heading font-black text-emerald-600/80 font-mono">
                      {s.num}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-subtle">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <h3 className="text-lg font-heading font-bold text-slate-900">
                      {s.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {s.desc}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                      {s.points.map((pt, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-start gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200/60 text-[11px] text-slate-700 font-medium"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-14 p-8 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-elevated">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-heading font-bold text-white">
                Ready to turn your domestic waste into green impact?
              </h3>
              <p className="text-xs text-slate-400">
                Join thousands of conscious citizens contributing to cleaner Indian smart cities.
              </p>
            </div>
            <Link
              href="/auth/citizen/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 shadow-subtle transition-all duration-150 active:scale-95 shrink-0"
            >
              <span>Create Citizen Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
