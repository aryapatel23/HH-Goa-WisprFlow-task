"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DishRating } from "@/lib/validations/dashboard";
import { Utensils } from "lucide-react";

interface DishRatingBarChartProps {
  data: DishRating[];
}

function getBarColor(rating: number) {
  if (rating >= 4.2) return "#10b981"; // emerald-500
  if (rating >= 3.5) return "#38bdf8"; // sky-400
  if (rating >= 3.0) return "#f59e0b"; // amber-500
  return "#ef4444"; // red-500
}

export function DishRatingBarChart({ data }: DishRatingBarChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format dish name for x-axis if long
  const chartData = data.map((d) => ({
    ...d,
    shortName: d.name.length > 14 ? d.name.substring(0, 12) + "…" : d.name,
  }));

  return (
    <Card className="border-zinc-800 bg-zinc-900/70 shadow-sm flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Utensils className="h-4 w-4 text-emerald-400" />
              Average Rating per Dish
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Aggregated student ratings across menu items (1.0 to 5.0 stars)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {mounted && chartData.length > 0 ? (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 45 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="shortName"
                  stroke="#71717a"
                  fontSize={11}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={11}
                  domain={[0, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as DishRating & { shortName: string };
                      return (
                        <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-3 shadow-xl text-xs space-y-1">
                          <p className="font-bold text-white">{item.name}</p>
                          {item.category && (
                            <p className="text-zinc-400">Category: {item.category}</p>
                          )}
                          <p className="text-emerald-400 font-semibold">
                            Rating: {item.avgRating} ★
                          </p>
                          <p className="text-zinc-500">
                            Based on {item.ratingCount} ratings
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="avgRating" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.avgRating)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center text-xs text-zinc-500">
            Loading dish ratings chart...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
