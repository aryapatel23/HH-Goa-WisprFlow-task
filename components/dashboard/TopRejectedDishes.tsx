"use client";

import React from "react";
import { AlertTriangle, ThumbsDown, ArrowDownRight, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RejectedDish } from "@/lib/validations/dashboard";

interface TopRejectedDishesProps {
  dishes: RejectedDish[];
}

export function TopRejectedDishes({ dishes }: TopRejectedDishesProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/70 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <ThumbsDown className="h-4 w-4 text-amber-400" />
              Top Rejected Dishes (Lowest Average Rating)
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Ranked by lowest student satisfaction score (minimum 3 ratings threshold)
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-xs">
            Needs Recipe Review
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {dishes.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            No dishes meet the low-rating threshold. High menu satisfaction!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 pr-4">Rank</th>
                  <th className="pb-3 pr-4">Dish Name</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4 text-center">Avg Rating</th>
                  <th className="pb-3 pr-4 text-center">Sample Size</th>
                  <th className="pb-3 pr-4 text-center">Rejection Risk</th>
                  <th className="pb-3 text-right">Kitchen Directive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {dishes.map((dish, idx) => {
                  const isSevere = dish.avgRating < 3.2;
                  return (
                    <tr key={dish.id} className="hover:bg-zinc-800/30 transition">
                      <td className="py-3 pr-4 font-mono font-bold text-zinc-500">
                        #{idx + 1}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="font-semibold text-zinc-200">{dish.name}</span>
                      </td>
                      <td className="py-3 pr-4 text-zinc-400">
                        {dish.category || "General"}
                      </td>
                      <td className="py-3 pr-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                            isSevere
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {dish.avgRating} ★
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-center font-mono text-zinc-400">
                        {dish.ratingCount} ratings
                      </td>
                      <td className="py-3 pr-4 text-center">
                        <span className="text-zinc-300 font-medium">
                          {dish.rejectionRate}%
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Badge
                          variant={isSevere ? "destructive" : "warning"}
                          className="text-[10px] font-medium"
                        >
                          {isSevere ? "Urgent Recipe Fix" : "Monitor Preparation"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
