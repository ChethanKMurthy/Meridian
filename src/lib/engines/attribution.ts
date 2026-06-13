import { getDb } from "../db/client";
import { campaigns, campaignCreators, creators, brands, products } from "../db/schema";
import { eq } from "drizzle-orm";

// Attribution layer: connect creator activity to realized business outcomes,
// and measure the prediction engine against reality (the data flywheel).

export type CampaignReport = {
  id: string;
  name: string;
  brand: string;
  product: string;
  status: string;
  objective: string;
  budgetInr: number;
  spendInr: number;
  predictedRoas: number | null;
  actualRoas: number | null;
  predictedRevenueInr: number | null;
  actualRevenueInr: number | null;
  conversions: number | null;
  forecastErrorPct: number | null; // |actual - predicted| / actual
  creators: {
    creatorId: string;
    name: string;
    feeInr: number;
    actualRoas: number | null;
    actualRevenueInr: number | null;
    conversions: number | null;
  }[];
};

export type CreatorTrackRecord = {
  creatorId: string;
  name: string;
  niche: string;
  campaignsRun: number;
  totalFeesInr: number;
  totalRevenueInr: number;
  avgRoas: number;
  totalConversions: number;
};

export async function getCampaignReports(): Promise<CampaignReport[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(campaigns)
    .innerJoin(brands, eq(campaigns.brandId, brands.id))
    .innerJoin(products, eq(campaigns.productId, products.id));
  const lineups = await db
    .select()
    .from(campaignCreators)
    .innerJoin(creators, eq(campaignCreators.creatorId, creators.id));

  return rows
    .map(({ campaigns: cp, brands: br, products: pr }) => {
      const lineup = lineups.filter((l) => l.campaign_creators.campaignId === cp.id);
      const predictedRoas = cp.predicted?.roas ?? null;
      const actualRoas = cp.actual?.roas ?? null;
      return {
        id: cp.id,
        name: cp.name,
        brand: br.name,
        product: pr.name,
        status: cp.status,
        objective: cp.objective,
        budgetInr: cp.budgetInr,
        spendInr: cp.spendInr,
        predictedRoas,
        actualRoas,
        predictedRevenueInr: cp.predicted?.revenueInr ?? null,
        actualRevenueInr: cp.actual?.revenueInr ?? null,
        conversions: cp.actual?.conversions ?? null,
        forecastErrorPct:
          predictedRoas !== null && actualRoas !== null && actualRoas > 0
            ? Math.round((Math.abs(actualRoas - predictedRoas) / actualRoas) * 100)
            : null,
        creators: lineup.map((l) => ({
          creatorId: l.creators.id,
          name: l.creators.name,
          feeInr: l.campaign_creators.feeInr,
          actualRoas: l.campaign_creators.actual?.roas ?? null,
          actualRevenueInr: l.campaign_creators.actual?.revenueInr ?? null,
          conversions: l.campaign_creators.actual?.conversions ?? null,
        })),
      };
    })
    .sort((a, b) => (a.status === "active" ? -1 : 1) - (b.status === "active" ? -1 : 1));
}

export async function getCreatorTrackRecords(): Promise<CreatorTrackRecord[]> {
  const db = await getDb();
  const lineups = await db
    .select()
    .from(campaignCreators)
    .innerJoin(creators, eq(campaignCreators.creatorId, creators.id));

  const byCreator = new Map<string, CreatorTrackRecord>();
  for (const l of lineups) {
    if (!l.campaign_creators.actual) continue;
    const id = l.creators.id;
    const rec = byCreator.get(id) ?? {
      creatorId: id,
      name: l.creators.name,
      niche: l.creators.niche,
      campaignsRun: 0,
      totalFeesInr: 0,
      totalRevenueInr: 0,
      avgRoas: 0,
      totalConversions: 0,
    };
    rec.campaignsRun += 1;
    rec.totalFeesInr += l.campaign_creators.feeInr;
    rec.totalRevenueInr += l.campaign_creators.actual.revenueInr;
    rec.totalConversions += l.campaign_creators.actual.conversions;
    byCreator.set(id, rec);
  }
  const out = [...byCreator.values()];
  for (const r of out) {
    r.avgRoas = +(r.totalRevenueInr / Math.max(1, r.totalFeesInr)).toFixed(2);
  }
  return out.sort((a, b) => b.avgRoas - a.avgRoas);
}

export async function getPlatformSummary() {
  const reports = await getCampaignReports();
  const completed = reports.filter((r) => r.actualRoas !== null);
  const totalSpend = completed.reduce((a, r) => a + r.spendInr, 0);
  const totalRevenue = completed.reduce((a, r) => a + (r.actualRevenueInr ?? 0), 0);
  const avgError =
    completed.length > 0
      ? Math.round(completed.reduce((a, r) => a + (r.forecastErrorPct ?? 0), 0) / completed.length)
      : null;
  return {
    campaignsCompleted: completed.length,
    campaignsActive: reports.filter((r) => r.status === "active").length,
    totalSpendInr: totalSpend,
    totalAttributedRevenueInr: totalRevenue,
    blendedRoas: totalSpend > 0 ? +(totalRevenue / totalSpend).toFixed(2) : null,
    avgForecastErrorPct: avgError,
  };
}
