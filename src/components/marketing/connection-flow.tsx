"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  useReducedMotion,
  animate,
} from "motion/react";
import { Package, Sparkles, IndianRupee } from "lucide-react";

// Traveling data packet along an SVG path (SMIL — resolution independent).
function Packet({ pathId, begin, dur, color }: { pathId: string; begin: string; dur: string; color: string }) {
  return (
    <circle r={5.5} fill={color} style={{ filter: "drop-shadow(0 0 6px rgba(47,107,255,0.7))" }}>
      <animateMotion dur={dur} begin={begin} repeatCount="indefinite" rotate="auto">
        <mpath href={`#${pathId}`} />
      </animateMotion>
    </circle>
  );
}

const FLOW_PATHS = {
  brand: "M236 232 C 330 232 372 250 438 250",
  creator: "M562 250 C 662 250 706 230 788 230",
  revenue: "M840 282 C 840 412 756 500 640 500",
  feedback: "M360 500 C 200 500 120 430 120 292",
};

const CHIPS = [
  { label: "Audience match", value: "87", x: "4%", y: "12%", z: 70, tone: "var(--blue)", cls: "float-mid" },
  { label: "Purchase intent", value: "81", x: "74%", y: "6%", z: 95, tone: "var(--pink)", cls: "float-slow" },
  { label: "Predicted ROAS", value: "2.14x", x: "80%", y: "60%", z: 55, tone: "var(--yellow)", cls: "float-fast" },
];

export function ConnectionFlow() {
  const wrap = useRef<HTMLDivElement>(null);
  const revRef = useRef<SVGTextElement>(null);
  const inViewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(inViewRef, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();

  // Pointer-driven 3D tilt (motion values, never React state).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), { stiffness: 120, damping: 18 });
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 });

  function onMove(e: React.PointerEvent) {
    if (reduce) return;
    const r = wrap.current!.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
  }

  // Revenue counter ticks up once when the scene enters view.
  useEffect(() => {
    if (!inView || !revRef.current) return;
    const node = revRef.current;
    if (reduce) {
      node.textContent = "₹41.6L";
      return;
    }
    const controls = animate(0, 41.6, {
      duration: 1.9,
      delay: 0.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = `₹${v.toFixed(1)}L`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce]);

  return (
    <div ref={inViewRef} className="scene relative mx-auto w-full max-w-4xl">
      <motion.div
        ref={wrap}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="preserve-3d relative"
        style={{ rotateX: reduce ? 0 : rotX, rotateY: reduce ? 0 : rotY }}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Floating data chips at varying depth */}
        {CHIPS.map((c) => (
          <div
            key={c.label}
            className={`${c.cls} absolute z-20 hidden rounded-2xl border border-edge bg-white/90 px-3.5 py-2 shadow-[var(--shadow-card)] backdrop-blur md:block`}
            style={{ left: c.x, top: c.y, transform: `translateZ(${c.z}px)` }}
          >
            <div className="text-[10.5px] font-medium text-faint">{c.label}</div>
            <div className="font-mono text-[16px] font-semibold" style={{ color: c.tone }}>
              {c.value}
            </div>
          </div>
        ))}

        <svg viewBox="0 0 1000 600" className="relative z-10 w-full" role="img" aria-label="Brand connected to creator to revenue through Meridian data">
          <defs>
            <linearGradient id="flow" x1="0" y1="0" x2="1" y2="0.4">
              <stop offset="0%" stopColor="var(--blue)" />
              <stop offset="45%" stopColor="var(--violet)" />
              <stop offset="78%" stopColor="var(--pink)" />
              <stop offset="100%" stopColor="var(--yellow)" />
            </linearGradient>
            <radialGradient id="core" cx="0.4" cy="0.35" r="0.8">
              <stop offset="0%" stopColor="#a9c2ff" />
              <stop offset="55%" stopColor="var(--blue)" />
              <stop offset="100%" stopColor="var(--violet)" />
            </radialGradient>
            <linearGradient id="rev" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#18b074" />
              <stop offset="100%" stopColor="#13a3b8" />
            </linearGradient>
          </defs>

          {/* Connection paths: faint base + animated flowing dashes */}
          {(["feedback", "brand", "creator", "revenue"] as const).map((k) => (
            <g key={k}>
              <path
                id={k}
                d={FLOW_PATHS[k]}
                fill="none"
                stroke="url(#flow)"
                strokeWidth={k === "feedback" ? 2 : 3.5}
                strokeLinecap="round"
                opacity={k === "feedback" ? 0.22 : 0.28}
              />
              <path
                d={FLOW_PATHS[k]}
                fill="none"
                stroke="url(#flow)"
                strokeWidth={k === "feedback" ? 2 : 3.5}
                strokeLinecap="round"
                strokeDasharray={k === "feedback" ? "2 12" : "10 16"}
                opacity={k === "feedback" ? 0.4 : 0.85}
                style={{ animation: `flowDash ${k === "feedback" ? 30 : 22}s linear infinite` }}
              />
            </g>
          ))}

          {/* Traveling data packets */}
          <Packet pathId="brand" begin="0s" dur="1.7s" color="var(--blue)" />
          <Packet pathId="brand" begin="0.85s" dur="1.7s" color="#a9c2ff" />
          <Packet pathId="creator" begin="0.4s" dur="1.7s" color="var(--violet)" />
          <Packet pathId="creator" begin="1.25s" dur="1.7s" color="var(--pink)" />
          <Packet pathId="revenue" begin="0.7s" dur="1.9s" color="var(--pink)" />
          <Packet pathId="revenue" begin="1.6s" dur="1.9s" color="var(--yellow)" />

          {/* Data core: pulse rings + orbiting points */}
          <g style={{ transformOrigin: "500px 250px" }}>
            {[0, 1, 2].map((i) => (
              <circle
                key={i}
                cx={500}
                cy={250}
                r={62}
                fill="none"
                stroke="var(--blue)"
                strokeWidth={2}
                style={{
                  transformOrigin: "500px 250px",
                  animation: `pulseRing 3s ease-out ${i * 1}s infinite`,
                }}
              />
            ))}
          </g>
          <g className="spin-slow" style={{ transformOrigin: "500px 250px" }}>
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return (
                <circle
                  key={i}
                  cx={500 + Math.cos(a) * 46}
                  cy={250 + Math.sin(a) * 46}
                  r={3}
                  fill="var(--violet)"
                  opacity={0.7}
                />
              );
            })}
          </g>
          <circle cx={500} cy={250} r={40} fill="url(#core)" />
          <text x={500} y={246} textAnchor="middle" className="fill-white font-[family-name:var(--font-display)]" fontSize={15} fontWeight={700}>
            Meridian
          </text>
          <text x={500} y={264} textAnchor="middle" className="fill-white/80" fontSize={9.5}>
            data core
          </text>

          {/* Brand node */}
          <g>
            <rect x={86} y={172} width={150} height={120} rx={20} fill="#fff" stroke="var(--border-strong)" strokeWidth={1.5} />
            <rect x={86} y={172} width={150} height={120} rx={20} fill="var(--blue)" opacity={0.05} />
            <foreignObject x={100} y={188} width={48} height={48}>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue/10 text-blue">
                <Package size={18} color="var(--blue)" />
              </div>
            </foreignObject>
            <text x={101} y={258} className="fill-foreground font-[family-name:var(--font-display)]" fontSize={16} fontWeight={700}>
              Brand
            </text>
            <text x={101} y={278} className="fill-[color:var(--muted)]" fontSize={11}>
              Product, budget, goal
            </text>
          </g>

          {/* Creator node */}
          <g>
            <circle cx={840} cy={230} r={52} fill="#fff" stroke="var(--border-strong)" strokeWidth={1.5} />
            <circle cx={840} cy={230} r={52} fill="var(--pink)" opacity={0.06} />
            <foreignObject x={816} y={206} width={48} height={48}>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-pink/10">
                <Sparkles size={18} color="var(--pink)" />
              </div>
            </foreignObject>
            <text x={840} y={306} textAnchor="middle" className="fill-foreground font-[family-name:var(--font-display)]" fontSize={16} fontWeight={700}>
              Creator
            </text>
          </g>

          {/* Revenue node */}
          <g>
            <rect x={360} y={458} width={280} height={84} rx={26} fill="#fff" stroke="var(--border-strong)" strokeWidth={1.5} />
            <rect x={360} y={458} width={280} height={84} rx={26} fill="#18b074" opacity={0.06} />
            <foreignObject x={382} y={482} width={40} height={40}>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-positive/12">
                <IndianRupee size={18} color="var(--positive)" />
              </div>
            </foreignObject>
            <text ref={revRef} x={436} y={498} className="fill-foreground font-mono" fontSize={26} fontWeight={700}>
              ₹0.0L
            </text>
            <text x={436} y={520} className="fill-[color:var(--muted)]" fontSize={11.5}>
              attributed revenue
            </text>
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
