import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Reveal } from "@/components/marketing/reveal";
import { Manifesto } from "@/components/marketing/manifesto";

export const metadata: Metadata = {
  title: "About Meridian",
  description:
    "Why creator marketing needs a decision engine, not another marketplace.",
};

const OLD_WAY = ["Followers", "Engagement", "Personal relationships", "Agencies", "Guesswork"];
const NEW_WAY = [
  "Audience quality",
  "Historical outcomes",
  "Behavioral similarity",
  "Product fit",
  "Predicted conversions",
  "Predicted revenue",
];

function Pill({ seed }: { seed: string }) {
  return (
    <span
      className="mx-1.5 inline-block h-[0.85em] w-16 translate-y-[0.06em] rounded-full bg-cover bg-center align-middle ring-2 ring-white shadow-[var(--shadow-sm)] md:w-24"
      style={{ backgroundImage: `url(https://picsum.photos/seed/${seed}/240/120)` }}
      aria-hidden
    />
  );
}

export default function AboutPage() {
  return (
    <>
      {/* Inline-typography-image hero statement */}
      <Section className="pt-40 md:pt-56">
        <Reveal>
          <span className="mb-6 inline-flex items-center rounded-full border border-edge bg-surface-2 px-3 py-1 text-[12px] font-semibold text-accent">
            About Meridian
          </span>
          <h1 className="max-w-5xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.12] tracking-tight md:text-6xl">
            We connect the creators
            <Pill seed="meridian-face-1" /> who move
            <Pill seed="meridian-crowd-1" /> audiences toward the revenue
            <Pill seed="meridian-chart-1" /> a brand actually needs.
          </h1>
          <p className="mt-8 max-w-2xl text-[16px] leading-relaxed text-muted md:text-[18px]">
            Meridian is a Growth Intelligence Platform. We exist to turn creator
            marketing from a relationship-driven process into a data-driven decision
            system. Think Bloomberg and Palantir for creator growth, not another Fiverr.
          </p>
        </Reveal>
      </Section>

      {/* The thesis: old way vs new way */}
      <Section className="pt-0 md:pt-0">
        <Reveal className="mb-12">
          <SectionHeading
            kicker="The thesis"
            title="Today, creator marketing is decided on the wrong inputs."
            blurb="Brands pick creators on visibility and rapport. We think the decision should rest on evidence: what the audience is, what the creator has actually sold, and what a campaign will return."
          />
        </Reveal>
        <Reveal y={36}>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="card p-7">
              <div className="text-[12px] font-semibold text-faint">
                Decided on today
              </div>
              <ul className="mt-5 space-y-3">
                {OLD_WAY.map((w) => (
                  <li key={w} className="flex items-center gap-3 text-[15px] text-muted">
                    <span className="h-px w-5 bg-edge-strong" />
                    <span className="line-through decoration-faint/60">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.25rem] border border-accent/30 bg-accent-soft p-7 shadow-[var(--shadow-card)]">
              <div className="text-[12px] font-semibold text-accent">
                Decided on with Meridian
              </div>
              <ul className="mt-5 space-y-3">
                {NEW_WAY.map((w) => (
                  <li key={w} className="flex items-center gap-3 text-[15px] text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Manifesto scrub */}
      <Section>
        <Manifesto text="The goal is a brand that stops asking which influencer to hire, and starts saying it needs five crore in additional revenue next quarter, then trusts the platform to determine which creators, which audiences, and which campaigns make that probable." />
      </Section>

      {/* What we are / are not */}
      <Section className="pt-0 md:pt-0">
        <Reveal className="mb-12">
          <SectionHeading
            title="An operating system for creator-driven growth"
          />
        </Reveal>
        <Reveal y={32}>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                t: "Not a marketplace",
                b: "We do not sell access to a creator list. We decide which creators generate the outcome you are paying for.",
              },
              {
                t: "Not a CRM",
                b: "We are not a place to manage relationships. We are the layer that predicts and measures business results.",
              },
              {
                t: "A decision engine",
                b: "A system that makes creator marketing measurable, predictable, and optimizable. A real growth channel.",
              },
            ].map((c) => (
              <div key={c.t} className="card card-interactive p-7">
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight">
                  {c.t}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-muted">{c.b}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* CTA */}
      <Section className="pt-0 md:pt-0">
        <Reveal>
          <div className="grad-mesh relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[2rem] border border-edge p-10 md:flex-row md:items-center md:p-14">
            <h2 className="max-w-xl font-[family-name:var(--font-display)] text-3xl font-semibold leading-[1.1] tracking-tight md:text-4xl">
              See the thesis run on a real brief.
            </h2>
            <Link href="/console" className="btn btn-primary btn-lg group shrink-0">
              Launch the console
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
