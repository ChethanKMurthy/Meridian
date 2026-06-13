"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowUp, Sparkles, Users, TrendingUp, LineChart, Crosshair } from "lucide-react";
import { ArtifactView, type Artifact } from "@/components/artifacts";

type Message = {
  role: "user" | "assistant";
  content: string;
  artifacts?: Artifact[];
};

const SUGGESTIONS = [
  {
    icon: Crosshair,
    title: "Plan a launch",
    prompt: "Launch a new protein supplement in South India with a budget of ₹20L",
  },
  {
    icon: LineChart,
    title: "Hit a revenue goal",
    prompt: "I need ₹50L in revenue from a skincare campaign. Budget ₹15L. Who do I work with?",
  },
  {
    icon: Users,
    title: "Find proven sellers",
    prompt: "Which creators have actually driven revenue for us?",
  },
  {
    icon: TrendingUp,
    title: "Read the market",
    prompt: "Where is consumer attention moving in fitness right now?",
  },
];

export function Console() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.text ?? "No response.", artifacts: data.artifacts ?? [] },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Request failed. Check that the dev server is still running." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex h-full flex-col">
      <div className="ambient pointer-events-none absolute inset-x-0 top-0 h-64 opacity-60" />

      <div className="relative flex-1 overflow-y-auto px-6 py-8 md:px-10">
        {messages.length === 0 ? (
          <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center text-center">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-accent-ink">
              <Sparkles size={20} />
            </span>
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
              What outcome do you need?
            </h1>
            <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-muted">
              Describe a product, a budget, and a goal. Meridian ranks the creators,
              allocates the budget, and forecasts the revenue before you spend a rupee.
            </p>
            <div className="mt-9 grid w-full gap-3 sm:grid-cols-2">
              {SUGGESTIONS.map(({ icon: Icon, title, prompt }) => (
                <button
                  key={title}
                  onClick={() => send(prompt)}
                  className="card card-interactive group p-4 text-left"
                >
                  <Icon size={17} className="text-accent" />
                  <div className="mt-3 text-[13.5px] font-medium text-foreground">{title}</div>
                  <div className="mt-1 text-[12.5px] leading-relaxed text-muted">{prompt}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-7">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-md bg-surface-2 px-4 py-2.5 text-[14px] leading-relaxed">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                      <Sparkles size={13} />
                    </span>
                    <div className="whitespace-pre-wrap pt-0.5 text-[14px] leading-relaxed text-foreground/90">
                      {m.content}
                    </div>
                  </div>
                  {m.artifacts?.map((a, j) => (
                    <div key={j} className="ml-9">
                      <ArtifactView artifact={a} />
                    </div>
                  ))}
                </div>
              )
            )}
            {busy && (
              <div className="flex items-center gap-3 text-[13.5px] text-muted">
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-accent/15 text-accent">
                  <Sparkles size={13} className="pulse-dot" />
                </span>
                Running the engines over the creator graph
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="relative border-t border-edge bg-surface/40 px-6 py-4 md:px-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="mx-auto flex max-w-3xl items-center gap-2 rounded-2xl border border-edge bg-surface px-3 py-2 transition-colors focus-within:border-edge-strong"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Product, budget, goal. e.g. Protein bar, ₹20L budget, ₹1Cr revenue, India"
            className="flex-1 bg-transparent px-2 py-1.5 text-[14px] outline-none placeholder:text-faint"
            disabled={busy}
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="btn btn-primary !p-2.5"
            aria-label="Send"
          >
            <ArrowUp size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
