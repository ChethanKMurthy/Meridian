import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Reveal } from "@/components/marketing/reveal";
import { HorizontalAccordion } from "@/components/marketing/horizontal-accordion";
import { Flywheel } from "@/components/marketing/flywheel";
import { Manifesto } from "@/components/marketing/manifesto";

export const metadata: Metadata = {
  title: "What we do at Meridian",
  description:
    "Six engines turn product, budget, and a revenue goal into ranked creators, forecasts, and measured outcomes.",
};

const PIPELINE = [
  {
    step: "01",
    title: "You state the outcome",
    body: "Product, budget, geography, and a revenue goal. One sentence in the console, no creator lists, no spreadsheets.",
  },
  {
    step: "02",
    title: "The engines decide",
    body: "Recommendation ranks creators on category fit, audience fit, realized performance, quality, and value. Prediction forecasts the funnel down to revenue and ROAS.",
  },
  {
    step: "03",
    title: "The plan comes back",
    body: "A ranked lineup, a budget allocation against your goal, expected revenue with confidence bands, and the risks worth knowing before you sign.",
  },
  {
    step: "04",
    title: "Reality feeds back",
    body: "Attribution compares predicted to actual on every completed campaign. The deltas retrain the rankings, so the next forecast is sharper than the last.",
  },
];

export default function WhatWeDoPage() {
  return (
    <>
      {/* Header */}
      <Section className="pt-40 md:pt-56">
        <Reveal>
          <SectionHeading
            kicker="What we do"
            title={
              <>
                Six engines, one job:{" "}
                <span className="text-accent">turn intent into revenue.</span>
              </>
            }
            blurb="Meridian is not a place to browse creators. It is a decision system that answers a single question: if I have this product, this budget, and this goal, which creators maximize expected business outcome?"
          />
        </Reveal>
      </Section>

      {/* Horizontal accordion of engines */}
      <Section className="pt-0 md:pt-0">
        <Reveal y={40}>
          <HorizontalAccordion />
        </Reveal>
      </Section>

      {/* The pipeline */}
      <Section className="pt-0 md:pt-0">
        <Reveal className="mb-14">
          <SectionHeading
            title="How a single sentence becomes a defensible plan"
          />
        </Reveal>
        <div className="grid gap-3 md:grid-cols-2">
          {PIPELINE.map((p) => (
            <Reveal key={p.step}>
              <div className="card card-interactive h-full p-8">
                <div className="font-mono text-[12px] text-accent">{p.step}</div>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Manifesto scrub */}
      <Section>
        <Manifesto text="Every campaign makes the system stronger. Data becomes performance, performance becomes prediction, prediction becomes better recommendations, and better recommendations become outcomes no competitor starting today can match." />
      </Section>

      {/* Flywheel */}
      <Section className="pt-0 md:pt-0">
        <Reveal className="mb-12">
          <SectionHeading
            title="The defensibility compounds with every launch"
            blurb="The moat is not the interface. It is the loop underneath it, and it only spins one direction."
          />
        </Reveal>
        <Reveal y={36}>
          <Flywheel />
        </Reveal>
      </Section>

      {/* Where it's heading */}
      <Section className="pt-0 md:pt-0">
        <Reveal>
          <div className="grad-mesh relative overflow-hidden rounded-[2rem] border border-edge p-8 md:p-14">
            <div className="ambient absolute inset-0" />
            <div className="relative grid gap-10 md:grid-cols-[1fr_1fr] md:items-center">
              <div>
                <span className="inline-flex items-center rounded-full border border-edge bg-white px-3 py-1 text-[12px] font-semibold text-accent">
                  Where this goes
                </span>
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold leading-[1.1] tracking-tight md:text-4xl">
                  Toward campaigns that run themselves
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">
                  Today the platform plans and forecasts. The trajectory is autonomous
                  execution: state a product, a market, and a revenue goal, and the
                  system finds creators, allocates budget, tracks results, and
                  optimizes spend, with human intervention becoming optional.
                </p>
                <Link href="/console" className="btn btn-primary group mt-7">
                  Try it on a real brief
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
              <div className="space-y-3 font-mono text-[13px]">
                {[
                  ["Input", "Protein bar · ₹20L · ₹1Cr revenue · India"],
                  ["Finds", "creators + audiences"],
                  ["Predicts", "reach → conversions → revenue"],
                  ["Allocates", "budget against the goal"],
                  ["Tracks", "realized ROAS, per creator"],
                  ["Optimizes", "the next campaign"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline gap-3 rounded-xl border border-edge bg-white/80 px-4 py-2.5 backdrop-blur"
                  >
                    <span className="w-20 shrink-0 text-faint">{k}</span>
                    <span className="text-foreground/90">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
