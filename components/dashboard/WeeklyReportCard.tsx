"use client";

import React, { useState, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  TrendingDown,
  RefreshCw,
  Scale,
  Flame,
  Star,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIWeeklyReport } from "@/lib/validations/weeklyReport";

export function WeeklyReportCard() {
  const [report, setReport] = useState<AIWeeklyReport | null>(null);
  const [reportDate, setReportDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing latest report
  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/reports/weekly");
      if (res.ok) {
        const data = await res.json();
        if (data.report) {
          setReport(data.report);
          setReportDate(data.createdAt);
        }
      }
    } catch (err: any) {
      console.error("Failed to load weekly report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  // Generate new report via POST
  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      setError(null);
      const res = await fetch("/api/reports/weekly", {
        method: "POST",
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to generate AI weekly report");
      }
      const data = await res.json();
      if (data.report) {
        setReport(data.report);
        setReportDate(data.createdAt);
      }
    } catch (err: any) {
      console.error("Error generating report:", err);
      setError(err?.message || "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 via-zinc-900 to-zinc-950 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-xs">
                <Bot className="h-3.5 w-3.5 mr-1 text-indigo-400" />
                AI Operations Intelligence
              </Badge>
              {reportDate && (
                <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
                  <Calendar className="h-3 w-3" />
                  Generated {new Date(reportDate).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
            <CardTitle className="text-xl sm:text-2xl font-black text-white">
              {report?.title || "Weekly Mess Operations & AI Quality Briefing"}
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400 max-w-2xl">
              Synthesized from student ratings, advance meal skips, waste-free streaks, and anonymous complaints with zero personal identifiers.
            </CardDescription>
          </div>

          <Button
            onClick={handleGenerateReport}
            disabled={generating}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shrink-0 shadow-lg shadow-indigo-600/20"
          >
            <Sparkles className={`h-3.5 w-3.5 mr-1.5 ${generating ? "animate-spin text-white" : ""}`} />
            {generating ? "Analyzing & Generating..." : "Generate AI Weekly Report"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-950/20 p-3 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {loading && !report ? (
          <div className="py-12 text-center text-xs text-zinc-400 space-y-2">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-indigo-500 border-r-transparent" />
            <p>Loading weekly operational summary...</p>
          </div>
        ) : report ? (
          <>
            {/* Executive Summary Paragraph */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 sm:p-5 text-sm text-zinc-200 leading-relaxed">
              <span className="font-bold text-indigo-400 block mb-1 uppercase tracking-wider text-xs">
                Executive Synthesis
              </span>
              {report.summary}
            </div>

            {/* Impact Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/60 p-3 text-center">
                <div className="text-[10px] uppercase text-zinc-400 font-semibold">Satisfaction</div>
                <div className="text-xl font-bold text-yellow-400 flex items-center justify-center gap-1 mt-0.5">
                  <Star className="h-3.5 w-3.5 fill-yellow-400" /> {report.metrics.averageRating}★
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{report.metrics.totalRatings} ratings</div>
              </div>

              <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/60 p-3 text-center">
                <div className="text-[10px] uppercase text-zinc-400 font-semibold">Food Saved</div>
                <div className="text-xl font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                  <Scale className="h-3.5 w-3.5" /> ~{report.metrics.foodSavedKg} kg
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{report.metrics.totalSkips} skips logged</div>
              </div>

              <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/60 p-3 text-center">
                <div className="text-[10px] uppercase text-zinc-400 font-semibold">Waste Cut</div>
                <div className="text-xl font-bold text-teal-400 flex items-center justify-center gap-1 mt-0.5">
                  <TrendingDown className="h-3.5 w-3.5" /> -{report.metrics.wasteReductionPercent}%
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">plate scrap reduction</div>
              </div>

              <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/60 p-3 text-center">
                <div className="text-[10px] uppercase text-zinc-400 font-semibold">Active Streaks</div>
                <div className="text-xl font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                  <Flame className="h-3.5 w-3.5" /> {report.metrics.activeStreaksCount}
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">clean plate streak</div>
              </div>

              <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/60 p-3 text-center">
                <div className="text-[10px] uppercase text-zinc-400 font-semibold">Total Reports</div>
                <div className="text-xl font-bold text-purple-400 mt-0.5">
                  {report.metrics.totalComplaints}
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">anonymous submissions</div>
              </div>

              <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/60 p-3 text-center">
                <div className="text-[10px] uppercase text-zinc-400 font-semibold">Critical Issues</div>
                <div className={`text-xl font-bold mt-0.5 ${report.metrics.criticalComplaints > 0 ? "text-red-400" : "text-emerald-400"}`}>
                  {report.metrics.criticalComplaints}
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">requiring urgent fix</div>
              </div>
            </div>

            {/* Two Column Layout: 3 Key Insights & 3 Recommended Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* 3 Key Insights */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                  3 Operational Key Insights
                </h4>
                <ul className="space-y-2.5">
                  {report.insights.map((insight, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-zinc-300 leading-relaxed flex items-start gap-2 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60"
                    >
                      <span className="font-mono font-bold text-amber-400 shrink-0 mt-0.5">
                        #{idx + 1}
                      </span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3 Recommended Actions */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  3 Recommended Kitchen Directives
                </h4>
                <ul className="space-y-2.5">
                  {report.recommendedActions.map((action, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-zinc-300 leading-relaxed flex items-start gap-2 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60"
                    >
                      <span className="font-mono font-bold text-emerald-400 shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-xs text-zinc-500">
            No weekly report generated yet. Click &ldquo;Generate AI Weekly Report&rdquo; above to run the analysis.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
