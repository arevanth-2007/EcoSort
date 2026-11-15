"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface AdminChartsProps {
  approvedKg: number;
  coinsIssued: number;
  coinsRedeemed: number;
}

const monthlyData = [
  { month: "Jun", RecycledKg: 18.2, CoinsEarned: 190, CoinsRedeemed: 60 },
  { month: "Jul", RecycledKg: 24.5, CoinsEarned: 260, CoinsRedeemed: 110 },
  { month: "Aug", RecycledKg: 35.8, CoinsEarned: 380, CoinsRedeemed: 150 },
  { month: "Sep", RecycledKg: 48.0, CoinsEarned: 510, CoinsRedeemed: 220 },
  { month: "Oct", RecycledKg: 72.4, CoinsEarned: 780, CoinsRedeemed: 340 },
  { month: "Nov", RecycledKg: 96.1, CoinsEarned: 1100, CoinsRedeemed: 420 },
];

const categoryDistribution = [
  { category: "Plastic", mass: 38.5, fill: "#2563EB" },
  { category: "Cardboard", mass: 24.0, fill: "#D97706" },
  { category: "Metal", mass: 14.5, fill: "#64748B" },
  { category: "Organic", mass: 12.0, fill: "#16A34A" },
  { category: "Glass", mass: 7.1, fill: "#059669" },
];

export default function AdminDashboardCharts({
  approvedKg,
  coinsIssued,
  coinsRedeemed,
}: AdminChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-gray-400">
        Loading analytics charts...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 eco-card p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Platform Growth & Coin Velocity</h3>
            <p className="text-xs text-gray-500">Monthly cumulative verified waste (kg) vs Green Coins</p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            +32% MoM Expansion
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorKg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#166534" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#166534" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="RecycledKg" stroke="#166534" strokeWidth={2} fillOpacity={1} fill="url(#colorKg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-4 eco-card p-6 bg-white flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Category Share (kg)</h3>
          <p className="text-xs text-gray-500 mb-4">Distribution by material category</p>

          <div className="space-y-3">
            {categoryDistribution.map((item) => {
              const total = 96.1;
              const percent = Math.round((item.mass / total) * 100);
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-700">{item.category}</span>
                    <span className="font-bold text-gray-900">{item.mass} kg ({percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${percent}%`, backgroundColor: item.fill }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
          <span>Total Diverted:</span>
          <strong className="text-gray-900 font-extrabold">{approvedKg.toFixed(1)} kg</strong>
        </div>
      </div>
    </div>
  );
}
