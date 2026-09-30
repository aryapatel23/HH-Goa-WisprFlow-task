"use client";

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ComplaintCategoryStat } from "@/lib/validations/dashboard";
import { PieChart as PieChartIcon } from "lucide-react";

interface ComplaintDonutChartProps {
  data: ComplaintCategoryStat[];
}

export function ComplaintDonutChart({ data }: ComplaintDonutChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalComplaints = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="border-zinc-800 bg-zinc-900/70 shadow-sm flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-purple-400" />
              Complaint Categories
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Distribution of student issues by root cause ({totalComplaints} total)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {mounted && data.length > 0 ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
            <div className="h-56 w-56 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload as ComplaintCategoryStat;
                        return (
                          <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-3 shadow-xl text-xs space-y-1">
                            <p className="font-bold text-white">{item.category}</p>
                            <p className="text-purple-300">
                              Complaints: {item.count} ({item.percentage}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={data}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-white">{totalComplaints}</span>
                <span className="text-[10px] uppercase text-zinc-400 font-semibold tracking-wider">Reports</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="w-full space-y-2">
              {data.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-zinc-950/40 border border-zinc-800/80"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-zinc-200 capitalize">
                      {item.category.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{item.count}</span>
                    <span className="text-zinc-500 text-[11px]">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-56 flex items-center justify-center text-xs text-zinc-500">
            {totalComplaints === 0 ? "No complaints logged yet" : "Loading complaint chart..."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
