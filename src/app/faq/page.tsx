import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpCircle } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      category: "Waste Classification & Verification",
      items: [
        {
          q: "How does the waste inspection workflow operate?",
          a: "EcoSort utilizes a centralized Analyzer queue. When a citizen uploads a segregated waste photo, administrators review the submission with the assistance of Google Gemini Vision AI or certified quality review. Once verified, Green Coins are credited immediately to the citizen's audited wallet.",
        },
        {
          q: "Why might a submission not be approved?",
          a: "Submissions may not be approved if: (1) Image clarity is poor or lighting is dim; (2) The photo contains mixed unsorted materials; (3) The category selected does not match the actual material shown; or (4) The item is general non-recyclable refuse.",
        },
        {
          q: "How is waste weight determined?",
          a: "The weight is entered by the citizen as an estimated mass in kilograms. The system enforces a maximum allowable weight threshold to ensure balanced submissions.",
        },
        {
          q: "What prevents duplicate submissions of the same photograph?",
          a: "EcoSort runs a cryptographic SHA-256 hash algorithm on every uploaded image binary. If the exact same image hash already exists in our database, the system rejects it immediately as a duplicate.",
        },
      ],
    },
    {
      category: "Green Coins & Wallet",
      items: [
        {
          q: "What are Green Coins (GC)?",
          a: "Green Coins are civic sustainability reward tokens earned through validated domestic waste segregation. They can be redeemed for eco-friendly products, tree saplings, and vouchers across our partner network.",
        },
        {
          q: "How are Green Coins calculated?",
          a: "Coins = Verified Weight (kg) × Category Rate. For example, Plastic earns 10 GC/kg, Metal earns 12 GC/kg, and E-waste earns 15 GC/kg. Rates are managed by system administrators based on municipal recycling priorities.",
        },
        {
          q: "Can my wallet balance go negative?",
          a: "Never. All Green Coin transactions operate through atomic database transactions with balance guards. You cannot redeem a reward unless your balance is greater than or equal to the cost.",
        },
      ],
    },
    {
      category: "Rewards & Redemptions",
      items: [
        {
          q: "How do I redeem physical items?",
          a: "When you redeem a reward from the marketplace, your Green Coins are deducted and a unique digital redemption code (ECO-RED-XXXXX) is generated. You present this code at the designated partner depot to collect your item.",
        },
        {
          q: "Can I cancel a pending reward redemption?",
          a: "Yes. If an item has not been collected yet at the partner depot, administrators can cancel the redemption, which immediately returns the item to stock and refunds 100% of the Green Coins back to your wallet.",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-16 bg-ecoBg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Knowledge Base
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mt-2 tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-base text-gray-600 mt-3 leading-relaxed">
              Find answers to common questions about EcoSort&apos;s waste categorization, Green Coins rewards, and redemptions.
            </p>
          </div>

          <div className="space-y-10">
            {faqs.map((cat, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 pb-2 border-b border-gray-200">
                  {cat.category}
                </h2>
                <div className="space-y-3">
                  {cat.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="eco-card p-5 bg-white border border-gray-200 rounded-2xl shadow-xs">
                      <h3 className="text-base font-bold text-gray-900 flex items-start gap-2">
                        <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span>{item.q}</span>
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 pl-7 leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  ))}
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
