import React from "react";
import AdminAnalyzerApprovals from "@/components/AdminAnalyzerApprovals";

export const dynamic = "force-dynamic";

export default function AdminApprovalsPage() {
  return (
    <div className="space-y-6">
      <AdminAnalyzerApprovals />
    </div>
  );
}
