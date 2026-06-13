import {
  pgTable,
  text,
  integer,
  real,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

// ---------- Shared JSON shapes ----------

export type PlatformPresence = {
  platform: "instagram" | "youtube" | "x";
  handle: string;
  followers: number;
  avgViews: number;
  engagementRate: number; // %
};

export type AgeDistribution = Record<string, number>; // bucket -> %
export type GenderSplit = { male: number; female: number; other: number };
export type GeoShare = { city: string; pct: number };

export type CampaignOutcome = {
  reach: number;
  impressions: number;
  engagement: number;
  clicks: number;
  conversions: number;
  revenueInr: number;
  roas: number;
};

// ---------- Tables ----------

export const creators = pgTable("creators", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  niche: text("niche").notNull(), // fitness | beauty | tech | food | finance | fashion | gaming | travel
  bio: text("bio").notNull(),
  location: text("location").notNull(),
  languages: jsonb("languages").$type<string[]>().notNull(),
  contentTopics: jsonb("content_topics").$type<string[]>().notNull(),
  platforms: jsonb("platforms").$type<PlatformPresence[]>().notNull(),
  totalFollowers: integer("total_followers").notNull(),
  engagementRate: real("engagement_rate").notNull(), // blended %
  audienceQuality: real("audience_quality").notNull(), // 0-100 (bot/fraud-adjusted)
  credibilityScore: real("credibility_score").notNull(), // 0-100 brand-safety + consistency
  growthRateMoM: real("growth_rate_mom").notNull(), // % followers/month
  ratePerCampaignInr: integer("rate_per_campaign_inr").notNull(),
  fraudRisk: real("fraud_risk").notNull(), // 0-100
});

export const audiences = pgTable("audiences", {
  id: text("id").primaryKey(),
  creatorId: text("creator_id")
    .notNull()
    .references(() => creators.id),
  ageDistribution: jsonb("age_distribution").$type<AgeDistribution>().notNull(),
  genderSplit: jsonb("gender_split").$type<GenderSplit>().notNull(),
  topGeos: jsonb("top_geos").$type<GeoShare[]>().notNull(),
  languages: jsonb("languages").$type<string[]>().notNull(),
  interests: jsonb("interests").$type<string[]>().notNull(),
  affinities: jsonb("affinities").$type<string[]>().notNull(), // brand/category affinities
  purchaseIntent: real("purchase_intent").notNull(), // 0-100
  incomeProfile: text("income_profile").notNull(), // low | mid | high | mixed
});

export const brands = pgTable("brands", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  description: text("description").notNull(),
});

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  brandId: text("brand_id")
    .notNull()
    .references(() => brands.id),
  name: text("name").notNull(),
  category: text("category").notNull(),
  priceInr: integer("price_inr").notNull(),
  marginPct: real("margin_pct").notNull(),
  targetAgeRange: text("target_age_range").notNull(), // e.g. "18-30"
  targetGender: text("target_gender").notNull(), // male | female | all
  targetGeos: jsonb("target_geos").$type<string[]>().notNull(),
  targetInterests: jsonb("target_interests").$type<string[]>().notNull(),
});

export const campaigns = pgTable("campaigns", {
  id: text("id").primaryKey(),
  brandId: text("brand_id")
    .notNull()
    .references(() => brands.id),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  name: text("name").notNull(),
  objective: text("objective").notNull(), // awareness | conversions | launch
  status: text("status").notNull(), // active | completed | draft
  budgetInr: integer("budget_inr").notNull(),
  spendInr: integer("spend_inr").notNull(),
  startDate: timestamp("start_date", { mode: "string" }).notNull(),
  endDate: timestamp("end_date", { mode: "string" }),
  predicted: jsonb("predicted").$type<CampaignOutcome | null>(),
  actual: jsonb("actual").$type<CampaignOutcome | null>(),
});

export const campaignCreators = pgTable("campaign_creators", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id")
    .notNull()
    .references(() => campaigns.id),
  creatorId: text("creator_id")
    .notNull()
    .references(() => creators.id),
  feeInr: integer("fee_inr").notNull(),
  deliverables: jsonb("deliverables").$type<string[]>().notNull(),
  actual: jsonb("actual").$type<CampaignOutcome | null>(),
});

export const trends = pgTable("trends", {
  id: text("id").primaryKey(),
  topic: text("topic").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  velocity: real("velocity").notNull(), // 0-100 attention velocity
  sentiment: real("sentiment").notNull(), // -1..1
  growthRateWoW: real("growth_rate_wow").notNull(), // % week over week
  momentum: text("momentum").notNull(), // emerging | rising | peaking | declining
  topGeos: jsonb("top_geos").$type<string[]>().notNull(),
  relatedTopics: jsonb("related_topics").$type<string[]>().notNull(),
});

// Relationship-first creator graph: typed edges between any two entities.
export const graphEdges = pgTable("graph_edges", {
  id: text("id").primaryKey(),
  fromType: text("from_type").notNull(), // creator | audience | brand | product | campaign | trend | topic
  fromId: text("from_id").notNull(),
  toType: text("to_type").notNull(),
  toId: text("to_id").notNull(),
  edgeType: text("edge_type").notNull(), // influences | overlaps_with | sold_for | rides_trend | worked_with | targets
  weight: real("weight").notNull(), // 0-1
});

export type Creator = typeof creators.$inferSelect;
export type Audience = typeof audiences.$inferSelect;
export type Brand = typeof brands.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type CampaignCreator = typeof campaignCreators.$inferSelect;
export type Trend = typeof trends.$inferSelect;
export type GraphEdge = typeof graphEdges.$inferSelect;
