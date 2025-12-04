import { getPortfolioContext } from "@/lib/ai-context";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const context = await getPortfolioContext();

    // Get the last user message
    const userMessage = messages[messages.length - 1]?.content || "";

    const systemPrompt = `
      You are an AI assistant for Mikael Sundh's portfolio.
      Context: ${context}
      
      Answer the user's question based strictly on the context above.
      Be concise and professional.
    `;

    // Direct call to Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages // Pass previous history
        ],
        stream: false // Simplifying to non-streaming for maximum stability
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return new Response(JSON.stringify({ role: 'assistant', content: reply }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("AI Error:", error);
    return new Response(JSON.stringify({ error: "Error processing AI request" }), { status: 500 });
  }
}