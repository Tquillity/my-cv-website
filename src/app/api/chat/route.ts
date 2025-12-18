import { getPortfolioContext } from "@/lib/ai-context";

export const maxDuration = 30;

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    console.error("Missing GROQ_API_KEY");
    return new Response(JSON.stringify({ error: "Server misconfiguration: Missing API Key" }), { status: 500 });
  }

  try {
    const { messages, locale } = await req.json();
    const siteLanguage = locale === 'sv' ? 'Swedish' : 'English';
    const context = await getPortfolioContext();

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

    const userMessages = messages.filter((m: any) => m.role !== 'system');
    
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

    console.log(`Chat request to Groq (Model: ${payload.model})`);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Groq API error (${response.status}):`, errorBody);
      throw new Error(`Groq API error: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return new Response(JSON.stringify({ role: 'assistant', content: reply }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("AI route error:", error);
    return new Response(JSON.stringify({ error: error.message || "Error processing AI request" }), { status: 500 });
  }
}
