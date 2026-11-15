"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application boundary error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-ecoBg flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full eco-card p-8 bg-white shadow-elevated space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-bold text-gray-900">Application Error Encountered</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          {error.message || "An unexpected error occurred while loading this view."}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-900 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4 text-secondary" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4 text-gray-400" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}