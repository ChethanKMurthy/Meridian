import { getDb } from "../db/client";
import { trends, graphEdges, creators, type Trend } from "../db/schema";
import { eq, and } from "drizzle-orm";

export type TrendOpportunity = Trend & {
  opportunityScore: number; // 0-100
  ridingCreators: { id: string; name: string; niche: string; totalFollowers: number }[];
};

// Opportunity = where attention is accelerating, weighted toward early momentum
// (acting on "emerging"/"rising" beats buying into "peaking").
const MOMENTUM_MULTIPLIER: Record<string, number> = {
  emerging: 1.15,
  rising: 1.1,
  peaking: 0.9,
  declining: 0.6,
};

export async function getTrendOpportunities(category?: string): Promise<TrendOpportunity[]> {
  const db = await getDb();
  const [allTrends, edges, allCreators] = await Promise.all([
    category
      ? db.select().from(trends).where(eq(trends.category, category.toLowerCase()))
      : db.select().from(trends),
    db
      .select()
      .from(graphEdges)
      .where(and(eq(graphEdges.edgeType, "rides_trend"), eq(graphEdges.toType, "trend"))),
    db.select().from(creators),
  ]);
  const creatorById = new Map(allCreators.map((c) => [c.id, c]));

  return allTrends
    .map((t) => {
      const raw =
        (t.velocity * 0.55 + Math.min(100, t.growthRateWoW * 2.5) * 0.35 + ((t.sentiment + 1) / 2) * 100 * 0.1) *
        (MOMENTUM_MULTIPLIER[t.momentum] ?? 1);
      const riding = edges
        .filter((e) => e.toId === t.id)
        .map((e) => creatorById.get(e.fromId))
        .filter((c): c is NonNullable<typeof c> => !!c)
        .sort((a, b) => b.totalFollowers - a.totalFollowers)
        .slice(0, 5)
        .map((c) => ({ id: c.id, name: c.name, niche: c.niche, totalFollowers: c.totalFollowers }));
      return {
        ...t,
        opportunityScore: Math.min(100, Math.round(raw)),
        ridingCreators: riding,
      };
    })
    .sort((a, b) => b.opportunityScore - a.opportunityScore);
}
