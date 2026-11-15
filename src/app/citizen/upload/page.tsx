"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { WASTE_CATEGORIES, WasteCategory } from "@/lib/types";
import {
  UploadCloud,
  CheckCircle2,
  Clock,
  Coins,
  Scale,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  Image as ImageIcon,
  Check,
} from "lucide-react";

export default function WasteUploadPage() {
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory>("PLASTIC");
  const [weightKg, setWeightKg] = useState<string>("2.0");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setError("Please select or capture a photograph of the segregated waste item.");
      return;
    }

    const weightNum = parseFloat(weightKg);
    if (isNaN(weightNum) || weightNum <= 0) {
      setError("Please specify a valid weight greater than 0 kg.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("category", selectedCategory);
      formData.append("weight", weightKg);

      const res = await fetch("/api/waste/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process waste submission.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="eco-card p-6 sm:p-8 bg-white border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
              Waste Segregation Submission
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Select category, upload a clear photo of your segregated recyclable waste, and enter the estimated weight.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified Adjudication
          </span>
        </div>

        {result && (
          <div className="mt-6 p-6 rounded-xl border bg-amber-50/70 border-amber-200 text-amber-950">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs bg-amber-500 text-white">
                <Clock className="w-6 h-6" />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block text-amber-800 font-mono">
                      Code: {result.submissionCode} &bull; Status: Queued for Verification
                    </span>
                    <h2 className="text-lg font-heading font-bold text-slate-950 mt-0.5">
                      Waste Submission Queued for Review
                    </h2>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Your waste submission has been securely recorded with SHA-256 integrity verification. It is currently placed in the administrative Analyzer queue for inspection. Green Coins will be credited to your wallet once approved.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-white border border-amber-200/60 text-xs">
                  <div>
                    <span className="text-slate-500 block">Category</span>
                    <strong className="text-slate-900">{result.submission?.category || selectedCategory}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Estimated Weight</span>
                    <strong className="text-slate-900 font-mono">{result.submission?.weightKg || weightKg} kg</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Earning Potential</span>
                    <strong className="text-emerald-700 font-mono font-bold">
                      Up to {Math.round((parseFloat(weightKg) || 0) * (WASTE_CATEGORIES[selectedCategory]?.defaultRate || 0))} GC
                    </strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors duration-150 shadow-subtle"
                  >
                    Submit Another Batch
                  </button>
                  <Link
                    href="/citizen/submissions"
                    className="px-4 py-2 rounded-lg bg-white text-slate-800 text-xs font-semibold border border-slate-200 hover:bg-slate-50 transition-colors duration-150"
                  >
                    View All Submissions
                  </Link>
                  <Link
                    href="/citizen/dashboard"
                    className="px-4 py-2 rounded-lg bg-white text-emerald-700 text-xs font-semibold border border-emerald-200 hover:bg-emerald-50 transition-colors duration-150 flex items-center gap-1"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block mb-0.5">Submission Error</span>
              <p>{error}</p>
            </div>
          </div>
        )}

        {!result && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                1. Select Waste Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(WASTE_CATEGORIES).map(([catKey, info]) => {
                  const isSelected = selectedCategory === catKey;
                  return (
                    <button
                      type="button"
                      key={catKey}
                      onClick={() => setSelectedCategory(catKey as WasteCategory)}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900">{info.name}</span>
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: info.color }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 font-mono">
                        {info.defaultRate > 0 ? `${info.defaultRate} GC/kg` : "0 GC"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Image Upload with Drag & Drop */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                2. Upload Segregated Waste Photo *
              </label>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-150 ${
                  previewUrl
                    ? "border-emerald-500 bg-emerald-50/20"
                    : "border-slate-300 hover:border-emerald-500 bg-slate-50/50"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="space-y-3">
                    <img
                      src={previewUrl}
                      alt="Waste preview"
                      className="max-h-60 mx-auto rounded-lg object-contain shadow-xs border border-slate-200"
                    />
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-emerald-700">{imageFile?.name}</span> (
                      {((imageFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB)
                      <p className="text-[11px] text-slate-400 mt-1">Click or drag another image to replace</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 py-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 mx-auto">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                      Click to upload photo, or drag and drop
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Supports JPEG, PNG, or WebP up to 8MB. Take a well-lit photo showing segregated materials.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Estimated Weight Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  3. Estimated Weight (Kilograms) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="50"
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="e.g. 2.5"
                    className="w-full pl-3.5 pr-12 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-semibold"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-bold font-mono">
                    kg
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Citizen-entered estimate. Max 50 kg per submission.
                </p>
              </div>

              {/* Potential Green Coin calculation preview */}
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200/80 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Estimated Earning Potential
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      {Math.round(
                        (parseFloat(weightKg) || 0) * (WASTE_CATEGORIES[selectedCategory]?.defaultRate || 0)
                      )}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">Green Coins</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Calculated as: {weightKg || 0} kg &times; {WASTE_CATEGORIES[selectedCategory]?.defaultRate ?? 0} GC/kg
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !imageFile}
              className="w-full py-3 rounded-lg bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-all duration-150 shadow-subtle flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Recording Submission...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 text-emerald-400" />
                  <span>Submit Waste for Verification</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
