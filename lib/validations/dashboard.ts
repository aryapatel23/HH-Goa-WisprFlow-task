import { z } from "zod";

export const HeadcountSummarySchema = z.object({
  totalStudents: z.number(),
  mealSkipsNextWeek: z.number(),
  totalSkips: z.number(),
  expectedHeadcount: z.number(),
  averageRatingToday: z.number(),
  totalComplaintsThisWeek: z.number(),
  openCriticalComplaints: z.number(),
});

export const DishRatingSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().nullable().optional(),
  avgRating: z.number(),
  ratingCount: z.number(),
});

export const RatingTrendPointSchema = z.object({
  date: z.string(),
  day: z.string(),
  avgRating: z.number(),
  count: z.number(),
});

export const ComplaintCategoryStatSchema = z.object({
  category: z.string(),
  count: z.number(),
  percentage: z.number(),
  color: z.string(),
});

export const RejectedDishSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().nullable().optional(),
  avgRating: z.number(),
  ratingCount: z.number(),
  rejectionRate: z.number(),
});

export const ComplaintItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  language: z.string(),
  category: z.string(),
  sentiment: z.string(),
  urgency: z.string(),
  linkDetail: z.string().nullable().optional(),
  dishName: z.string().nullable().optional(),
  dishId: z.string().nullable().optional(),
  resolved: z.boolean(),
  createdAt: z.string(),
});

export const DashboardStatsSchema = z.object({
  summary: HeadcountSummarySchema,
  dishRatings: z.array(DishRatingSchema),
  ratingTrends: z.array(RatingTrendPointSchema),
  complaintCategories: z.array(ComplaintCategoryStatSchema),
  rejectedDishes: z.array(RejectedDishSchema),
  complaints: z.array(ComplaintItemSchema),
});

export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
export type HeadcountSummary = z.infer<typeof HeadcountSummarySchema>;
export type DishRating = z.infer<typeof DishRatingSchema>;
export type RatingTrendPoint = z.infer<typeof RatingTrendPointSchema>;
export type ComplaintCategoryStat = z.infer<typeof ComplaintCategoryStatSchema>;
export type RejectedDish = z.infer<typeof RejectedDishSchema>;
export type ComplaintItem = z.infer<typeof ComplaintItemSchema>;
