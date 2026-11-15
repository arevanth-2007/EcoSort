import React from "react";
import Link from "next/link";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import CitizenIdBadge from "@/components/CitizenIdBadge";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Coins,
  Cpu,
  Scale,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Eye,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSessionUser();
  if (!session) redirect("/auth/citizen/login");

  const { id } = await params;

  const submission = await prisma.wasteSubmission.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          citizenId: true,
          name: true,
        },
      },
      aiAnalysis: true,
      manualInspection: true,
      reviewedBy: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!submission || (submission.userId !== session.id && session.role !== "ADMIN")) {
    notFound();
  }

  const isApproved = submission.status === "APPROVED";
  const isRejected = submission.status === "REJECTED";
  const isPending = ["PENDING", "AI_ANALYZED", "MANUAL_INSPECTION"].includes(submission.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/citizen/submissions"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Submissions History
        </Link>
      </div>

      <div className="eco-card p-6 sm:p-8 bg-white space-y-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {submission.submissionCode}
              </span>
              <CitizenIdBadge citizenId={submission.user?.citizenId || session.citizenId} variant="compact" />
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isApproved
                    ? "bg-emerald-100 text-emerald-800"
                    : isRejected
                    ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {submission.status === "PENDING"
                  ? "Awaiting Verification"
                  : submission.status === "AI_ANALYZED"
                  ? "AI Vision Analyzed"
                  : submission.status === "MANUAL_INSPECTION"
                  ? "Manual Inspected"
                  : submission.status}
              </span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 mt-1">
              Waste Classification Record
            </h1>
            <p className="text-xs text-gray-500">
              Submitted on {formatDate(submission.createdAt)}
            </p>
          </div>

          {isApproved && (
            <div className="px-5 py-3 rounded-2xl bg-lightGreen border border-green-200 text-right self-start sm:self-auto">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                Green Coins Awarded
              </span>
              <span className="text-2xl font-black text-primary">+{submission.coinsAwarded} GC</span>
            </div>
          )}
        </div>

        {/* Content Layout: Image + Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Photo Column */}
          <div className="md:col-span-5 space-y-3">
            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-xs aspect-square relative">
              <img
                src={submission.imageUrl}
                alt={submission.submissionCode}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
              <span>SHA-256 Fingerprint:</span>
              <span className="font-mono truncate max-w-[150px]">{submission.imageHash}</span>
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Verification Breakdown
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-500 block">Citizen Category</span>
                <strong className="text-gray-900 text-sm">{submission.userSelectedCategory}</strong>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-500 block">Analysis Category</span>
                <strong className="text-gray-900 text-sm">
                  {submission.aiPredictedCategory || submission.manualInspection?.selectedCategory || "Pending"}
                </strong>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-500 block">Confidence Rating</span>
                <strong className="text-emerald-700 text-sm">
                  {submission.aiConfidence != null ? `${Math.round(submission.aiConfidence * 100)}%` : "N/A"}
                </strong>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-500 block">Reported Mass</span>
                <strong className="text-gray-900 text-sm">{submission.weightKg} kg</strong>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-gray-800">
                <Cpu className="w-4 h-4 text-primary" />
                <span>Verification Method:</span>
                <span className="bg-white px-2 py-0.5 rounded border border-gray-200 font-mono text-[11px]">
                  {submission.verificationMethod}
                </span>
              </div>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                Waste submissions are evaluated in the administrative Analyzer through Google Gemini Vision AI and certified inspection.
              </p>
            </div>

            {/* Pending Notice */}
            {isPending && (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <Clock className="w-4 h-4" />
                  <span>Awaiting Analyzer Adjudication</span>
                </div>
                <p className="leading-relaxed">
                  This item is queued for administrative review. Once verified, Green Coins will be credited directly to your wallet.
                </p>
              </div>
            )}

            {/* Rejection Guidance Card if Rejected */}
            {isRejected && (
              <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-3">
                <div className="flex items-center gap-2 font-bold text-red-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Rejection Feedback</span>
                </div>
                <p className="leading-relaxed">{submission.rejectionReason}</p>

                <div className="pt-3 border-t border-red-200/60">
                  <h4 className="font-bold flex items-center gap-1.5 mb-1.5 text-red-800">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    How to ensure approval next time:
                  </h4>
                  <ul className="space-y-1 text-[11px] text-red-700 list-disc list-inside">
                    <li>Clean and thoroughly dry the material before photographing</li>
                    <li>Avoid shadows and blur; use direct natural or indoor lighting</li>
                    <li>Only submit single-material segregated batches</li>
                  </ul>
                </div>

                <a
                  href="/citizen/upload"
                  className="inline-block mt-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-xs"
                >
                  Resubmit New Photo &rarr;
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
