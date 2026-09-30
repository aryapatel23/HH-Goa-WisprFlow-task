"use client";

import React from "react";
import { Users, CalendarX2, Star, MessageSquareWarning, AlertOctagon, TrendingUp, ChefHat, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeadcountSummary } from "@/lib/validations/dashboard";

interface HeadcountCardsProps {
  summary: HeadcountSummary;
}

export function HeadcountCards({ summary }: HeadcountCardsProps) {
  return (
    <div className="space-y-4">
      {/* Featured Primary Headcount Forecast Card */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 via-zinc-900 to-zinc-950 p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-2.5 py-0.5 font-semibold text-xs">
                <ChefHat className="h-3.5 w-3.5 mr-1" />
                Kitchen Demand Forecast
              </Badge>
              <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">
                Next Week / Major Meal
              </Badge>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Expected Headcount
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl">
              Calculated live based on registered hostel students minus advance meal skips logged before cutoff.
            </p>

            {/* Formula calculation badge */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-300 bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 w-fit">
              <span className="text-zinc-400">Total Students</span>
              <span className="font-bold text-white">({summary.totalStudents})</span>
              <span className="text-emerald-400">−</span>
              <span className="text-zinc-400">Avg Skips/Meal</span>
              <span className="font-bold text-amber-400">({Math.round(summary.totalSkips / 14)})</span>
              <span className="text-emerald-400">=</span>
              <span className="font-bold text-emerald-400">{summary.expectedHeadcount} Portions</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-zinc-900/90 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-inner">
            <div className="text-center sm:text-right">
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                {summary.expectedHeadcount}
              </div>
              <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mt-1">
                Portions To Prepare
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                Target cook volume
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Supporting KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Students */}
        <Card className="border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium text-zinc-400">Total Students</CardDescription>
              <Users className="h-4 w-4 text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              {summary.totalStudents}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-500">Registered hostel residents</p>
          </CardContent>
        </Card>

        {/* Meal Skips */}
        <Card className="border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium text-zinc-400">Meal Skips Logged</CardDescription>
              <CalendarX2 className="h-4 w-4 text-amber-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-amber-400">
              {summary.totalSkips}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-500">{summary.mealSkipsNextWeek} upcoming this cycle</p>
          </CardContent>
        </Card>

        {/* Average Rating Today */}
        <Card className="border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium text-zinc-400">Average Rating</CardDescription>
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-yellow-400 flex items-center gap-1">
              {summary.averageRatingToday} <span className="text-base text-zinc-400 font-normal">/ 5.0</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-500">Satisfaction baseline</p>
          </CardContent>
        </Card>

        {/* Total Complaints This Week */}
        <Card className="border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium text-zinc-400">Total Complaints</CardDescription>
              <MessageSquareWarning className="h-4 w-4 text-purple-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-purple-400">
              {summary.totalComplaintsThisWeek}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-500">Received over past 7 days</p>
          </CardContent>
        </Card>

        {/* Open Critical Complaints */}
        <Card className={`border-zinc-800 bg-zinc-900/60 transition ${summary.openCriticalComplaints > 0 ? "border-red-500/50 bg-red-950/20" : ""}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium text-zinc-400">Critical Issues</CardDescription>
              <AlertOctagon className={`h-4 w-4 ${summary.openCriticalComplaints > 0 ? "text-red-500 animate-pulse" : "text-emerald-400"}`} />
            </div>
            <CardTitle className={`text-2xl font-bold ${summary.openCriticalComplaints > 0 ? "text-red-400" : "text-emerald-400"}`}>
              {summary.openCriticalComplaints}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-zinc-500">
              {summary.openCriticalComplaints > 0 ? "Requires urgent attention" : "All critical issues resolved"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
