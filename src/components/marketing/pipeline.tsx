"use client";

import { motion, useReducedMotion } from "motion/react";
import { Package, Database, Crosshair, IndianRupee, type LucideIcon } from "lucide-react";

type Step = { icon: LucideIcon; title: string; body: string; metric: string; tint: string };

const STEPS: Step[] = [
  {
    icon: Package,
    title: "The brand states a goal",
    body: "Product, budget, geography, and the revenue it needs.",
    metric: "Protein bar, ₹20L, ₹1Cr",
    tint: "var(--blue)",
  },
  {
    icon: Database,
    title: "Our data scores the graph",
    body: "Audience quality, purchase intent, and realized outcomes per creator.",
    metric: "20 creators evaluated",
    tint: "var(--violet)",
  },
  {
    icon: Crosshair,
    title: "Engines match and forecast",
    body: "The creators who maximize expected outcome, ranked with confidence.",
    metric: "2.14x ROAS predicted",
    tint: "var(--pink)",
  },
  {
    icon: IndianRupee,
    title: "Revenue, attributed back",
    body: "Realized results feed the flywheel and sharpen the next forecast.",
    metric: "₹41.6L realized",
    tint: "var(--positive)",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function Pipeline() {
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      {/* connecting line that draws across as the row enters view */}
      <motion.div
        className="absolute left-0 right-0 top-[44px] hidden h-[2px] origin-left bg-[linear-gradient(90deg,var(--blue),var(--violet),var(--pink),var(--yellow))] md:block"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.1, ease }}
      />

      <motion.div
        className="grid gap-5 md:grid-cols-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: reduce ? 0 : 0.18 }}
      >
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.title}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7, ease }}
              className="relative"
            >
              <div
                className="relative z-10 grid h-[88px] w-[88px] place-items-center rounded-3xl border border-edge bg-white shadow-[var(--shadow-card)]"
                style={{ color: s.tint }}
              >
                <Icon size={30} strokeWidth={1.6} />
                <span
                  className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold text-white"
                  style={{ background: s.tint }}
                >
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-[family-name:var(--font-display)] text-[17px] font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{s.body}</p>
              <div
                className="mt-3 inline-flex rounded-full px-3 py-1 font-mono text-[12px] font-medium"
                style={{ background: "color-mix(in oklab, " + s.tint + " 12%, white)", color: s.tint }}
              >
                {s.metric}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
