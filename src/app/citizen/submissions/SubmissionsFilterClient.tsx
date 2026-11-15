"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, RotateCcw } from "lucide-react";
import { WASTE_CATEGORIES } from "@/lib/types";

interface FilterProps {
  initialSearch?: string;
  initialCategory?: string;
  initialStatus?: string;
}

export default function SubmissionsFilterClient({
  initialSearch = "",
  initialCategory = "",
  initialStatus = "",
}: FilterProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState(initialStatus);

  const applyFilters = (newSearch: string, newCategory: string, newStatus: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.set("search", newSearch);
    if (newCategory) params.set("category", newCategory);
    if (newStatus) params.set("status", newStatus);
    router.push(`/citizen/submissions?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(search, category, status);
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setStatus("");
    router.push("/citizen/submissions");
  };

  return (
    <div className="eco-card p-4 bg-white space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="flex-1 relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code (e.g. ECO-SUB-00001)..."
          className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
      </form>

      {/* Category Dropdown */}
      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          applyFilters(search, e.target.value, status);
        }}
        className="w-full sm:w-40 px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Categories</option>
        {Object.keys(WASTE_CATEGORIES).map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>

      {/* Status Dropdown */}
      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          applyFilters(search, category, e.target.value);
        }}
        className="w-full sm:w-36 px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Statuses</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
        <option value="PROCESSING">Processing</option>
      </select>

      {/* Reset */}
      {(search || category || status) && (
        <button
          onClick={handleReset}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg text-xs flex items-center gap-1 shrink-0"
          title="Reset filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      )}
    </div>
  );
}
