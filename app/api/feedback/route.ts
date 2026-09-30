import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import anthropic from "@/lib/anthropic";
import prisma from "@/lib/prisma";
import { ComplaintCategory, Sentiment, UrgencyLevel, MealSlot } from "@prisma/client";

// 1. Zod input schema
const feedbackRequestSchema = z.object({
  text: z.string().min(2, "Feedback text must be at least 2 characters").max(2000),
  language: z.string().default("en"),
  mealSlot: z.enum(["breakfast", "lunch", "snacks", "dinner"]).optional(),
  dishName: z.string().optional(),
  linkDetail: z.string().optional(),
  audioUrl: z.string().optional(),
});

// 2. Zod schema for AI output validation
const aiOutputSchema = z.object({
  category: z.enum(["HYGIENE", "TASTE", "QUANTITY", "SERVICE", "OTHER"]),
  sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE"]),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  summary: z.string().min(1),
  dishName: z.string().nullable().optional(),
});

type AIOutput = z.infer<typeof aiOutputSchema>;

// Keyword-based fallback classifier
function classifyWithKeywords(text: string, dishHint?: string): AIOutput {
  const lower = text.toLowerCase();

  // 1. Category & Urgency detection
  let category: "HYGIENE" | "TASTE" | "QUANTITY" | "SERVICE" | "OTHER" = "OTHER";
  let urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "MEDIUM";
  let sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE" = "NEGATIVE";

  // Hygiene keywords (English, Hindi, Gujarati, Hinglish)
  if (
    /hygiene|clean|dirty|hair|cockroach|bug|insect|fly|smell|odor|badboo|stink|greasy|wash|water dispenser|cooler|safai|ganda|keeda|kachra|plate/i.test(
      lower
    )
  ) {
    category = "HYGIENE";
    urgency = /cockroach|insect|keeda|smell|badboo|poison|fever|sick/i.test(lower) ? "CRITICAL" : "HIGH";
  }
  // Taste & Cooking keywords
  else if (
    /taste|oil|oily|namak|salt|mirchi|spicy|tikha|kacchi|raw|uncooked|burnt|jala|thanda|cold|sweet|meetha|khatta|swad|kadwa|salty/i.test(
      lower
    )
  ) {
    category = "TASTE";
    urgency = "MEDIUM";
    if (/good|great|badiya|swadist|delicious|yummy|bhalo|pasand/i.test(lower)) {
      sentiment = "POSITIVE";
      urgency = "LOW";
    }
  }
  // Quantity keywords
  else if (
    /quantity|khatam|finished|empty|kam|less|not enough|portion|refused|ration/i.test(
      lower
    )
  ) {
    category = "QUANTITY";
    urgency = "HIGH";
  }
  // Service keywords
  else if (
    /service|staff|rude|behaviour|shout|slow|late|counter|wait|line/i.test(
      lower
    )
  ) {
    category = "SERVICE";
    urgency = "MEDIUM";
  }

  // Positive sentiment check
  if (/good|tasty|delicious|great|awesome|badiya|saras|nice|loved/i.test(lower) && !/not good|not tasty/i.test(lower)) {
    sentiment = "POSITIVE";
    urgency = "LOW";
  }

  // 2. Dish extraction
  let detectedDish: string | null = dishHint || null;
  if (!detectedDish) {
    const dishKeywords = [
      { key: "paneer", name: "Paneer Sabji" },
      { key: "roti", name: "Phulka Roti" },
      { key: "phulka", name: "Phulka Roti" },
      { key: "dal", name: "Dal Tadka" },
      { key: "poha", name: "Poha" },
      { key: "rice", name: "Basmati Rice" },
      { key: "chawal", name: "Basmati Rice" },
      { key: "chai", name: "Chai (Tea)" },
      { key: "tea", name: "Chai (Tea)" },
      { key: "khichdi", name: "Moong Dal Khichdi" },
      { key: "kichdi", name: "Moong Dal Khichdi" },
      { key: "gulab jamun", name: "Gulab Jamun" },
      { key: "samosa", name: "Samosa" },
      { key: "pakoda", name: "Pakoda" },
      { key: "paratha", name: "Aloo Paratha" },
    ];
    for (const d of dishKeywords) {
      if (lower.includes(d.key)) {
        detectedDish = d.name;
        break;
      }
    }
  }

  // 3. One-line English summary
  let summary = `Student reported ${category.toLowerCase()} feedback: "${text.slice(0, 70)}..."`;
  if (category === "TASTE") {
    summary = detectedDish
      ? `Taste issue with ${detectedDish}: preparation quality concern.`
      : `General taste feedback regarding food seasoning or cooking.`;
  } else if (category === "HYGIENE") {
    summary = `Hygiene concern flagged requiring sanitation inspection.`;
  } else if (category === "QUANTITY") {
    summary = detectedDish
      ? `Shortage reported for ${detectedDish} during meal service.`
      : `Quantity shortage reported by student before meal slot conclusion.`;
  }

  return {
    category,
    sentiment,
    urgency,
    summary,
    dishName: detectedDish,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod input validation
    const validationResult = feedbackRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { text, language, mealSlot, dishName, linkDetail, audioUrl } = validationResult.data;

    let aiOutput: AIOutput | null = null;

    // 2. Send text to Claude API for structured analysis
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const isRealApiKey = apiKey && !apiKey.includes("dummy") && apiKey.startsWith("sk-ant-");

    if (isRealApiKey) {
      try {
        const prompt = `You are the AI food & hygiene intelligence module for MassMatter, an Indian hostel mess platform.
Analyze this feedback submitted by a student in ${language} (may be Hindi, English, Gujarati, or Hinglish):
"${text}"

Extract the structured assessment according to this JSON schema:
{
  "category": "HYGIENE" | "TASTE" | "QUANTITY" | "SERVICE" | "OTHER",
  "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
  "urgency": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "summary": "Concise one-line summary in English",
  "dishName": "Name of Indian hostel dish mentioned (e.g., Paneer Sabji, Dal Tadka, Phulka Roti, Poha, Khichdi, Chai, etc.) or null"
}

Respond ONLY with valid JSON. Do not wrap in markdown quotes if possible, or use standard json formatting.`;

        const response = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 350,
          temperature: 0.1,
          messages: [{ role: "user", content: prompt }],
        });

        const textBlock = response.content.find((c) => c.type === "text");
        if (textBlock && textBlock.text) {
          const rawJson = textBlock.text.trim().replace(/^```json/, "").replace(/```$/, "").trim();
          const parsed = JSON.parse(rawJson);

          // Validate Claude's output with Zod
          const zodValidation = aiOutputSchema.safeParse(parsed);
          if (zodValidation.success) {
            aiOutput = zodValidation.data;
          } else {
            console.warn("Zod validation of Claude output failed:", zodValidation.error);
          }
        }
      } catch (claudeError) {
        console.warn("Claude API call failed or timed out, executing fallback classifier:", claudeError);
      }
    }

    // 3. Fallback to keyword-based classifier if Claude fails or API key is missing
    if (!aiOutput) {
      aiOutput = classifyWithKeywords(text, dishName);
    }

    // 4. Resolve dish and meal in database if mentioned
    let linkedDishId: string | null = null;
    let linkedMealId: string | null = null;

    const dishToSearch = aiOutput.dishName || dishName;
    if (dishToSearch) {
      const dbDish = await prisma.dish.findFirst({
        where: {
          name: {
            contains: dishToSearch.split(" ")[0],
            mode: "insensitive",
          },
        },
      });
      if (dbDish) {
        linkedDishId = dbDish.id;
        linkedMealId = dbDish.mealId;
      }
    }

    if (!linkedMealId && mealSlot) {
      const dbMeal = await prisma.meal.findFirst({
        where: {
          slot: mealSlot as MealSlot,
        },
        orderBy: { date: "desc" },
      });
      if (dbMeal) linkedMealId = dbMeal.id;
    }

    // 5. Store Complaint in PostgreSQL: MUST NEVER STORE USER ID
    const savedComplaint = await prisma.complaint.create({
      data: {
        text,
        language: language || "en",
        category: aiOutput.category as ComplaintCategory,
        sentiment: aiOutput.sentiment as Sentiment,
        urgency: aiOutput.urgency as UrgencyLevel,
        linkDetail: linkDetail || (mealSlot ? `Meal Slot: ${mealSlot}` : "Anonymous General Complaint"),
        audioUrl: audioUrl || null,
        dishId: linkedDishId,
        mealId: linkedMealId,
        // Notice: NO userId field exists in model, identity is strictly anonymous!
      },
    });

    return NextResponse.json({
      success: true,
      message: "Feedback submitted anonymously and processed by AI",
      classification: aiOutput,
      complaint: {
        id: savedComplaint.id,
        category: savedComplaint.category,
        sentiment: savedComplaint.sentiment,
        urgency: savedComplaint.urgency,
        linkDetail: savedComplaint.linkDetail,
        createdAt: savedComplaint.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error in feedback API:", error);
    return NextResponse.json(
      { error: "Internal server error while processing feedback", details: error.message },
      { status: 500 }
    );
  }
}
