import OpenAI from "openai";

// API Key from environment variable (GROQ_API_KEY / XAI_API_KEY / XAI_APA_KEY)
const apiKey =
  process.env.GROQ_API_KEY ||
  process.env.XAI_API_KEY ||
  process.env.XAI_APA_KEY ||
  process.env.GROK_API_KEY ||
  "dummy-key";

const isGroq = apiKey.startsWith("gsk_");

// Base URL: defaults to GroqCloud if gsk key, or xAI otherwise
const baseURL =
  process.env.GROQ_BASE_URL ||
  process.env.XAI_BASE_URL ||
  (isGroq ? "https://api.groq.com/openai/v1" : "https://api.x.ai/v1");

// Model from environment variable
export const GROK_MODEL =
  process.env.GROQ_MODEL ||
  process.env.GROK_MODEL ||
  (isGroq ? "llama-3.3-70b-versatile" : "grok-2-latest");

export const grok = new OpenAI({
  apiKey,
  baseURL,
});

export const groqClient = grok;

export default grok;
