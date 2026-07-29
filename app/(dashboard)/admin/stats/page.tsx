"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AdminStatsCard from "@/components/AdminStatsCard";
import { toast } from "sonner";

export default function AdminStatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (res.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      toast.error("هەڵەیەک ڕوویدا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={{ name: "ئەدمین", role: "admin" }} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">ڕاپۆرت و ئامارەکان</h1>

        {loading ? (
          <div className="text-center py-20">⏳ چاوەڕێ بکە...</div>
        ) : stats ? (
          <AdminStatsCard stats={stats} />
        ) : (
          <div className="text-center py-20">هیچ داتایەک نییە</div>
        )}
      </div>
    </div>
  );
}
