import Link from "next/link";
import { getDb } from "@/lib/db/client";
import { creators, audiences } from "@/lib/db/schema";
import { getCreatorTrackRecords } from "@/lib/engines/attribution";
import { formatInr, formatCount } from "@/lib/format";
import { PageHeader, ScoreBar, Pill, Th, Td } from "@/components/ui";
import { SocialLinks } from "@/components/social-preview";

export const dynamic = "force-dynamic";

export default async function CreatorsPage() {
  const db = await getDb();
  const [allCreators, allAudiences, trackRecords] = await Promise.all([
    db.select().from(creators),
    db.select().from(audiences),
    getCreatorTrackRecords(),
  ]);
  const audByCreator = new Map(allAudiences.map((a) => [a.creatorId, a]));
  const roasByCreator = new Map(trackRecords.map((t) => [t.creatorId, t.avgRoas]));
  const rows = [...allCreators].sort((a, b) => b.totalFollowers - a.totalFollowers);

  return (
    <div>
      <PageHeader
        title="Creator Intelligence"
        subtitle={`${rows.length} profiled creators · scored on audience quality, credibility, and realized outcomes`}
      />
      <div className="px-8 py-6">
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-edge">
              <tr>
                <Th>Creator</Th>
                <Th>Niche</Th>
                <Th right>Followers</Th>
                <Th right>Eng%</Th>
                <Th>Audience Quality</Th>
                <Th right>Intent</Th>
                <Th right>Realized ROAS</Th>
                <Th right>Fee</Th>
                <Th right>Fraud</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge/60">
              {rows.map((c) => {
                const aud = audByCreator.get(c.id);
                const roas = roasByCreator.get(c.id);
                return (
                  <tr key={c.id} className="transition-colors hover:bg-surface-2/50">
                    <Td>
                      <Link href={`/creators/${c.id}`} className="group">
                        <div className="font-medium group-hover:text-accent">{c.name}</div>
                        <div className="text-[11px] text-faint">{c.location}</div>
                      </Link>
                      <div className="mt-1.5">
                        <SocialLinks platforms={c.platforms} />
                      </div>
                    </Td>
                    <Td>
                      <Pill>{c.niche}</Pill>
                    </Td>
                    <Td right mono>{formatCount(c.totalFollowers)}</Td>
                    <Td right mono>{c.engagementRate.toFixed(1)}</Td>
                    <Td>
                      <ScoreBar score={c.audienceQuality} />
                    </Td>
                    <Td right mono>{aud ? Math.round(aud.purchaseIntent) : "—"}</Td>
                    <Td right>
                      {roas != null ? (
                        <span className={`font-mono ${roas >= 3 ? "text-positive" : roas >= 1.5 ? "text-foreground" : "text-negative"}`}>
                          {roas}x
                        </span>
                      ) : (
                        <span className="text-faint">no history</span>
                      )}
                    </Td>
                    <Td right mono>{formatInr(c.ratePerCampaignInr)}</Td>
                    <Td right>
                      <span className={`font-mono ${c.fraudRisk >= 10 ? "text-negative" : "text-muted"}`}>
                        {c.fraudRisk}
                      </span>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
