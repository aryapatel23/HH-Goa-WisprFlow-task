"use client";

import React, { useState, useMemo } from "react";
import {
  MessageSquareWarning,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Filter,
  Utensils,
  MapPin,
  Globe,
  Smile,
  Meh,
  Frown,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComplaintItem } from "@/lib/validations/dashboard";

interface ComplaintFeedProps {
  complaints: ComplaintItem[];
}

const CATEGORIES = ["ALL", "HYGIENE", "TASTE", "QUANTITY", "SERVICE", "OTHER"] as const;
const URGENCIES = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;

export function ComplaintFeed({ complaints }: ComplaintFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("ALL");

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchCat =
        selectedCategory === "ALL" || c.category.toUpperCase() === selectedCategory;
      const matchUrg =
        selectedUrgency === "ALL" || c.urgency.toUpperCase() === selectedUrgency;
      return matchCat && matchUrg;
    });
  }, [complaints, selectedCategory, selectedUrgency]);

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency.toUpperCase()) {
      case "CRITICAL":
        return (
          <Badge className="bg-red-500/20 text-red-400 border border-red-500/50 flex items-center gap-1 font-bold animate-pulse">
            <AlertOctagon className="h-3 w-3" />
            CRITICAL
          </Badge>
        );
      case "HIGH":
        return (
          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 font-semibold">
            <AlertTriangle className="h-3 w-3" />
            HIGH
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
            <Info className="h-3 w-3" />
            MEDIUM
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-zinc-400">
            LOW
          </Badge>
        );
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment.toUpperCase()) {
      case "POSITIVE":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded">
            <Smile className="h-3 w-3" /> Positive
          </span>
        );
      case "NEUTRAL":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
            <Meh className="h-3 w-3" /> Neutral
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 bg-rose-950/40 border border-rose-800/50 px-2 py-0.5 rounded">
            <Frown className="h-3 w-3" /> Negative
          </span>
        );
    }
  };

  return (
    <Card className="border-zinc-800 bg-zinc-900/70 shadow-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquareWarning className="h-4 w-4 text-rose-400" />
              Live Anonymous Complaints & Feedback Feed
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Multilingual student voices (Hindi, Hinglish, English) classified with priority ranking
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-zinc-700 text-zinc-300 text-xs w-fit">
            Showing {filteredComplaints.length} of {complaints.length} reports
          </Badge>
        </div>

        {/* Filter Controls Bar */}
        <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-zinc-800/80">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-zinc-400 flex items-center gap-1 mr-1 text-[11px] uppercase tracking-wider font-semibold">
              <Filter className="h-3 w-3" /> Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Urgency Filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mr-1">
              Urgency:
            </span>
            {URGENCIES.map((urg) => (
              <button
                key={urg}
                type="button"
                onClick={() => setSelectedUrgency(urg)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  selectedUrgency === urg
                    ? "bg-zinc-100 text-zinc-950 font-bold shadow-sm"
                    : "bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
              >
                {urg}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredComplaints.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-500">
            No complaints found matching the selected filters.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredComplaints.map((c) => {
              const isCritical = c.urgency.toUpperCase() === "CRITICAL";
              return (
                <div
                  key={c.id}
                  className={`rounded-xl p-4 transition border ${
                    isCritical
                      ? "border-red-500/60 bg-red-950/20 shadow-md shadow-red-950/30"
                      : "border-zinc-800/80 bg-zinc-950/40 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      {/* Meta badges row */}
                      <div className="flex flex-wrap items-center gap-2">
                        {getUrgencyBadge(c.urgency)}
                        <Badge variant="outline" className="text-xs font-medium border-zinc-700 text-zinc-300">
                          {c.category}
                        </Badge>
                        {getSentimentBadge(c.sentiment)}
                        <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                          <Globe className="h-3 w-3 text-zinc-400" />
                          <span className="uppercase">{c.language}</span>
                        </span>
                      </div>

                      {/* Complaint Text */}
                      <p className="text-sm text-zinc-100 font-medium leading-relaxed">
                        &ldquo;{c.text}&rdquo;
                      </p>

                      {/* Link to Dish / Context Detail */}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-zinc-400">
                        {c.dishName && (
                          <span className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md">
                            <Utensils className="h-3 w-3 text-emerald-400" />
                            Linked Dish: <strong className="text-white">{c.dishName}</strong>
                          </span>
                        )}
                        {c.linkDetail && (
                          <span className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md">
                            <MapPin className="h-3 w-3 text-amber-400" />
                            Location: {c.linkDetail}
                          </span>
                        )}
                        <span className="text-[11px] text-zinc-500">
                          {new Date(c.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Action Status */}
                    <div className="shrink-0 flex sm:flex-col items-end gap-2">
                      {isCritical ? (
                        <span className="text-[11px] font-bold text-red-400 bg-red-950/60 border border-red-800/80 px-2 py-1 rounded-md inline-flex items-center gap-1">
                          <AlertOctagon className="h-3.5 w-3.5" /> High Attention
                        </span>
                      ) : (
                        <span className="text-[11px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-md">
                          Reviewed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
