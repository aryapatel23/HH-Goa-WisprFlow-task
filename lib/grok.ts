import OpenAI from "openai";

// Base URL for xAI Grok API (OpenAI-compatible)
const baseURL = process.env.XAI_BASE_URL || "https://api.x.ai/v1";

// API Key from environment variable (XAI_API_KEY / XAI_APA_KEY)
const apiKey =
  process.env.XAI_API_KEY ||
  process.env.XAI_APA_KEY ||
  process.env.GROK_API_KEY ||
  process.env.GROQ_API_KEY ||
  "dummy-xai-key";

// Model from environment variable (GROK_MODEL / GROQ_MODEL)
export const GROK_MODEL =
  process.env.GROK_MODEL ||
  process.env.GROQ_MODEL ||
  process.env.XAI_MODEL ||
  "grok-2-latest";

export const grok = new OpenAI({
  apiKey,
  baseURL,
});

export const groqClient = grok;

export default grok;
