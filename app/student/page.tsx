"use client";

import React, { useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
  Mic,
  MicOff,
  Flame,
  Calendar,
  AlertCircle,
  Star,
  Sparkles,
  ShieldAlert,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function StudentView() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const unauthorizedAlert = searchParams.get("unauthorized");

  const [skippedDinner, setSkippedDinner] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({
    "Paneer Sabji (Paneer Butter Masala)": 5,
    "Dal Fry / Yellow Dal": 4,
    "Jeera Rice": 4,
    "Desi Ghee Phulka Roti": 3,
    "Moong Dal Khichdi": 4,
    "Hot Gulab Jamun": 5,
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
          dish: "Paneer Sabji / Phulka Roti",
        });
        setIsRecording(false);
      }, 2200);
    }
  };

  const handleRate = (dish: string, stars: number) => {
    setRatings((prev) => ({ ...prev, [dish]: stars }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Role access alert if student tried accessing dashboard */}
      {unauthorizedAlert && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <ShieldAlert className="h-5 w-5 shrink-0 text-red-600" />
          <div>
            <strong>Access Restricted:</strong> You are logged in as a <strong>Student</strong>.
            The Manager Dashboard is only accessible to mess managers and administrators.
          </div>
        </div>
      )}

      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-6 dark:border-emerald-900/50 dark:from-emerald-950/30 dark:via-zinc-900 dark:to-zinc-950">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs uppercase">
              Student Portal
            </Badge>
            <span className="text-xs text-zinc-500">Hostel Block B</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Welcome, {session?.user?.name || "Aarav Sharma"}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            &ldquo;Speak up about your food. Cook what students eat. Waste less.&rdquo;
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-amber-300/80 bg-white/90 p-3.5 shadow-sm dark:border-amber-900/50 dark:bg-zinc-900">
          <Flame className="h-7 w-7 text-amber-500 fill-amber-500 animate-pulse" />
          <div>
            <div className="text-lg font-extrabold text-amber-600 dark:text-amber-400">5 Days</div>
            <div className="text-[11px] text-zinc-500 font-medium">Waste-Free Streak</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Menu & Skip Toggle */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Today's Dinner Menu</Badge>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> 8:00 PM – 10:00 PM
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-xl">Rai University Hostel Mess</CardTitle>
                  <CardDescription>
                    Rate dishes in 1-tap or mark skip early so the kitchen cooks the right quantity.
                  </CardDescription>
                </div>

                <div className="flex flex-col items-end">
                  <Button
                    variant={skippedDinner ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => setSkippedDinner(!skippedDinner)}
                    className="transition-all"
                  >
                    {skippedDinner ? "Skipping Dinner Logged" : "Skip Dinner Tonight"}
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
                    Skip recorded! Kitchen target reduced by 1 portion. +1 Waste-Free streak point added.
                  </span>
                </div>
              )}

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {[
                  { name: "Paneer Sabji (Paneer Butter Masala)", cat: "Special Sabji" },
                  { name: "Dal Fry / Yellow Dal", cat: "Dal" },
                  { name: "Jeera Rice", cat: "Rice" },
                  { name: "Desi Ghee Phulka Roti", cat: "Breads" },
                  { name: "Moong Dal Khichdi", cat: "Comfort Food" },
                  { name: "Hot Gulab Jamun", cat: "Dessert" },
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
              <span>Ratings recorded anonymously</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                Live Menu Active
              </span>
            </CardFooter>
          </Card>

          {/* Voice Feedback */}
          <Card className="border-emerald-200/80 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 dark:border-emerald-900/50 dark:from-emerald-950/10 dark:to-teal-950/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Mic className="h-5 w-5 text-emerald-600" />
                    Anonymous Voice Feedback & Complaint Box
                  </CardTitle>
                  <CardDescription>
                    Tap the mic to speak in Hindi, Gujarati, English, or Hinglish. Identity is strictly anonymous.
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
                  Try speaking: &ldquo;aaj ka paneer bahut oily tha, aur roti kacchi thi&rdquo;
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

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4 text-emerald-600" />
                Thali Scan
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
      <StudentView />
    </Suspense>
  );
}
