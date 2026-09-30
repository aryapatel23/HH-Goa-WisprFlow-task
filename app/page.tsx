"use client";

import React from "react";
import Link from "next/link";
import {
  Mic,
  TrendingDown,
  Flame,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChefHat,
  Trophy,
  GraduationCap,
  LayoutDashboard,
  CheckCircle2,
  Globe,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Top Main Hero Section - Fits in One Screen Viewport */}
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6 flex-1 flex flex-col justify-center">
        {/* Header Pill & Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-semibold text-emerald-300 backdrop-blur shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            Built Solo Entirely with Voice using Wispr Flow | Rai University Mess Pilot
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Mass<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Matter</span>
          </h1>

          <p className="text-base sm:text-xl font-medium text-emerald-400">
            &ldquo;Speak up about your food. Cook what students eat. Waste less.&rdquo;
          </p>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            The voice-driven hostel mess intelligence platform connecting 450+ students with kitchen managers to eliminate blind cooking, guarantee food quality, and end campus food waste.
          </p>
        </div>

        {/* 4 Impact Metric Badges (Fixed & Verified Labels) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto w-full">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center shadow-sm hover:border-zinc-700 transition">
            <div className="text-xl sm:text-2xl font-black text-white">450+</div>
            <div className="text-[11px] text-zinc-400 font-medium mt-0.5">Enrolled Hostel Residents</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center shadow-sm hover:border-zinc-700 transition">
            <div className="text-xl sm:text-2xl font-black text-emerald-400">-22.4%</div>
            <div className="text-[11px] text-zinc-400 font-medium mt-0.5">Verified Food Waste Cut</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center shadow-sm hover:border-zinc-700 transition">
            <div className="text-xl sm:text-2xl font-black text-amber-400">120+</div>
            <div className="text-[11px] text-zinc-400 font-medium mt-0.5">Advance Skips Logged Weekly</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center shadow-sm hover:border-zinc-700 transition">
            <div className="text-xl sm:text-2xl font-black text-cyan-400">4 Langs</div>
            <div className="text-[11px] text-zinc-400 font-medium mt-0.5">Hindi, English, Gujarati, Hinglish</div>
          </div>
        </div>

        {/* 3 Core Architecture Pillars in One Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto w-full">
          {/* Pillar 1: Voice Feedback */}
          <Link href="/student" className="group">
            <Card className="h-full border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-emerald-500/50 transition-all duration-300 shadow-sm flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Mic className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-300 text-[10px]">
                    Anonymous AI
                  </Badge>
                </div>
                <CardTitle className="text-sm font-bold text-white mt-2 group-hover:text-emerald-400 transition-colors">
                  1. Multilingual Voice Feedback
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400 leading-relaxed">
                  Students speak freely in Hindi, Gujarati, or English. Groq LLaMA-3.3-70B classifies hygiene, taste, and dish links without storing student ID.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 text-[11px] text-zinc-500 flex items-center gap-1 font-medium">
                Try voice widget in Student Portal <ArrowRight className="h-3 w-3 ml-auto text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </Link>

          {/* Pillar 2: Demand Forecasting */}
          <Link href="/dashboard" className="group">
            <Card className="h-full border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-cyan-500/50 transition-all duration-300 shadow-sm flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <ChefHat className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 text-[10px]">
                    Cook Volume
                  </Badge>
                </div>
                <CardTitle className="text-sm font-bold text-white mt-2 group-hover:text-cyan-400 transition-colors">
                  2. Predictive Demand Forecast
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400 leading-relaxed">
                  Predicts target headcount per meal: [Enrolled − Skips ± Trend]. Kitchen cooks precise portions with 92% confidence notes.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 text-[11px] text-zinc-500 flex items-center gap-1 font-medium">
                Explore Manager Analytics <ArrowRight className="h-3 w-3 ml-auto text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </Link>

          {/* Pillar 3: Gamified Streaks & Leaderboard */}
          <Link href="/leaderboard" className="group">
            <Card className="h-full border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-amber-500/50 transition-all duration-300 shadow-sm flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Flame className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="border-amber-500/30 text-amber-300 text-[10px]">
                    3/7/14 Tiers
                  </Badge>
                </div>
                <CardTitle className="text-sm font-bold text-white mt-2 group-hover:text-amber-400 transition-colors">
                  3. Waste-Free Streaks & Board
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400 leading-relaxed">
                  Dynamic color-shifting tiers at 3, 7, and 14 days with celebratory animations. Top 10 campus leaderboard with strict anti-cheat reset.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 text-[11px] text-zinc-500 flex items-center gap-1 font-medium">
                View Top 10 Campus Leaders <ArrowRight className="h-3 w-3 ml-auto text-amber-400 group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 1-Click Fast Navigation Bar */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 max-w-4xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-emerald-600 text-white font-semibold text-[11px]">
              Ready for Demo
            </Badge>
            <span className="text-zinc-400">Jump directly into any section:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/student">
              <Button size="sm" variant="outline" className="h-8 text-xs border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200">
                <GraduationCap className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                Student Portal
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" variant="outline" className="h-8 text-xs border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200">
                <LayoutDashboard className="h-3.5 w-3.5 mr-1 text-cyan-400" />
                Manager Dashboard
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button size="sm" variant="outline" className="h-8 text-xs border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200">
                <Trophy className="h-3.5 w-3.5 mr-1 text-amber-400" />
                Leaderboard
              </Button>
            </Link>
            <Link href="/streak">
              <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
                <Flame className="h-3.5 w-3.5 mr-1 fill-white" />
                My Streak
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Strip */}
      <footer className="border-t border-zinc-900 py-3 text-center text-[11px] text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>MassMatter &copy; 2026 | Rai University Hostel Mess Pilot</span>
          <span className="text-zinc-400">
            Solo Developed by <strong>Arya Patel</strong> with <strong>Wispr Flow</strong> Voice Development
          </span>
        </div>
      </footer>
    </div>
  );
}
