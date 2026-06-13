"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Terminal,
  Users,
  Megaphone,
  TrendingUp,
  ArrowUpLeft,
} from "lucide-react";

const LINKS = [
  { href: "/console", label: "Command", icon: Terminal },
  { href: "/creators", label: "Creators", icon: Users },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/trends", label: "Trends", icon: TrendingUp },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-edge bg-surface-2">
      <Link href="/" className="group block px-5 py-6">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-accent font-[family-name:var(--font-display)] text-[13px] font-bold text-accent-ink">
            M
          </span>
          <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold tracking-tight">
            Meridian
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1 pl-0.5 text-[12px] text-faint transition-colors group-hover:text-muted">
          <ArrowUpLeft size={12} /> Back to site
        </div>
      </Link>

      <nav className="mt-3 flex flex-col gap-1 px-3">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition-colors ${
                active
                  ? "bg-surface-2 text-foreground"
                  : "text-muted hover:bg-surface-2/60 hover:text-foreground"
              }`}
            >
              <Icon size={16} className={active ? "text-accent" : "text-faint"} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-5 py-5">
        <div className="rounded-xl border border-edge bg-white px-3.5 py-3 shadow-[var(--shadow-sm)]">
          <div className="flex items-center gap-2 text-[12.5px] font-medium text-foreground">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-positive" />
            Creator graph live
          </div>
          <div className="mt-1 text-[12px] text-faint">20 creators, 8 campaigns</div>
        </div>
      </div>
    </aside>
  );
}
