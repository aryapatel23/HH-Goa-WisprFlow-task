"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { RatingTrendPoint } from "@/lib/validations/dashboard";
import { TrendingUp } from "lucide-react";

interface RatingTrendLineChartProps {
  data: RatingTrendPoint[];
}

export function RatingTrendLineChart({ data }: RatingTrendLineChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card className="border-zinc-800 bg-zinc-900/70 shadow-sm flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              Rating Trend (Last 7 Days)
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Daily average hostel meal satisfaction score
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {mounted && data.length > 0 ? (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 15, left: -20, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={11}
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as RatingTrendPoint;
                      return (
                        <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-3 shadow-xl text-xs space-y-1">
                          <p className="font-bold text-white">
                            {item.day} ({item.date})
                          </p>
                          <p className="text-cyan-400 font-semibold">
                            Avg Score: {item.avgRating.toFixed(2)} ★
                          </p>
                          <p className="text-zinc-500">
                            {item.count} student ratings logged
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avgRating"
                  stroke="#06b6d4" // cyan-500
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#06b6d4", stroke: "#0e7490", strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: "#38bdf8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center text-xs text-zinc-500">
            Loading trend chart...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
