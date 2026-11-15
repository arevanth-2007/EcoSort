"use client";

import React, { useState } from "react";
import { formatDate } from "@/lib/utils";
import { MessageSquare, Mail, CheckCircle2, Clock, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminSupportProps {
  initialTickets: any[];
  initialMessages: any[];
}

export default function AdminSupportClient({
  initialTickets,
  initialMessages,
}: AdminSupportProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"tickets" | "messages">("tickets");
  const [tickets, setTickets] = useState(initialTickets);
  const [messages, setMessages] = useState(initialMessages);

  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [ticketStatus, setTicketStatus] = useState("RESOLVED");
  const [saving, setSaving] = useState(false);

  const handleUpdateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    setSaving(true);

    try {
      const res = await fetch("/api/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          status: ticketStatus,
          adminResponse,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTickets(
        tickets.map((t) => (t.id === selectedTicket.id ? { ...t, status: ticketStatus, adminResponse } : t))
      );
      setSelectedTicket(null);
      setAdminResponse("");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to update ticket.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            Citizen Support & Inquiries
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review reported issues, AI rejection appeals, and public contact submissions.
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab("tickets")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "tickets" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Citizen Tickets ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "messages" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Public Contact ({messages.length})
          </button>
        </div>
      </div>

      {/* TICKETS TAB */}
      {activeTab === "tickets" && (
        <div className="eco-card p-6 bg-white">
          {tickets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Code</th>
                    <th className="pb-3 font-semibold">Citizen</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Subject</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50/70">
                      <td className="py-3.5 font-mono font-bold text-gray-800">{t.ticketCode}</td>
                      <td className="py-3.5 font-semibold text-gray-900">{t.user?.name}</td>
                      <td className="py-3.5 text-gray-500">{t.category}</td>
                      <td className="py-3.5 text-gray-800 max-w-xs truncate">{t.subject}</td>
                      <td className="py-3.5">
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
                      </td>
                      <td className="py-3.5 text-gray-400">{formatDate(t.createdAt)}</td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedTicket(t);
                            setAdminResponse(t.adminResponse || "");
                            setTicketStatus(t.status);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-bold"
                        >
                          Review / Reply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 text-xs">
              No citizen support tickets logged.
            </div>
          )}
        </div>
      )}

      {/* PUBLIC MESSAGES TAB */}
      {activeTab === "messages" && (
        <div className="eco-card p-6 bg-white">
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((m) => (
                <div key={m.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-sm text-gray-900">{m.name}</strong>{" "}
                      <span className="text-gray-500">({m.email})</span>
                    </div>
                    <span className="text-gray-400">{formatDate(m.createdAt)}</span>
                  </div>
                  <p className="font-semibold text-primary">{m.subject}</p>
                  <p className="text-gray-700 leading-relaxed bg-white p-3 rounded-lg border border-gray-100">
                    {m.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 text-xs">
              No public contact messages in the database.
            </div>
          )}
        </div>
      )}

      {/* REPLY MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                Ticket {selectedTicket.ticketCode}
              </h3>
              <button onClick={() => setSelectedTicket(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1">
              <p><strong>Citizen:</strong> {selectedTicket.user?.name} ({selectedTicket.user?.email})</p>
              <p><strong>Subject:</strong> {selectedTicket.subject}</p>
              <p className="pt-1 text-gray-700">{selectedTicket.description}</p>
            </div>

            <form onSubmit={handleUpdateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={ticketStatus}
                  onChange={(e) => setTicketStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:ring-2 focus:ring-gray-900"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Official Response *</label>
                <textarea
                  required
                  rows={3}
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Provide resolution details or advice to the citizen..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 rounded-xl bg-gray-900 text-white font-bold hover:bg-black"
                >
                  {saving ? "Saving..." : "Save Response"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
