"use client";

import { motion, useReducedMotion } from "motion/react";

// Word-by-word fade-up as the line scrolls into view (Motion staggerChildren).
// Always resolves to fully visible.
export function Manifesto({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <motion.p
      className="mx-auto max-w-4xl text-center font-[family-name:var(--font-display)] text-2xl font-medium leading-[1.5] tracking-tight md:text-4xl md:leading-[1.45]"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ staggerChildren: reduce ? 0 : 0.025 }}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { opacity: reduce ? 1 : 0.12, y: reduce ? 0 : 6 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.p>
  );
}
