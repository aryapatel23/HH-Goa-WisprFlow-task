"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  Sparkles,
  Trophy,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  ArrowRight,
  RefreshCw,
  Scale,
  Award,
  AlertTriangle,
  PartyPopper,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TierInfo {
  tier: "bronze" | "emerald" | "sapphire" | "legend";
  name: string;
  color: string;
  bgClass: string;
  borderClass: string;
  flameColor: string;
  accentText: string;
  nextTierDays: number;
  nextTierName: string;
}

export default function StreakPage() {
  const [currentStreak, setCurrentStreak] = useState(5);
  const [longestStreak, setLongestStreak] = useState(12);
  const [alreadyClaimedToday, setAlreadyClaimedToday] = useState(false);
  const [tierInfo, setTierInfo] = useState<TierInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error" | "reset"; message: string } | null>(null);

  const fetchStreak = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/streak");
      if (res.ok) {
        const data = await res.json();
        setCurrentStreak(data.currentStreak);
        setLongestStreak(data.longestStreak);
        setAlreadyClaimedToday(data.alreadyClaimedToday);
        setTierInfo(data.tierInfo);
      }
    } catch (err) {
      console.error("Failed to load streak:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreak();
  }, []);

  const handleClaimCleanPlate = async () => {
    try {
      setClaiming(true);
      setNotification(null);

      const res = await fetch("/api/streak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clean_plate" }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.streakReset) {
          setCurrentStreak(0);
          setNotification({
            type: "reset",
            message: data.error || "Streak reset to 0 due to skip attendance violation.",
          });
        } else {
          setNotification({
            type: "error",
            message: data.error || "Streak can only increase once per day.",
          });
        }
        return;
      }

      if (data.celebrate) {
        setCurrentStreak(data.currentStreak);
        setLongestStreak(data.longestStreak);
        setAlreadyClaimedToday(true);
        if (data.tierInfo) setTierInfo(data.tierInfo);

        // Trigger celebratory animation
        setCelebrating(true);
        setNotification({
          type: "success",
          message: data.message || "+1 Day added to your streak!",
        });

        // Turn off celebration after 4 seconds
        setTimeout(() => setCelebrating(false), 4500);
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err?.message || "Failed to update streak",
      });
    } finally {
      setClaiming(false);
    }
  };

  // Determine dynamic colors based on 3, 7, and 14 days
  const getDynamicStyles = () => {
    if (currentStreak >= 14) {
      return {
        themeName: "Legendary Gold Tier",
        cardBg: "from-amber-950/40 via-purple-950/30 to-zinc-950",
        borderColor: "border-amber-400 shadow-amber-500/20",
        flameColor: "#f59e0b",
        glowColor: "bg-amber-400/20",
        textColor: "text-amber-400",
        badgeBg: "bg-amber-400/20 text-amber-300 border-amber-400/50",
        auraRing: "ring-4 ring-amber-400/30",
        tierLabel: "👑 Tier 3: Zero-Waste Master (14+ Days)",
      };
    }
    if (currentStreak >= 7) {
      return {
        themeName: "Sapphire Blue Tier",
        cardBg: "from-cyan-950/40 via-blue-950/30 to-zinc-950",
        borderColor: "border-cyan-400/80 shadow-cyan-500/20",
        flameColor: "#06b6d4",
        glowColor: "bg-cyan-400/20",
        textColor: "text-cyan-400",
        badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
        auraRing: "ring-2 ring-cyan-400/30",
        tierLabel: "💎 Tier 2: Sapphire Champion (7-13 Days)",
      };
    }
    if (currentStreak >= 3) {
      return {
        themeName: "Emerald Green Tier",
        cardBg: "from-emerald-950/40 via-teal-950/30 to-zinc-950",
        borderColor: "border-emerald-400/80 shadow-emerald-500/20",
        flameColor: "#10b981",
        glowColor: "bg-emerald-400/20",
        textColor: "text-emerald-400",
        badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        auraRing: "ring-2 ring-emerald-400/30",
        tierLabel: "🌿 Tier 1: Emerald Eco-Warrior (3-6 Days)",
      };
    }
    return {
      themeName: "Bronze Starter Tier",
      cardBg: "from-zinc-900 via-zinc-900/90 to-zinc-950",
      borderColor: "border-zinc-700 shadow-zinc-800/20",
      flameColor: "#f97316",
      glowColor: "bg-orange-500/10",
      textColor: "text-orange-400",
      badgeBg: "bg-orange-500/20 text-orange-300 border-orange-500/40",
      auraRing: "ring-1 ring-zinc-700",
      tierLabel: "🌱 Tier 0: Starter Sprout (0-2 Days)",
    };
  };

  const styles = getDynamicStyles();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20 relative overflow-hidden">
      {/* Celebration Confetti & Sparkles Overlay */}
      {celebrating && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs animate-fade-in" />
          <div className="relative z-10 bg-zinc-900 border-2 border-amber-400 rounded-3xl p-8 max-w-sm mx-4 text-center shadow-2xl animate-scale-up space-y-4">
            <div className="text-6xl animate-bounce">🎉</div>
            <h2 className="text-2xl font-black text-white">Streak Grouped & Increased!</h2>
            <div className="text-4xl font-black text-amber-400 flex items-center justify-center gap-2">
              <Flame className="h-8 w-8 fill-amber-400 animate-pulse" />
              {currentStreak} Days
            </div>
            <p className="text-xs text-zinc-300">
              Outstanding commitment to zero food waste! +1 portion saved today.
            </p>
            <div className="text-[11px] text-amber-300 font-mono bg-amber-950/40 border border-amber-900/50 rounded-lg p-2">
              ✨ Daily limit active: 1 streak bump per calendar day.
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <Link href="/student" className="hover:text-white transition flex items-center gap-1">
            ← Back to Student Portal
          </Link>
          <Link href="/leaderboard" className="hover:text-amber-400 transition flex items-center gap-1">
            <Trophy className="h-3.5 w-3.5" /> View Campus Leaderboard →
          </Link>
        </div>

        {/* Dynamic Color Hero Card */}
        <div
          className={`relative overflow-hidden rounded-3xl border-2 ${styles.borderColor} bg-gradient-to-br ${styles.cardBg} p-6 sm:p-10 shadow-2xl transition-all duration-700 ${styles.auraRing}`}
        >
          <div className={`absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full ${styles.glowColor} blur-3xl pointer-events-none`} />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`${styles.badgeBg} text-xs font-bold px-3 py-1 shadow-sm`}>
                  <Flame className="h-3.5 w-3.5 mr-1 fill-current" />
                  {styles.tierLabel}
                </Badge>
                <span className="text-xs text-zinc-400 font-medium">Changes at 3, 7 & 14 days</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Waste-Free Streak
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-lg leading-relaxed">
                Log meal skips before cutoffs or clear your dining plates with zero edible waste to level up your streak.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-300">
                <span className="bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-xl font-mono">
                  Personal Best: <strong className="text-white">{longestStreak} Days</strong>
                </span>
                <span className="bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-xl text-emerald-400 font-mono">
                  Food Saved: ~<strong>{(currentStreak * 0.45).toFixed(1)} kg</strong>
                </span>
              </div>
            </div>

            {/* Giant Dynamic Flame Display */}
            <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-zinc-950/70 border border-zinc-800/80 text-center shrink-0 min-w-[200px]">
              <div
                className={`relative flex items-center justify-center h-28 w-28 rounded-full mb-3 shadow-inner ${
                  celebrating ? "scale-115 transition-transform duration-300" : ""
                }`}
                style={{
                  background: `radial-gradient(circle, ${styles.flameColor}25 0%, transparent 70%)`,
                }}
              >
                <Flame
                  className="h-20 w-20 animate-pulse transition-colors duration-700"
                  style={{ color: styles.flameColor, fill: styles.flameColor }}
                />
              </div>

              <div className={`text-5xl sm:text-6xl font-black ${styles.textColor}`}>
                {currentStreak}
              </div>
              <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mt-1">
                Zero-Waste Days
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Alert Banners */}
        {notification && (
          <div
            className={`rounded-2xl border p-4 text-xs flex items-center justify-between gap-3 ${
              notification.type === "success"
                ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-300"
                : notification.type === "reset"
                ? "border-red-500/60 bg-red-950/30 text-red-300 font-semibold"
                : "border-amber-500/40 bg-amber-950/20 text-amber-300"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {notification.type === "success" && <PartyPopper className="h-5 w-5 text-emerald-400 shrink-0" />}
              {notification.type === "reset" && <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 animate-bounce" />}
              {notification.type === "error" && <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0" />}
              <span>{notification.message}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotification(null)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Claim / Action Row */}
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Claim Today&apos;s Zero-Waste Check-In
              </CardTitle>
              <span className="text-[11px] text-zinc-400 font-mono">
                1 increment allowed per calendar day
              </span>
            </div>
            <CardDescription className="text-xs text-zinc-400">
              Verify your clean plate at the mess disposal counter to bump your streak for today.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-zinc-200">
                  {alreadyClaimedToday
                    ? "✓ You have already incremented your streak today."
                    : "Ready to claim today's clean plate streak!"}
                </p>
                <p className="text-zinc-500">
                  {alreadyClaimedToday
                    ? "Next streak bump opens tomorrow after your next meal."
                    : "Confirm your empty plate was returned to the wash station."}
                </p>
              </div>

              <Button
                onClick={handleClaimCleanPlate}
                disabled={claiming || alreadyClaimedToday}
                className={`font-bold text-xs px-5 py-2 shrink-0 ${
                  alreadyClaimedToday
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20"
                }`}
              >
                <Sparkles className={`h-3.5 w-3.5 mr-1.5 ${claiming ? "animate-spin" : ""}`} />
                {alreadyClaimedToday ? "Claimed for Today" : claiming ? "Verifying..." : "Claim Clean Plate (+1 Day)"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Milestone Progression Tracker (3, 7, 14 Days) */}
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" />
              Streak Color Milestone Progression
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              The card theme and flame shift color at 3, 7, and 14 days of zero food waste
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Bronze Tier */}
              <div
                className={`rounded-xl border p-4 text-center space-y-2 transition ${
                  currentStreak < 3
                    ? "border-orange-500/80 bg-orange-950/20 ring-2 ring-orange-500/20"
                    : "border-zinc-800 bg-zinc-950/40 opacity-70"
                }`}
              >
                <div className="text-2xl">🌱</div>
                <div className="font-bold text-sm text-orange-400">Bronze Starter</div>
                <div className="text-xs text-zinc-400 font-mono">0 - 2 Days</div>
                <Badge variant="outline" className="text-[10px] border-zinc-700">
                  {currentStreak >= 3 ? "✓ Completed" : "Current Tier"}
                </Badge>
              </div>

              {/* Emerald Tier */}
              <div
                className={`rounded-xl border p-4 text-center space-y-2 transition ${
                  currentStreak >= 3 && currentStreak < 7
                    ? "border-emerald-400/80 bg-emerald-950/20 ring-2 ring-emerald-400/20"
                    : currentStreak >= 7
                    ? "border-zinc-800 bg-zinc-950/40 opacity-70"
                    : "border-zinc-800 bg-zinc-950/20"
                }`}
              >
                <div className="text-2xl">🌿</div>
                <div className="font-bold text-sm text-emerald-400">Emerald Eco-Warrior</div>
                <div className="text-xs text-zinc-400 font-mono">3 - 6 Days</div>
                <Badge
                  variant={currentStreak >= 3 ? "default" : "outline"}
                  className={`text-[10px] ${currentStreak >= 3 ? "bg-emerald-600 text-white" : "border-zinc-700 text-zinc-500"}`}
                >
                  {currentStreak >= 7 ? "✓ Completed" : currentStreak >= 3 ? "Current Tier" : "Unlocks at 3d"}
                </Badge>
              </div>

              {/* Sapphire Tier */}
              <div
                className={`rounded-xl border p-4 text-center space-y-2 transition ${
                  currentStreak >= 7 && currentStreak < 14
                    ? "border-cyan-400/80 bg-cyan-950/20 ring-2 ring-cyan-400/20"
                    : currentStreak >= 14
                    ? "border-zinc-800 bg-zinc-950/40 opacity-70"
                    : "border-zinc-800 bg-zinc-950/20"
                }`}
              >
                <div className="text-2xl">💎</div>
                <div className="font-bold text-sm text-cyan-400">Sapphire Champion</div>
                <div className="text-xs text-zinc-400 font-mono">7 - 13 Days</div>
                <Badge
                  variant={currentStreak >= 7 ? "default" : "outline"}
                  className={`text-[10px] ${currentStreak >= 7 ? "bg-cyan-600 text-white" : "border-zinc-700 text-zinc-500"}`}
                >
                  {currentStreak >= 14 ? "✓ Completed" : currentStreak >= 7 ? "Current Tier" : "Unlocks at 7d"}
                </Badge>
              </div>

              {/* Legend Master Tier */}
              <div
                className={`rounded-xl border p-4 text-center space-y-2 transition ${
                  currentStreak >= 14
                    ? "border-amber-400/80 bg-amber-950/30 ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/10"
                    : "border-zinc-800 bg-zinc-950/20"
                }`}
              >
                <div className="text-2xl">👑</div>
                <div className="font-bold text-sm text-amber-400">Zero-Waste Master</div>
                <div className="text-xs text-zinc-400 font-mono">14+ Days</div>
                <Badge
                  variant={currentStreak >= 14 ? "default" : "outline"}
                  className={`text-[10px] ${currentStreak >= 14 ? "bg-amber-500 text-zinc-950 font-bold" : "border-zinc-700 text-zinc-500"}`}
                >
                  {currentStreak >= 14 ? "👑 Master Active" : "Unlocks at 14d"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strict Anti-Cheating & Reset Policy Card */}
        <div className="rounded-2xl border border-red-500/30 bg-red-950/15 p-5 space-y-2 text-xs text-red-200">
          <div className="flex items-center gap-2 font-bold text-red-400 text-sm">
            <ShieldAlert className="h-4 w-4" />
            Zero-Waste Anti-Cheating & Reset Guarantee
          </div>
          <p className="leading-relaxed text-zinc-300">
            <strong>Rule 1:</strong> Streaks are strictly limited to increase <strong>once per calendar day</strong>.
          </p>
          <p className="leading-relaxed text-zinc-300">
            <strong>Rule 2 (Streak Reset Penalty):</strong> If you log an advance meal skip to save food, but then show up to eat or rate the meal, the system flags the attendance violation and <strong>immediately resets your streak to 0</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
