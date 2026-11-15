"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Sparkles,
  Cpu,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  Clock,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { WasteCategory } from "@/lib/types";

interface SubmissionUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

interface AIAnalysisData {
  predictedCategory: string;
  confidence: number;
  rawLabel: string;
  modelUsed: string;
  materialName?: string;
  reasoning?: string;
  isRecyclable?: boolean;
  imageQuality?: string;
  warning?: string | null;
}

interface ManualInspectionData {
  selectedCategory: string;
  notes?: string | null;
}

interface WasteSubmissionItem {
  id: string;
  submissionCode: string;
  userId: string;
  user: SubmissionUser;
  userSelectedCategory: WasteCategory;
  aiPredictedCategory?: string | null;
  aiConfidence?: number | null;
  aiModelUsed?: string | null;
  imageUrl: string;
  weightKg: number;
  coinsAwarded: number;
  status: "PENDING" | "AI_ANALYZED" | "MANUAL_INSPECTION" | "APPROVED" | "REJECTED";
  verificationMethod: "NONE" | "MANUAL" | "AI_ASSISTED";
  rejectionReason?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  aiAnalysis?: AIAnalysisData | null;
  manualInspection?: ManualInspectionData | null;
}

export default function AdminAnalyzerApprovals() {
  const [submissions, setSubmissions] = useState<WasteSubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("NEEDS_REVIEW");
  const [search, setSearch] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<WasteSubmissionItem | null>(null);

  const [activeTab, setActiveTab] = useState<"ai" | "manual">("ai");
  const [aiRunning, setAiRunning] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const [manualCategory, setManualCategory] = useState<WasteCategory>("PLASTIC");
  const [manualNotes, setManualNotes] = useState("");
  const [savingManual, setSavingManual] = useState(false);

  const [adjudicating, setAdjudicating] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const PRESET_REJECTION_REASONS = [
    "Image is blurry or insufficient lighting to verify waste",
    "Mixed / unsegregated waste detected in single submission",
    "Category mismatch: item is not recyclable as claimed",
    "Hazardous, electronic, or prohibited municipal waste",
    "Contaminated with excess food oils, paints, or organic liquids",
    "Duplicate submission or previously processed item",
  ];

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      let queryStatus = statusFilter;
      if (statusFilter === "NEEDS_REVIEW") {
        queryStatus = "ALL";
      }
      const res = await fetch(`/api/admin/submissions?status=${queryStatus}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.submissions) {
        if (statusFilter === "NEEDS_REVIEW") {
          setSubmissions(
            data.submissions.filter((s: WasteSubmissionItem) =>
              ["PENDING", "AI_ANALYZED", "MANUAL_INSPECTION"].includes(s.status)
            )
          );
        } else {
          setSubmissions(data.submissions);
        }
      }
    } catch (err) {
      console.error("Failed to load submissions:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const openInspection = (item: WasteSubmissionItem) => {
    setSelectedSubmission(item);
    setManualCategory(item.userSelectedCategory);
    setManualNotes(item.adminNotes || "");
    setAiResult(
      item.aiAnalysis
        ? {
            predictedCategory: item.aiAnalysis.predictedCategory,
            confidence: item.aiAnalysis.confidence,
            rawLabel: item.aiAnalysis.rawLabel,
            materialName: item.aiAnalysis.materialName || item.aiAnalysis.rawLabel,
            reasoning: item.aiAnalysis.reasoning,
            isRecyclable: item.aiAnalysis.isRecyclable,
            imageQuality: item.aiAnalysis.imageQuality,
            warning: item.aiAnalysis.warning,
            modelUsed: item.aiAnalysis.modelUsed,
          }
        : null
    );
    setAiError(null);
    setActiveTab(item.aiAnalysis ? "ai" : item.manualInspection ? "manual" : "ai");
    setActionSuccess(null);
    setRejectionModalOpen(false);
    setRejectionReason("");
    setRejectionError(null);
  };

  const handleRunAi = async () => {
    if (!selectedSubmission) return;
    try {
      setAiRunning(true);
      setAiError(null);
      const res = await fetch("/api/admin/submissions/analyze-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: selectedSubmission.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAiError(data.error || "AI classification failed. Check API configuration or retry.");
      } else {
        setAiResult(data.aiResult);
        setActionSuccess("AI Vision Analysis completed successfully!");
        // Update local item status
        setSelectedSubmission((prev) =>
          prev
            ? {
                ...prev,
                status: "AI_ANALYZED",
                aiPredictedCategory: data.aiResult.predictedCategory,
                aiConfidence: data.aiResult.confidence,
                aiModelUsed: data.aiResult.modelUsed,
              }
            : null
        );
        fetchSubmissions();
      }
    } catch (err: any) {
      setAiError(err.message || "Failed to contact AI service.");
    } finally {
      setAiRunning(false);
    }
  };

  const handleSaveManual = async () => {
    if (!selectedSubmission) return;
    try {
      setSavingManual(true);
      const res = await fetch("/api/admin/submissions/inspect-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          selectedCategory: manualCategory,
          notes: manualNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save manual inspection");
      } else {
        setActionSuccess("Manual inspection saved!");
        setSelectedSubmission((prev) =>
          prev
            ? {
                ...prev,
                status: "MANUAL_INSPECTION",
                adminNotes: manualNotes,
              }
            : null
        );
        fetchSubmissions();
      }
    } catch (err: any) {
      alert(err.message || "Network error");
    } finally {
      setSavingManual(false);
    }
  };

  const handleAdjudicate = async (decision: "APPROVE" | "REJECT") => {
    if (!selectedSubmission) return;
    if (decision === "REJECT" && !rejectionReason.trim()) {
      setRejectionError("Please select or type a reason for the rejection.");
      setRejectionModalOpen(true);
      return;
    }

    try {
      setAdjudicating(true);
      setRejectionError(null);
      const method = activeTab === "ai" && aiResult ? "AI_ASSISTED" : "MANUAL";
      const finalCat =
        activeTab === "manual"
          ? manualCategory
          : aiResult?.predictedCategory || selectedSubmission.userSelectedCategory;

      const res = await fetch("/api/admin/submissions/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          decision,
          verificationMethod: method,
          finalCategory: finalCat,
          rejectionReason: decision === "REJECT" ? rejectionReason.trim() : null,
          adminNotes: manualNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (decision === "REJECT") {
          setRejectionError(data.error || "Failed to execute rejection decision.");
        } else {
          alert(data.error || "Failed to execute decision");
        }
      } else {
        const msg =
          decision === "APPROVE"
            ? `Submission ${selectedSubmission.submissionCode} approved! Awarded ${data.coinsAwarded} Green Coins.`
            : `Submission ${selectedSubmission.submissionCode} rejected. Reason logged and citizen notified.`;

        setActionSuccess(msg);
        setSelectedSubmission(null);
        setRejectionModalOpen(false);
        setRejectionReason("");
        setRejectionError(null);
        await fetchSubmissions();
      }
    } catch (err: any) {
      if (decision === "REJECT") {
        setRejectionError(err.message || "Failed to submit rejection request.");
      } else {
        alert(err.message || "Failed to adjudicate");
      }
    } finally {
      setAdjudicating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Awaiting Review
          </span>
        );
      case "AI_ANALYZED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3 h-3" /> AI Analyzed
          </span>
        );
      case "MANUAL_INSPECTION":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Eye className="w-3 h-3" /> Manual Inspected
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              ANALYZER PENDING APPROVALS
            </h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Centralized queue for inspecting citizen waste submissions via Real AI Vision Analysis or Manual Inspection before awarding Green Coins.
          </p>
        </div>

        <button
          onClick={fetchSubmissions}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Queue
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 my-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: "NEEDS_REVIEW", label: "Needs Review" },
            { key: "PENDING", label: "Pending" },
            { key: "AI_ANALYZED", label: "AI Analyzed" },
            { key: "MANUAL_INSPECTION", label: "Manual Inspected" },
            { key: "APPROVED", label: "Approved" },
            { key: "REJECTED", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === tab.key
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search code or citizen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-56"
          />
        </div>
      </div>

      {/* Submissions Table */}
      {loading ? (
        <div className="py-12 text-center">
          <RefreshCw className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-medium">Loading submissions queue...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-800">Queue is Clear</p>
          <p className="text-xs text-gray-400 mt-0.5">No submissions matching the current filter.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-3">Item</th>
                <th className="py-3 px-3">Citizen</th>
                <th className="py-3 px-3">Claimed Category</th>
                <th className="py-3 px-3">Weight</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Analysis State</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative">
                        <img
                          src={sub.imageUrl}
                          alt="Waste item"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 font-mono text-[11px]">
                          {sub.submissionCode}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-gray-800">{sub.user.name}</p>
                    <p className="text-[10px] text-gray-400">{sub.user.email}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                      {sub.userSelectedCategory}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-gray-700">
                    {sub.weightKg.toFixed(1)} kg
                  </td>
                  <td className="py-3 px-3">{getStatusBadge(sub.status)}</td>
                  <td className="py-3 px-3">
                    {sub.aiConfidence ? (
                      <div>
                        <p className="text-[11px] font-semibold text-gray-800 flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-blue-600" />
                          AI: {sub.aiPredictedCategory} ({Math.round(sub.aiConfidence * 100)}%)
                        </p>
                        <p className="text-[9px] text-gray-400 font-mono truncate max-w-[140px]">
                          {sub.aiModelUsed}
                        </p>
                      </div>
                    ) : sub.manualInspection ? (
                      <p className="text-[11px] font-semibold text-purple-700 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        Manual: {sub.manualInspection.selectedCategory}
                      </p>
                    ) : (
                      <span className="text-[11px] text-gray-400 italic">Not inspected</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => openInspection(sub)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary hover:bg-primary-hover text-white transition-colors"
                    >
                      Inspect & Adjudicate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Inspection Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Analyzer Adjudication Workspace
                </span>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Submission: {selectedSubmission.submissionCode}
                  {getStatusBadge(selectedSubmission.status)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Image & Citizen Claim */}
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video relative">
                  <img
                    src={selectedSubmission.imageUrl}
                    alt="Inspection waste item"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-gray-500">Citizen Claim</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block">Citizen</span>
                      <span className="font-bold text-gray-800">{selectedSubmission.user.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Email</span>
                      <span className="font-bold text-gray-800">{selectedSubmission.user.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Claimed Category</span>
                      <span className="font-bold text-primary">{selectedSubmission.userSelectedCategory}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Estimated Weight</span>
                      <span className="font-bold text-gray-800">{selectedSubmission.weightKg} kg</span>
                    </div>
                  </div>
                </div>

                {actionSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{actionSuccess}</span>
                  </div>
                )}
              </div>

              {/* Right Column: Verification Engine (AI vs Manual) */}
              <div className="flex flex-col h-full space-y-4">
                {/* Mode Tabs */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                  <button
                    onClick={() => setActiveTab("ai")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === "ai"
                        ? "bg-white text-gray-900 shadow-xs"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-secondary" />
                    AI Vision Analysis
                  </button>
                  <button
                    onClick={() => setActiveTab("manual")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === "manual"
                        ? "bg-white text-gray-900 shadow-xs"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 text-primary" />
                    Manual Inspection
                  </button>
                </div>

                {/* Tab 1: AI Vision Analysis */}
                {activeTab === "ai" && (
                  <div className="flex-1 p-4 rounded-xl border border-gray-200 bg-white space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-primary" />
                          Google Gemini Vision AI
                        </h4>
                        <p className="text-[11px] text-gray-500">Model: gemini-3.1-flash-lite</p>
                      </div>

                      <button
                        onClick={handleRunAi}
                        disabled={aiRunning}
                        className="px-3 py-1.5 text-xs font-semibold bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${aiRunning ? "animate-spin" : ""}`} />
                        {aiRunning ? "Analyzing with Gemini..." : "Run AI Analysis"}
                      </button>
                    </div>

                    {aiError && (
                      <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-2">
                        <div className="flex items-center gap-2 font-bold text-red-700">
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                          <span>Gemini Vision Notice</span>
                        </div>
                        <p className="text-xs text-red-800 leading-relaxed">{aiError}</p>
                        {aiError.includes("GEMINI_API_KEY") && (
                          <div className="p-2.5 rounded-lg bg-white border border-red-200 text-[11px] text-gray-700 space-y-1.5">
                            <p className="font-semibold text-gray-900">How to configure Google Gemini Vision:</p>
                            <ol className="list-decimal list-inside space-y-1 text-gray-600">
                              <li>Obtain a free API Key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary underline font-medium">Google AI Studio</a></li>
                              <li>Add <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono">GEMINI_API_KEY=&quot;AIza...&quot;</code> to your local <code className="font-mono">.env</code> file</li>
                              <li>Click &quot;Run AI Analysis&quot; to test real vision inference or switch to <strong>Manual Inspection</strong> to adjudicate immediately</li>
                            </ol>
                          </div>
                        )}
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => setActiveTab("manual")}
                            className="text-xs font-semibold text-primary hover:text-primary-hover underline flex items-center gap-1"
                          >
                            <span>Switch to Manual Inspection Tab</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    {aiResult ? (
                      <div className="space-y-3">
                        {/* Primary Category & Confidence */}
                        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                                Gemini Vision Classification
                              </span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-base font-extrabold text-gray-900">
                                  {aiResult.predictedCategory}
                                </span>
                                {aiResult.materialName && (
                                  <span className="text-xs font-semibold text-gray-600 bg-white/80 px-2 py-0.5 rounded-md border border-gray-200">
                                    {aiResult.materialName}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-mono font-bold text-emerald-900">
                                {Math.round(aiResult.confidence * 100)}%
                              </span>
                              <span className="text-[10px] text-gray-500 block">Confidence</span>
                            </div>
                          </div>

                          {/* Confidence bar */}
                          <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.round(aiResult.confidence * 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Recyclability & Image Quality Badges */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-gray-400 uppercase">Recyclable:</span>
                            <span className={`font-bold ${aiResult.isRecyclable ? "text-emerald-700" : "text-amber-700"}`}>
                              {aiResult.isRecyclable ? "Yes (Recyclable)" : "No (Non-Recyclable)"}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-gray-400 uppercase">Quality:</span>
                            <span className="font-bold text-gray-800">
                              {aiResult.imageQuality || "CLEAR"}
                            </span>
                          </div>
                        </div>

                        {/* Visual Reasoning */}
                        {aiResult.reasoning && (
                          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                              Visual Analysis Reasoning
                            </span>
                            <p className="text-gray-700 leading-relaxed italic">
                              &ldquo;{aiResult.reasoning}&rdquo;
                            </p>
                          </div>
                        )}

                        {/* Warning Banner if detected */}
                        {aiResult.warning && (
                          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold block">Advisory Warning:</span>
                              <span className="text-[11px]">{aiResult.warning}</span>
                            </div>
                          </div>
                        )}

                        {/* Category Agreement Card */}
                        <div
                          className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                            aiResult.predictedCategory === selectedSubmission.userSelectedCategory
                              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                              : "bg-amber-50 border-amber-200 text-amber-900"
                          }`}
                        >
                          {aiResult.predictedCategory === selectedSubmission.userSelectedCategory ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>AI confirms citizen category ({selectedSubmission.userSelectedCategory}).</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>
                                Category mismatch: Citizen claimed {selectedSubmission.userSelectedCategory}, but AI detected {aiResult.predictedCategory}.
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-gray-400 text-xs">
                        Click &ldquo;Run AI Analysis&rdquo; to execute Google Gemini Vision on this item.
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Manual Inspection */}
                {activeTab === "manual" && (
                  <div className="flex-1 p-4 rounded-xl border border-gray-200 bg-white space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-primary" />
                        Human Quality Inspection
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        Confirm or override waste categorization manually based on visual inspection.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Confirmed Category
                        </label>
                        <select
                          value={manualCategory}
                          onChange={(e) => setManualCategory(e.target.value as WasteCategory)}
                          className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="PLASTIC">Plastic</option>
                          <option value="CARDBOARD">Cardboard</option>
                          <option value="PAPER">Paper</option>
                          <option value="GLASS">Glass</option>
                          <option value="METAL">Metal</option>
                          <option value="ORGANIC">Organic</option>
                          <option value="E_WASTE">E-Waste</option>
                          <option value="OTHER">Other / Unsorted</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Inspection Notes
                        </label>
                        <textarea
                          rows={3}
                          value={manualNotes}
                          onChange={(e) => setManualNotes(e.target.value)}
                          placeholder="Add quality inspection notes, packaging condition, cleanliness..."
                          className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <button
                        onClick={handleSaveManual}
                        disabled={savingManual}
                        className="px-3 py-1.5 text-xs font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        {savingManual ? "Saving..." : "Save Manual Inspection"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Final Decision Action Box */}
                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Adjudication Decision</span>
                    <span className="text-[10px] text-slate-400">Requires Admin Action</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleAdjudicate("APPROVE")}
                      disabled={adjudicating}
                      className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{adjudicating ? "Processing..." : "Approve & Credit Coins"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRejectionError(null);
                        setRejectionModalOpen(true);
                      }}
                      disabled={adjudicating}
                      className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-900 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Submission</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectionModalOpen && selectedSubmission && (
        <div
          style={{ zIndex: 9999 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Reject Waste Submission: {selectedSubmission.submissionCode}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Citizen: {selectedSubmission.user.name} ({selectedSubmission.weightKg} kg {selectedSubmission.userSelectedCategory})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRejectionModalOpen(false);
                  setRejectionError(null);
                }}
                disabled={adjudicating}
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Select or type a clear explanation. This reason will be recorded in PostgreSQL, sent directly to the citizen&apos;s notification inbox, and 0 Green Coins will be awarded.
            </p>

            {/* Quick preset reason chips */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Common Rejection Reasons (Click to apply)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_REJECTION_REASONS.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setRejectionReason(r);
                      if (rejectionError) setRejectionError(null);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border text-left transition-all ${
                      rejectionReason === r
                        ? "bg-red-50 border-red-300 text-red-800 font-semibold"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Reason for Rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  if (rejectionError) setRejectionError(null);
                }}
                placeholder="Explain clearly why this submission was rejected..."
                className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            {rejectionError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{rejectionError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setRejectionModalOpen(false);
                  setRejectionError(null);
                }}
                disabled={adjudicating}
                className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAdjudicate("REJECT")}
                disabled={adjudicating}
                className="px-5 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 text-white rounded-xl transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {adjudicating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Rejecting Submission...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Confirm Rejection</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
