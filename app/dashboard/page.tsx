"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Briefcase,
  Sparkles,
  RefreshCw,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardStats, DashboardStatsSchema } from "@/lib/validations/dashboard";
import { HeadcountCards } from "@/components/dashboard/HeadcountCards";
import { DishRatingBarChart } from "@/components/dashboard/DishRatingBarChart";
import { RatingTrendLineChart } from "@/components/dashboard/RatingTrendLineChart";
import { ComplaintDonutChart } from "@/components/dashboard/ComplaintDonutChart";
import { TopRejectedDishes } from "@/components/dashboard/TopRejectedDishes";
import { ComplaintFeed } from "@/components/dashboard/ComplaintFeed";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const userRole = (session?.user as any)?.role as string | undefined;

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Role protection: Redirect unauthenticated to login and student to /student
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard");
    } else if (status === "authenticated" && userRole === "student") {
      router.push("/student?unauthorized=true");
    }
  }, [status, userRole, router]);

  // Fetch dashboard stats from API route with Zod validation
  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP ${res.status}: Failed to fetch dashboard data`);
      }

      const json = await res.json();
      // Zod validation check
      const parsed = DashboardStatsSchema.parse(json);
      setStats(parsed);
    } catch (err: any) {
      console.error("Failed to load dashboard data:", err);
      setError(err?.message || "An unexpected error occurred while parsing dashboard data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && (userRole === "manager" || userRole === "admin")) {
      fetchDashboardData();
    }
  }, [status, userRole, fetchDashboardData]);

  // Guard loading or student redirect
  if (status === "loading" || userRole === "student") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent" />
          <p className="text-xs text-zinc-400">Verifying manager permissions & security credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-16">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur shadow-sm">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={userRole === "admin" ? "destructive" : "warning"}
                className="capitalize text-xs font-semibold px-2.5 py-0.5"
              >
                {userRole === "admin" ? (
                  <ShieldCheck className="mr-1.5 h-3.5 w-3.5 inline text-rose-300" />
                ) : (
                  <Briefcase className="mr-1.5 h-3.5 w-3.5 inline text-amber-300" />
                )}
                {userRole || "manager"} Authority
              </Badge>
              <span className="text-xs text-zinc-400">Rai University Central Mess</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-emerald-400" />
              Manager Demand & Operations Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Authenticated as <strong>{session?.user?.name || "Rameshwar Prasad"}</strong> ({session?.user?.email})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchDashboardData(true)}
              disabled={loading || refreshing}
              className="border-zinc-700 bg-zinc-850 hover:bg-zinc-800 text-zinc-200 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${refreshing ? "animate-spin text-emerald-400" : ""}`} />
              {refreshing ? "Syncing..." : "Sync Live Data"}
            </Button>
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 py-1 px-3 text-xs hidden sm:inline-flex">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
              Live Feedback Engine
            </Badge>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-red-500/50 bg-red-950/20 p-4 text-red-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchDashboardData()}
              className="border-red-500/30 text-red-300 text-xs"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && !stats && (
          <div className="space-y-6 animate-pulse">
            <div className="h-44 rounded-2xl bg-zinc-900/60 border border-zinc-800" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-zinc-900/60 border border-zinc-800" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 rounded-xl bg-zinc-900/60 border border-zinc-800" />
              <div className="h-80 rounded-xl bg-zinc-900/60 border border-zinc-800" />
            </div>
          </div>
        )}

        {/* Loaded Content */}
        {stats && (
          <div className="space-y-8">
            {/* 1. Headcount & Supporting KPIs Card */}
            <HeadcountCards summary={stats.summary} />

            {/* 2. Charts Row: Dish Rating Bar Chart & 7-Day Trend Line Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DishRatingBarChart data={stats.dishRatings} />
              <RatingTrendLineChart data={stats.ratingTrends} />
            </div>

            {/* 3. Operational Insights: Donut Chart of Categories & Top Rejected Dishes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ComplaintDonutChart data={stats.complaintCategories} />
              <TopRejectedDishes dishes={stats.rejectedDishes} />
            </div>

            {/* 4. Anonymous Live Complaint Feed (Filterable & Highlighted) */}
            <ComplaintFeed complaints={stats.complaints} />
          </div>
        )}
      </div>
    </div>
  );
}
