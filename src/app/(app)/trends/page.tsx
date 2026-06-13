import Link from "next/link";
import { getTrendOpportunities } from "@/lib/engines/trends";
import { formatCount } from "@/lib/format";
import { PageHeader, Pill, momentumTone } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function TrendsPage() {
  const opportunities = await getTrendOpportunities();

  return (
    <div>
      <PageHeader
        title="Trend Intelligence"
        subtitle="Where consumer attention is moving, ranked by opportunity, before competitors see it"
      />
      <div className="grid gap-4 px-8 py-6 lg:grid-cols-2">
        {opportunities.map((t) => (
          <div key={t.id} className="card p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-edge-strong bg-surface-2 font-mono text-[15px] font-bold text-accent">
                {t.opportunityScore}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[14px] font-medium">{t.topic}</span>
                  <Pill tone={momentumTone(t.momentum)}>{t.momentum}</Pill>
                  <Pill>{t.category}</Pill>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{t.description}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-5 border-t border-edge pt-3 font-mono text-[11.5px] text-muted">
              <span>
                velocity <span className="text-foreground">{t.velocity}</span>
              </span>
              <span className={t.growthRateWoW >= 15 ? "text-positive" : ""}>+{t.growthRateWoW}% WoW</span>
              <span className={t.sentiment >= 0 ? "text-positive" : "text-negative"}>
                {t.sentiment >= 0 ? "+" : ""}
                {t.sentiment.toFixed(2)} sentiment
              </span>
              <span className="ml-auto text-faint">{t.topGeos.slice(0, 3).join(" · ")}</span>
            </div>
            {t.ridingCreators.length > 0 && (
              <div className="mt-2.5 text-[12px] text-faint">
                Positioned creators:{" "}
                {t.ridingCreators.map((c, i) => (
                  <span key={c.id}>
                    {i > 0 && ", "}
                    <Link href={`/creators/${c.id}`} className="text-muted hover:text-accent">
                      {c.name}
                    </Link>{" "}
                    <span className="font-mono">({formatCount(c.totalFollowers)})</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
