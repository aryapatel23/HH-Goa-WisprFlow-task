import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardStatsSchema } from "@/lib/validations/dashboard";
import { getMealHeadcountForecasts } from "@/lib/forecast";

const CATEGORY_COLORS: Record<string, string> = {
  HYGIENE: "#ef4444", // red
  TASTE: "#f97316", // orange
  QUANTITY: "#eab308", // yellow
  SERVICE: "#3b82f6", // blue
  OTHER: "#a855f7", // purple
};

export async function GET() {
  try {
    let session = null;
    try {
      session = await auth();
    } catch {
      // ignore context error in non-http testing
    }

    let role = (session?.user as any)?.role;

    // In dev / demo mode, fallback to demo manager if testing without session cookies
    if (!role && process.env.NODE_ENV === "development") {
      const demoManager = await prisma.user.findFirst({
        where: { email: "manage@massmatter.com" },
      });
      if (demoManager) role = "manager";
    }

    // Guard: Only manager and admin allowed
    if (role !== "manager" && role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Manager or Admin access required" },
        { status: 403 }
      );
    }

    // 1. Total Students
    const totalStudents = await prisma.user.count({
      where: { role: "student" },
    });

    // 2. Skips Count (All and Upcoming)
    const now = new Date();
    const totalSkips = await prisma.skip.count();
    
    // Meal skips for next 7 days / future meals
    const mealSkipsNextWeek = await prisma.skip.count({
      where: {
        meal: {
          date: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
        },
      },
    });

    // Average skips per major meal (lunch & dinner = 14 meals/week)
    const avgSkipsPerMeal = Math.max(1, Math.round(totalSkips / 14));
    const expectedHeadcount = Math.max(0, totalStudents - avgSkipsPerMeal);

    // 3. Average Rating Today
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const todayRatings = await prisma.rating.aggregate({
      _avg: { star: true },
      _count: { id: true },
      where: {
        createdAt: { gte: startOfToday },
      },
    });

    // If today is early and has few ratings, compute across the current week schedule
    const allRatingsAgg = await prisma.rating.aggregate({
      _avg: { star: true },
      _count: { id: true },
    });

    const averageRatingToday = Number(
      (todayRatings._count.id > 0 && todayRatings._avg.star
        ? todayRatings._avg.star
        : allRatingsAgg._avg.star || 4.1
      ).toFixed(1)
    );

    // 4. Complaints Stats
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const totalComplaintsThisWeek = await prisma.complaint.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
    });

    const openCriticalComplaints = await prisma.complaint.count({
      where: {
        urgency: "CRITICAL",
        resolved: false,
      },
    });

    // 5. Dish Ratings (for Bar Chart)
    const dishesWithRatings = await prisma.dish.findMany({
      include: {
        ratings: {
          select: { star: true },
        },
      },
    });

    const dishRatings = dishesWithRatings
      .filter((d) => d.ratings.length > 0)
      .map((dish) => {
        const sum = dish.ratings.reduce((acc, r) => acc + r.star, 0);
        const count = dish.ratings.length;
        const avg = count > 0 ? Number((sum / count).toFixed(1)) : 0;
        return {
          id: dish.id,
          name: dish.name,
          category: dish.category,
          avgRating: avg,
          ratingCount: count,
        };
      })
      // sort by ratingCount descending to show most relevant dishes
      .sort((a, b) => b.ratingCount - a.ratingCount)
      .slice(0, 10);

    // 6. Rating Trends (7-day trend using meal dates)
    const mealsWithRatings = await prisma.meal.findMany({
      include: {
        ratings: {
          select: { star: true },
        },
      },
      orderBy: { date: "asc" },
    });

    // Group meals by date string
    const dateMap = new Map<string, { totalStars: number; count: number; dateObj: Date }>();
    for (const meal of mealsWithRatings) {
      const dStr = meal.date.toISOString().split("T")[0];
      const existing = dateMap.get(dStr) || { totalStars: 0, count: 0, dateObj: meal.date };
      for (const r of meal.ratings) {
        existing.totalStars += r.star;
        existing.count += 1;
      }
      dateMap.set(dStr, existing);
    }

    const ratingTrends = Array.from(dateMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([dateStr, stat]) => {
        const dayName = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(stat.dateObj);
        const avg = stat.count > 0 ? Number((stat.totalStars / stat.count).toFixed(2)) : 4.0;
        return {
          date: dateStr,
          day: dayName,
          avgRating: avg,
          count: stat.count,
        };
      });

    // 7. Complaint Categories (Donut Chart)
    const complaintsGrouped = await prisma.complaint.groupBy({
      by: ["category"],
      _count: { id: true },
    });

    const totalComplaintsCount = complaintsGrouped.reduce((acc, c) => acc + c._count.id, 0);
    const complaintCategories = complaintsGrouped.map((c) => ({
      category: c.category,
      count: c._count.id,
      percentage: totalComplaintsCount > 0 ? Math.round((c._count.id / totalComplaintsCount) * 100) : 0,
      color: CATEGORY_COLORS[c.category] || "#94a3b8",
    }));

    // 8. Top Rejected Dishes (Ranked by lowest avg rating with >= 3 ratings)
    const dishesForRejection = dishesWithRatings
      .map((dish) => {
        const count = dish.ratings.length;
        const lowStarCount = dish.ratings.filter((r) => r.star <= 2).length;
        const sum = dish.ratings.reduce((acc, r) => acc + r.star, 0);
        const avg = count > 0 ? Number((sum / count).toFixed(1)) : 0;
        const rejectionRate = count > 0 ? Math.round((lowStarCount / count) * 100) : 0;
        return {
          id: dish.id,
          name: dish.name,
          category: dish.category,
          avgRating: avg,
          ratingCount: count,
          rejectionRate,
        };
      })
      .filter((d) => d.ratingCount >= 3)
      .sort((a, b) => a.avgRating - b.avgRating)
      .slice(0, 5);

    // 9. Complaint Feed with Dish relation & urgency ranking
    const rawComplaints = await prisma.complaint.findMany({
      include: {
        dish: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Priority map for urgency
    const urgencyPriority: Record<string, number> = {
      CRITICAL: 4,
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1,
    };

    const sortedComplaints = [...rawComplaints].sort((a, b) => {
      const pA = urgencyPriority[a.urgency] || 0;
      const pB = urgencyPriority[b.urgency] || 0;
      if (pA !== pB) return pB - pA; // highest urgency first
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    const complaintItems = sortedComplaints.map((c) => ({
      id: c.id,
      text: c.text,
      language: c.language,
      category: c.category,
      sentiment: c.sentiment,
      urgency: c.urgency,
      linkDetail: c.linkDetail,
      dishName: c.dish?.name || null,
      dishId: c.dish?.id || null,
      resolved: c.resolved,
      createdAt: c.createdAt.toISOString(),
    }));

    // 10. Meal Headcount Forecasts
    const forecasts = await getMealHeadcountForecasts(6);

    // Assemble payload
    const payload = {
      summary: {
        totalStudents,
        mealSkipsNextWeek,
        totalSkips,
        expectedHeadcount,
        averageRatingToday,
        totalComplaintsThisWeek,
        openCriticalComplaints,
      },
      forecasts,
      dishRatings,
      ratingTrends,
      complaintCategories,
      rejectedDishes: dishesForRejection,
      complaints: complaintItems,
    };

    // Zod validation check
    const validatedData = DashboardStatsSchema.parse(payload);

    return NextResponse.json(validatedData);
  } catch (error: any) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard analytics", details: error?.message },
      { status: 500 }
    );
  }
}
