import { getPortfolioContext } from "@/lib/ai-context";
import { z } from "zod";
import type { ChatMessage } from "@/types";

export const maxDuration = 30;

const MAX_BODY_BYTES = 64 * 1024; // 64KB hard cap to prevent abuse
const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 2000;

const ChatBodySchema = z.object({
  locale: z.enum(["en", "sv"]).optional().default("en"),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().min(1).max(MAX_MESSAGE_CHARS),
      })
    )
    .max(MAX_MESSAGES),
});

// Minimal in-memory token bucket rate limiter (best-effort in serverless, still valuable on long-lived nodes).
type Bucket = { tokens: number; lastRefillMs: number };
const buckets = new Map<string, Bucket>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_TOKENS = 30; // 30 requests / 10 min per IP
function takeToken(key: string): boolean {
  const now = Date.now();
  const existing = buckets.get(key) ?? { tokens: RATE_LIMIT_MAX_TOKENS, lastRefillMs: now };

  // Refill linearly over the window.
  const elapsed = now - existing.lastRefillMs;
  if (elapsed > 0) {
    const refill = (elapsed / RATE_LIMIT_WINDOW_MS) * RATE_LIMIT_MAX_TOKENS;
    existing.tokens = Math.min(RATE_LIMIT_MAX_TOKENS, existing.tokens + refill);
    existing.lastRefillMs = now;
  }

  if (existing.tokens < 1) {
    buckets.set(key, existing);
    return false;
  }

  existing.tokens -= 1;
  buckets.set(key, existing);
  return true;
}

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: "Server misconfiguration: Missing API Key" }), { status: 500 });
  }

  try {
    // Fast reject oversized bodies (best-effort; not all runtimes provide content-length).
    const contentLength = req.headers.get("content-length");
    if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
      return new Response(JSON.stringify({ error: "Payload too large" }), { status: 413 });
    }

    // Best-effort origin check to reduce cross-site abuse (resource-CSRF).
    const origin = req.headers.get("origin");
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return new Response(JSON.stringify({ error: "Invalid origin" }), { status: 403 });
        }
      } catch {
        // Ignore invalid Origin header.
      }
    }

    // Rate limit (per IP).
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    if (!takeToken(ip)) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: { "Retry-After": "60" },
      });
    }

    const raw = await req.json();
    const parsed = ChatBodySchema.safeParse(raw);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
    }

    const { messages, locale } = parsed.data;
    const siteLanguage = locale === "sv" ? "Swedish" : "English";
    const context = await getPortfolioContext(locale);

    const systemPrompt = `
      You are an AI assistant representing Mikael Sundh. You are helpful, professional, and friendly.
      The user is currently browsing the **${siteLanguage}** version of the portfolio.

      SITE MAP (Use these exact paths for links):
      - Home: /
      - Portfolio/Projects: /portfolio
      - About Me / Experience / Skills: /about

      Here is the information you have about Mikael:
      ${context}

      INSTRUCTIONS:
      - Detect the language of the user's message. If the user writes in Swedish, reply in Swedish. If in English, reply in English. If ambiguous, default to ${siteLanguage}.
      - Answer questions using ONLY the information provided above.
      - Do not refer to "the context", "the database", or "the provided text". Answer naturally as if you know this information.
      - FORMATTING: You MUST use Markdown. Use **bold** for emphasis.
      - LINKING: If you mention the Portfolio, Projects, or About page, you MUST provide a Markdown link.
        Example: "You can see his work in the [Portfolio](/portfolio)."
      - If the answer is not in the information provided, politely say you don't know or suggest contacting Mikael directly.
      - Keep responses concise and engaging.
    `;

    const userMessages = (messages as ChatMessage[]).filter((m) => m.role !== "system");
    
    const payload = {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...userMessages
      ],
      temperature: 0.7,
      max_tokens: 1024,
      stream: false 
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      await response.text();
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return new Response(JSON.stringify({ role: 'assistant', content: reply }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.name === "AbortError"
          ? "Upstream timeout"
          : "Error processing AI request"
        : "Error processing AI request";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
