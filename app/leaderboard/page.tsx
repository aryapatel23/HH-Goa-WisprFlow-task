"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Flame,
  Medal,
  Crown,
  Sparkles,
  Shield,
  ArrowRight,
  TrendingUp,
  Scale,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LeaderboardStudent {
  rank: number;
  firstName: string;
  hostelBlock: string;
  currentStreak: number;
  longestStreak: number;
  foodSavedKg: number;
  tier: "bronze" | "emerald" | "sapphire" | "legend";
}

interface BlockStat {
  totalStreaks: number;
  studentCount: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardStudent[]>([]);
  const [blockStats, setBlockStats] = useState<Record<string, BlockStat>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
        setBlockStats(data.blockStats || {});
      }
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getTierBadge = (tier: string, streak: number) => {
    switch (tier) {
      case "legend":
        return (
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[11px] font-bold">
            👑 Legend (14+ Days)
          </Badge>
        );
      case "sapphire":
        return (
          <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[11px] font-semibold">
            💎 Sapphire (7+ Days)
          </Badge>
        );
      case "emerald":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[11px] font-semibold">
            🌿 Emerald (3+ Days)
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-[11px]">
            🌱 Sprout ({streak}d)
          </Badge>
        );
    }
  };

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];
  const rest = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 via-zinc-900 to-zinc-950 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs px-2.5 py-0.5">
                  <Trophy className="h-3.5 w-3.5 mr-1" />
                  Rai University Hostel
                </Badge>
                <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">
                  Zero-Waste Honor Roll
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2.5">
                Student Waste-Free Leaderboard
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                Honoring the top 10 hostel residents with the longest clean-plate and advance-skip streaks. Only first names and hostel blocks are displayed for privacy.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchLeaderboard(true)}
                disabled={loading || refreshing}
                className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs"
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${refreshing ? "animate-spin text-amber-400" : ""}`} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Link href="/streak">
                <Button className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20">
                  <Flame className="h-3.5 w-3.5 mr-1.5 fill-zinc-950" />
                  My Streak
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center space-y-3">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-500 border-r-transparent" />
            <p className="text-xs text-zinc-400">Loading student leaderboard rankings...</p>
          </div>
        )}

        {!loading && leaderboard.length > 0 && (
          <>
            {/* Top 3 Podium (Mobile-first Responsive) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* 2nd Place */}
              {top2 && (
                <div className="order-2 md:order-1 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col items-center text-center space-y-3 relative hover:border-zinc-700 transition">
                  <div className="h-12 w-12 rounded-full bg-slate-400/20 border-2 border-slate-300 flex items-center justify-center text-slate-200 font-black text-xl shadow-lg">
                    🥈
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">2nd Place</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">{top2.firstName}</h3>
                    <span className="text-xs text-zinc-400">{top2.hostelBlock}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-2xl font-black text-cyan-400">
                    <Flame className="h-5 w-5 fill-cyan-400" />
                    {top2.currentStreak} <span className="text-xs text-zinc-400 font-normal">Days</span>
                  </div>
                  {getTierBadge(top2.tier, top2.currentStreak)}
                  <p className="text-[11px] text-zinc-500">~{top2.foodSavedKg} kg food waste prevented</p>
                </div>
              )}

              {/* 1st Place Champion */}
              {top1 && (
                <div className="order-1 md:order-2 rounded-2xl border-2 border-amber-400/80 bg-gradient-to-b from-amber-950/40 via-zinc-900 to-zinc-950 p-7 flex flex-col items-center text-center space-y-3 relative shadow-2xl shadow-amber-500/10 md:-translate-y-2">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-zinc-950 flex items-center justify-center font-black text-3xl shadow-xl shadow-amber-400/20 animate-bounce">
                    👑
                  </div>
                  <div>
                    <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/50 text-[10px] uppercase font-bold tracking-wider">
                      Mess Champion
                    </Badge>
                    <h3 className="text-2xl font-black text-white mt-1">{top1.firstName}</h3>
                    <span className="text-xs text-amber-300/80 font-medium">{top1.hostelBlock}</span>
                  </div>
                  <div className="flex items-center gap-2 text-4xl font-black text-amber-400">
                    <Flame className="h-7 w-7 fill-amber-400" />
                    {top1.currentStreak} <span className="text-sm text-zinc-300 font-normal">Days</span>
                  </div>
                  {getTierBadge(top1.tier, top1.currentStreak)}
                  <p className="text-xs text-amber-200/70 font-mono">
                    ~{top1.foodSavedKg} kg edible food saved!
                  </p>
                </div>
              )}

              {/* 3rd Place */}
              {top3 && (
                <div className="order-3 md:order-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col items-center text-center space-y-3 relative hover:border-zinc-700 transition">
                  <div className="h-12 w-12 rounded-full bg-amber-800/20 border-2 border-amber-600 flex items-center justify-center text-amber-400 font-black text-xl shadow-lg">
                    🥉
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">3rd Place</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">{top3.firstName}</h3>
                    <span className="text-xs text-zinc-400">{top3.hostelBlock}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-2xl font-black text-emerald-400">
                    <Flame className="h-5 w-5 fill-emerald-400" />
                    {top3.currentStreak} <span className="text-xs text-zinc-400 font-normal">Days</span>
                  </div>
                  {getTierBadge(top3.tier, top3.currentStreak)}
                  <p className="text-[11px] text-zinc-500">~{top3.foodSavedKg} kg food waste prevented</p>
                </div>
              )}
            </div>

            {/* Ranks 4 to 10 Table */}
            <Card className="border-zinc-800 bg-zinc-900/70 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Medal className="h-4 w-4 text-amber-400" />
                  Top 10 Zero-Waste Leaderboard Rankings
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Updated in real-time as students log skips before cutoff and clear plates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold text-[11px]">
                        <th className="pb-3 pr-4">Rank</th>
                        <th className="pb-3 pr-4">First Name</th>
                        <th className="pb-3 pr-4">Hostel Block</th>
                        <th className="pb-3 pr-4 text-center">Current Streak</th>
                        <th className="pb-3 pr-4 text-center">Longest Record</th>
                        <th className="pb-3 pr-4 text-center">Food Saved</th>
                        <th className="pb-3 text-right">Badge Tier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {leaderboard.map((student) => {
                        const isTop3 = student.rank <= 3;
                        return (
                          <tr
                            key={student.rank}
                            className={`hover:bg-zinc-800/30 transition ${
                              isTop3 ? "bg-zinc-900/30 font-semibold" : ""
                            }`}
                          >
                            <td className="py-3.5 pr-4 font-mono font-bold">
                              {student.rank === 1 && "🥇 #1"}
                              {student.rank === 2 && "🥈 #2"}
                              {student.rank === 3 && "🥉 #3"}
                              {student.rank > 3 && `#${student.rank}`}
                            </td>
                            <td className="py-3.5 pr-4 text-white font-medium text-sm">
                              {student.firstName}
                            </td>
                            <td className="py-3.5 pr-4 text-zinc-300">
                              <span className="bg-zinc-800/70 border border-zinc-700/60 px-2 py-0.5 rounded text-[11px]">
                                {student.hostelBlock}
                              </span>
                            </td>
                            <td className="py-3.5 pr-4 text-center">
                              <span className="inline-flex items-center gap-1 font-bold text-amber-400 text-sm">
                                <Flame className="h-3.5 w-3.5 fill-amber-400" />
                                {student.currentStreak}d
                              </span>
                            </td>
                            <td className="py-3.5 pr-4 text-center text-zinc-400 font-mono">
                              {student.longestStreak} days
                            </td>
                            <td className="py-3.5 pr-4 text-center text-emerald-400 font-medium">
                              ~{student.foodSavedKg} kg
                            </td>
                            <td className="py-3.5 text-right">
                              {getTierBadge(student.tier, student.currentStreak)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Hostel Block Championship Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(blockStats).map(([blockName, stat]) => (
                <div
                  key={blockName}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center space-y-1"
                >
                  <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                    {blockName}
                  </span>
                  <div className="text-xl font-bold text-white flex items-center justify-center gap-1">
                    <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
                    {stat.totalStreaks} Total Days
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    {stat.studentCount} leader{stat.studentCount > 1 ? "s" : ""} in top 10
                  </p>
                </div>
              ))}
            </div>

            {/* Call to action to build streak */}
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-zinc-900 to-teal-950/30 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  Want to see your name on the Leaderboard?
                </h4>
                <p className="text-xs text-zinc-300">
                  Mark your meal skips before cutoff time and clean your plates to climb the ranks and earn emerald, sapphire, and master tiers!
                </p>
              </div>
              <Link href="/streak" className="shrink-0">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 shadow-lg shadow-emerald-600/20">
                  Grow Your Streak <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
