"use client";

import React from "react";
import { Utensils, Clock, CheckCircle2, AlertCircle, ChefHat, Sparkles, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MealForecast } from "@/lib/validations/dashboard";

interface MealForecastCardsProps {
  forecasts: MealForecast[];
}

export function MealForecastCards({ forecasts }: MealForecastCardsProps) {
  if (!forecasts || forecasts.length === 0) {
    return null;
  }

  const getSlotBadgeColor = (slot: string) => {
    switch (slot.toLowerCase()) {
      case "breakfast":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "lunch":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "snacks":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      default:
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    }
  };

  return (
    <Card className="border-zinc-800 bg-zinc-900/70 shadow-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                <ChefHat className="h-3.5 w-3.5 mr-1" />
                Slot-by-Slot Forecast
              </Badge>
              <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">
                Next Meals Schedule
              </Badge>
            </div>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              Meal-by-Meal Headcount & Cook Volume Forecast
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Attendance projection modeled on past weekend vs weekday baselines, dish appeal, and cutoff logs
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30 hidden sm:inline-flex">
            <Sparkles className="h-3 w-3 mr-1" /> Auto-Calibrated
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forecasts.map((f) => {
            return (
              <div
                key={f.mealId}
                className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-3 hover:border-zinc-700 transition"
              >
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getSlotBadgeColor(
                        f.slot
                      )}`}
                    >
                      {f.slot}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">
                      {f.day}, {f.date}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" />
                    {f.startTime}–{f.endTime}
                  </span>
                </div>

                {/* Main Target Headcount Portions */}
                <div className="flex items-baseline justify-between pt-1 border-t border-zinc-800/60">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                      Target Cook Headcount
                    </div>
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                      {f.predictedHeadcount} Portions
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-zinc-500">Base: </span>
                    <span className="font-semibold text-zinc-300">{f.totalStudents}</span>
                    <span className="text-zinc-500"> | Skips: </span>
                    <span className="font-semibold text-amber-400">-{f.projectedSkips}</span>
                  </div>
                </div>

                {/* Dishes preview */}
                <div className="text-xs text-zinc-300 space-y-1 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/80">
                  <div className="text-[10px] uppercase font-semibold text-zinc-500">
                    Menu Preview:
                  </div>
                  <div className="line-clamp-2 leading-relaxed text-zinc-200">
                    {f.dishes.slice(0, 3).join(", ")}
                    {f.dishes.length > 3 && ` +${f.dishes.length - 3} more`}
                  </div>
                </div>

                {/* Confidence note */}
                <div className="pt-1 flex items-start gap-1.5 text-[11px] text-emerald-400/90 font-medium bg-emerald-950/20 border border-emerald-900/30 rounded-md p-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-400" />
                  <span>{f.confidenceNote}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
