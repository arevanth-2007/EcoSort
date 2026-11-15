"use client";

import React, { useState } from "react";
import { Copy, Check, ShieldCheck, UserCheck } from "lucide-react";

interface CitizenIdBadgeProps {
  citizenId?: string | null;
  variant?: "pill" | "card" | "compact" | "mono";
  showLabel?: boolean;
  className?: string;
}

export default function CitizenIdBadge({
  citizenId,
  variant = "pill",
  showLabel = true,
  className = "",
}: CitizenIdBadgeProps) {
  const [copied, setCopied] = useState(false);

  const displayId = citizenId || "ECO-CIT-000000";

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(displayId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === "compact") {
    return (
      <span
        onClick={handleCopy}
        title="Click to copy Citizen ID"
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-mono font-bold cursor-pointer transition-colors duration-150 border border-slate-200/80 ${className}`}
      >
        <span>{displayId}</span>
        {copied ? (
          <Check className="w-3 h-3 text-emerald-600" />
        ) : (
          <Copy className="w-3 h-3 text-slate-400 hover:text-slate-600" />
        )}
      </span>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Permanent Citizen ID
            </span>
            <span className="text-xs font-mono font-bold text-slate-900 tracking-tight">
              {displayId}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors shadow-2xs"
          title="Copy Citizen ID"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] text-emerald-700">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px]">Copy ID</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // Default 'pill' variant
  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Click to copy your unique permanent Citizen ID"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-all duration-150 group shadow-2xs ${className}`}
    >
      <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      <span className="text-[11px] text-slate-300">
        {showLabel && <span className="text-slate-400 font-normal">Citizen ID: </span>}
        <strong className="font-mono font-bold text-white tracking-wide">{displayId}</strong>
      </span>
      {copied ? (
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded">
          <Check className="w-3 h-3" />
          <span>Copied!</span>
        </span>
      ) : (
        <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
      )}
    </button>
  );
}
