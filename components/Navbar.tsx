"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Utensils,
  Flame,
  Sparkles,
  User,
  LogOut,
  LogIn,
  LayoutDashboard,
  GraduationCap,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const userRole = (session?.user as any)?.role as "student" | "manager" | "admin" | undefined;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
            <Utensils className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
              MassMatter
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Hostel Mess & Waste Reduction
            </span>
          </div>
        </Link>

        {/* Portal Links based on role */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/student"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              pathname === "/student"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Student Portal</span>
          </Link>

          <Link
            href="/leaderboard"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              pathname === "/leaderboard"
                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Trophy className="h-4 w-4 text-amber-500" />
            <span>Leaderboard</span>
          </Link>

          <Link
            href="/streak"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              pathname === "/streak"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
            <span>Streak</span>
          </Link>

          {(userRole === "manager" || userRole === "admin" || !session) && (
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                pathname === "/dashboard"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Manager Dashboard</span>
            </Link>
          )}
        </div>

        {/* Right side status & auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/streak"
            className="hidden sm:flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-3 py-1 text-xs font-medium text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300 hover:opacity-90 transition"
          >
            <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            <span>Waste-Free Streak</span>
          </Link>

          {status === "authenticated" && session?.user ? (
            <div className="flex items-center gap-2.5">
              {/* Role Badge */}
              <Badge
                variant={
                  userRole === "admin"
                    ? "destructive"
                    : userRole === "manager"
                    ? "warning"
                    : "default"
                }
                className="capitalize text-xs font-semibold"
              >
                {userRole === "admin" && <ShieldCheck className="mr-1 h-3 w-3 inline" />}
                {userRole || "student"}
              </Badge>

              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 max-w-[130px] truncate">
                  {session.user.name || session.user.email}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {session.user.email}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: "/login" })}
                title="Sign Out"
                className="h-8 w-8 text-zinc-500 hover:text-red-600 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" className="gap-1.5 text-xs font-semibold">
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
