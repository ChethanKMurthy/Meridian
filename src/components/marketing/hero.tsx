"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import { ConnectionFlow } from "@/components/marketing/connection-flow";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-16 md:pt-36">
      <div className="grad-mesh pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-edge-strong to-transparent" />

      <div className="mx-auto max-w-6xl text-center">
        <motion.div {...rise(0)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-edge bg-white/70 px-3.5 py-1.5 text-[12.5px] font-medium text-muted backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-positive pulse-dot" />
          The operating system for creator-driven growth
        </motion.div>

        <motion.h1
          {...rise(0.08)}
          className="mx-auto max-w-5xl font-[family-name:var(--font-display)] font-semibold tracking-[-0.02em]"
          style={{ fontSize: "clamp(2.6rem, 6vw, 5.25rem)", lineHeight: 1.04 }}
        >
          Turn a brand brief into the{" "}
          <span className="grad-text">creators who make money.</span>
        </motion.h1>

        <motion.p {...rise(0.16)} className="mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed text-muted md:text-[17px]">
          State a product, a budget, and a revenue goal. Meridian connects you to the
          exact creators who will hit it, and forecasts the return before you spend a rupee.
        </motion.p>

        <motion.div {...rise(0.24)} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/console" className="btn btn-gradient btn-lg group">
            Launch the console
            <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <a href="#demo" className="btn btn-ghost btn-lg">
            <Play size={15} className="text-accent" />
            Watch the demo
          </a>
        </motion.div>
      </div>

      <div className="mt-14 md:mt-16">
        <ConnectionFlow />
      </div>
    </section>
  );
}
