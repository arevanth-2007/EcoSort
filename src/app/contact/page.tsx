"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Send, CheckCircle2, Phone, ShieldCheck, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Failed to submit message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Inquiries &amp; Citizen Support
            </span>
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-slate-900 mt-3 tracking-tight">
              Contact EcoSort
            </h1>
            <p className="text-base text-slate-600 mt-3 leading-relaxed">
              Have questions regarding recycling guidelines, partner store drop-offs, or municipal partnerships? Reach out to our community operations team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="eco-card p-6 bg-white border border-slate-200 space-y-4">
                <h3 className="text-base font-heading font-bold text-slate-900">Platform Headquarters</h3>
                <div className="space-y-4 text-xs text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">National Operations Center</p>
                      <p>Plot 22, Cyber Gateway Sector, Madhapur</p>
                      <p>HITEC City, Hyderabad, Telangana - 500081</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Support Inquiries</p>
                      <p>support@ecosort.in</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Community Hotline</p>
                      <p>+91 40 6712 4001 / +91 80080 12000</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="eco-card p-6 bg-white border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Regional Desks</h4>
                <div className="space-y-2 text-[12px] text-slate-600">
                  <div className="flex justify-between pb-1.5 border-b border-slate-100">
                    <span className="font-medium text-slate-800">Hyderabad (HQ)</span>
                    <span className="font-mono text-slate-500">+91 40 6712 4001</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-slate-100">
                    <span className="font-medium text-slate-800">Bengaluru Depot</span>
                    <span className="font-mono text-slate-500">+91 80 4125 7800</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-slate-100">
                    <span className="font-medium text-slate-800">Pune Center</span>
                    <span className="font-mono text-slate-500">+91 20 2543 9200</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-800">Visakhapatnam Hub</span>
                    <span className="font-mono text-slate-500">+91 891 278 4020</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                <span className="font-bold block mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Verified Response SLA
                </span>
                Inquiries are securely logged to our PostgreSQL ticketing system and processed by our Indian regional coordinators within 24 business hours.
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="eco-card p-6 sm:p-8 bg-white border border-slate-200">
                <h3 className="text-lg font-heading font-bold text-slate-900 mb-1">Send a Message</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Fill in your details below. You will receive an automated tracking ticket.
                </p>

                {success && (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your inquiry has been logged successfully. Our team will contact you shortly.</span>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. aarav@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Inquiry regarding drop-off in Bengaluru Indiranagar"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Message *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please specify your query, location, or municipal integration requirement..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-emerald-600 rounded-lg shadow-subtle transition-all duration-150 disabled:opacity-50 active:scale-[0.98]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {loading ? "Submitting..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
