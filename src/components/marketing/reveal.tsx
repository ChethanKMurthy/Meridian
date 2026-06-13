"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

// On-scroll entrance via IntersectionObserver (Motion whileInView).
// Always settles to the visible state — it can never get stuck hidden the way
// a misfiring ScrollTrigger `from()` can.
export function Reveal({
  children,
  className,
  y = 28,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
