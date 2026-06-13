import { ArrowRight } from "lucide-react";

const STEPS = [
  "Campaign data",
  "Creator performance",
  "Sharper predictions",
  "Better recommendations",
  "Better outcomes",
  "More customers",
  "More data",
];

export function Flywheel() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((s, i) => (
        <div key={s} className="card relative flex items-center gap-3 px-4 py-4">
          <span className="font-mono text-[12px] font-semibold text-accent">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-[14px] font-medium">{s}</span>
          {i < STEPS.length - 1 && (
            <ArrowRight
              size={14}
              className="absolute -bottom-2.5 left-6 rotate-90 text-faint sm:bottom-auto sm:right-[-11px] sm:left-auto sm:top-1/2 sm:-translate-y-1/2 sm:rotate-0"
            />
          )}
        </div>
      ))}
      <div className="flex items-center justify-center rounded-[1.25rem] border border-dashed border-accent/40 bg-accent-soft px-4 py-4 text-center text-[13px] font-semibold text-accent">
        and the loop tightens
      </div>
    </div>
  );
}
