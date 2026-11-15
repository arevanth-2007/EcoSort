"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Leaf } from "lucide-react";

export interface DayRecyclingData {
  day: string;
  Plastic: number;
  Cardboard: number;
  Metal: number;
  Organic: number;
  Paper: number;
  Glass: number;
}

interface CitizenDashboardChartsProps {
  weeklyData?: DayRecyclingData[];
}

export default function CitizenDashboardCharts({ weeklyData = [] }: CitizenDashboardChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalApprovedMass = weeklyData.reduce((sum, item) => {
    return (
      sum +
      (item.Plastic || 0) +
      (item.Cardboard || 0) +
      (item.Metal || 0) +
      (item.Organic || 0) +
      (item.Paper || 0) +
      (item.Glass || 0)
    );
  }, 0);

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        Loading personal activity chart...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {totalApprovedMass === 0 && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Zero approved activity recorded this week.</strong> All impact data is strictly calculated from your approved waste batches.
          </span>
        </div>
      )}

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} unit="kg" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "0.75rem",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="Plastic" fill="#2563EB" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="Cardboard" fill="#D97706" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="Metal" fill="#64748B" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="Organic" fill="#16A34A" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="Paper" fill="#0284C7" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="Glass" fill="#059669" radius={[4, 4, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
