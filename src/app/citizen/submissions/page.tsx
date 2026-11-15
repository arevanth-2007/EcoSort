import React from "react";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatDate, getPublicImageUrl } from "@/lib/utils";
import { WasteCategory, SubmissionStatus } from "@/lib/types";
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
} from "lucide-react";
import SubmissionsFilterClient from "./SubmissionsFilterClient";
import CitizenIdBadge from "@/components/CitizenIdBadge";

export const dynamic = "force-dynamic";

export default async function CitizenSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSessionUser();
  if (!session) redirect("/auth/citizen/login");

  const resolvedParams = await searchParams;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search.trim() : "";
  const category = typeof resolvedParams.category === "string" ? (resolvedParams.category as WasteCategory) : undefined;
  const status = typeof resolvedParams.status === "string" ? (resolvedParams.status as SubmissionStatus) : undefined;

  const [user, submissions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.id },
      select: { citizenId: true },
    }),
    prisma.wasteSubmission.findMany({
      where: {
        userId: session.id,
        submissionCode: search ? { contains: search, mode: "insensitive" } : undefined,
        userSelectedCategory: category ? category : undefined,
        status: status ? status : undefined,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <History className="w-6 h-6 text-primary" />
              My Waste Submissions
            </h1>
            <CitizenIdBadge citizenId={user?.citizenId || session.citizenId} />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Complete history of your AI-evaluated domestic waste segregation batches.
          </p>
        </div>
        <a
          href="/citizen/upload"
          className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-900 text-white text-xs font-bold transition-colors shadow-xs self-start sm:self-auto"
        >
          + Upload New Waste
        </a>
      </div>

      <SubmissionsFilterClient initialSearch={search} initialCategory={category} initialStatus={status} />

      {submissions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((s) => (
            <div key={s.id} className="eco-card overflow-hidden flex flex-col justify-between group">
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                <img
                  src={getPublicImageUrl(s.imageUrl)}
                  alt={s.submissionCode}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs ${
                    s.status === "APPROVED"
                      ? "bg-green-500 text-white"
                      : s.status === "REJECTED"
                      ? "bg-red-500 text-white"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  {s.status}
                </span>

                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-xs font-mono font-bold">
                  {s.submissionCode}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-gray-600">Selected: {s.userSelectedCategory}</span>
                    <span className="text-gray-400">{formatDate(s.createdAt)}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Inspection Status:</span>
                      <strong className="text-gray-900">
                        {s.status === "PENDING"
                          ? "In Queue"
                          : s.status === "AI_ANALYZED"
                          ? "AI Analyzed"
                          : s.status === "MANUAL_INSPECTION"
                          ? "Manual Inspected"
                          : s.status}
                      </strong>
                    </div>
                    {s.aiPredictedCategory && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">AI Classification:</span>
                        <strong className="text-gray-900">{s.aiPredictedCategory}</strong>
                      </div>
                    )}
                    {s.aiConfidence != null && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">AI Confidence:</span>
                        <span className="font-bold text-emerald-700">
                          {(s.aiConfidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Reported Mass:</span>
                      <strong className="text-gray-900">{s.weightKg} kg</strong>
                    </div>
                  </div>

                  {s.status === "REJECTED" && s.rejectionReason && (
                    <p className="mt-2 text-[11px] text-red-600 line-clamp-2 leading-relaxed">
                      {s.rejectionReason}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black text-primary">
                      {s.coinsAwarded > 0 ? `+${s.coinsAwarded}` : "0"}
                    </span>
                    <span className="text-xs text-gray-500 font-semibold">GC Awarded</span>
                  </div>
                  <a
                    href={`/citizen/submissions/${s.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-900"
                  >
                    Details <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="eco-card p-12 text-center bg-white">
          <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No matching submissions found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Try resetting your search or filter keywords, or upload a new segregated waste item today.
          </p>
          <a
            href="/citizen/upload"
            className="mt-4 inline-block px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-900 transition-colors"
          >
            Upload Waste Now
          </a>
        </div>
      )}
    </div>
  );
}
