import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// Helper to determine tier color & metadata
export function getStreakTier(streak: number) {
  if (streak >= 14) {
    return {
      tier: "legend",
      name: "Zero-Waste Master",
      color: "gold",
      bgClass: "from-amber-500/20 via-purple-950/40 to-zinc-950",
      borderClass: "border-amber-400/60 shadow-amber-500/20",
      flameColor: "#f59e0b",
      accentText: "text-amber-300",
      nextTierDays: 0,
      nextTierName: "Max Tier Achieved!",
    };
  }
  if (streak >= 7) {
    return {
      tier: "sapphire",
      name: "Sapphire Champion",
      color: "cyan",
      bgClass: "from-cyan-950/30 via-blue-950/20 to-zinc-950",
      borderClass: "border-cyan-500/50 shadow-cyan-500/20",
      flameColor: "#06b6d4",
      accentText: "text-cyan-300",
      nextTierDays: 14 - streak,
      nextTierName: "Zero-Waste Master (14 Days)",
    };
  }
  if (streak >= 3) {
    return {
      tier: "emerald",
      name: "Emerald Eco-Warrior",
      color: "emerald",
      bgClass: "from-emerald-950/30 via-teal-950/20 to-zinc-950",
      borderClass: "border-emerald-500/50 shadow-emerald-500/20",
      flameColor: "#10b981",
      accentText: "text-emerald-300",
      nextTierDays: 7 - streak,
      nextTierName: "Sapphire Champion (7 Days)",
    };
  }
  return {
    tier: "bronze",
    name: "Starter Sprout",
    color: "zinc",
    bgClass: "from-zinc-900 via-zinc-900/90 to-zinc-950",
    borderClass: "border-zinc-700 shadow-zinc-800/20",
    flameColor: "#f97316",
    accentText: "text-orange-400",
    nextTierDays: 3 - streak,
    nextTierName: "Emerald Eco-Warrior (3 Days)",
  };
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let streak = await prisma.streak.findUnique({
      where: { userId },
    });

    if (!streak) {
      streak = await prisma.streak.create({
        data: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
        },
      });
    }

    const now = new Date();
    const alreadyClaimedToday = streak.lastPlateDate
      ? isSameDay(new Date(streak.lastPlateDate), now)
      : false;

    const tierInfo = getStreakTier(streak.currentStreak);

    return NextResponse.json({
      success: true,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastPlateDate: streak.lastPlateDate,
      lastSkipDate: streak.lastSkipDate,
      alreadyClaimedToday,
      tierInfo,
    });
  } catch (error: any) {
    console.error("GET streak error:", error);
    return NextResponse.json(
      { error: "Failed to fetch streak data", details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json().catch(() => ({}));
    const action = json.action || "clean_plate"; // "clean_plate" or "verify_skip"

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    // 1. Check for Skip Violation Penalty
    // If student marked a skip for today's meal, but attempts to claim a dining clean plate:
    const activeSkipsToday = await prisma.skip.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });

    if (action === "clean_plate" && activeSkipsToday.length > 0) {
      // Violation: Student marked a skip for today, yet showed up to claim dining clean plate!
      await prisma.streak.upsert({
        where: { userId },
        update: {
          currentStreak: 0,
        },
        create: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
        },
      });

      return NextResponse.json(
        {
          error: "Streak Reset! You marked an advance meal skip for today but showed up to eat. Zero-waste honesty policy strictly resets streak to 0.",
          streakReset: true,
          currentStreak: 0,
        },
        { status: 400 }
      );
    }

    // 2. Fetch current streak record
    let streak = await prisma.streak.findUnique({
      where: { userId },
    });

    if (!streak) {
      streak = await prisma.streak.create({
        data: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
        },
      });
    }

    // 3. Enforce: Streak only increases once per day!
    const dateToCheck = action === "clean_plate" ? streak.lastPlateDate : streak.lastSkipDate;
    if (dateToCheck && isSameDay(new Date(dateToCheck), now)) {
      return NextResponse.json(
        {
          error: "Streak already increased today. Streak can only increase once per calendar day.",
          alreadyClaimedToday: true,
          currentStreak: streak.currentStreak,
        },
        { status: 400 }
      );
    }

    // 4. Increment streak
    const newStreak = streak.currentStreak + 1;
    const newLongest = Math.max(streak.longestStreak, newStreak);

    const updated = await prisma.streak.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastPlateDate: action === "clean_plate" ? now : streak.lastPlateDate,
        lastSkipDate: action === "verify_skip" ? now : streak.lastSkipDate,
      },
    });

    const tierInfo = getStreakTier(newStreak);

    return NextResponse.json({
      success: true,
      celebrate: true,
      currentStreak: newStreak,
      longestStreak: newLongest,
      message: "Congratulations! +1 day added to your Waste-Free Streak!",
      tierInfo,
    });
  } catch (error: any) {
    console.error("POST streak error:", error);
    return NextResponse.json(
      { error: "Failed to update streak", details: error?.message },
      { status: 500 }
    );
  }
}
