import type { ReactNode } from "react";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="border-b border-edge px-8 py-7">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      {subtitle && <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-muted">{subtitle}</p>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "positive" | "negative" | "accent";
}) {
  const toneClass =
    tone === "positive"
      ? "text-positive"
      : tone === "negative"
        ? "text-negative"
        : tone === "accent"
          ? "text-accent"
          : "text-foreground";
  return (
    <div className="card card-interactive px-4 py-3.5">
      <div className="text-[12px] font-medium text-muted">{label}</div>
      <div className={`mt-1.5 font-mono text-[22px] font-semibold tracking-tight ${toneClass}`}>
        {value}
      </div>
      {hint && <div className="mt-1 text-[11.5px] text-faint">{hint}</div>}
    </div>
  );
}

export function ScoreBar({ score, max = 100 }: { score: number; max?: number }) {
  const p = Math.max(0, Math.min(100, (score / max) * 100));
  const color = p >= 70 ? "bg-positive" : p >= 45 ? "bg-accent" : "bg-negative";
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-3">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${p}%` }} />
      </div>
      <span className="font-mono text-[12px] tabular-nums text-muted">{Math.round(score)}</span>
    </div>
  );
}

export function Pill({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "positive" | "negative" | "accent" | "info";
}) {
  const cls = {
    default: "border-edge-strong bg-surface-2 text-muted",
    positive: "border-positive/25 bg-positive/10 text-positive",
    negative: "border-negative/25 bg-negative/10 text-negative",
    accent: "border-accent/25 bg-accent/10 text-accent",
    info: "border-info/25 bg-info/10 text-info",
  }[tone];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11.5px] font-medium capitalize ${cls}`}
    >
      {children}
    </span>
  );
}

export function Th({ children, right }: { children?: ReactNode; right?: boolean }) {
  return (
    <th
      className={`whitespace-nowrap px-3 py-2.5 text-[12px] font-medium text-faint ${
        right ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

export function Td({ children, right, mono }: { children?: ReactNode; right?: boolean; mono?: boolean }) {
  return (
    <td
      className={`whitespace-nowrap px-3 py-3 text-[13.5px] ${right ? "text-right" : "text-left"} ${
        mono ? "font-mono tabular-nums" : ""
      }`}
    >
      {children}
    </td>
  );
}

export function momentumTone(m: string): "positive" | "accent" | "info" | "negative" {
  if (m === "rising") return "positive";
  if (m === "emerging") return "info";
  if (m === "peaking") return "accent";
  return "negative";
}
