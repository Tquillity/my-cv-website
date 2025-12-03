import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getPortfolioContext } from "@/lib/ai-context";

// Configure Groq Provider
const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const context = await getPortfolioContext();

    const result = await streamText({
      model: groq("llama3-8b-8192"),
      system: `
        You are an AI assistant for Mikael Sundh's portfolio website.
        Your goal is to answer questions about Mikael's experience, projects, and skills.
        
        Here is the context about Mikael:
        ${context}
        
        Rules:
        - Answer ONLY based on the provided context.
        - If the user asks about something not in the context, say "I don't have information about that in Mikael's portfolio."
        - Be professional, concise, and friendly.
        - Do not hallucinate or make up facts.
      `,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("AI Error:", error);
    return new Response("Error processing AI request", { status: 500 });
  }
}
