import { z } from "zod";

export const AIWeeklyReportSchema = z.object({
  title: z.string().default("Weekly Mess Operations & AI Quality Briefing"),
  summary: z.string(),
  insights: z.array(z.string()).min(1).max(5),
  recommendedActions: z.array(z.string()).min(1).max(5),
  metrics: z.object({
    totalRatings: z.number(),
    averageRating: z.number(),
    totalSkips: z.number(),
    foodSavedKg: z.number(),
    wasteReductionPercent: z.number(),
    activeStreaksCount: z.number(),
    totalComplaints: z.number(),
    criticalComplaints: z.number(),
  }),
});

export type AIWeeklyReport = z.infer<typeof AIWeeklyReportSchema>;

export const WeeklyReportResponseSchema = z.object({
  id: z.string(),
  weekStart: z.string(),
  createdAt: z.string(),
  report: AIWeeklyReportSchema,
});

export type WeeklyReportResponse = z.infer<typeof WeeklyReportResponseSchema>;
