"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const LINKS = [
  { href: "/what-we-do", label: "What we do" },
  { href: "/about", label: "About" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`glass flex w-full max-w-5xl items-center gap-2 rounded-full border px-3 py-2 transition-all duration-500 ${
          scrolled ? "border-edge-strong shadow-[var(--shadow-card)]" : "border-edge"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 pl-1.5 pr-3">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent font-[family-name:var(--font-display)] text-[14px] font-bold text-accent-ink">
            M
          </span>
          <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold tracking-tight">
            Meridian
          </span>
        </Link>

        <div className="ml-1 hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3.5 py-1.5 text-[13.5px] transition-colors ${
                  active ? "bg-surface-2 text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/console"
            className="hidden rounded-full px-3.5 py-1.5 text-[13.5px] text-muted transition-colors hover:text-foreground sm:block"
          >
            Sign in
          </Link>
          <Link href="/console" className="btn btn-primary btn-sm group">
            Launch console
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
