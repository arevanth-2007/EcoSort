import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import prisma from "@/lib/db";
import { Gift, Coins, MapPin, Store, ArrowRight, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RewardsPreviewPage() {
  let rewards: any[] = [];
  let stores: any[] = [];

  try {
    rewards = await prisma.reward.findMany({
      where: { isActive: true },
      include: { sampleStore: true },
      orderBy: { coinCost: "asc" },
    });
    stores = await prisma.sampleStore.findMany({
      where: { isActive: true },
      include: { _count: { select: { rewards: true } } },
    });
  } catch (err) {
    console.error("Error fetching preview rewards:", err);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-16 bg-ecoBg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Community Rewards
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mt-2 tracking-tight">
              Rewards Marketplace
            </h1>
            <p className="text-base text-gray-600 mt-3 leading-relaxed">
              Earn Green Coins by segregating waste and redeem them for sustainable products, native saplings, and vouchers at verified partner hubs across India.
            </p>
          </div>

          <div className="eco-card p-6 bg-white border border-green-200">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-3">
              <Store className="w-5 h-5 text-primary" />
              Verified Collection & Redemption Centers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stores.map((s) => (
                <div key={s.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                  <span className="font-bold text-gray-900 block text-sm">{s.name}</span>
                  <p className="text-gray-500 mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                    <span>{s.address}, {s.city}</span>
                  </p>
                  <span className="inline-block mt-2 font-semibold text-primary">
                    {s._count.rewards} rewards available here
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((rew) => (
              <div key={rew.id} className="eco-card overflow-hidden flex flex-col justify-between group">
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={rew.imageUrl}
                    alt={rew.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black bg-white/95 text-primary shadow-sm flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-secondary" />
                    <span>{rew.coinCost} GC</span>
                  </div>
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                    {rew.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {rew.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed line-clamp-2">
                      {rew.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                      <span className="truncate max-w-[180px]">
                        {rew.sampleStore ? rew.sampleStore.name : "Digital Redemption"}
                      </span>
                      <span className="font-semibold text-emerald-700">{rew.stock} in stock</span>
                    </div>
                  </div>

                  <a
                    href="/citizen/rewards"
                    className="mt-4 w-full py-2.5 rounded-xl bg-primary hover:bg-primary-900 text-white text-xs font-bold text-center transition-colors shadow-xs"
                  >
                    Redeem in Citizen Portal &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
