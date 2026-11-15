import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: string;
  trendPositive?: boolean;
}

export default function StatCard({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-lightGreen",
  trend,
  trendPositive = true,
}: StatCardProps) {
  return (
    <div className="eco-card p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{value}</span>
          {unit && <span className="text-sm font-semibold text-gray-500">{unit}</span>}
        </div>
        {(subtitle || trend) && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={`font-semibold px-1.5 py-0.5 rounded ${
                  trendPositive ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {trend}
              </span>
            )}
            {subtitle && <span className="text-gray-500 truncate">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
