"use client";

import React, { useState } from "react";
import { formatDate } from "@/lib/utils";
import {
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Send,
  Clock,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface HelpClientProps {
  initialTickets: any[];
}

export default function HelpClient({ initialTickets }: HelpClientProps) {
  const router = useRouter();
  const [tickets, setTickets] = useState(initialTickets);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("AI Classification Help");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, category, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create ticket");

      setTickets([data.ticket, ...tickets]);
      setSuccess(true);
      setSubject("");
      setDescription("");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to submit ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary" />
          Citizen Help & Support
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Guidance on waste validation, AI rejection resolution, and ticket assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="eco-card p-5 bg-lightGreen border border-green-200">
          <h3 className="font-bold text-primary flex items-center gap-1.5 mb-2">
            <Lightbulb className="w-4 h-4 text-secondary" />
            AI Rejection Troubleshooting
          </h3>
          <p className="text-gray-700 leading-relaxed">
            If your submission was rejected with &ldquo;Confidence below 80%&rdquo;, please photograph the item against a clean white or neutral floor under bright indoor or daylight. Do not mix multiple waste categories in one image.
          </p>
        </div>

        <div className="eco-card p-5 bg-white border border-gray-200">
          <h3 className="font-bold text-gray-900 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Simulated Store Collection
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Redeemed rewards generate an immutable voucher code (ECO-RED-XXXXX). Simply open the voucher in your rewards tab and present it at the designated campus collection desk.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 eco-card p-6 bg-white space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Submit an Issue / Ticket
          </h3>

          {success && (
            <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-xs text-green-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>Ticket submitted successfully! Our administration team has logged your inquiry.</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="AI Classification Help">AI Classification & Confidence</option>
                <option value="Duplicate Image Error">Duplicate Image Hash Alert</option>
                <option value="Green Coins Wallet">Green Coins & Transactions</option>
                <option value="Reward Redemption">Reward Desk & Voucher Query</option>
                <option value="General Question">General Feedback / Bug Report</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of the issue..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Detailed Description</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include submission codes, photos description, or any error details..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-primary resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-900 transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5 text-secondary" />
              {submitting ? "Submitting..." : "Submit Support Ticket"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 eco-card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Your Tickets ({tickets.length})</h3>
            <span className="text-[10px] text-gray-400">Database tracked</span>
          </div>

          {tickets.length > 0 ? (
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-primary">{t.ticketCode}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === "RESOLVED"
                          ? "bg-green-100 text-green-800"
                          : t.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <p className="font-bold text-gray-900">{t.subject}</p>
                  <p className="text-[11px] text-gray-500 line-clamp-2">{t.description}</p>

                  {t.adminResponse && (
                    <div className="p-2.5 rounded-lg bg-green-50 border border-green-200 text-[11px] text-green-900">
                      <strong>Admin Response:</strong> {t.adminResponse}
                    </div>
                  )}

                  <span className="text-[10px] text-gray-400 block pt-1 border-t border-gray-200/40">
                    {formatDate(t.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-xs">
              You have no active support tickets.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
