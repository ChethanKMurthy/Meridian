import type { Creator, Audience, CampaignOutcome } from "../db/schema";

// Funnel-based outcome forecasting. Deterministic v0 heuristics — the feedback
// loop (predicted vs actual on completed campaigns) is what improves these over time.

export type Forecast = CampaignOutcome & {
  confidence: number; // 0-1
  low: { revenueInr: number; roas: number };
  high: { revenueInr: number; roas: number };
};

// Calibrated against realized reach on completed campaigns (multi-deliverable
// packages reach well beyond single-post averages).
const PLATFORM_REACH_RATE: Record<string, number> = {
  instagram: 0.6,
  youtube: 0.48,
  x: 0.3,
};

function baseConversionRate(priceInr: number): number {
  if (priceInr <= 200) return 0.04;
  if (priceInr <= 1000) return 0.032;
  if (priceInr <= 5000) return 0.022;
  if (priceInr <= 15000) return 0.012;
  return 0.006;
}

export function predictCreatorCampaign(
  creator: Creator,
  audience: Audience | undefined,
  spendInr: number,
  priceInr: number,
  fitScore = 0.7, // 0-1, from the recommendation engine when available
  hasHistory = false
): Forecast {
  // Content volume scales sub-linearly with spend relative to the creator's standard rate.
  const volume = Math.min(2.5, Math.max(0.4, Math.sqrt(spendInr / creator.ratePerCampaignInr)));

  let reach = 0;
  for (const p of creator.platforms) {
    reach += p.followers * (PLATFORM_REACH_RATE[p.platform] ?? 0.2);
  }
  reach = Math.round(reach * volume * (creator.audienceQuality / 100));

  const impressions = Math.round(reach * 1.65);
  const engagement = Math.round(impressions * (creator.engagementRate / 100));

  const intent = audience ? audience.purchaseIntent / 70 : 1;
  const ctr = 0.01 * (0.6 + fitScore * 0.9) * Math.min(1.4, intent);
  const clicks = Math.round(impressions * ctr);

  const cvr = baseConversionRate(priceInr) * (0.5 + fitScore * 0.8) * Math.min(1.3, intent);
  const conversions = Math.round(clicks * cvr);

  const revenueInr = conversions * priceInr;
  const roas = spendInr > 0 ? +(revenueInr / spendInr).toFixed(2) : 0;

  // Confidence: data completeness + historical signal - fraud uncertainty.
  let confidence = 0.45;
  if (audience) confidence += 0.15;
  if (hasHistory) confidence += 0.25;
  confidence -= creator.fraudRisk / 200;
  confidence = Math.max(0.2, Math.min(0.92, confidence));

  const spread = 0.45 * (1 - confidence) + 0.1;
  return {
    reach,
    impressions,
    engagement,
    clicks,
    conversions,
    revenueInr,
    roas,
    confidence: +confidence.toFixed(2),
    low: { revenueInr: Math.round(revenueInr * (1 - spread)), roas: +(roas * (1 - spread)).toFixed(2) },
    high: { revenueInr: Math.round(revenueInr * (1 + spread)), roas: +(roas * (1 + spread)).toFixed(2) },
  };
}

export function aggregateForecasts(parts: { spendInr: number; forecast: Forecast }[]): Forecast {
  const sum = (f: (x: { spendInr: number; forecast: Forecast }) => number) =>
    parts.reduce((a, p) => a + f(p), 0);
  const spend = sum((p) => p.spendInr);
  const revenueInr = sum((p) => p.forecast.revenueInr);
  const confidence =
    parts.length > 0
      ? +(sum((p) => p.forecast.confidence * p.spendInr) / Math.max(1, spend)).toFixed(2)
      : 0;
  return {
    reach: sum((p) => p.forecast.reach),
    impressions: sum((p) => p.forecast.impressions),
    engagement: sum((p) => p.forecast.engagement),
    clicks: sum((p) => p.forecast.clicks),
    conversions: sum((p) => p.forecast.conversions),
    revenueInr,
    roas: spend > 0 ? +(revenueInr / spend).toFixed(2) : 0,
    confidence,
    low: { revenueInr: sum((p) => p.forecast.low.revenueInr), roas: spend > 0 ? +(sum((p) => p.forecast.low.revenueInr) / spend).toFixed(2) : 0 },
    high: { revenueInr: sum((p) => p.forecast.high.revenueInr), roas: spend > 0 ? +(sum((p) => p.forecast.high.revenueInr) / spend).toFixed(2) : 0 },
  };
}
