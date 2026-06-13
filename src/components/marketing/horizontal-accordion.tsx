"use client";

import { useState } from "react";
import { Network, Sparkles, LineChart, Crosshair, Radar } from "lucide-react";

type Panel = {
  id: string;
  title: string;
  body: string;
  icon: typeof Network;
  grad: string;
  tint: string;
};

const PANELS: Panel[] = [
  {
    id: "graph",
    title: "Creator Intelligence",
    body: "Ingest, enrich, and standardize every creator into a structured profile: content history, audience, pricing, and realized performance.",
    icon: Network,
    grad: "linear-gradient(160deg,#eaf0ff,#dce8ff)",
    tint: "var(--blue)",
  },
  {
    id: "audience",
    title: "Audience Intelligence",
    body: "Understand audiences better than the creators themselves: demographics, affinities, purchase intent, and fraud, scored rather than guessed.",
    icon: Sparkles,
    grad: "linear-gradient(160deg,#ffeef5,#ffe0ec)",
    tint: "var(--pink)",
  },
  {
    id: "recommend",
    title: "Recommendation",
    body: "Given product, budget, and goal, rank the creators who maximize expected business outcome, with match, confidence, and audience-fit scores.",
    icon: Crosshair,
    grad: "linear-gradient(160deg,#fff6e0,#ffefc4)",
    tint: "#b8860b",
  },
  {
    id: "predict",
    title: "Prediction",
    body: "Forecast reach, conversions, revenue, and ROAS before launch, with confidence bands that tighten as the data flywheel turns.",
    icon: LineChart,
    grad: "linear-gradient(160deg,#ece8ff,#ddd6ff)",
    tint: "var(--violet)",
  },
  {
    id: "trends",
    title: "Trend Intelligence",
    body: "Detect where consumer attention is accelerating before competitors see it, and surface the creators already positioned to ride it.",
    icon: Radar,
    grad: "linear-gradient(160deg,#e6fbf3,#d3f6e8)",
    tint: "var(--positive)",
  },
];

export function HorizontalAccordion() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex h-[440px] flex-col gap-3 md:flex-row">
      {PANELS.map((p, i) => {
        const isActive = i === active;
        const Icon = p.icon;
        return (
          <button
            key={p.id}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            className={`group relative flex-1 overflow-hidden rounded-3xl border border-edge text-left shadow-[var(--shadow-card)] transition-all duration-500 ease-out ${
              isActive ? "md:flex-[4]" : "md:flex-[1]"
            }`}
            style={{ background: p.grad }}
            aria-expanded={isActive}
          >
            <div className="relative flex h-full flex-col justify-between p-6">
              <span
                className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-[var(--shadow-sm)]"
                style={{ color: p.tint }}
              >
                <Icon size={20} />
              </span>

              <div>
                <h3
                  className={`font-[family-name:var(--font-display)] font-semibold tracking-tight transition-all duration-500 ${
                    isActive
                      ? "text-2xl text-foreground"
                      : "text-lg text-foreground/70 md:[writing-mode:vertical-rl] md:rotate-180"
                  }`}
                >
                  {p.title}
                </h3>
                <p
                  className={`mt-3 max-w-md text-[13.5px] leading-relaxed text-muted transition-opacity duration-500 ${
                    isActive ? "opacity-100" : "pointer-events-none opacity-0 md:hidden"
                  }`}
                >
                  {p.body}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
