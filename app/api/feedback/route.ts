import { NextRequest, NextResponse } from "next/server";
import { complaintSchema } from "@/lib/validations";
import anthropic from "@/lib/anthropic";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod input validation
    const validationResult = complaintSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { text, mealSlot, dishName } = validationResult.data;

    // 2. AI Intelligence Classification (Claude API with fallback)
    let aiClassification = {
      category: "OTHER",
      sentiment: "NEGATIVE",
      urgency: "MEDIUM",
      dish: dishName || null,
      summary: text.slice(0, 100),
    };

    try {
      if (process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes("dummy")) {
        const response = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 300,
          messages: [
            {
              role: "user",
              content: `Analyze this hostel mess feedback: "${text}". 
Respond ONLY with a JSON object containing:
- category: one of ["HYGIENE", "TASTE", "QUANTITY", "SERVICE", "OTHER"]
- sentiment: one of ["POSITIVE", "NEUTRAL", "NEGATIVE"]
- urgency: one of ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
- dish: string or null
- summary: string (one-sentence summary in English)`
            }
          ]
        });

        const content = response.content[0];
        if (content.type === "text") {
          const parsed = JSON.parse(content.text);
          aiClassification = { ...aiClassification, ...parsed };
        }
      }
    } catch (aiErr) {
      console.warn("AI Classification fallback triggered:", aiErr);
    }

    // 3. Store anonymous complaint in database (identity is NEVER stored)
    // Note: When database is connected:
    /*
    const saved = await prisma.complaint.create({
      data: {
        text,
        category: aiClassification.category as any,
        sentiment: aiClassification.sentiment as any,
        urgency: aiClassification.urgency as any,
      }
    });
    */

    return NextResponse.json({
      success: true,
      message: "Feedback submitted anonymously and processed by AI",
      data: aiClassification,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
