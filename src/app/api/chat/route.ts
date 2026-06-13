import OpenAI from "openai";
import { NextResponse } from "next/server";
import { TOOLS, executeTool } from "@/lib/ai/tools";

export const maxDuration = 60;

// Groq exposes an OpenAI-compatible API. Set GROQ_API_KEY in .env.local.
const MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
const MAX_ITERATIONS = 6;

const SYSTEM_PROMPT = `You are the intelligence layer of a Growth Intelligence Platform for creator marketing in India. Brands use you to turn "Product X, Budget Y, Goal Z" into ranked creators, campaign plans, and revenue forecasts, backed by data, not follower counts.

You have tools backed by the platform's creator graph, recommendation engine, prediction engine, trend engine, and attribution data. Use them. Never invent creators, numbers, or campaign results. All money is INR; use Indian notation (₹5L = ₹500,000; ₹1Cr = ₹10,000,000) when writing amounts.

Working style:
- For "which creators / plan a launch / I need ₹X revenue" requests, call plan_campaign or recommend_creators rather than asking clarifying questions; state the assumptions you made (geo, price) in one line and proceed. Ask only if the budget is missing entirely.
- Lead with the recommendation or the headline number, then the reasoning. Keep responses tight; the UI renders your tool results as tables, so do not repeat every row in prose. Call out the top picks, the expected ROAS, and the risks.
- Flag risks honestly: low confidence, concentration, goal shortfalls.
- When forecasts come with confidence bands, mention the range, not just the midpoint.`;

type ClientMessage = { role: "user" | "assistant"; content: string };
export type Artifact = { tool: string; input: Record<string, unknown>; data: unknown };

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: ClientMessage[] };

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({
      text:
        "The AI console needs a Groq API key. Add `GROQ_API_KEY` to `.env.local` (get a free key at console.groq.com) and restart the server. " +
        "Until then, the Creators, Campaigns, and Trends pages work fully, they query the intelligence engines directly.",
      artifacts: [],
    });
  }

  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const history: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const artifacts: Artifact[] = [];

  try {
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const response = await client.chat.completions.create({
        model: MODEL,
        temperature: 0.4,
        max_tokens: 2048,
        messages: history,
        tools: TOOLS,
        tool_choice: "auto",
      });

      const choice = response.choices[0];
      const msg = choice.message;

      if (msg.tool_calls && msg.tool_calls.length > 0) {
        history.push(msg);
        for (const call of msg.tool_calls) {
          if (call.type !== "function") continue;
          const name = call.function.name;
          let result: unknown;
          try {
            const input = call.function.arguments ? JSON.parse(call.function.arguments) : {};
            result = await executeTool(name, input);
            artifacts.push({ tool: name, input, data: result });
            history.push({
              role: "tool",
              tool_call_id: call.id,
              content: JSON.stringify(result),
            });
          } catch (err) {
            history.push({
              role: "tool",
              tool_call_id: call.id,
              content: `Tool error: ${err instanceof Error ? err.message : String(err)}`,
            });
          }
        }
        continue;
      }

      return NextResponse.json({ text: msg.content ?? "", artifacts });
    }

    return NextResponse.json({
      text: "I ran out of analysis steps before finishing. Try narrowing the request.",
      artifacts,
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { text: "Groq API key is invalid. Check `GROQ_API_KEY` in `.env.local`.", artifacts: [] },
          { status: 200 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { text: "Rate limited by Groq. Wait a moment and retry.", artifacts: [] },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { text: `API error ${error.status}: ${error.message}`, artifacts },
        { status: 200 }
      );
    }
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ text: `Something went wrong: ${message}`, artifacts }, { status: 200 });
  }
}
