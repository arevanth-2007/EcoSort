import React from "react";
import { Leaf, RefreshCw } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-ecoBg flex flex-col items-center justify-center p-4">
      <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-elevated mb-4 animate-bounce">
        <Leaf className="w-7 h-7 text-secondary" />
      </div>
      <div className="flex items-center gap-2 text-primary font-bold text-sm">
        <RefreshCw className="w-4 h-4 animate-spin text-secondary" />
        <span>Loading EcoSort Platform...</span>
      </div>
      <p className="text-xs text-gray-400 mt-1">Checking session and AI validation status</p>
    </div>
  );
}
