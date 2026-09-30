"use client";

import React from "react";
import Link from "next/link";
import { Utensils, Flame, Sparkles, User, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
            <Utensils className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
              MessMeter <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-mono">(Mass Master)</span>
            </span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Voice-First Mess Intelligence
            </span>
          </div>
        </Link>

        {/* Navigation items & streak info */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-3 py-1 text-xs font-medium text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
            <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            <span>Streak: <strong>5 Days Waste-Free</strong></span>
          </div>

          <Badge variant="outline" className="hidden md:inline-flex items-center gap-1.5 py-1">
            <Sparkles className="h-3 w-3 text-emerald-500" />
            <span>Wispr Flow Voice AI</span>
          </Badge>

          <div className="flex items-center gap-2 border-l border-zinc-200 pl-3 dark:border-zinc-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <User className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium hidden sm:inline text-zinc-600 dark:text-zinc-400">
              Hostel Block B
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
