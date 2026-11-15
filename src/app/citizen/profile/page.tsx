import React from "react";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatDate, getEcoLevelInfo } from "@/lib/utils";
import CitizenIdBadge from "@/components/CitizenIdBadge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Sparkles,
  Trophy,
  CheckCircle2,
  Lock,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CitizenProfilePage() {
  const session = await getSessionUser();
  if (!session) redirect("/auth/citizen/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      citizenProfile: true,
      wallet: true,
      badges: {
        include: { badge: true },
      },
    },
  });

  if (!user) redirect("/auth/citizen/login");

  const allBadges = await prisma.badge.findMany();
  const earnedBadgeSlugs = new Set(user.badges.map((b) => b.badge.slug));
  const levelInfo = getEcoLevelInfo(user.citizenProfile?.totalApprovedWeightKg ?? 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="eco-card p-6 sm:p-8 bg-white flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <img
          src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
          alt={user.name}
          className="w-24 h-24 rounded-full border-4 border-lightGreen bg-gray-50 shadow-md object-cover shrink-0"
        />

        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
                <CitizenIdBadge citizenId={user.citizenId} />
              </div>
              <p className="text-xs text-primary font-bold mt-1">{levelInfo.title} &bull; Level {levelInfo.level}</p>
            </div>
            <a
              href="/citizen/settings"
              className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold self-center sm:self-auto transition-colors"
            >
              Edit Profile & Settings
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{user.mobile || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{user.address || "Hyderabad, Telangana"}</span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Joined {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Level & Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="eco-card p-5 bg-white text-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Recycled Mass
          </span>
          <span className="text-3xl font-black text-gray-900">
            {user.citizenProfile?.totalApprovedWeightKg.toFixed(1)} kg
          </span>
          <p className="text-[11px] text-gray-500 mt-1">Diverted from municipal landfills</p>
        </div>

        <div className="eco-card p-5 bg-white text-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Green Coins
          </span>
          <span className="text-3xl font-black text-primary">
            {user.wallet?.balance ?? 0} GC
          </span>
          <p className="text-[11px] text-gray-500 mt-1">Ready for marketplace rewards</p>
        </div>

        <div className="eco-card p-5 bg-white text-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Approved Uploads
          </span>
          <span className="text-3xl font-black text-gray-900">
            {user.citizenProfile?.approvedSubmissionsCount ?? 0}
          </span>
          <p className="text-[11px] text-gray-500 mt-1">100% verified by Vision AI</p>
        </div>
      </div>

      {/* Badges Collection Gallery */}
      <div className="eco-card p-6 sm:p-8 bg-white">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Sustainability Badges & Achievements
            </h3>
            <p className="text-xs text-gray-500">
              Unlocked by achieving verified recycling milestones
            </p>
          </div>
          <span className="text-xs font-bold text-primary px-3 py-1 bg-lightGreen rounded-full">
            {user.badges.length} / {allBadges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allBadges.map((badge) => {
            const isUnlocked = earnedBadgeSlugs.has(badge.slug);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? "bg-lightGreen/50 border-green-200 shadow-xs"
                    : "bg-gray-50/70 border-gray-200 opacity-60 grayscale"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isUnlocked ? "bg-primary text-white" : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {isUnlocked ? <Trophy className="w-5 h-5 text-secondary" /> : <Lock className="w-4 h-4" />}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-900">{badge.name}</h4>
                  <p className="text-xs text-gray-600 mt-0.5 leading-snug">{badge.description}</p>
                  <span
                    className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isUnlocked ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isUnlocked ? "Unlocked" : "Locked Milestone"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
