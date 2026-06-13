"use client";

import { formatInr, formatCount } from "@/lib/format";
import { Pill, momentumTone } from "@/components/ui";
import { SocialLinks, SocialPreviewMini } from "@/components/social-preview";
import type { PlatformPresence } from "@/lib/db/schema";

export type Artifact = { tool: string; input: Record<string, unknown>; data: unknown };

/* eslint-disable @typescript-eslint/no-explicit-any */

export function ArtifactView({ artifact }: { artifact: Artifact }) {
  const d = artifact.data as any;
  switch (artifact.tool) {
    case "recommend_creators":
    case "search_creators":
      return <CreatorTable rows={d} recommended={artifact.tool === "recommend_creators"} />;
    case "plan_campaign":
      return <PlanView plan={d} />;
    case "predict_campaign":
      return <ForecastView data={d} />;
    case "get_trends":
      return <TrendList rows={d} />;
    case "get_campaign_performance":
      return <PerformanceView data={d} />;
    default:
      return null;
  }
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-edge px-3.5 py-2.5 text-[12px] font-medium text-muted">
        {title}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

const th = "whitespace-nowrap px-3 py-2 text-left text-[11px] font-medium text-faint";
const td = "whitespace-nowrap px-3 py-2.5 text-[12.5px]";

function CreatorTable({ rows, recommended }: { rows: any[]; recommended: boolean }) {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const hasSocials = rows.some((r) => Array.isArray(r.platforms) && r.platforms.length > 0);
  const previews = rows.filter((r) => Array.isArray(r.platforms) && r.platforms.length > 0).slice(0, 4);
  return (
    <div className="space-y-2.5">
      <Box title={recommended ? "Ranked creators" : "Creator graph search"}>
        <table className="w-full">
          <thead className="border-b border-edge">
            <tr>
              <th className={th}>Creator</th>
              <th className={th}>Niche</th>
              <th className={`${th} text-right`}>Followers</th>
              <th className={`${th} text-right`}>Eng%</th>
              {recommended && <th className={`${th} text-right`}>Match</th>}
              {recommended && <th className={`${th} text-right`}>Hist. ROAS</th>}
              {recommended && <th className={`${th} text-right`}>Est. ROAS</th>}
              <th className={`${th} text-right`}>Fee</th>
              {hasSocials && <th className={th}>Socials</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-edge/60">
            {rows.map((r) => (
              <tr key={r.creatorId} className="hover:bg-surface-2/50">
                <td className={td}>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-[11px] text-faint">{r.location}</div>
                </td>
                <td className={td}>
                  <Pill>{r.niche}</Pill>
                </td>
                <td className={`${td} text-right font-mono`}>{formatCount(r.totalFollowers)}</td>
                <td className={`${td} text-right font-mono`}>{r.engagementRate?.toFixed(1)}</td>
                {recommended && (
                  <td className={`${td} text-right`}>
                    <span className={`font-mono font-semibold ${r.matchScore >= 65 ? "text-positive" : r.matchScore >= 45 ? "text-accent" : "text-muted"}`}>
                      {r.matchScore}
                    </span>
                  </td>
                )}
                {recommended && (
                  <td className={`${td} text-right font-mono text-muted`}>
                    {r.historicalRoas != null ? `${r.historicalRoas}x` : "—"}
                  </td>
                )}
                {recommended && (
                  <td className={`${td} text-right font-mono`}>
                    {r.forecastAtStandardRate ? `${r.forecastAtStandardRate.roas}x` : "—"}
                  </td>
                )}
                <td className={`${td} text-right font-mono`}>{formatInr(r.feeInr)}</td>
                {hasSocials && (
                  <td className={td}>
                    {Array.isArray(r.platforms) && r.platforms.length > 0 ? (
                      <SocialLinks platforms={r.platforms as PlatformPresence[]} />
                    ) : null}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      {previews.length > 0 && (
        <Box title="Profile previews">
          <div className="grid gap-2 p-2 sm:grid-cols-2">
            {previews.map((r) => (
              <SocialPreviewMini
                key={r.creatorId}
                creatorId={r.creatorId}
                name={r.name}
                platforms={r.platforms as PlatformPresence[]}
              />
            ))}
          </div>
        </Box>
      )}
    </div>
  );
}

function FunnelStats({ f }: { f: any }) {
  const items = [
    ["Reach", formatCount(f.reach)],
    ["Clicks", formatCount(f.clicks)],
    ["Conversions", formatCount(f.conversions)],
    ["Revenue", formatInr(f.revenueInr)],
    ["ROAS", `${f.roas}x`],
  ];
  return (
    <div className="grid grid-cols-5 divide-x divide-edge">
      {items.map(([label, value]) => (
        <div key={label} className="px-3 py-2.5">
          <div className="text-[11px] text-faint">{label}</div>
          <div className="mt-0.5 font-mono text-[15px] font-semibold">{value}</div>
        </div>
      ))}
    </div>
  );
}

function PlanView({ plan }: { plan: any }) {
  if (!plan?.forecast) return null;
  return (
    <div className="space-y-2">
      <Box title="Expected outcomes">
        <FunnelStats f={plan.forecast} />
        <div className="border-t border-edge px-3 py-2 text-[11.5px] text-muted">
          Range: <span className="font-mono">{formatInr(plan.forecast.low.revenueInr)}</span> to{" "}
          <span className="font-mono">{formatInr(plan.forecast.high.revenueInr)}</span> revenue · confidence{" "}
          <span className="font-mono">{Math.round(plan.forecast.confidence * 100)}%</span>
          {plan.goalCoverage != null && (
            <>
              {" "}· goal coverage{" "}
              <span className={`font-mono ${plan.goalCoverage >= 100 ? "text-positive" : plan.goalCoverage >= 80 ? "text-accent" : "text-negative"}`}>
                {plan.goalCoverage}%
              </span>
            </>
          )}
        </div>
      </Box>
      <Box title={`Budget allocation · ${formatInr(plan.totalSpendInr)} deployed, ${formatInr(plan.remainingBudgetInr)} reserve`}>
        <table className="w-full">
          <thead className="border-b border-edge">
            <tr>
              <th className={th}>Creator</th>
              <th className={th}>Niche</th>
              <th className={`${th} text-right`}>Match</th>
              <th className={`${th} text-right`}>Fee</th>
              <th className={`${th} text-right`}>Est. Revenue</th>
              <th className={`${th} text-right`}>Est. ROAS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge/60">
            {plan.allocations.map((a: any) => (
              <tr key={a.creatorId} className="hover:bg-surface-2/50">
                <td className={`${td} font-medium`}>{a.name}</td>
                <td className={td}><Pill>{a.niche}</Pill></td>
                <td className={`${td} text-right font-mono`}>{a.matchScore}</td>
                <td className={`${td} text-right font-mono`}>{formatInr(a.feeInr)}</td>
                <td className={`${td} text-right font-mono`}>{formatInr(a.forecast.revenueInr)}</td>
                <td className={`${td} text-right font-mono`}>{a.forecast.roas}x</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      {plan.risks?.length > 0 && (
        <div className="rounded-lg border border-negative/25 bg-negative/5 px-3 py-2.5">
          <div className="text-[11.5px] font-medium text-negative">Risks</div>
          <ul className="mt-1.5 space-y-1 text-[12.5px] text-muted">
            {plan.risks.map((r: string, i: number) => (
              <li key={i}>· {r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ForecastView({ data }: { data: any }) {
  if (!data?.aggregate) return null;
  return (
    <div className="space-y-2">
      <Box title="Aggregate forecast">
        <FunnelStats f={data.aggregate} />
        <div className="border-t border-edge px-3 py-2 text-[11.5px] text-muted">
          Range: <span className="font-mono">{data.aggregate.low.roas}x to {data.aggregate.high.roas}x</span> ROAS ·
          confidence <span className="font-mono">{Math.round(data.aggregate.confidence * 100)}%</span>
        </div>
      </Box>
      <Box title="Per-creator forecast">
        <table className="w-full">
          <thead className="border-b border-edge">
            <tr>
              <th className={th}>Creator</th>
              <th className={`${th} text-right`}>Spend</th>
              <th className={`${th} text-right`}>Reach</th>
              <th className={`${th} text-right`}>Conversions</th>
              <th className={`${th} text-right`}>Revenue</th>
              <th className={`${th} text-right`}>ROAS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge/60">
            {data.perCreator.map((p: any) => (
              <tr key={p.creatorId} className="hover:bg-surface-2/50">
                <td className={`${td} font-medium`}>{p.name}</td>
                <td className={`${td} text-right font-mono`}>{formatInr(p.spendInr)}</td>
                <td className={`${td} text-right font-mono`}>{formatCount(p.forecast.reach)}</td>
                <td className={`${td} text-right font-mono`}>{formatCount(p.forecast.conversions)}</td>
                <td className={`${td} text-right font-mono`}>{formatInr(p.forecast.revenueInr)}</td>
                <td className={`${td} text-right font-mono`}>{p.forecast.roas}x</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </div>
  );
}

function TrendList({ rows }: { rows: any[] }) {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return (
    <Box title="Trend opportunities">
      <div className="divide-y divide-edge/60">
        {rows.slice(0, 6).map((t) => (
          <div key={t.id} className="px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-accent">{t.opportunityScore}</span>
              <span className="text-[13px] font-medium">{t.topic}</span>
              <Pill tone={momentumTone(t.momentum)}>{t.momentum}</Pill>
              <span className="ml-auto font-mono text-[11px] text-faint">+{t.growthRateWoW}% WoW</span>
            </div>
            <div className="mt-1 text-[12px] text-muted">{t.description}</div>
            {t.ridingCreators?.length > 0 && (
              <div className="mt-1 text-[11px] text-faint">
                Positioned: {t.ridingCreators.map((c: any) => c.name).join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </Box>
  );
}

function PerformanceView({ data }: { data: any }) {
  if (!data?.summary) return null;
  const s = data.summary;
  return (
    <div className="space-y-2">
      <Box title="Platform summary">
        <div className="grid grid-cols-5 divide-x divide-edge">
          {[
            ["Completed", s.campaignsCompleted],
            ["Active", s.campaignsActive],
            ["Spend", formatInr(s.totalSpendInr)],
            ["Attributed Rev", formatInr(s.totalAttributedRevenueInr)],
            ["Blended ROAS", s.blendedRoas ? `${s.blendedRoas}x` : "—"],
          ].map(([label, value]) => (
            <div key={String(label)} className="px-3 py-2.5">
              <div className="text-[11px] text-faint">{label}</div>
              <div className="mt-0.5 font-mono text-[15px] font-semibold">{value}</div>
            </div>
          ))}
        </div>
      </Box>
      <Box title="Creator track records">
        <table className="w-full">
          <thead className="border-b border-edge">
            <tr>
              <th className={th}>Creator</th>
              <th className={th}>Niche</th>
              <th className={`${th} text-right`}>Campaigns</th>
              <th className={`${th} text-right`}>Fees</th>
              <th className={`${th} text-right`}>Revenue</th>
              <th className={`${th} text-right`}>Avg ROAS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge/60">
            {data.creatorTrackRecords.slice(0, 8).map((r: any) => (
              <tr key={r.creatorId} className="hover:bg-surface-2/50">
                <td className={`${td} font-medium`}>{r.name}</td>
                <td className={td}><Pill>{r.niche}</Pill></td>
                <td className={`${td} text-right font-mono`}>{r.campaignsRun}</td>
                <td className={`${td} text-right font-mono`}>{formatInr(r.totalFeesInr)}</td>
                <td className={`${td} text-right font-mono`}>{formatInr(r.totalRevenueInr)}</td>
                <td className={`${td} text-right font-mono ${r.avgRoas >= 3 ? "text-positive" : ""}`}>{r.avgRoas}x</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </div>
  );
}
