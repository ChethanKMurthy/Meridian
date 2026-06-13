import Link from "next/link";
import { ArrowRight } from "lucide-react";

const COLUMNS = [
  {
    heading: "Platform",
    links: [
      { label: "Command console", href: "/console" },
      { label: "Creator intelligence", href: "/creators" },
      { label: "Campaign attribution", href: "/campaigns" },
      { label: "Trend radar", href: "/trends" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "What we do", href: "/what-we-do" },
      { label: "About", href: "/about" },
      { label: "The thesis", href: "/about" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-edge bg-surface-2 px-6 pt-24 pb-12 md:px-10">
      <div className="ambient pointer-events-none absolute inset-0 opacity-80" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Set the goal.
              <br />
              <span className="grad-text">We find the revenue.</span>
            </h2>
            <Link href="/console" className="btn btn-gradient btn-lg group mt-8">
              Launch the console
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <div className="text-[12px] font-semibold text-foreground">{col.heading}</div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[14px] text-muted transition-colors hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-edge pt-6 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-accent font-[family-name:var(--font-display)] text-[12px] font-bold text-accent-ink">
              M
            </span>
            <span className="font-[family-name:var(--font-display)] text-[14px] font-semibold tracking-tight">Meridian</span>
            <span className="text-[12px] text-faint">Growth Intelligence</span>
          </div>
          <p className="text-[12px] text-faint">A decision engine for creator-driven growth. Not a marketplace.</p>
        </div>
      </div>
    </footer>
  );
}
