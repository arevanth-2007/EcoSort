"use client";

import React, { useState } from "react";
import { Sliders, CheckCircle2, Cpu, Coins, ShieldAlert, Sparkles, Scale } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminSettingsProps {
  initialSettings: any;
}

export default function AdminSettingsClient({ initialSettings }: AdminSettingsProps) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);

  const [thresholdPercent, setThresholdPercent] = useState(
    Math.round(initialSettings.confidenceThreshold * 100).toString()
  );
  const [plasticRate, setPlasticRate] = useState(initialSettings.plasticRate.toString());
  const [paperRate, setPaperRate] = useState(initialSettings.paperRate.toString());
  const [cardboardRate, setCardboardRate] = useState(initialSettings.cardboardRate.toString());
  const [glassRate, setGlassRate] = useState(initialSettings.glassRate.toString());
  const [metalRate, setMetalRate] = useState(initialSettings.metalRate.toString());
  const [organicRate, setOrganicRate] = useState(initialSettings.organicRate.toString());
  const [ewasteRate, setEwasteRate] = useState(initialSettings.ewasteRate.toString());

  const [maxWeight, setMaxWeight] = useState(initialSettings.maxWeightPerSubmission.toString());
  const [aiModelId, setAiModelId] = useState(initialSettings.aiModelId || "gemini-3.1-flash-lite");

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confidenceThreshold: parseFloat(thresholdPercent) / 100,
          plasticRate,
          paperRate,
          cardboardRate,
          glassRate,
          metalRate,
          organicRate,
          ewasteRate,
          maxWeightPerSubmission: maxWeight,
          aiModelId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSettings(data.settings);
      setSavedSuccess(true);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <Sliders className="w-6 h-6 text-primary" />
          System Configuration & AI Rules
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Adjust automated computer vision confidence gates, Green Coin multipliers per category, and demo toggles.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs text-green-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>System configuration successfully updated and logged to audit trail.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="eco-card p-6 bg-white space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            AI Vision Inference & Confidence Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Confidence Verification Gate (%) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="50"
                  max="99"
                  required
                  value={thresholdPercent}
                  onChange={(e) => setThresholdPercent(e.target.value)}
                  className="w-full pl-3.5 pr-8 py-2 rounded-xl border border-gray-300 text-xs font-bold text-primary focus:ring-2 focus:ring-gray-900"
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold">%</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Submissions with prediction scores below this percentage are automatically rejected.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Max Allowed Weight per Submission (kg) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="500"
                  required
                  value={maxWeight}
                  onChange={(e) => setMaxWeight(e.target.value)}
                  className="w-full pl-3.5 pr-8 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-800 focus:ring-2 focus:ring-gray-900"
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold">kg</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Prevents accidental or inflated single-upload mass.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Google Gemini Vision Model Identifier
            </label>
            <input
              type="text"
              value={aiModelId}
              onChange={(e) => setAiModelId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-mono focus:ring-2 focus:ring-gray-900"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Multimodal vision model (e.g. <code>gemini-3.1-flash-lite</code> or <code>gemini-3-flash-preview</code>).
            </p>
          </div>
        </div>

        <div className="eco-card p-6 bg-white space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Coins className="w-4 h-4 text-primary" />
            Green Coin Rates Per Kilogram (GC / kg)
          </h3>
          <p className="text-xs text-gray-500">
            Coins awarded = Approved Weight (kg) &times; Rate. Changes apply immediately to new submissions.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Plastic (GC/kg)</label>
              <input
                type="number"
                min="1"
                required
                value={plasticRate}
                onChange={(e) => setPlasticRate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-primary focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Paper (GC/kg)</label>
              <input
                type="number"
                min="1"
                required
                value={paperRate}
                onChange={(e) => setPaperRate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-primary focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Cardboard (GC/kg)</label>
              <input
                type="number"
                min="1"
                required
                value={cardboardRate}
                onChange={(e) => setCardboardRate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-primary focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Glass (GC/kg)</label>
              <input
                type="number"
                min="1"
                required
                value={glassRate}
                onChange={(e) => setGlassRate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-primary focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Metal (GC/kg)</label>
              <input
                type="number"
                min="1"
                required
                value={metalRate}
                onChange={(e) => setMetalRate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-primary focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Organic (GC/kg)</label>
              <input
                type="number"
                min="1"
                required
                value={organicRate}
                onChange={(e) => setOrganicRate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-primary focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">E-Waste (GC/kg)</label>
              <input
                type="number"
                min="1"
                required
                value={ewasteRate}
                onChange={(e) => setEwasteRate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-primary focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-60"
        >
          {saving ? "Saving Changes..." : "Apply & Save Platform Configuration"}
        </button>
      </form>
    </div>
  );
}
