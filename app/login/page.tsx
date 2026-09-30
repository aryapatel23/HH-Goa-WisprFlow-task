"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Utensils,
  GraduationCap,
  ShieldCheck,
  Briefcase,
  Mail,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email: email.trim(),
      redirect: false,
    });

    if (res?.error) {
      setError("Unable to sign in. Please verify your email.");
      setLoading(false);
    } else {
      // Determine redirection based on email
      if (email.includes("manager") || email.includes("admin")) {
        router.push("/dashboard");
      } else {
        router.push("/student");
      }
      router.refresh();
    }
  };

  const handleDemoLogin = async (demoEmail: string, role: "student" | "manager" | "admin", redirectPath: string) => {
    setDemoLoading(role);
    setError(null);

    const res = await signIn("credentials", {
      email: demoEmail,
      role,
      redirect: false,
    });

    if (res?.error) {
      setError(`Failed to sign in as ${role}`);
      setDemoLoading(null);
    } else {
      router.push(redirectPath);
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/25">
            <Utensils className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Welcome to MassMaster
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to access your hostel mess portal or analytics dashboard
          </p>
        </div>

        {/* Demo Fast Login Section */}
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 shadow-sm dark:border-emerald-900/60 dark:from-emerald-950/20 dark:to-teal-950/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-emerald-900 dark:text-emerald-300">
                <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Quick 1-Click Demo Accounts
              </CardTitle>
              <Badge variant="outline" className="text-[10px] uppercase font-bold border-emerald-300 dark:border-emerald-800">
                Demo Mode
              </Badge>
            </div>
            <CardDescription className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
              Tap any role to immediately test the platform permissions:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {/* Student Demo Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoLogin("student@massmaster.com", "student", "/student")}
              disabled={!!demoLoading || loading}
              className="w-full justify-between bg-white/90 hover:bg-emerald-50 dark:bg-zinc-900 dark:hover:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900 h-11"
            >
              <div className="flex items-center gap-2.5 text-left">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-white">
                    Demo Student <span className="font-normal text-zinc-500">(Aarav)</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">student@massmaster.com</div>
                </div>
              </div>
              <Badge variant="default" className="text-[10px] px-2 py-0">
                {demoLoading === "student" ? "Entering..." : "Student Page →"}
              </Badge>
            </Button>

            {/* Manager Demo Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoLogin("manager@massmaster.com", "manager", "/dashboard")}
              disabled={!!demoLoading || loading}
              className="w-full justify-between bg-white/90 hover:bg-amber-50 dark:bg-zinc-900 dark:hover:bg-amber-950/40 border-amber-200/80 dark:border-amber-900 h-11"
            >
              <div className="flex items-center gap-2.5 text-left">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-white">
                    Demo Mess Manager <span className="font-normal text-zinc-500">(Rameshwar)</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">manager@massmaster.com</div>
                </div>
              </div>
              <Badge variant="warning" className="text-[10px] px-2 py-0">
                {demoLoading === "manager" ? "Entering..." : "Dashboard →"}
              </Badge>
            </Button>

            {/* Admin Demo Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoLogin("admin@massmaster.com", "admin", "/dashboard")}
              disabled={!!demoLoading || loading}
              className="w-full justify-between bg-white/90 hover:bg-red-50 dark:bg-zinc-900 dark:hover:bg-red-950/40 border-red-200/80 dark:border-red-900 h-11"
            >
              <div className="flex items-center gap-2.5 text-left">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-white">
                    Demo Chief Admin <span className="font-normal text-zinc-500">(Prof. Kulkarni)</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">admin@massmaster.com</div>
                </div>
              </div>
              <Badge variant="destructive" className="text-[10px] px-2 py-0">
                {demoLoading === "admin" ? "Entering..." : "Admin View →"}
              </Badge>
            </Button>
          </CardContent>
        </Card>

        {/* Standard Email & Google Sign-In Card */}
        <Card className="shadow-md">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-base">Or Sign in with your Email</CardTitle>
            <CardDescription className="text-xs">
              Use your college domain email or Google workspace account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-2.5 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <Input
                    type="email"
                    placeholder="name@student.raiuniversity.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !!demoLoading}
                className="w-full text-xs font-semibold h-10"
              >
                {loading ? "Signing in..." : "Continue with Email"}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white px-2 text-zinc-400 dark:bg-zinc-950">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => signIn("google", { callbackUrl: "/student" })}
              className="w-full text-xs font-medium h-10 gap-2 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Sign In with Google
            </Button>
          </CardContent>
          <CardFooter className="pt-0 text-center justify-center">
            <span className="text-[11px] text-zinc-400">
              Anonymous complaints remain strictly disconnected from your account.
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
