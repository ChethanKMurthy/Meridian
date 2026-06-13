import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { creators, audiences, campaignCreators, campaigns } from "@/lib/db/schema";
import { formatInr, formatCount } from "@/lib/format";
import { StatCard, Pill, Th, Td } from "@/components/ui";
import { SocialCard } from "@/components/social-preview";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = await getDb();
  const [creator] = await db.select().from(creators).where(eq(creators.id, id));
  if (!creator) notFound();

  const [audience] = await db.select().from(audiences).where(eq(audiences.creatorId, id));
  const history = await db
    .select()
    .from(campaignCreators)
    .innerJoin(campaigns, eq(campaignCreators.campaignId, campaigns.id))
    .where(eq(campaignCreators.creatorId, id));

  const completed = history.filter((h) => h.campaign_creators.actual);
  const totalRevenue = completed.reduce((a, h) => a + (h.campaign_creators.actual?.revenueInr ?? 0), 0);
  const totalFees = completed.reduce((a, h) => a + h.campaign_creators.feeInr, 0);
  const avgRoas = totalFees > 0 ? +(totalRevenue / totalFees).toFixed(2) : null;

  return (
    <div>
      <div className="border-b border-edge px-8 py-6">
        <Link href="/creators" className="mb-3 inline-flex items-center gap-1.5 text-[12px] text-muted hover:text-foreground">
          <ArrowLeft size={13} /> Creators
        </Link>
        <div className="flex items-baseline gap-3">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">{creator.name}</h1>
          <Pill>{creator.niche}</Pill>
          <span className="text-[12px] text-faint">{creator.location} · {creator.languages.join(", ")}</span>
        </div>
        <p className="mt-2 max-w-2xl text-[13px] text-muted">{creator.bio}</p>
      </div>

      <div className="space-y-6 px-8 py-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          <StatCard label="Total Reach" value={formatCount(creator.totalFollowers)} />
          <StatCard label="Engagement" value={`${creator.engagementRate.toFixed(1)}%`} />
          <StatCard label="Audience Quality" value={Math.round(creator.audienceQuality)} tone={creator.audienceQuality >= 85 ? "positive" : undefined} />
          <StatCard label="Credibility" value={Math.round(creator.credibilityScore)} />
          <StatCard label="Realized ROAS" value={avgRoas != null ? `${avgRoas}x` : "—"} tone={avgRoas != null && avgRoas >= 3 ? "positive" : undefined} hint={completed.length > 0 ? `${completed.length} campaigns` : "no history"} />
          <StatCard label="Fee" value={formatInr(creator.ratePerCampaignInr)} hint={`fraud risk ${creator.fraudRisk}/100`} tone={creator.fraudRisk >= 10 ? "negative" : undefined} />
        </div>

        {creator.platforms.length > 0 && (
          <div>
            <h2 className="mb-3 text-[13px] font-semibold text-foreground">Social profiles</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {creator.platforms.map((p) => (
                <SocialCard key={p.platform} creatorId={creator.id} p={p} />
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card p-4">
            <h2 className="text-[12px] font-medium text-muted">Content Topics</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {creator.contentTopics.map((t) => (
                <Pill key={t}>{t}</Pill>
              ))}
            </div>
          </div>

          {audience && (
            <div className="card p-4">
              <h2 className="text-[12px] font-medium text-muted">Audience Intelligence</h2>
              <div className="mt-3 grid grid-cols-2 gap-4 text-[13px]">
                <div>
                  <div className="text-[11px] text-faint">Age</div>
                  {Object.entries(audience.ageDistribution).map(([k, v]) => (
                    <div key={k} className="mt-1 flex items-center gap-2">
                      <span className="w-12 font-mono text-[11px] text-muted">{k}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                        <div className="h-full bg-info" style={{ width: `${v}%` }} />
                      </div>
                      <span className="w-8 text-right font-mono text-[11px] text-muted">{v}%</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-[11px] text-faint">Top Geographies</div>
                  {audience.topGeos.map((g) => (
                    <div key={g.city} className="mt-1 flex items-center justify-between">
                      <span className="text-[12px]">{g.city}</span>
                      <span className="font-mono text-[11px] text-muted">{g.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 border-t border-edge pt-3 text-[12px] text-muted">
                <span>
                  M <span className="font-mono">{audience.genderSplit.male}%</span> · F{" "}
                  <span className="font-mono">{audience.genderSplit.female}%</span>
                </span>
                <span>
                  Purchase intent <span className="font-mono text-accent">{audience.purchaseIntent}/100</span>
                </span>
                <span className="capitalize">Income: {audience.incomeProfile}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {audience.affinities.map((a) => (
                  <Pill key={a} tone="info">{a}</Pill>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-edge px-4 py-2.5 text-[12px] font-medium text-muted">
            Campaign History
          </div>
          {history.length === 0 ? (
            <div className="px-4 py-6 text-[13px] text-faint">No campaigns yet. Forecasts for this creator use category baselines.</div>
          ) : (
            <table className="w-full">
              <thead className="border-b border-edge">
                <tr>
                  <Th>Campaign</Th>
                  <Th>Status</Th>
                  <Th right>Fee</Th>
                  <Th right>Conversions</Th>
                  <Th right>Revenue</Th>
                  <Th right>ROAS</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge/60">
                {history.map((h) => {
                  const actual = h.campaign_creators.actual;
                  return (
                    <tr key={h.campaign_creators.id}>
                      <Td>{h.campaigns.name}</Td>
                      <Td>
                        <Pill tone={h.campaigns.status === "active" ? "info" : "default"}>{h.campaigns.status}</Pill>
                      </Td>
                      <Td right mono>{formatInr(h.campaign_creators.feeInr)}</Td>
                      <Td right mono>{actual ? formatCount(actual.conversions) : "—"}</Td>
                      <Td right mono>{actual ? formatInr(actual.revenueInr) : "—"}</Td>
                      <Td right>
                        {actual ? (
                          <span className={`font-mono ${actual.roas >= 3 ? "text-positive" : actual.roas < 1.5 ? "text-negative" : ""}`}>
                            {actual.roas}x
                          </span>
                        ) : (
                          <span className="text-faint">in flight</span>
                        )}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
