import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeGreeting(): { greeting: string; period: "morning" | "afternoon" | "evening" | "night" } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { greeting: "Good Morning", period: "morning" };
  } else if (hour >= 12 && hour < 17) {
    return { greeting: "Good Afternoon", period: "afternoon" };
  } else if (hour >= 17 && hour < 21) {
    return { greeting: "Good Evening", period: "evening" };
  } else {
    return { greeting: "Good Night", period: "night" };
  }
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function calculateGreenCoins(weightKg: number, ratePerKg: number): number {
  if (weightKg <= 0 || ratePerKg <= 0) return 0;
  return Math.round(weightKg * ratePerKg);
}

export interface EcoLevelInfo {
  level: number;
  title: string;
  minKg: number;
  maxKg: number;
  nextLevelTitle?: string;
  progressPercent: number;
  badgeSlug: string;
}

export function getEcoLevelInfo(totalWeightKg: number): EcoLevelInfo {
  const kg = Math.max(0, totalWeightKg);

  if (kg < 10) {
    return {
      level: 1,
      title: "Eco Beginner",
      minKg: 0,
      maxKg: 10,
      nextLevelTitle: "Eco Explorer",
      progressPercent: Math.min(100, Math.round((kg / 10) * 100)),
      badgeSlug: "first-recycling",
    };
  } else if (kg < 25) {
    return {
      level: 2,
      title: "Eco Explorer",
      minKg: 10,
      maxKg: 25,
      nextLevelTitle: "Green Champion",
      progressPercent: Math.min(100, Math.round(((kg - 10) / 15) * 100)),
      badgeSlug: "5-submissions",
    };
  } else if (kg < 50) {
    return {
      level: 3,
      title: "Green Champion",
      minKg: 25,
      maxKg: 50,
      nextLevelTitle: "Eco Hero",
      progressPercent: Math.min(100, Math.round(((kg - 25) / 25) * 100)),
      badgeSlug: "green-champion",
    };
  } else if (kg < 100) {
    return {
      level: 4,
      title: "Eco Hero",
      minKg: 50,
      maxKg: 100,
      nextLevelTitle: "Planet Protector",
      progressPercent: Math.min(100, Math.round(((kg - 50) / 50) * 100)),
      badgeSlug: "10kg-recycled",
    };
  } else {
    return {
      level: 5,
      title: "Planet Protector",
      minKg: 100,
      maxKg: 100,
      progressPercent: 100,
      badgeSlug: "plastic-saver",
    };
  }
}

export function calculateEnvironmentalImpact(totalKg: number) {
  const kg = Math.max(0, totalKg);
  return {
    co2SavedKg: Number((kg * 1.42).toFixed(1)),
    treesEquivalent: Number((kg * 0.014).toFixed(2)),
    landfillDivertedKg: Number(kg.toFixed(1)),
    energySavedKwh: Number((kg * 3.8).toFixed(1)),
    waterSavedLiters: Math.round(kg * 18.5),
  };
}

export function generateCode(prefix: "ECO-SUB" | "ECO-RED" | "ECO-TXN" | "ECO-TCK"): string {
  const randomPart = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomPart}`;
}
