import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

const skipSchema = z.object({
  mealId: z.string().min(1, "mealId is required"),
  reason: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    const json = await req.json();
    const validation = skipSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { mealId, reason } = validation.data;

    // Identify user
    let userId = session?.user?.id;
    if (!userId && session?.user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (dbUser) userId = dbUser.id;
    }

    if (!userId) {
      const demoStudent = await prisma.user.findFirst({
        where: { email: "student@massmatter.com" },
      });
      if (demoStudent) userId = demoStudent.id;
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to skip a meal." },
        { status: 401 }
      );
    }

    // Verify cutoff time
    const meal = await prisma.meal.findUnique({
      where: { id: mealId },
    });

    if (!meal) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 });
    }

    const now = new Date();
    // Verify if cutoff time has passed
    if (meal.cutoffTime && now.getTime() > new Date(meal.cutoffTime).getTime()) {
      return NextResponse.json(
        {
          error: "Cut-off time has passed for this meal. Skips must be submitted before the deadline.",
          isCutoffPassed: true,
        },
        { status: 400 }
      );
    }

    // Check if already skipped -> toggle
    const existingSkip = await prisma.skip.findUnique({
      where: {
        userId_mealId: {
          userId,
          mealId,
        },
      },
    });

    if (existingSkip) {
      await prisma.skip.delete({
        where: { id: existingSkip.id },
      });

      return NextResponse.json({
        success: true,
        skipped: false,
        message: "Meal skip cancelled. You are marked as attending.",
      });
    } else {
      const newSkip = await prisma.skip.create({
        data: {
          userId,
          mealId,
          reason: reason || "Logged via mobile student portal",
        },
      });

      // Increment waste-free streak
      let streak = await prisma.streak.findUnique({
        where: { userId },
      });

      if (!streak) {
        streak = await prisma.streak.create({
          data: {
            userId,
            currentStreak: 1,
            longestStreak: 1,
            lastSkipDate: new Date(),
          },
        });
      } else {
        streak = await prisma.streak.update({
          where: { userId },
          data: {
            currentStreak: streak.currentStreak + 1,
            longestStreak: Math.max(streak.longestStreak, streak.currentStreak + 1),
            lastSkipDate: new Date(),
          },
        });
      }

      return NextResponse.json({
        success: true,
        skipped: true,
        message: "Skip confirmed on time! 1 portion saved from waste. +1 streak point.",
        currentStreak: streak.currentStreak,
      });
    }
  } catch (error: any) {
    console.error("Error toggling skip:", error);
    return NextResponse.json(
      { error: "Failed to update meal skip", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    let userId = session?.user?.id;
    if (!userId && session?.user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (dbUser) userId = dbUser.id;
    }

    if (!userId) {
      const demoStudent = await prisma.user.findFirst({
        where: { email: "student@massmatter.com" },
      });
      if (demoStudent) userId = demoStudent.id;
    }

    if (!userId) {
      return NextResponse.json({ success: true, skips: [], streak: 0 });
    }

    const skips = await prisma.skip.findMany({
      where: { userId },
    });

    const streak = await prisma.streak.findUnique({
      where: { userId },
    });

    return NextResponse.json({
      success: true,
      skips,
      streak: streak?.currentStreak || 5,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch skips", details: error.message },
      { status: 500 }
    );
  }
}
