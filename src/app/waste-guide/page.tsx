import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WASTE_CATEGORIES, WasteCategory } from "@/lib/types";
import { CheckCircle2, AlertTriangle, Lightbulb, Sparkles, ArrowRight } from "lucide-react";

export default function WasteGuidePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-16 bg-ecoBg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Educational Reference
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mt-2 tracking-tight">
              Waste Segregation Guide
            </h1>
            <p className="text-base text-gray-600 mt-3 leading-relaxed">
              Correct segregation ensures high AI classification confidence, swift administrator verification, and timely Green Coin crediting.
            </p>
          </div>

          <div className="eco-card p-6 sm:p-8 bg-gradient-to-r from-lightGreen to-emerald-50 border border-green-200">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-secondary" />
              The 3 Golden Rules for EcoSort Verification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-700">
              <div className="p-3.5 rounded-xl bg-white shadow-xs border border-green-100">
                <span className="font-bold text-gray-900 block mb-1">1. Clean and Dry</span>
                Rinse all food residue, liquids, and oily stains. Wet or stained cardboard will be identified as &ldquo;Other/Trash&rdquo;.
              </div>
              <div className="p-3.5 rounded-xl bg-white shadow-xs border border-green-100">
                <span className="font-bold text-gray-900 block mb-1">2. Single-Material Batches</span>
                Do not mix plastic bottles with aluminum cans in one photo. Submit each category separately for 90%+ AI confidence.
              </div>
              <div className="p-3.5 rounded-xl bg-white shadow-xs border border-green-100">
                <span className="font-bold text-gray-900 block mb-1">3. Clear, Bright Lighting</span>
                Take photos against a neutral background with ample light. Shadows and blurriness lower the AI confidence below 80%.
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(WASTE_CATEGORIES).map(([catKey, info]) => {
              const isOther = catKey === "OTHER";
              return (
                <div
                  key={catKey}
                  className={`eco-card p-6 sm:p-8 border-l-4 ${
                    isOther ? "border-l-gray-400 bg-gray-50/50" : "border-l-primary"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-900">{info.name}</h2>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            isOther ? "bg-gray-200 text-gray-700" : "bg-lightGreen text-primary"
                          }`}
                        >
                          {isOther ? "0 GC (Not Eligible)" : `${info.defaultRate} Green Coins / kg`}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{info.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Examples */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-secondary" />
                        Accepted Items
                      </h4>
                      <ul className="space-y-1.5 text-sm text-gray-600">
                        {info.acceptedExamples.map((ex, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                            {ex}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Segregation Tips */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        Segregation & Preparation Tips
                      </h4>
                      <ul className="space-y-1.5 text-sm text-gray-600">
                        {info.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center pt-8">
            <a
              href="/citizen/upload"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold text-white bg-primary hover:bg-primary-900 shadow-md transition-all"
            >
              Upload Waste Now
              <ArrowRight className="w-4 h-4 text-secondary" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
