import Link from "next/link";
import { ArrowRight, Network, LineChart, Crosshair, Radar } from "lucide-react";

// Gapless 6-col bento (3x2 + 3x1 + 3x1 + 6x1 = 18 cells), grid-flow-dense.
export function Bento() {
  return (
    <div className="grid auto-rows-[minmax(0,1fr)] grid-flow-dense grid-cols-1 gap-3 md:grid-cols-6 md:[grid-auto-rows:200px]">
      {/* Creator graph — large feature cell */}
      <Link
        href="/creators"
        className="card card-interactive group relative col-span-1 overflow-hidden md:col-span-3 md:row-span-2"
      >
        <div className="absolute inset-0 bg-[linear-gradient(150deg,#eaf0ff,#f7eaff_55%,#fff6e6)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.5]" viewBox="0 0 400 400" aria-hidden>
          {Array.from({ length: 14 }).map((_, i) => {
            const x = (i * 97) % 400;
            const y = (i * 151) % 400;
            return <circle key={i} cx={x} cy={y} r={2.5} fill="var(--blue)" opacity={0.5} />;
          })}
          <path d="M40 80 L180 150 L320 60 M180 150 L240 300 L90 320" stroke="var(--violet)" strokeWidth={1.2} fill="none" opacity={0.4} />
        </svg>
        <div className="relative flex h-full flex-col justify-between p-6">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-accent shadow-[var(--shadow-sm)]">
            <Network size={20} />
          </span>
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
              The creator graph
            </h3>
            <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-muted">
              Creators, audiences, products, campaigns, and trends, connected as one
              relationship-first graph. The asset every other engine reads from.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-accent">
              Explore creators <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Link>

      {/* Prediction */}
      <div className="card card-interactive relative col-span-1 overflow-hidden p-6 md:col-span-3">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-yellow/20 blur-2xl" />
        <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-yellow/15 text-[#b8860b]">
          <LineChart size={19} />
        </span>
        <h3 className="relative mt-4 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight">
          Prediction engine
        </h3>
        <p className="relative mt-1.5 text-[13px] leading-relaxed text-muted">
          Reach, conversions, revenue, and ROAS, forecast with confidence bands before a
          single rupee is committed.
        </p>
      </div>

      {/* Attribution */}
      <div className="card card-interactive relative col-span-1 overflow-hidden p-6 md:col-span-3">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-pink/15 blur-2xl" />
        <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-pink/12 text-pink">
          <Crosshair size={19} />
        </span>
        <h3 className="relative mt-4 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight">
          Attribution that closes the loop
        </h3>
        <p className="relative mt-1.5 text-[13px] leading-relaxed text-muted">
          Every completed campaign feeds realized ROAS back into the rankings. Each launch
          makes the next forecast sharper.
        </p>
      </div>

      {/* Trends — wide */}
      <Link href="/trends" className="card card-interactive group relative col-span-1 overflow-hidden md:col-span-6">
        <div className="grad-mesh absolute inset-0 opacity-90" />
        <div className="relative flex h-full flex-col justify-between gap-6 p-6 md:flex-row md:items-center">
          <div className="max-w-md">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-accent shadow-[var(--shadow-sm)]">
              <Radar size={19} />
            </span>
            <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight">
              Catch the trend before the category does
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
              Attention velocity, ranked. See where audiences are moving and which creators
              are already positioned to ride it.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-accent shadow-[var(--shadow-sm)]">
            Open the trend radar <ArrowRight size={14} />
          </span>
        </div>
      </Link>
    </div>
  );
}
