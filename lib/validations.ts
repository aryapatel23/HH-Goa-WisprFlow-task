import { z } from "zod";

// Complaint validation schema with AI auto-tagging categories
export const complaintSchema = z.object({
  text: z.string().min(3, "Complaint must be at least 3 characters").max(1000),
  language: z.string().default("en"),
  category: z.enum(["HYGIENE", "TASTE", "QUANTITY", "SERVICE", "OTHER"]).default("OTHER"),
  mealSlot: z.enum(["breakfast", "lunch", "snacks", "dinner"]).optional(),
  dishName: z.string().optional(),
  linkDetail: z.string().optional(),
  sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE"]).default("NEGATIVE"),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
});

export type ComplaintInput = z.infer<typeof complaintSchema>;

// Meal rating schema
export const ratingSchema = z.object({
  mealId: z.string().min(1),
  dishId: z.string().optional(),
  star: z.number().int().min(1).max(5).default(5),
  reaction: z.string().optional(),
});

export type RatingInput = z.infer<typeof ratingSchema>;

// Meal skip toggle schema
export const skipMealSchema = z.object({
  mealId: z.string().min(1),
  reason: z.string().optional(),
});

export type SkipMealInput = z.infer<typeof skipMealSchema>;
