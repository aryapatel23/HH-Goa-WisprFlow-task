import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Query top 10 students by currentStreak
    const topStudents = await prisma.user.findMany({
      where: {
        role: "student",
        streak: {
          isNot: null,
        },
      },
      include: {
        streak: true,
      },
      orderBy: [
        {
          streak: {
            currentStreak: "desc",
          },
        },
        {
          streak: {
            longestStreak: "desc",
          },
        },
      ],
      take: 10,
    });

    // Privacy preserving: Only first name and hostel block
    const leaderboard = topStudents.map((student, index) => {
      // Split full name and extract only first name
      const firstName = student.name.trim().split(/\s+/)[0] || "Student";
      const block = student.hostelBlock || "Block A";
      const currentStreak = student.streak?.currentStreak || 0;
      const longestStreak = student.streak?.longestStreak || currentStreak;

      // Calculate tier based on 3, 7, 14 days
      let tier = "bronze";
      if (currentStreak >= 14) tier = "legend";
      else if (currentStreak >= 7) tier = "sapphire";
      else if (currentStreak >= 3) tier = "emerald";

      return {
        rank: index + 1,
        firstName,
        hostelBlock: block,
        currentStreak,
        longestStreak,
        foodSavedKg: Number((currentStreak * 0.45).toFixed(1)),
        tier,
      };
    });

    // Calculate block-wise performance summary
    const blockStats: Record<string, { totalStreaks: number; studentCount: number }> = {};
    for (const student of topStudents) {
      const b = student.hostelBlock || "Block A";
      if (!blockStats[b]) blockStats[b] = { totalStreaks: 0, studentCount: 0 };
      blockStats[b].totalStreaks += student.streak?.currentStreak || 0;
      blockStats[b].studentCount += 1;
    }

    return NextResponse.json({
      success: true,
      leaderboard,
      blockStats,
    });
  } catch (error: any) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard", details: error?.message },
      { status: 500 }
    );
  }
}
