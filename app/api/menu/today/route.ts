import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MealSlot } from "@prisma/client";

export async function GET() {
  try {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    // Try finding today's meals
    let meals = await prisma.meal.findMany({
      where: {
        date: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      include: {
        dishes: true,
      },
      orderBy: {
        slot: "asc",
      },
    });

    // If no meals match today's exact date (e.g. seed was run on different day),
    // grab the latest 4 meals (breakfast, lunch, snacks, dinner) or create/map them
    if (meals.length === 0) {
      const allMeals = await prisma.meal.findMany({
        include: { dishes: true },
        take: 4,
        orderBy: { date: "desc" },
      });
      meals = allMeals;
    }

    // Default cutoff times for today's meals if needed
    const cutoffMap: Record<MealSlot, { start: string; end: string; cutoffHour: number; cutoffMin: number }> = {
      [MealSlot.breakfast]: { start: "07:30", end: "09:30", cutoffHour: 6, cutoffMin: 30 },
      [MealSlot.lunch]: { start: "12:30", end: "14:30", cutoffHour: 10, cutoffMin: 30 },
      [MealSlot.snacks]: { start: "17:00", end: "18:00", cutoffHour: 15, cutoffMin: 30 },
      [MealSlot.dinner]: { start: "20:00", end: "22:00", cutoffHour: 18, cutoffMin: 0 },
    };

    // Calculate dynamic cutoff timestamp for each meal today
    const enrichedMeals = meals.map((m) => {
      const conf = cutoffMap[m.slot] || { start: m.startTime, end: m.endTime, cutoffHour: 18, cutoffMin: 0 };
      const todayCutoff = new Date(now);
      todayCutoff.setHours(conf.cutoffHour, conf.cutoffMin, 0, 0);

      const isCutoffPassed = now.getTime() > todayCutoff.getTime();

      return {
        ...m,
        startTime: conf.start,
        endTime: conf.end,
        cutoffTime: todayCutoff.toISOString(),
        isCutoffPassed,
      };
    });

    // Determine the next upcoming meal
    const slotOrder: MealSlot[] = [MealSlot.breakfast, MealSlot.lunch, MealSlot.snacks, MealSlot.dinner];
    const sortedEnriched = slotOrder
      .map((slot) => enrichedMeals.find((m) => m.slot === slot))
      .filter(Boolean);

    // Find next meal whose end time or cutoff is in the future, or default to dinner/tomorrow breakfast
    let nextMeal = sortedEnriched.find((m: any) => !m.isCutoffPassed);
    if (!nextMeal && sortedEnriched.length > 0) {
      nextMeal = sortedEnriched[sortedEnriched.length - 1]; // Dinner
    }

    return NextResponse.json({
      success: true,
      meals: sortedEnriched,
      nextMeal,
      serverTime: now.toISOString(),
    });
  } catch (error: any) {
    console.error("Error fetching today's menu:", error);
    return NextResponse.json(
      { error: "Failed to load today's menu", details: error.message },
      { status: 500 }
    );
  }
}
