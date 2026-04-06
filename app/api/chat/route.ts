import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are a helpful AI assistant for Velten Digital, a premium AI & Automation agency.
Help visitors understand services and pricing. Be concise, friendly, and professional.

Services:
- Websites & Landing Pages: modern, conversion-focused sites
- AI Chat Support: AI-powered support for FAQs and lead qualification
- Telegram Bots: communication, lead capture, notifications
- Business Automation (n8n): CRM, email, forms, integrations
- Data Analytics & Dashboards: KPI tracking, reports, BI

Pricing:
- Starter: website + hosting + SEO + analytics — from 10 000 UAH / €220
- Growth: Starter + AI Chat + Telegram Bot — 15 000–20 000 UAH / €330–€440
- Pro: Growth + n8n + data analysis + custom AI — from 30 000 UAH / €660+

Keep answers under 3 sentences. Always invite the visitor to reach out via the contact form or Telegram.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  // Last message is the current user input
  const lastMessage = messages[messages.length - 1];

  // Build history from all previous messages
  const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT
  });

  const chat = model.startChat({
    history,
    generationConfig: { maxOutputTokens: 512 }
  });

  try {
    const result = await chat.sendMessageStream(lastMessage.content);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      }
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache"
      }
    });
  } catch (err) {
    console.error("[chat route error]", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
