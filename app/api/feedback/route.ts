import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { grok, GROK_MODEL } from "@/lib/grok";
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

    // 2. Call xAI Grok API via OpenAI SDK
    const apiKey =
      process.env.XAI_API_KEY ||
      process.env.XAI_APA_KEY ||
      process.env.GROK_API_KEY ||
      process.env.GROQ_API_KEY;

    const isConfigured = apiKey && !apiKey.includes("dummy") && apiKey.length > 5;

    if (isConfigured) {
      try {
        const prompt = `Analyze this hostel mess feedback submitted in ${language} (English, Hindi, Gujarati, or Hinglish):
"${text}"

Respond with ONLY a JSON object matching this exact schema:
{
  "category": "HYGIENE" | "TASTE" | "QUANTITY" | "SERVICE" | "OTHER",
  "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
  "urgency": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "summary": "Concise one-line summary in English",
  "dishName": "Name of Indian hostel dish mentioned (e.g., Paneer Sabji, Dal Tadka, Phulka Roti, Poha, Khichdi, etc.) or null"
}`;

        const completion = await grok.chat.completions.create({
          model: GROK_MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are the AI food & hygiene intelligence module for MassMatter, an Indian hostel mess platform. Respond ONLY with valid JSON.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.1,
          response_format: { type: "json_object" },
        });

        const rawContent = completion.choices[0]?.message?.content;
        if (rawContent) {
          const parsed = JSON.parse(rawContent.trim());
          const zodValidation = aiOutputSchema.safeParse(parsed);
          if (zodValidation.success) {
            aiOutput = zodValidation.data;
          } else {
            console.warn("Zod validation of Grok output failed:", zodValidation.error);
          }
        }
      } catch (grokError) {
        console.warn("xAI Grok API call failed or timed out, running fallback classifier:", grokError);
      }
    }

    // 3. Fallback to keyword-based classifier if Grok fails or key is missing
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
        // Strictly anonymous: NO user ID is stored
      },
    });

    return NextResponse.json({
      success: true,
      message: "Feedback submitted anonymously and processed by Grok AI",
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
