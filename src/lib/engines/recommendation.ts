import { getDb } from "../db/client";
import {
  creators,
  audiences,
  products,
  campaigns,
  campaignCreators,
  type Creator,
  type Audience,
} from "../db/schema";
import { eq } from "drizzle-orm";
import { predictCreatorCampaign, type Forecast } from "./prediction";

export type RecommendInput = {
  category: string; // free text, e.g. "protein supplement", "skincare"
  budgetInr: number;
  geo?: string; // city, or region like "south india"
  targetGender?: "male" | "female" | "all";
  priceInr?: number; // unit price of the product being sold
  limit?: number;
};

export type ScoredCreator = {
  creator: Creator;
  audience?: Audience;
  matchScore: number; // 0-100
  confidence: number; // 0-1
  scores: {
    categoryFit: number;
    audienceFit: number;
    performance: number;
    quality: number;
    value: number;
  };
  rationale: string[];
  historicalRoas: number | null;
  forecast: Forecast; // at the creator's standard rate
};

const REGIONS: Record<string, string[]> = {
  "south india": ["Bengaluru", "Chennai", "Hyderabad", "Kochi", "Coimbatore", "Madurai", "Thiruvananthapuram"],
  "north india": ["Delhi NCR", "Lucknow", "Jaipur", "Chandigarh", "Dehradun"],
  "west india": ["Mumbai", "Pune", "Ahmedabad"],
  "east india": ["Kolkata", "Patna"],
};

// Category keyword -> related signals found in creator topics / audience interests & affinities.
const CATEGORY_SIGNALS: Record<string, string[]> = {
  protein: ["protein", "bodybuilding", "fitness", "gym", "strength", "meal prep", "nutrition", "running", "supplements"],
  supplement: ["protein", "supplements", "fitness", "wellness", "nutrition"],
  skincare: ["skincare", "serums", "sunscreen", "beauty", "ingredients", "acne", "clean beauty", "dermo-cosmetics"],
  beauty: ["skincare", "makeup", "beauty", "haircare", "lipstick", "foundation"],
  haircare: ["haircare", "hair oils", "scalp", "curly hair", "shampoo"],
  earbuds: ["earbuds", "audio", "headphones", "music", "gadgets", "smartphones"],
  audio: ["earbuds", "audio", "headphones", "music"],
  smartphone: ["smartphones", "gadgets", "budget tech", "reviews"],
  fintech: ["investing", "saving", "fintech apps", "mutual funds", "personal finance", "budgeting"],
  investment: ["investing", "fintech apps", "stocks", "mutual funds", "saving"],
  shoes: ["running shoes", "running", "sneakers", "marathons", "fitness", "trekking shoes"],
  running: ["running", "marathons", "running shoes", "endurance", "fitness"],
  beverage: ["wellness", "healthy eating", "food", "yoga", "snacks", "beverages", "kombucha"],
  energy: ["gaming", "esports", "energy drinks", "fitness", "study"],
  snack: ["snacks", "fitness", "meal prep", "trekking", "healthy eating", "energy bars"],
  fashion: ["fashion", "streetwear", "sneakers", "ethnic wear", "athleisure", "capsule wardrobe"],
  gaming: ["gaming", "esports", "BGMI", "Valorant", "gaming gear"],
  travel: ["travel", "trekking", "hotels", "luxury travel", "camping"],
  food: ["cooking", "recipes", "food", "meal prep", "baking"],
  app: ["fintech apps", "AI tools", "productivity", "online courses"],
  course: ["online courses", "career advice", "upskilling", "coding"],
};

function tokenize(s: string): string[] {
  return s.toLowerCase().split(/[^a-z0-9&₹]+/).filter((t) => t.length > 2);
}

function expandCategory(category: string): Set<string> {
  const out = new Set<string>(tokenize(category));
  for (const tok of tokenize(category)) {
    for (const [key, signals] of Object.entries(CATEGORY_SIGNALS)) {
      if (tok.includes(key) || key.includes(tok)) {
        signals.forEach((s) => out.add(s.toLowerCase()));
      }
    }
  }
  return out;
}

function overlapScore(signals: Set<string>, fields: string[]): number {
  if (fields.length === 0) return 0;
  let hits = 0;
  for (const f of fields) {
    const fl = f.toLowerCase();
    for (const s of signals) {
      if (fl.includes(s) || s.includes(fl)) {
        hits++;
        break;
      }
    }
  }
  return Math.min(1, hits / Math.min(5, fields.length));
}

function geoCities(geo: string): string[] {
  const g = geo.toLowerCase().trim();
  for (const [region, cities] of Object.entries(REGIONS)) {
    if (g.includes(region.split(" ")[0]) && region.includes("india") === g.includes("india")) return cities;
    if (g === region || region.startsWith(g)) return cities;
  }
  if (g.includes("south")) return REGIONS["south india"];
  if (g.includes("north")) return REGIONS["north india"];
  if (g.includes("west")) return REGIONS["west india"];
  if (g.includes("east")) return REGIONS["east india"];
  return [geo];
}

export async function recommendCreators(input: RecommendInput): Promise<ScoredCreator[]> {
  const db = await getDb();
  const [allCreators, allAudiences, allProducts, history] = await Promise.all([
    db.select().from(creators),
    db.select().from(audiences),
    db.select().from(products),
    db
      .select({
        creatorId: campaignCreators.creatorId,
        feeInr: campaignCreators.feeInr,
        actual: campaignCreators.actual,
        productId: campaigns.productId,
      })
      .from(campaignCreators)
      .innerJoin(campaigns, eq(campaignCreators.campaignId, campaigns.id)),
  ]);

  const audienceByCreator = new Map(allAudiences.map((a) => [a.creatorId, a]));
  const signals = expandCategory(input.category);

  // Borrow target interests from catalog products in the same category.
  for (const p of allProducts) {
    if (overlapScore(signals, [p.category, p.name]) > 0.3) {
      p.targetInterests.forEach((i) => signals.add(i.toLowerCase()));
    }
  }

  const cities = input.geo ? geoCities(input.geo) : null;
  const categoryProductIds = new Set(
    allProducts.filter((p) => overlapScore(signals, [p.category]) > 0.3).map((p) => p.id)
  );

  const scored: ScoredCreator[] = allCreators.map((c) => {
    const aud = audienceByCreator.get(c.id);
    const rationale: string[] = [];

    // 1. Category fit — creator topics + niche vs expanded category signals.
    const categoryFit = Math.max(
      overlapScore(signals, [...c.contentTopics, c.niche]),
      aud ? overlapScore(signals, [...aud.interests, ...aud.affinities]) * 0.85 : 0
    );
    if (categoryFit > 0.6) rationale.push(`Content and audience interests align with ${input.category}`);

    // 2. Audience fit — geo + gender + purchase intent.
    let audienceFit = 0.5;
    if (aud) {
      let geoShare = 1;
      if (cities) {
        geoShare = aud.topGeos
          .filter((g) => cities.some((city) => g.city.toLowerCase().includes(city.toLowerCase()) || city.toLowerCase().includes(g.city.toLowerCase())))
          .reduce((a, g) => a + g.pct, 0) / 50; // 50%+ matched share = full marks
        geoShare = Math.min(1, geoShare);
        if (geoShare > 0.5) rationale.push(`Strong audience presence in ${input.geo}`);
      }
      let genderFit = 1;
      if (input.targetGender && input.targetGender !== "all") {
        genderFit = aud.genderSplit[input.targetGender] / 60;
        genderFit = Math.min(1, genderFit);
      }
      const intent = aud.purchaseIntent / 100;
      audienceFit = geoShare * 0.4 + genderFit * 0.25 + intent * 0.35;
      if (aud.purchaseIntent >= 75) rationale.push(`High purchase-intent audience (${aud.purchaseIntent}/100)`);
    }

    // 3. Historical performance — realized ROAS, weighted toward same-category products.
    const rows = history.filter((h) => h.creatorId === c.id && h.actual);
    let performance = 0.5;
    let historicalRoas: number | null = null;
    if (rows.length > 0) {
      const weighted = rows.map((r) => ({
        roas: r.actual!.roas,
        w: categoryProductIds.has(r.productId) ? 2 : 1,
      }));
      const wSum = weighted.reduce((a, r) => a + r.w, 0);
      historicalRoas = +(weighted.reduce((a, r) => a + r.roas * r.w, 0) / wSum).toFixed(2);
      performance = Math.min(1, historicalRoas / 4);
      const sameCat = rows.some((r) => categoryProductIds.has(r.productId));
      if (sameCat) rationale.push(`Proven seller in this category (${historicalRoas}x realized ROAS)`);
      else if (historicalRoas >= 2.5) rationale.push(`${historicalRoas}x average realized ROAS across past campaigns`);
    }

    // 4. Quality — audience quality, credibility, fraud penalty.
    const quality = Math.max(0, (c.audienceQuality * 0.5 + c.credibilityScore * 0.5 - c.fraudRisk * 1.5) / 100);
    if (c.fraudRisk >= 10) rationale.push(`⚠ Elevated fraud risk (${c.fraudRisk}/100)`);

    // 5. Value — effective cost per engaged follower vs market.
    const costPerK = c.ratePerCampaignInr / (c.totalFollowers / 1000) / Math.max(1, c.engagementRate);
    const value = Math.min(1, Math.max(0.1, 110 / Math.max(20, costPerK)));

    // Category relevance gates the rest: a great general performer with zero
    // category fit should not outrank a relevant specialist.
    const relevanceGate = 0.45 + 0.55 * Math.min(1, categoryFit * 1.5);
    const matchScore = Math.round(
      (categoryFit * 0.32 + audienceFit * 0.24 + performance * 0.20 + quality * 0.14 + value * 0.10) *
        relevanceGate *
        100
    );

    const hasHistory = rows.length > 0;
    const fit = categoryFit * 0.6 + audienceFit * 0.4;
    const priceInr = input.priceInr ?? guessPrice(allProducts, signals);
    const forecast = predictCreatorCampaign(c, aud, c.ratePerCampaignInr, priceInr, fit, hasHistory);

    return {
      creator: c,
      audience: aud,
      matchScore,
      confidence: forecast.confidence,
      scores: {
        categoryFit: Math.round(categoryFit * 100),
        audienceFit: Math.round(audienceFit * 100),
        performance: Math.round(performance * 100),
        quality: Math.round(quality * 100),
        value: Math.round(value * 100),
      },
      rationale,
      historicalRoas,
      forecast,
    };
  });

  const affordable = scored.filter((s) => s.creator.ratePerCampaignInr <= input.budgetInr);
  affordable.sort((a, b) => b.matchScore - a.matchScore);
  return affordable.slice(0, input.limit ?? 10);
}

function guessPrice(allProducts: { category: string; priceInr: number }[], signals: Set<string>): number {
  const matches = allProducts.filter((p) => overlapScore(signals, [p.category]) > 0.3);
  if (matches.length === 0) return 1000;
  return Math.round(matches.reduce((a, p) => a + p.priceInr, 0) / matches.length);
}

export type SearchInput = {
  niche?: string;
  geo?: string;
  minFollowers?: number;
  maxFeeInr?: number;
  query?: string;
  limit?: number;
};

export async function searchCreators(input: SearchInput) {
  const db = await getDb();
  const [allCreators, allAudiences] = await Promise.all([
    db.select().from(creators),
    db.select().from(audiences),
  ]);
  const audienceByCreator = new Map(allAudiences.map((a) => [a.creatorId, a]));
  const cities = input.geo ? geoCities(input.geo) : null;
  const q = input.query ? tokenize(input.query) : null;

  return allCreators
    .filter((c) => {
      if (input.niche && c.niche !== input.niche.toLowerCase()) return false;
      if (input.minFollowers && c.totalFollowers < input.minFollowers) return false;
      if (input.maxFeeInr && c.ratePerCampaignInr > input.maxFeeInr) return false;
      if (cities) {
        const aud = audienceByCreator.get(c.id);
        const inGeo =
          cities.some((city) => c.location.toLowerCase().includes(city.toLowerCase())) ||
          (aud?.topGeos.some((g) => cities.some((city) => g.city.toLowerCase().includes(city.toLowerCase()))) ?? false);
        if (!inGeo) return false;
      }
      if (q) {
        const hay = [c.name, c.bio, c.niche, ...c.contentTopics].join(" ").toLowerCase();
        if (!q.some((t) => hay.includes(t))) return false;
      }
      return true;
    })
    .sort((a, b) => b.totalFollowers - a.totalFollowers)
    .slice(0, input.limit ?? 15)
    .map((c) => ({ creator: c, audience: audienceByCreator.get(c.id) }));
}
