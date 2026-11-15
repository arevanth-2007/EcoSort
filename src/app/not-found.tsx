import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Leaf, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-ecoBg">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4 text-center">
        <div className="max-w-md w-full eco-card p-8 bg-white shadow-elevated space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-lightGreen flex items-center justify-center text-primary mx-auto">
            <Leaf className="w-7 h-7 text-secondary" />
          </div>

          <span className="text-4xl font-black text-gray-900 block tracking-tight">404</span>
          <h1 className="text-xl font-bold text-gray-800">Page Not Found</h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            The page or waste record you are looking for does not exist or may have been relocated.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-900 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4 text-secondary" />
              <span>Back to Home</span>
            </Link>
            <Link
              href="/citizen/dashboard"
              className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
            >
              Citizen Dashboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}