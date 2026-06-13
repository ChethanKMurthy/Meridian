"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Sparkles } from "lucide-react";

gsap.registerPlugin(useGSAP);

const QUERY = "Launch a protein supplement in South India, budget 20L";

const ROWS = [
  { name: "Arjun Mehta", niche: "fitness", match: 87, roas: "5.1x", fee: "6.5L" },
  { name: "Rohit Deshpande", niche: "fitness", match: 83, roas: "6.3x", fee: "2.2L" },
  { name: "Meghna Joshi", niche: "food", match: 66, roas: "3.1x", fee: "7.0L" },
  { name: "Priya Nair", niche: "fitness", match: 64, roas: "2.4x", fee: "3.8L" },
];

const METRICS = [
  { label: "Reach", to: 4.2, suffix: "M", decimals: 1 },
  { label: "Conversions", to: 1180, suffix: "", decimals: 0 },
  { label: "Revenue", to: 41.6, prefix: "₹", suffix: "L", decimals: 1 },
  { label: "ROAS", to: 2.14, suffix: "x", decimals: 2 },
];

const TOTAL = 10;

export function ProductDemo() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = root.current!.querySelector<HTMLElement>("[data-query]")!;
      const loader = root.current!.querySelector<HTMLElement>("[data-loader]")!;
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", root.current!);
      const metricEls = gsap.utils.toArray<HTMLElement>("[data-metric]", root.current!);
      const metricVals = gsap.utils.toArray<HTMLElement>("[data-metric-val]", root.current!);
      const caret = root.current!.querySelector<HTMLElement>("[data-caret]")!;
      const bar = root.current!.querySelector<HTMLElement>("[data-bar]")!;
      const reply = root.current!.querySelector<HTMLElement>("[data-reply]")!;

      gsap.fromTo(bar, { width: "0%" }, { width: "100%", duration: TOTAL, ease: "none", repeat: -1 });
      gsap.to(caret, { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: "steps(1)" });

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
      tl.set(q, { textContent: "" })
        .set(loader, { autoAlpha: 0 })
        .set(reply, { autoAlpha: 0, y: 8 })
        .set(rows, { autoAlpha: 0, y: 10 })
        .set(metricEls, { autoAlpha: 0, y: 10 })
        .set(metricVals, { textContent: "0" });

      const proxy = { n: 0 };
      tl.to(proxy, {
        n: QUERY.length,
        duration: 1.7,
        ease: "none",
        onUpdate: () => {
          q.textContent = QUERY.slice(0, Math.round(proxy.n));
        },
      });

      tl.to(loader, { autoAlpha: 1, duration: 0.3 }, "+=0.25");
      tl.to(loader, { autoAlpha: 0, duration: 0.3 }, "+=1.0");
      tl.to(reply, { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.1");
      tl.to(rows, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.16 }, "-=0.1");
      tl.to(metricEls, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.1 }, "+=0.2");
      METRICS.forEach((m, i) => {
        const counter = { v: 0 };
        tl.to(
          counter,
          {
            v: m.to,
            duration: 1.0,
            ease: "power2.out",
            onUpdate: () => {
              metricVals[i].textContent =
                (m.prefix ?? "") + counter.v.toFixed(m.decimals) + (m.suffix ?? "");
            },
          },
          i === 0 ? "<" : "<0.08"
        );
      });
      tl.to({}, { duration: 2.4 });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative">
      <div className="overflow-hidden rounded-3xl border border-edge bg-white shadow-[var(--shadow-float)]">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-edge bg-surface-2 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-negative/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-positive/60" />
          <span className="ml-2 font-mono text-[11px] text-faint">meridian.console</span>
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-pink/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-pink">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-pink" />
            Live demo
          </span>
        </div>

        {/* Screen */}
        <div className="relative min-h-[420px] bg-white px-5 py-6 md:px-8">
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-accent-soft px-4 py-2.5 text-left text-[13px] text-foreground">
              <span data-query />
              <span
                data-caret
                className="ml-0.5 inline-block w-[2px] -translate-y-[1px] bg-accent align-middle"
                style={{ height: "1em" }}
              />
            </div>
          </div>

          <div data-loader className="mt-5 flex items-center gap-2 text-[13px] text-muted" style={{ visibility: "hidden" }}>
            <Sparkles size={14} className="pulse-dot text-accent" />
            Running recommendation and prediction engines over the creator graph
          </div>

          <div data-reply className="mt-5" style={{ visibility: "hidden" }}>
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-accent/12 text-accent">
                <Sparkles size={13} />
              </span>
              <p className="pt-0.5 text-[13px] leading-relaxed text-foreground/90">
                Four creators clear the bar for a South India protein launch. Top picks
                below, at an expected blended ROAS of <span className="font-mono font-semibold text-accent">2.14x</span>.
              </p>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-edge">
              <div className="grid grid-cols-[1.6fr_0.8fr_0.7fr_0.7fr] gap-2 border-b border-edge bg-surface-2 px-3 py-1.5 text-[10px] font-medium text-faint">
                <span>Creator</span>
                <span className="text-right">Match</span>
                <span className="text-right">Hist ROAS</span>
                <span className="text-right">Fee</span>
              </div>
              {ROWS.map((r) => (
                <div
                  key={r.name}
                  data-row
                  className="grid grid-cols-[1.6fr_0.8fr_0.7fr_0.7fr] items-center gap-2 border-b border-edge/70 px-3 py-2 text-[12.5px] last:border-0"
                >
                  <div>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-[10px] capitalize text-faint">{r.niche}</div>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-semibold ${r.match >= 65 ? "text-positive" : "text-accent"}`}>
                      {r.match}
                    </span>
                  </div>
                  <div className="text-right font-mono text-muted">{r.roas}</div>
                  <div className="text-right font-mono">₹{r.fee}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-4 divide-x divide-edge overflow-hidden rounded-xl border border-edge bg-surface-2/60">
              {METRICS.map((m) => (
                <div key={m.label} data-metric className="px-3 py-2.5" style={{ visibility: "hidden" }}>
                  <div className="text-[10px] text-faint">{m.label}</div>
                  <div data-metric-val className="mt-0.5 font-mono text-[15px] font-semibold text-foreground">
                    0
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scrubber */}
        <div className="border-t border-edge bg-surface-2 px-4 py-2.5">
          <div className="h-1 w-full overflow-hidden rounded-full bg-surface-3">
            <div data-bar className="h-full rounded-full bg-accent" style={{ width: "0%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
