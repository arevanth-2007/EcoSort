import React from "react";
import Link from "next/link";
import Image from "next/image";

interface EcoSortLogoProps {
  variant?: "light" | "dark" | "mark-only" | "gemini";
  size?: "sm" | "md" | "lg";
  withLink?: boolean;
  className?: string;
}

export default function EcoSortLogo({
  variant = "light",
  size = "md",
  withLink = true,
  className = "",
}: EcoSortLogoProps) {
  const sizeClasses = {
    sm: "h-7",
    md: "h-9",
    lg: "h-12",
  };

  const markSizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const isDark = variant === "dark";

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none transition-transform duration-150 active:scale-95 ${className}`}>
      {/* Precision Geometric SVG Icon Shield */}
      <div className={`relative flex items-center justify-center rounded-xl font-bold shadow-sm transition-all duration-200 group-hover:shadow-md ${
        isDark 
          ? "bg-slate-900 border border-emerald-500/40 text-emerald-400" 
          : "bg-slate-900 border border-slate-800 text-emerald-400"
      } ${markSizes[size]}`}>
        {/* Modern Möbius Segregation Loop SVG */}
        <svg viewBox="0 0 40 40" className="w-4/5 h-4/5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`markG-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="60%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id={`facetG-${variant}`} x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a3e635" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <path
            d="M20 7 C27 7 32 12 32 19 C32 26 26 30 20 34 C14 30 8 26 8 19 C8 12 13 7 20 7 Z"
            stroke={`url(#markG-${variant})`}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 17 C16 13 24 13 26 17 C28 21 23 25 20 27 C17 25 12 21 14 17 Z"
            fill={`url(#facetG-${variant})`}
            opacity="0.9"
          />
          <circle cx="20" cy="19" r="2.6" fill="#ecfdf5" />
          <circle cx="20" cy="19" r="1.1" fill="#064e3b" />
        </svg>

        {/* Real-time pulse ping indicator */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>

      {variant !== "mark-only" && (
        <div className="flex flex-col leading-none">
          <span className={`font-heading font-extrabold tracking-tight ${textSizes[size]} ${
            isDark ? "text-white" : "text-slate-900"
          }`}>
            Eco<span className="text-emerald-600 font-extrabold">Sort</span>
          </span>
          <span className={`text-[9px] font-semibold tracking-wider uppercase mt-0.5 font-sans ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}>
            Smart Segregation
          </span>
        </div>
      )}
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
