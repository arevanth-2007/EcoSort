"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WASTE_CATEGORIES, WasteCategory } from "@/lib/types";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Coins,
  UploadCloud,
  CheckCircle2,
  Gift,
  TreeDeciduous,
  Globe,
  HelpCircle,
  Mail,
  Send,
  Award,
  ChevronRight,
  TrendingUp,
  MapPin,
  Camera,
  Check,
  AlertCircle,
} from "lucide-react";

export default function HomePage() {
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<WasteCategory>("PLASTIC");

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError("");
    setContactSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject,
          message: contactMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setContactSuccess(true);
      setContactName("");
      setContactEmail("");
      setContactSubject("");
      setContactMessage("");
    } catch (err: any) {
      setContactError(err.message || "Failed to submit message");
    } finally {
      setContactLoading(false);
    }
  };

  const sampleRewards = [
    {
      title: "Eco-Friendly Jute Bag",
      category: "Eco-Product",
      cost: 60,
      image: "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=500&auto=format&fit=crop&q=80",
      store: "Central Hub — HITEC City, Hyderabad",
    },
    {
      title: "Native Neem Tree Sapling",
      category: "Sapling",
      cost: 40,
      image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=500&auto=format&fit=crop&q=80",
      store: "Sustainability Depot — Indiranagar, Bengaluru",
    },
    {
      title: "Stainless Steel Water Bottle",
      category: "Eco-Product",
      cost: 120,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80",
      store: "Resource Recovery — Kothrud, Pune",
    },
    {
      title: "Organic Market ₹250 Voucher",
      category: "Voucher",
      cost: 50,
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=80",
      store: "Digital Partner Store",
    },
  ];

  const regionalHubs = [
    { city: "Hyderabad", location: "HITEC City & Madhapur", pin: "500081", desc: "Operations Headquarters & Primary Citizen Drop Hub" },
    { city: "Bengaluru", location: "Indiranagar 100 Ft Rd", pin: "560066", desc: "Organic Compost & Sustainable Lifestyle Depot" },
    { city: "Pune", location: "Kothrud Industrial Sector", pin: "411038", desc: "High-Capacity Municipal Transfer Partner" },
    { city: "Visakhapatnam", location: "Beach Road & MVP Colony", pin: "530017", desc: "Coastal Plastics Divergence Center" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/60 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 shadow-xs">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>AI Waste Segregation &amp; Civic Rewards</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                  Segregate Smarter. <br className="hidden sm:inline" />
                  Earn Greener. <br className="hidden sm:inline" />
                  <span className="text-emerald-600">Transform Cities.</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
                  EcoSort connects citizens, municipal recycling streams, and circular economy rewards with automated Google Gemini Vision verification. Segregate at source, upload your photo, and convert domestic recyclables into verified Green Coins.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link
                    href="/auth/citizen/signup"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-subtle hover:shadow transition-all duration-150 active:scale-[0.98]"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4 text-emerald-100" />
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all duration-150"
                  >
                    <span>How It Works</span>
                  </Link>
                </div>

                <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                  <div>
                    <div className="text-xl sm:text-2xl font-heading font-black text-slate-900">8 Categories</div>
                    <div className="text-[12px] text-slate-500 font-medium">Standardized Rates</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-heading font-black text-emerald-600">Gemini Vision</div>
                    <div className="text-[12px] text-slate-500 font-medium">Real-time Inspection</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-heading font-black text-slate-900">Green Coins</div>
                    <div className="text-[12px] text-slate-500 font-medium">Verifiable Ledger</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-200/50 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-lime-200/40 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="relative eco-card overflow-hidden border border-slate-200/90 shadow-elevated bg-white">
                    <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Live AI Vision Inspector</span>
                      </div>
                      <span className="text-[11px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">gemini-3.1-flash-lite</span>
                    </div>

                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1526951521990-620dc14c214b?w=600&auto=format&fit=crop&q=80"
                        alt="Segregated Plastic Waste"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-slate-900/85 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] text-white font-medium flex items-center gap-1.5">
                        <Camera className="w-3 h-3 text-emerald-400" />
                        <span>ECO-SUB-VERIFY • 2.5 kg</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-3 bg-white">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div>
                          <span className="text-[11px] text-slate-500 font-semibold block uppercase">AI Prediction</span>
                          <span className="text-sm font-bold text-slate-900">Clean PET Plastic Bottles</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-slate-500 font-semibold block uppercase">Confidence</span>
                          <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">95.0%</span>
                        </div>
                      </div>

                      <div className="text-[12px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                        <span className="font-semibold text-slate-800">Visual Reasoning: </span>
                        Clear PET polymer transparency and standard screw tops observed. Uncontaminated and suitable for single-stream recycling.
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Advisory Passed (+25 GC)</span>
                        </div>
                        <span className="text-[11px] text-slate-500">Awaiting Admin Sign-off</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 bg-white border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Simple 4-Step Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 mt-3 tracking-tight">
                How EcoSort Works
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                A seamless pipeline connecting domestic segregation to verified municipal circular rewards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Segregate at Source",
                  desc: "Sort your domestic recyclables into clean streams: plastic, paper, cardboard, metal, glass, or organic.",
                  icon: UploadCloud,
                },
                {
                  step: "02",
                  title: "Upload & Weight",
                  desc: "Take a clear photograph and enter your estimated weight using your citizen dashboard.",
                  icon: Camera,
                },
                {
                  step: "03",
                  title: "Gemini AI Verification",
                  desc: "Google Gemini Vision evaluates image clarity, classifies materials, and scores confidence score instantly.",
                  icon: Sparkles,
                },
                {
                  step: "04",
                  title: "Earn Green Coins",
                  desc: "Admin approves verified batches. Green Coins credit to your wallet to redeem for saplings, goods, and vouchers.",
                  icon: Coins,
                },
              ].map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div key={idx} className="relative eco-card p-6 border border-slate-200 bg-slate-50/50 hover:bg-white flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-heading font-black text-emerald-600/70">{s.step}</span>
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-xs">
                        <Icon className="w-5 h-5 text-emerald-600" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50/60 border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Standardized Multipliers
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 mt-2 tracking-tight">
                  Waste Categories &amp; Coin Rates
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Transparent, verifiable rates per kilogram configured on the EcoSort network.
                </p>
              </div>
              <Link
                href="/waste-guide"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                <span>View Full Segregation Manual</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(WASTE_CATEGORIES).map(([key, info]) => {
                const isSelected = selectedCategoryTab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedCategoryTab(key as WasteCategory)}
                    className={`eco-card p-4 text-left transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "border-emerald-600 ring-2 ring-emerald-500/20 bg-white"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900">{info.name}</span>
                      <span className="text-xs font-black text-emerald-600 font-mono">
                        +{info.defaultRate} GC/kg
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {info.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Category Deep Dive Panel */}
            {selectedCategoryTab && (
              <div className="mt-6 eco-card p-6 bg-white border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <h3 className="text-base font-bold text-slate-900">
                      {WASTE_CATEGORIES[selectedCategoryTab].name} Segregation Guidelines
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-mono">
                    Rate: {WASTE_CATEGORIES[selectedCategoryTab].defaultRate} Green Coins per kg
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-emerald-50/60 p-4 rounded-lg border border-emerald-100 space-y-2">
                    <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Accepted &amp; Rewarded Items
                    </span>
                    <p className="text-emerald-800/90 leading-relaxed">
                      {WASTE_CATEGORIES[selectedCategoryTab].acceptedExamples.join(", ")}. Ensure items are rinsed and drained before photographing.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-slate-500" />
                      Quality &amp; Cleanliness Rules
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      Do not mix with hazardous oils or chemical residues. High-confidence AI scores require clear lighting and unoccluded view.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 4: REWARD MARKETPLACE PREVIEW */}
        <section className="py-20 bg-white border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Civic Marketplace
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 mt-3 tracking-tight">
                Redeem Green Coins for Real Rewards
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Spend your earned balance on sustainable goods, organic saplings, or partner vouchers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sampleRewards.map((reward, i) => (
                <div key={i} className="eco-card overflow-hidden border border-slate-200 bg-white flex flex-col group">
                  <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={reward.image}
                      alt={reward.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold">
                      {reward.cost} GC
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {reward.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-2">{reward.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{reward.store}</span>
                      </p>
                    </div>
                    <Link
                      href="/rewards-preview"
                      className="mt-4 w-full py-2 text-center text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors duration-150"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: REGIONAL HUBS (INDIAN NETWORK) */}
        <section className="py-20 bg-slate-50/60 border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Civic Centers
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 mt-3 tracking-tight">
                Our Indian Regional Network
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Physical drop-off stations, municipal transfer depots, and redemption counters across major smart cities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {regionalHubs.map((hub, idx) => (
                <div key={idx} className="eco-card p-5 bg-white border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-slate-900">{hub.city}</h3>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        PIN {hub.pin}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-emerald-700 mb-2">{hub.location}</p>
                    <p className="text-[12px] text-slate-500 leading-relaxed">{hub.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Active Municipal Partner</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: CONTACT & INQUIRIES */}
        <section id="contact" className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Get In Touch
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 mt-3 tracking-tight">
                Contact EcoSort Support
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Have questions regarding waste categories, regional hubs, or municipal partnerships? Send us a message.
              </p>
            </div>

            <div className="eco-card p-6 sm:p-8 bg-white border border-slate-200">
              {contactSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Thank you! Your inquiry has been logged into our support ticketing system.</span>
                </div>
              )}

              {contactError && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{contactError}</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. aarav@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Waste drop-off inquiry in Hyderabad"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details about your query or municipal partnership..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={contactLoading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-emerald-600 rounded-lg shadow-subtle transition-all duration-150 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {contactLoading ? "Sending Inquiry..." : "Submit Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
