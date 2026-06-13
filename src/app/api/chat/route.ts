import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { TOOLS, executeTool } from "@/lib/ai/tools";

export const maxDuration = 120;

const MODEL = "claude-opus-4-8";
const MAX_ITERATIONS = 6;

const SYSTEM_PROMPT = `You are the intelligence layer of a Growth Intelligence Platform for creator marketing in India. Brands use you to turn "Product X, Budget Y, Goal Z" into ranked creators, campaign plans, and revenue forecasts — decisions backed by data, not follower counts.

You have tools backed by the platform's creator graph, recommendation engine, prediction engine, trend engine, and attribution data. Use them — never invent creators, numbers, or campaign results. All money is INR; use Indian notation (₹5L = ₹500,000; ₹1Cr = ₹10,000,000) when writing amounts.

Working style:
- For "which creators / plan a launch / I need ₹X revenue" requests, call plan_campaign or recommend_creators rather than asking clarifying questions; state the assumptions you made (geo, price) in one line and proceed. Ask only if the budget is missing entirely.
- Lead with the recommendation or the headline number, then the reasoning. Keep responses tight — the UI renders your tool results as tables, so don't repeat every row in prose; call out the top picks, the expected ROAS, and the risks.
- Flag risks honestly: fraud signals, low confidence, concentration, goal shortfalls.
- When forecasts come with confidence bands, mention the range, not just the midpoint.`;

type ClientMessage = { role: "user" | "assistant"; content: string };
export type Artifact = { tool: string; input: Record<string, unknown>; data: unknown };

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: ClientMessage[] };

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      text:
        "The AI layer needs an Anthropic API key. Set `ANTHROPIC_API_KEY` in `.env.local` and restart the server. " +
        "Until then, the Creators, Campaigns, and Trends pages work fully — they query the intelligence engines directly.",
      artifacts: [],
    });
  }

  const client = new Anthropic();
  const history: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const artifacts: Artifact[] = [];

  try {
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 4096,
        thinking: { type: "adaptive" },
        system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        tools: TOOLS,
        messages: history,
      });

      if (response.stop_reason === "tool_use") {
        history.push({ role: "assistant", content: response.content });
        const toolResults: Anthropic.ToolResultBlockParam[] = [];
        for (const block of response.content) {
          if (block.type !== "tool_use") continue;
          try {
            const data = await executeTool(block.name, block.input as Record<string, unknown>);
            artifacts.push({ tool: block.name, input: block.input as Record<string, unknown>, data });
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: JSON.stringify(data),
            });
          } catch (err) {
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: `Tool error: ${err instanceof Error ? err.message : String(err)}`,
              is_error: true,
            });
          }
        }
        history.push({ role: "user", content: toolResults });
        continue;
      }

      if (response.stop_reason === "pause_turn") {
        history.push({ role: "assistant", content: response.content });
        continue;
      }

      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n");
      return NextResponse.json({ text, artifacts });
    }

    return NextResponse.json({
      text: "I ran out of analysis steps before finishing — try narrowing the request.",
      artifacts,
    });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { text: "Anthropic API key is invalid. Check `ANTHROPIC_API_KEY` in `.env.local`.", artifacts: [] },
        { status: 200 }
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { text: "Rate limited by the Anthropic API — wait a moment and retry.", artifacts: [] },
        { status: 200 }
      );
    }
    const message = error instanceof Anthropic.APIError ? `API error ${error.status}: ${error.message}` : String(error);
    return NextResponse.json({ text: `Something went wrong: ${message}`, artifacts }, { status: 200 });
  }
}
