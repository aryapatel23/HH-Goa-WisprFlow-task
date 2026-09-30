"use client";

import React, { useState } from "react";
import {
  Mic,
  MicOff,
  Flame,
  TrendingDown,
  Users,
  UtensilsCrossed,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ThumbsDown,
  Star,
  ChevronRight,
  ShieldCheck,
  Bot,
  BrainCircuit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"student" | "manager">("student");
  const [skippedDinner, setSkippedDinner] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({
    "Paneer Butter Masala": 4,
    "Dal Tadka": 5,
    "Jeera Rice": 3,
    "Phulka Roti": 4,
  });
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiTag, setAiTag] = useState<{
    category: string;
    sentiment: string;
    urgency: string;
    dish: string;
  } | null>(null);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTranscript("Listening for speech in Hindi, English, Gujarati or Hinglish...");
      setTimeout(() => {
        setTranscript("aaj ka paneer bahut oily tha, aur roti kacchi thi");
        setAiTag({
          category: "TASTE & COOKING QUALITY",
          sentiment: "NEGATIVE",
          urgency: "MEDIUM",
          dish: "Paneer Butter Masala / Phulka Roti",
        });
        setIsRecording(false);
      }, 2500);
    }
  };

  const handleRate = (dish: string, stars: number) => {
    setRatings((prev) => ({ ...prev, [dish]: stars }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-emerald-50/50 via-white to-white py-12 dark:border-zinc-800 dark:from-emerald-950/20 dark:via-zinc-950 dark:to-zinc-950 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/70 px-4 py-1.5 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Built for Rai University Hostel Mess Pilot | Powered by Wispr Flow
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white text-emerald-600 dark:text-emerald-400">
              MassMaster
            </h1>

            <p className="mt-4 text-xl font-medium text-emerald-700 dark:text-emerald-300 sm:text-2xl">
              &ldquo;Speak up about your food. Cook what students eat. Waste less.&rdquo;
            </p>

            <p className="mt-4 max-w-2xl text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
              AI-powered hostel mess feedback, multilingual voice complaint intelligence,
              and predictive demand forecasting to eliminate food waste.
            </p>

            {/* Quick Stat Pill Bar */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6">
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">22%</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Est. Food Waste Reduced</div>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-2xl font-bold text-amber-500">68</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Tonight's Marked Skips</div>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">382</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">AI Target Headcount</div>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">4 Langs</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">EN, HI, GU, Hinglish</div>
              </div>
            </div>

            {/* View Switcher Tabs */}
            <div className="mt-10 inline-flex rounded-lg border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900">
              <button
                onClick={() => setActiveTab("student")}
                className={`rounded-md px-5 py-2 text-sm font-semibold transition-all ${
                  activeTab === "student"
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                Student View (1-Tap & Voice)
              </button>
              <button
                onClick={() => setActiveTab("manager")}
                className={`rounded-md px-5 py-2 text-sm font-semibold transition-all ${
                  activeTab === "manager"
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                Manager Dashboard (Demand & AI)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Demo Area */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {activeTab === "student" ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left 2 Cols: Menu & Skip Toggle */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Today's Dinner</Badge>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> 8:00 PM – 10:00 PM
                        </span>
                      </div>
                      <CardTitle className="mt-2 text-xl">Rai University Hostel Mess Menu</CardTitle>
                      <CardDescription>
                        Rate dishes in 1-tap or speak your feedback to keep your Waste-Free Streak!
                      </CardDescription>
                    </div>

                    {/* Skip Dinner Action */}
                    <div className="flex flex-col items-end">
                      <Button
                        variant={skippedDinner ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => setSkippedDinner(!skippedDinner)}
                        className="transition-all"
                      >
                        {skippedDinner ? "Skipping Dinner Marked" : "Skip Dinner Tonight"}
                      </Button>
                      <span className="text-[11px] text-zinc-400 mt-1">Cut-off: 6:00 PM</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {skippedDinner && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                      <span>
                        You have notified the mess manager you won't attend. 1 meal saved from over-cooking! +1 Streak points earned.
                      </span>
                    </div>
                  )}

                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {[
                      { name: "Paneer Butter Masala", cat: "Main Course", initial: 4 },
                      { name: "Dal Tadka", cat: "Lentils", initial: 5 },
                      { name: "Jeera Rice", cat: "Rice", initial: 3 },
                      { name: "Phulka Roti", cat: "Breads", initial: 4 },
                      { name: "Gulab Jamun", cat: "Dessert", initial: 5 },
                    ].map((dish) => (
                      <div
                        key={dish.name}
                        className="flex flex-wrap items-center justify-between py-3.5 gap-2"
                      >
                        <div>
                          <div className="font-semibold text-sm text-zinc-900 dark:text-white">
                            {dish.name}
                          </div>
                          <div className="text-xs text-zinc-500">{dish.cat}</div>
                        </div>

                        {/* 5-star rater */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRate(dish.name, star)}
                              className="p-1 hover:scale-125 transition-transform"
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  (ratings[dish.name] || 0) >= star
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-zinc-300 dark:text-zinc-700"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 justify-between">
                  <span>Student ID strictly separated from complaints</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    Live Session Active
                  </span>
                </CardFooter>
              </Card>

              {/* Voice Feedback Widget */}
              <Card className="border-emerald-200/80 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 dark:border-emerald-900/50 dark:from-emerald-950/10 dark:to-teal-950/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Mic className="h-5 w-5 text-emerald-600" />
                        Voice Feedback & Complaint Box
                      </CardTitle>
                      <CardDescription>
                        Tap to speak in English, Hindi, Gujarati, or Hinglish. Identity is 100% anonymous.
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-emerald-300 dark:border-emerald-800">
                      Claude AI Pipeline
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-300/80 rounded-xl bg-white/60 dark:border-emerald-900/50 dark:bg-zinc-900/50">
                    <button
                      onClick={toggleRecording}
                      className={`h-16 w-16 rounded-full flex items-center justify-center text-white transition-all shadow-lg ${
                        isRecording
                          ? "bg-red-500 animate-ping shadow-red-500/50"
                          : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 hover:scale-105"
                      }`}
                    >
                      {isRecording ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
                    </button>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      {isRecording ? "Listening now... Speak freely" : "Click to speak voice feedback"}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Example: &ldquo;aaj ka paneer bahut oily tha, aur roti kacchi thi&rdquo;
                    </p>
                  </div>

                  {transcript && (
                    <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                      <div className="text-xs font-medium text-zinc-500">Transcribed Speech:</div>
                      <div className="text-sm font-semibold italic text-zinc-800 dark:text-zinc-200">
                        &ldquo;{transcript}&rdquo;
                      </div>

                      {aiTag && (
                        <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-2 text-xs">
                          <span className="font-semibold text-zinc-600 dark:text-zinc-400">
                            AI Classification:
                          </span>
                          <Badge variant="destructive">{aiTag.category}</Badge>
                          <Badge variant="outline">{aiTag.sentiment}</Badge>
                          <Badge variant="warning">Urgency: {aiTag.urgency}</Badge>
                          <span className="text-zinc-500 self-center">Linked: {aiTag.dish}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right 1 Col: Streaks & Leaderboard */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Flame className="h-5 w-5 text-amber-500 fill-amber-500" />
                    Waste-Free Streak
                  </CardTitle>
                  <CardDescription>
                    Earn badges by skipping meals on time and leaving an empty plate.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-center">
                    <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">5 Days</div>
                    <div className="text-xs text-amber-800 dark:text-amber-300 font-medium mt-1">
                      Current Clean Plate Streak 🔥
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                      <span>Progress to 7-Day Champion</span>
                      <span>5 / 7</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-amber-500 w-[71%]" />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
                      Hostel Block Leaderboard
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 font-medium">
                        <span>🥇 Block B (Floor 2)</span>
                        <span className="text-emerald-700 dark:text-emerald-400">94% Zero-Waste</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                        <span>🥈 Block A (Floor 3)</span>
                        <span className="text-zinc-600 dark:text-zinc-400">89% Zero-Waste</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                        <span>🥉 Block C (Floor 1)</span>
                        <span className="text-zinc-600 dark:text-zinc-400">82% Zero-Waste</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stretch: Thali Scan Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4 text-emerald-600" />
                    Thali Scan (Stretch Feature)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Photograph returned plate; Claude Vision estimates leftover waste per dish.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-dashed border-zinc-300 p-4 text-center dark:border-zinc-700">
                    <div className="text-xs text-zinc-500">Camera / Photo Upload Mock</div>
                    <Button variant="outline" size="sm" className="mt-2 text-xs">
                      Upload Plate Photo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Manager View */
          <div className="space-y-8">
            {/* Top Cards: Forecasting */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Total Hostel Enrolled</CardDescription>
                  <CardTitle className="text-2xl font-bold">450 Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-zinc-500">Registered dinner diners</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Confirmed Skips</CardDescription>
                  <CardTitle className="text-2xl font-bold text-red-600">-68 Meals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-zinc-500">Logged before 6:00 PM cutoff</div>
                </CardContent>
              </Card>

              <Card className="border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    AI Adjusted Target
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    382 Portions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    Prevents 68 plates from bin!
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Weekly Waste Trend</CardDescription>
                  <CardTitle className="text-2xl font-bold text-indigo-600">-22.4%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-zinc-500">Compared to last week</div>
                </CardContent>
              </Card>
            </div>

            {/* AI Weekly Summary & Actionable Recommendations */}
            <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50/40 via-white to-emerald-50/40 dark:border-indigo-900/50 dark:from-indigo-950/20 dark:via-zinc-900 dark:to-emerald-950/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-indigo-600" />
                    <CardTitle className="text-lg">Claude AI Executive Weekly Summary</CardTitle>
                  </div>
                  <Badge variant="default" className="bg-indigo-600">Generated Today</Badge>
                </div>
                <CardDescription>
                  Synthesized from 1,240 meal ratings, 214 skip requests, and 48 multilingual voice complaints.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-500" /> 3 Key Insights
                    </h4>
                    <ul className="mt-2 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 list-disc list-inside">
                      <li><strong>Phulka Roti</strong> has 42% complaint rate on Wednesdays due to undercooking during peak rush.</li>
                      <li><strong>Paneer Butter Masala</strong> is the #1 rated dish (4.7★), attendance surges +18% on paneer days.</li>
                      <li>Friday dinner experiences the highest skip rate (34%), save 15kg rice by adjusting cook volume.</li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 3 Recommended Actions
                    </h4>
                    <ul className="mt-2 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 list-disc list-inside">
                      <li>Adjust tandoor temperature & add second cook on Wednesday dinner for rotis.</li>
                      <li>Reduce base rice procurement on Friday by 20% to prevent spoilage.</li>
                      <li>Review cooking oil quantity with vendor for paneer gravy preparations.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dish Ratings Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dish-Wise Performance (This Week)</CardTitle>
                <CardDescription>Real-time student sentiment per menu item</CardDescription>
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
                        <th className="pb-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                      <tr>
                        <td className="py-3 font-medium">Paneer Butter Masala</td>
                        <td className="py-3 text-zinc-500">Main Course</td>
                        <td className="py-3 font-semibold text-emerald-600">4.7 ★</td>
                        <td className="py-3">389</td>
                        <td className="py-3 text-emerald-600 font-medium">4% (Low)</td>
                        <td className="py-3"><Badge variant="default">Keep Menu</Badge></td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium">Phulka Roti</td>
                        <td className="py-3 text-zinc-500">Bread</td>
                        <td className="py-3 font-semibold text-amber-500">3.1 ★</td>
                        <td className="py-3">340</td>
                        <td className="py-3 text-amber-600 font-medium">28% (Medium)</td>
                        <td className="py-3"><Badge variant="warning">Inspect Cook</Badge></td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium">Karela Masala</td>
                        <td className="py-3 text-zinc-500">Side Dish</td>
                        <td className="py-3 font-semibold text-red-500">1.8 ★</td>
                        <td className="py-3">210</td>
                        <td className="py-3 text-red-600 font-medium">62% (High Waste)</td>
                        <td className="py-3"><Badge variant="destructive">Replace Dish</Badge></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </section>

      {/* Planned Features & Architecture PRD Section */}
      <section className="border-t border-zinc-200 bg-zinc-50/50 py-12 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Planned Features & Architecture
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Built systematically according to the Product Requirements Document (PRD v1.0).
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-emerald-600" />
                  1. Voice-First Pipeline
                </CardTitle>
                <CardDescription className="text-xs">
                  Native Web Speech API + Anthropic Claude SDK for translation, sentiment scoring, and dish linking.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5">
                <div>• English, Hindi, Gujarati, Hinglish parsing</div>
                <div>• Real-time classification into hygiene, taste, quantity</div>
                <div>• 100% strictly anonymous complaint identity</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-teal-600" />
                  2. Demand Forecasting
                </CardTitle>
                <CardDescription className="text-xs">
                  Headcount forecasting model adjusting for meal skip signals and weekday patterns.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5">
                <div>• Enrolled head count - confirmed skips</div>
                <div>• Day-of-week moving averages</div>
                <div>• Real-time kitchen portion recommendations</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Flame className="h-5 w-5 text-amber-500" />
                  3. Clean Plate Streaks
                </CardTitle>
                <CardDescription className="text-xs">
                  Gamifying food conservation for hostel blocks, floors, and individual students.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5">
                <div>• Rewards for on-time skip marking</div>
                <div>• Hostel block clean-plate leaderboards</div>
                <div>• Thali Scan vision leftover verification (stretch)</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800">
        <p>
          MassMaster &copy; 2026. Built with Wispr Flow voice development for Rai University Hostel Mess.
        </p>
      </footer>
    </div>
  );
}
