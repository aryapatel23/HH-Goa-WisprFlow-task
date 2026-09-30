"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
  Flame,
  Calendar,
  Clock,
  AlertCircle,
  Star,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  Smile,
  ThumbsUp,
  Meh,
  ThumbsDown,
  Flame as FlameIcon,
  Utensils,
  Coffee,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Dish {
  id: string;
  name: string;
  category: string | null;
  mealId: string;
}

interface Meal {
  id: string;
  date: string;
  slot: "breakfast" | "lunch" | "snacks" | "dinner";
  startTime: string;
  endTime: string;
  cutoffTime: string;
  isCutoffPassed: boolean;
  dishes: Dish[];
}

const REACTIONS = [
  { emoji: "😋", label: "Delicious", key: "delicious" },
  { emoji: "👍", label: "Good", key: "good" },
  { emoji: "😐", label: "Average", key: "average" },
  { emoji: "👎", label: "Bad", key: "bad" },
  { emoji: "🔥", label: "Spicy", key: "spicy" },
];

function StudentPortalContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const unauthorizedAlert = searchParams.get("unauthorized");

  // State
  const [meals, setMeals] = useState<Meal[]>([]);
  const [activeMealId, setActiveMealId] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, { star: number; reaction?: string }>>({});
  const [skips, setSkips] = useState<Record<string, boolean>>({});
  const [currentStreak, setCurrentStreak] = useState<number>(5);
  const [loading, setLoading] = useState(true);
  const [savingRating, setSavingRating] = useState<string | null>(null);
  const [skipLoading, setSkipLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Time & countdown state
  const [now, setNow] = useState<Date>(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch today's menu, ratings, and skips
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // 1. Fetch Today's Menu
        const menuRes = await fetch("/api/menu/today");
        const menuData = await menuRes.json();
        if (menuData.meals && menuData.meals.length > 0) {
          setMeals(menuData.meals);
          if (menuData.nextMeal) {
            setActiveMealId(menuData.nextMeal.id);
          } else {
            setActiveMealId(menuData.meals[menuData.meals.length - 1].id);
          }
        }

        // 2. Fetch User Ratings for today
        const ratingsRes = await fetch("/api/ratings");
        const ratingsData = await ratingsRes.json();
        if (ratingsData.ratings) {
          const map: Record<string, { star: number; reaction?: string }> = {};
          ratingsData.ratings.forEach((r: any) => {
            if (r.dishId) {
              map[r.dishId] = { star: r.star, reaction: r.reaction };
            }
          });
          setRatings(map);
        }

        // 3. Fetch User Skips & Streak
        const skipsRes = await fetch("/api/skips");
        const skipsData = await skipsRes.json();
        if (skipsData.skips) {
          const skipMap: Record<string, boolean> = {};
          skipsData.skips.forEach((s: any) => {
            skipMap[s.mealId] = true;
          });
          setSkips(skipMap);
        }
        if (typeof skipsData.streak === "number") {
          setCurrentStreak(skipsData.streak);
        }
      } catch (err) {
        console.error("Failed to load student data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Identify next upcoming meal
  const nextMeal = meals.find((m) => {
    const cutoffDate = new Date(m.cutoffTime);
    return now.getTime() < cutoffDate.getTime();
  }) || meals[meals.length - 1];

  // Calculate live countdown to next meal's cutoff
  const getCountdown = (cutoffIso: string) => {
    const cutoffDate = new Date(cutoffIso);
    const diff = cutoffDate.getTime() - now.getTime();
    if (diff <= 0) return { passed: true, formatted: "Cut-off time has passed" };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n: number) => String(n).padStart(2, "0");
    return {
      passed: false,
      formatted: `${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`,
    };
  };

  const nextMealCountdown = nextMeal ? getCountdown(nextMeal.cutoffTime) : null;
  const isNextMealSkipped = nextMeal ? !!skips[nextMeal.id] : false;

  // Handle Skip This Meal
  const handleToggleSkip = async (meal: Meal) => {
    const countdown = getCountdown(meal.cutoffTime);
    if (countdown.passed) {
      setNotification("Cut-off time has passed for this meal. Changes can no longer be accepted.");
      return;
    }

    setSkipLoading(true);
    try {
      const res = await fetch("/api/skips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealId: meal.id }),
      });
      const data = await res.json();

      if (data.success) {
        setSkips((prev) => ({ ...prev, [meal.id]: data.skipped }));
        if (data.currentStreak) setCurrentStreak(data.currentStreak);
        setNotification(data.message);
        setTimeout(() => setNotification(null), 4000);
      } else {
        setNotification(data.error || "Failed to update meal skip");
      }
    } catch {
      setNotification("Error communicating with server.");
    } finally {
      setSkipLoading(false);
    }
  };

  // Handle 1-Tap 5-Star Rating & Enjoy Reaction
  const handleSaveRating = async (dishId: string, mealId: string, star: number, reaction?: string) => {
    const current = ratings[dishId] || { star: 0 };
    const newRating = {
      star: star > 0 ? star : current.star || 5,
      reaction: reaction !== undefined ? reaction : current.reaction,
    };

    // Optimistic UI update
    setRatings((prev) => ({ ...prev, [dishId]: newRating }));
    setSavingRating(dishId);

    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dishId,
          mealId,
          star: newRating.star,
          reaction: newRating.reaction,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification(data.updated ? "Rating updated for today!" : "Rating saved! Thank you!");
        setTimeout(() => setNotification(null), 2500);
      }
    } catch (err) {
      console.error("Failed to save rating:", err);
    } finally {
      setSavingRating(null);
    }
  };

  const getMealIcon = (slot: string) => {
    switch (slot) {
      case "breakfast":
        return <Sun className="h-5 w-5 text-amber-500" />;
      case "lunch":
        return <Utensils className="h-5 w-5 text-emerald-600" />;
      case "snacks":
        return <Coffee className="h-5 w-5 text-orange-500" />;
      case "dinner":
        return <Moon className="h-5 w-5 text-indigo-500" />;
      default:
        return <Utensils className="h-5 w-5 text-emerald-600" />;
    }
  };

  // Formatted date string
  const todayDateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-lg md:max-w-2xl px-4 py-6 sm:px-6 space-y-5">
      {/* Role Alert */}
      {unauthorizedAlert && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <ShieldAlert className="h-5 w-5 shrink-0 text-red-600" />
          <div>
            <strong>Student View Only:</strong> The Manager Dashboard is restricted to mess managers.
          </div>
        </div>
      )}

      {/* Floating Notification Banner */}
      {notification && (
        <div className="sticky top-20 z-40 flex items-center justify-between rounded-xl bg-zinc-900 px-4 py-3 text-xs font-medium text-white shadow-xl animate-in fade-in slide-in-from-top-2 dark:bg-emerald-700">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-white" />
            {notification}
          </span>
          <button onClick={() => setNotification(null)} className="ml-2 text-zinc-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* TOP HEADER: Today's Date, User & Streak Badge */}
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <span>{todayDateString}</span>
          </div>

          {/* Small Waste-Free Streak Badge using Session */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
            <Flame className="h-4 w-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{currentStreak} Days Waste-Free</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Hi, {session?.user?.name || "Aarav Sharma"} 👋
            </h1>
            <p className="text-xs text-zinc-500">
              Hostel Block B • Rai University Mess
            </p>
          </div>
          <Badge variant="outline" className="text-[11px] font-semibold">
            Student Portal
          </Badge>
        </div>
      </div>

      {/* NEXT MEAL HERO CARD WITH LIVE COUNTDOWN & BIG SKIP BUTTON */}
      {nextMeal && (
        <Card className="border-emerald-300 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 shadow-md dark:border-emerald-900/60 dark:from-emerald-950/30 dark:via-zinc-900 dark:to-teal-950/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getMealIcon(nextMeal.slot)}
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Next Meal • {nextMeal.slot}
                </span>
              </div>
              <span className="text-xs font-medium text-zinc-500">
                {nextMeal.startTime} – {nextMeal.endTime}
              </span>
            </div>

            <CardTitle className="text-xl capitalize">
              Today&apos;s {nextMeal.slot} Menu
            </CardTitle>
            <CardDescription className="text-xs">
              Cut-off for skipping is set by the mess manager to prevent over-cooking.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Live Cutoff Countdown Timer */}
            <div className="rounded-xl border border-emerald-200/80 bg-white/90 p-3.5 text-center shadow-sm dark:border-emerald-900/60 dark:bg-zinc-900/90">
              <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                <Clock className="h-3.5 w-3.5 text-emerald-600" />
                <span>Skip Cut-Off Countdown:</span>
              </div>

              <div className={`mt-1 font-mono text-2xl font-black tracking-wider ${
                nextMealCountdown?.passed ? "text-zinc-400" : "text-emerald-600 dark:text-emerald-400"
              }`}>
                {nextMealCountdown?.formatted}
              </div>

              <div className="mt-1 text-[11px] text-zinc-400">
                {nextMealCountdown?.passed
                  ? "Kitchen preparation started • Skip window closed"
                  : `Deadline: ${new Date(nextMeal.cutoffTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
              </div>
            </div>

            {/* BIG "SKIP THIS MEAL" BUTTON */}
            <div>
              <Button
                type="button"
                onClick={() => handleToggleSkip(nextMeal)}
                disabled={nextMealCountdown?.passed || skipLoading}
                variant={isNextMealSkipped ? "destructive" : "default"}
                className={`w-full h-14 text-sm font-bold shadow-lg transition-all ${
                  isNextMealSkipped
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-[1.01]"
                }`}
              >
                {nextMealCountdown?.passed ? (
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Skip Window Closed (Cutoff Passed)
                  </span>
                ) : isNextMealSkipped ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Skipping {nextMeal.slot} Confirmed • Tap to Cancel
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Utensils className="h-5 w-5" />
                    Skip This Meal (I won&apos;t eat {nextMeal.slot})
                  </span>
                )}
              </Button>
            </div>

            {isNextMealSkipped && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300 text-center font-medium">
                🌱 You notified the kitchen on time! 1 plate saved from wastage. +1 Waste-Free streak point.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TODAY'S FULL MENU CARDS (BREAKFAST, LUNCH, SNACKS, DINNER) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">
            Today&apos;s Full Mess Menu
          </h2>
          <span className="text-xs text-zinc-500">1-Tap 5★ Ratings & Reactions</span>
        </div>

        {loading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <div className="text-center space-y-2">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent" />
              <p className="text-xs text-zinc-500">Loading today&apos;s delicious menu...</p>
            </div>
          </div>
        ) : (
          meals.map((meal) => {
            const isMealSkipped = !!skips[meal.id];
            const countdown = getCountdown(meal.cutoffTime);

            return (
              <Card
                key={meal.id}
                className={`overflow-hidden transition-all border ${
                  activeMealId === meal.id
                    ? "border-emerald-300 dark:border-emerald-800 shadow-sm"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                <CardHeader className="bg-zinc-50/70 p-4 dark:bg-zinc-900/60 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getMealIcon(meal.slot)}
                      <div>
                        <h3 className="text-sm font-bold capitalize text-zinc-900 dark:text-white">
                          {meal.slot}
                        </h3>
                        <span className="text-[11px] text-zinc-500">
                          {meal.startTime} – {meal.endTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isMealSkipped && (
                        <Badge variant="destructive" className="text-[10px] py-0.5">
                          Skipped
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant={isMealSkipped ? "destructive" : "outline"}
                        onClick={() => handleToggleSkip(meal)}
                        disabled={countdown.passed || skipLoading}
                        className="h-8 text-xs px-2.5"
                      >
                        {countdown.passed ? "Cutoff Passed" : isMealSkipped ? "Cancel Skip" : "Skip Slot"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-4">
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                    {meal.dishes.map((dish) => {
                      const userRating = ratings[dish.id] || { star: 0 };

                      return (
                        <div key={dish.id} className="py-3 first:pt-0 last:pb-0 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                                {dish.name}
                              </div>
                              {dish.category && (
                                <span className="text-[11px] text-zinc-400">
                                  {dish.category}
                                </span>
                              )}
                            </div>

                            {/* One-Tap 5-Star Rating Row */}
                            <div className="flex items-center gap-1 shrink-0">
                              {[1, 2, 3, 4, 5].map((starVal) => {
                                const isFilled = userRating.star >= starVal;
                                return (
                                  <button
                                    key={starVal}
                                    type="button"
                                    onClick={() => handleSaveRating(dish.id, meal.id, starVal)}
                                    disabled={savingRating === dish.id}
                                    title={`Rate ${starVal} Star`}
                                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                                  >
                                    <Star
                                      className={`h-5 w-5 ${
                                        isFilled
                                          ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                                          : "text-zinc-300 dark:text-zinc-700 hover:text-amber-300"
                                      }`}
                                    />
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Enjoy Reaction Row */}
                          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1 no-scrollbar">
                            <span className="text-[10px] text-zinc-400 font-medium mr-1 shrink-0">
                              Reaction:
                            </span>
                            {REACTIONS.map((rec) => {
                              const isSelected = userRating.reaction === rec.key;
                              return (
                                <button
                                  key={rec.key}
                                  type="button"
                                  onClick={() => handleSaveRating(dish.id, meal.id, userRating.star || 4, rec.key)}
                                  disabled={savingRating === dish.id}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                                    isSelected
                                      ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 scale-105"
                                      : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                                  }`}
                                >
                                  <span>{rec.emoji}</span>
                                  <span className="text-[11px]">{rec.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* FOOTER NOTE */}
      <div className="pt-2 text-center text-xs text-zinc-400">
        MassMaster • Only 1 rating allowed per dish per day to maintain data integrity.
      </div>
    </div>
  );
}

export default function StudentPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center space-y-2">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent" />
          <p className="text-xs text-zinc-500">Loading Student Portal...</p>
        </div>
      </div>
    }>
      <StudentPortalContent />
    </Suspense>
  );
}
