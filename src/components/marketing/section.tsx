import type { ReactNode } from "react";

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`px-6 py-28 md:px-10 md:py-44 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHeading({
  kicker,
  title,
  blurb,
  align = "left",
}: {
  kicker?: string;
  title: ReactNode;
  blurb?: string;
  align?: "left" | "center";
}) {
  const alignCls = align === "center" ? "items-center text-center mx-auto" : "items-start";
  return (
    <div className={`flex max-w-3xl flex-col ${alignCls}`}>
      {kicker && (
        <span className="mb-4 inline-flex items-center rounded-full border border-edge bg-surface-2 px-3 py-1 text-[12px] font-semibold text-accent">
          {kicker}
        </span>
      )}
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
        {title}
      </h2>
      {blurb && (
        <p
          className={`mt-5 max-w-xl text-[15px] leading-relaxed text-muted md:text-[16px] ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {blurb}
        </p>
      )}
    </div>
  );
}
