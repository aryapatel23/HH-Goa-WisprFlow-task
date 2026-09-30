"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  TrendingDown,
  Users,
  CheckCircle2,
  Sparkles,
  Bot,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Briefcase,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const userRole = (session?.user as any)?.role as string | undefined;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard");
    } else if (status === "authenticated" && userRole === "student") {
      router.push("/student?unauthorized=true");
    }
  }, [status, userRole, router]);

  if (status === "loading" || userRole === "student") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center space-y-2">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent align-[-0.125em]" />
          <p className="text-xs text-zinc-500">Checking permissions & loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Badge
              variant={userRole === "admin" ? "destructive" : "warning"}
              className="capitalize text-xs font-semibold"
            >
              {userRole === "admin" ? <ShieldCheck className="mr-1 h-3 w-3 inline" /> : <Briefcase className="mr-1 h-3 w-3 inline" />}
              {userRole || "manager"} Access
            </Badge>
            <span className="text-xs text-zinc-500">Rai University Hostel Mess</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Manager Demand & AI Dashboard
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Logged in as <strong>{session?.user?.name || "Rameshwar Prasad"}</strong> ({session?.user?.email})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 py-1.5 px-3">
            <Sparkles className="h-3.5 w-3.5 mr-1 text-emerald-600" />
            AI Demand Forecast Active
          </Badge>
        </div>
      </div>

      {/* Top Cards: Forecasting */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Hostel Enrolled</CardDescription>
            <CardTitle className="text-2xl font-bold">450 Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-zinc-500">Registered hostel mess residents</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Dinner Skips Confirmed</CardDescription>
            <CardTitle className="text-2xl font-bold text-red-600">-68 Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-zinc-500">Logged before 6:00 PM cutoff</div>
          </CardContent>
        </Card>

        <Card className="border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              AI Target Cook Headcount
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              382 Portions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              Saves ~20kg rice & sabji tonight
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Waste Reduction</CardDescription>
            <CardTitle className="text-2xl font-bold text-indigo-600">-22.4%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-zinc-500">Zero-waste streak effect</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Weekly Executive Briefing */}
      <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50/40 via-white to-emerald-50/40 dark:border-indigo-900/50 dark:from-indigo-950/20 dark:via-zinc-900 dark:to-emerald-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-lg">Claude AI Executive Weekly Summary</CardTitle>
            </div>
            <Badge variant="default" className="bg-indigo-600">Generated This Week</Badge>
          </div>
          <CardDescription>
            Synthesized from 625 student ratings, 120 advance meal skips, and multilingual voice complaints.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <h4 className="font-semibold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500" /> 3 Key Insights
              </h4>
              <ul className="mt-2 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 list-disc list-inside">
                <li><strong>Phulka Roti</strong> has 42% complaint rate on Wednesdays due to undercooking during rush hours.</li>
                <li><strong>Paneer Sabji</strong> maintains highest rating (4.7★); student dinner attendance peaks on Paneer nights.</li>
                <li>Friday dinner consistently has 34% skip rate; cut rice procurement by 15kg to prevent spoilage.</li>
              </ul>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <h4 className="font-semibold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 3 Recommended Actions
              </h4>
              <ul className="mt-2 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 list-disc list-inside">
                <li>Deploy second tandoor cook on Wednesday dinner between 8:15 PM and 9:00 PM.</li>
                <li>Reduce Friday base rice cook volume by 20% to eliminate leftover surplus.</li>
                <li>Standardize oil quantity in paneer gravy preparations with head chef.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dish-Wise Ratings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dish-Wise Performance & Waste Analysis</CardTitle>
          <CardDescription>Aggregated feedback per menu item across the current schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-xs font-semibold text-zinc-500 dark:border-zinc-800">
                  <th className="pb-3">Dish Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Avg Stars</th>
                  <th className="pb-3">Total Ratings</th>
                  <th className="pb-3">Rejection Rate</th>
                  <th className="pb-3">Directive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                <tr>
                  <td className="py-3 font-semibold">Paneer Sabji (Butter Masala)</td>
                  <td className="py-3 text-zinc-500">Special Sabji</td>
                  <td className="py-3 font-bold text-emerald-600">4.7 ★</td>
                  <td className="py-3">389</td>
                  <td className="py-3 text-emerald-600 font-medium">4% (Low Waste)</td>
                  <td className="py-3"><Badge variant="default">Retain in Menu</Badge></td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">Dal Tadka with Jeera Hing</td>
                  <td className="py-3 text-zinc-500">Dal</td>
                  <td className="py-3 font-bold text-emerald-600">4.4 ★</td>
                  <td className="py-3">345</td>
                  <td className="py-3 text-emerald-600 font-medium">8% (Good)</td>
                  <td className="py-3"><Badge variant="default">Standard Recipe</Badge></td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">Desi Ghee Phulka Roti</td>
                  <td className="py-3 text-zinc-500">Breads</td>
                  <td className="py-3 font-bold text-amber-500">3.1 ★</td>
                  <td className="py-3">340</td>
                  <td className="py-3 text-amber-600 font-medium">28% (Medium Waste)</td>
                  <td className="py-3"><Badge variant="warning">Inspect Tandoor</Badge></td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">Poha with Roasted Peanuts</td>
                  <td className="py-3 text-zinc-500">Breakfast</td>
                  <td className="py-3 font-bold text-amber-500">3.4 ★</td>
                  <td className="py-3">280</td>
                  <td className="py-3 text-amber-600 font-medium">22% (Watch)</td>
                  <td className="py-3"><Badge variant="outline">Adjust Moisture</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Multilingual Voice Complaints Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                Live Multilingual Complaint Box (Anonymous)
              </CardTitle>
              <CardDescription>
                AI-classified voice and text feedback from students in Hindi, Hinglish, and English
              </CardDescription>
            </div>
            <Badge variant="outline">10 Recent Reports</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                text: "aaj ka paneer bahut oily tha, aur roti kacchi thi",
                lang: "Hinglish",
                cat: "TASTE",
                urgency: "MEDIUM",
                link: "Mess Counter 1 - Dinner Service",
                sentiment: "NEGATIVE",
              },
              {
                text: "dal me bilkul namak nahi hai aur thandi serve ki gayi hai",
                lang: "Hindi",
                cat: "TASTE",
                urgency: "LOW",
                link: "Lunch Dal Dispenser",
                sentiment: "NEGATIVE",
              },
              {
                text: "dinner ke time rice aur dal tadka 9:15 baje hi khatam ho gaya tha",
                lang: "Hindi",
                cat: "QUANTITY",
                urgency: "HIGH",
                link: "Late Dinner Shift",
                sentiment: "NEGATIVE",
              },
              {
                text: "water dispenser ke paas paani phaila hua hai aur bohot gandi smell aa rahi hai",
                lang: "Hindi",
                cat: "HYGIENE",
                urgency: "CRITICAL",
                link: "Water Cooler Area, Block B Side",
                sentiment: "NEGATIVE",
              },
              {
                text: "The plates in the rack were greasy and had residue on them. Please ensure hotter wash water.",
                lang: "English",
                cat: "HYGIENE",
                urgency: "HIGH",
                link: "Main Plate Collection Rack",
                sentiment: "NEGATIVE",
              },
            ].map((c, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-zinc-100 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/40 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    &ldquo;{c.text}&rdquo;
                  </div>
                  <div className="text-zinc-500 flex items-center gap-2">
                    <span>Language: <strong>{c.lang}</strong></span>
                    <span>•</span>
                    <span>Location: <strong>{c.link}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={c.urgency === "CRITICAL" ? "destructive" : c.urgency === "HIGH" ? "warning" : "secondary"}>
                    {c.cat} ({c.urgency})
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
