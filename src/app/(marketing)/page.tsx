import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/marketing/hero";
import { Marquee } from "@/components/marketing/marquee";
import { Pipeline } from "@/components/marketing/pipeline";
import { ProductDemo } from "@/components/marketing/product-demo";
import { Bento } from "@/components/marketing/bento";
import { Graph3D } from "@/components/marketing/graph-3d";
import { Manifesto } from "@/components/marketing/manifesto";
import { Reveal } from "@/components/marketing/reveal";
import { Section, SectionHeading } from "@/components/marketing/section";

const STATS = [
  { value: "6", label: "Intelligence engines", sub: "graph, recommendation, prediction, attribution, trend, planner", tint: "var(--blue)" },
  { value: "₹0", label: "Spent before certainty", sub: "every campaign is forecast first", tint: "var(--pink)" },
  { value: "1", label: "Question that matters", sub: "what revenue, by when, for what budget", tint: "#b8860b" },
];

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Marquee />

      {/* The connection story, as a scroll-revealed pipeline */}
      <Section>
        <Reveal className="mb-14">
          <SectionHeading
            kicker="How it works"
            title={
              <>
                We connect the brand to the creator who makes money,{" "}
                <span className="grad-text">backed by data at every step.</span>
              </>
            }
          />
        </Reveal>
        <Reveal y={36}>
          <Pipeline />
        </Reveal>
      </Section>

      {/* The product demo */}
      <Section id="demo" className="pt-0 md:pt-0">
        <Reveal className="mb-12">
          <SectionHeading
            title={
              <>
                Watch a brief become a <span className="grad-text">revenue plan</span> in seconds
              </>
            }
            blurb="One sentence in. A ranked creator lineup, budget allocation, and revenue forecast out. This is the console running a real query, live."
          />
        </Reveal>
        <Reveal y={40}>
          <ProductDemo />
        </Reveal>
      </Section>

      {/* Capabilities bento */}
      <Section className="pt-0 md:pt-0">
        <Reveal className="mb-12">
          <SectionHeading
            title="The moat is not the UI. It is what sits underneath it."
            blurb="Discovery tools find creators. Meridian decides which ones generate revenue, and proves it after."
          />
        </Reveal>
        <Reveal y={40}>
          <Bento />
        </Reveal>
      </Section>

      {/* WebGL creator graph */}
      <Section className="pt-0 md:pt-0">
        <Reveal className="mb-12">
          <SectionHeading
            kicker="The graph, in 3D"
            title={
              <>
                Every creator, audience, and outcome is{" "}
                <span className="grad-text">one connected graph.</span>
              </>
            }
            blurb="This is the asset the engines read from. Drag to turn it, and watch the relationships that turn a brief into revenue."
          />
        </Reveal>
        <Reveal y={36}>
          <Graph3D />
        </Reveal>
      </Section>

      {/* Scrubbing manifesto */}
      <Section>
        <Manifesto text="Influencer marketing has run on followers, relationships, and guesswork. We replaced it with audience quality, historical outcomes, and predicted revenue, so a brand stops asking which influencer to hire, and starts asking how much revenue it needs next quarter." />
      </Section>

      {/* Proof / stats */}
      <Section className="pt-0 md:pt-0">
        <Reveal>
          <div className="grid gap-3 md:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="card p-8">
                <div
                  className="font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight md:text-6xl"
                  style={{ color: s.tint }}
                >
                  {s.value}
                </div>
                <div className="mt-3 text-[14px] font-medium text-foreground">{s.label}</div>
                <div className="mt-1 text-[12.5px] leading-relaxed text-faint">{s.sub}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* CTA band */}
      <Section className="pt-0 md:pt-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-edge bg-surface-2 px-8 py-20 text-center md:px-16">
            <div className="grad-mesh absolute inset-0 opacity-80" />
            <div className="relative">
              <h2 className="mx-auto max-w-3xl font-[family-name:var(--font-display)] text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
                Give it a product, a budget, and a number.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-[15px] text-muted">
                The console does the rest: ranked creators, budget allocation, and a revenue
                forecast you can defend.
              </p>
              <Link href="/console" className="btn btn-gradient btn-lg group mt-9">
                Open the console
                <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
