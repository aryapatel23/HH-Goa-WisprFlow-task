import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// Zod schema for saving a rating
const saveRatingSchema = z.object({
  dishId: z.string().min(1, "dishId is required"),
  mealId: z.string().min(1, "mealId is required"),
  star: z.number().int().min(1).max(5, "Stars must be between 1 and 5"),
  reaction: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // 1. Zod input validation
    const json = await req.json();
    const validation = saveRatingSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { dishId, mealId, star, reaction } = validation.data;

    // 2. Identify student from session or fallback demo student
    let userId = session?.user?.id;
    if (!userId && session?.user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (dbUser) userId = dbUser.id;
    }

    if (!userId) {
      // Find default demo student if testing without login
      const demoStudent = await prisma.user.findFirst({
        where: { email: "student@massmatter.com" },
      });
      if (demoStudent) {
        userId = demoStudent.id;
      } else {
        return NextResponse.json(
          { error: "Unauthorized. Please sign in to submit a rating." },
          { status: 401 }
        );
      }
    }

    // 3. Anti-Cheating Rule: If student marked a skip for this meal and still showed up to eat & rate,
    // immediately reset their streak to 0 and remove the fraudulent skip.
    const violatedSkip = await prisma.skip.findUnique({
      where: {
        userId_mealId: {
          userId,
          mealId,
        },
      },
    });

    let streakResetMessage = "";
    if (violatedSkip) {
      await prisma.streak.upsert({
        where: { userId },
        update: { currentStreak: 0 },
        create: { userId, currentStreak: 0, longestStreak: 0 },
      });

      // Remove the violated skip so headcount accounts for actual attendance
      await prisma.skip.delete({
        where: { id: violatedSkip.id },
      });

      streakResetMessage = " (Notice: Streak reset to 0 because you marked a skip for this meal but showed up to dine!)";
    }

    // 4. Enforce ONLY ONE rating per student per dish per day
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const existingRating = await prisma.rating.findFirst({
      where: {
        userId,
        dishId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    let savedRating;
    if (existingRating) {
      // Update the existing rating for today
      savedRating = await prisma.rating.update({
        where: { id: existingRating.id },
        data: {
          star,
          reaction: reaction || existingRating.reaction,
        },
      });
      return NextResponse.json({
        success: true,
        updated: true,
        message: `Rating updated for today.${streakResetMessage}`,
        streakReset: !!violatedSkip,
        rating: savedRating,
      });
    } else {
      // Create new rating
      savedRating = await prisma.rating.create({
        data: {
          userId,
          mealId,
          dishId,
          star,
          reaction: reaction || null,
        },
      });
      return NextResponse.json({
        success: true,
        updated: false,
        message: `Rating submitted successfully.${streakResetMessage}`,
        streakReset: !!violatedSkip,
        rating: savedRating,
      });
    }
  } catch (error: any) {
    console.error("Error saving rating:", error);
    return NextResponse.json(
      { error: "Failed to save rating", details: error.message },
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
      return NextResponse.json({ success: true, ratings: [] });
    }

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const ratings = await prisma.rating.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return NextResponse.json({ success: true, ratings });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch ratings", details: error.message },
      { status: 500 }
    );
  }
}
