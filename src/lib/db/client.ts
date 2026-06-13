import { PGlite } from "@electric-sql/pglite";
import { drizzle, type PgliteDatabase } from "drizzle-orm/pglite";
import path from "path";
import * as schema from "./schema";
import { seed } from "./seed";

export type Db = PgliteDatabase<typeof schema>;

const DDL = `
CREATE TABLE IF NOT EXISTS creators (
  id text PRIMARY KEY,
  name text NOT NULL,
  niche text NOT NULL,
  bio text NOT NULL,
  location text NOT NULL,
  languages jsonb NOT NULL,
  content_topics jsonb NOT NULL,
  platforms jsonb NOT NULL,
  total_followers integer NOT NULL,
  engagement_rate real NOT NULL,
  audience_quality real NOT NULL,
  credibility_score real NOT NULL,
  growth_rate_mom real NOT NULL,
  rate_per_campaign_inr integer NOT NULL,
  fraud_risk real NOT NULL
);
CREATE TABLE IF NOT EXISTS audiences (
  id text PRIMARY KEY,
  creator_id text NOT NULL REFERENCES creators(id),
  age_distribution jsonb NOT NULL,
  gender_split jsonb NOT NULL,
  top_geos jsonb NOT NULL,
  languages jsonb NOT NULL,
  interests jsonb NOT NULL,
  affinities jsonb NOT NULL,
  purchase_intent real NOT NULL,
  income_profile text NOT NULL
);
CREATE TABLE IF NOT EXISTS brands (
  id text PRIMARY KEY,
  name text NOT NULL,
  industry text NOT NULL,
  description text NOT NULL
);
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  brand_id text NOT NULL REFERENCES brands(id),
  name text NOT NULL,
  category text NOT NULL,
  price_inr integer NOT NULL,
  margin_pct real NOT NULL,
  target_age_range text NOT NULL,
  target_gender text NOT NULL,
  target_geos jsonb NOT NULL,
  target_interests jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS campaigns (
  id text PRIMARY KEY,
  brand_id text NOT NULL REFERENCES brands(id),
  product_id text NOT NULL REFERENCES products(id),
  name text NOT NULL,
  objective text NOT NULL,
  status text NOT NULL,
  budget_inr integer NOT NULL,
  spend_inr integer NOT NULL,
  start_date timestamp NOT NULL,
  end_date timestamp,
  predicted jsonb,
  actual jsonb
);
CREATE TABLE IF NOT EXISTS campaign_creators (
  id text PRIMARY KEY,
  campaign_id text NOT NULL REFERENCES campaigns(id),
  creator_id text NOT NULL REFERENCES creators(id),
  fee_inr integer NOT NULL,
  deliverables jsonb NOT NULL,
  actual jsonb
);
CREATE TABLE IF NOT EXISTS trends (
  id text PRIMARY KEY,
  topic text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  velocity real NOT NULL,
  sentiment real NOT NULL,
  growth_rate_wow real NOT NULL,
  momentum text NOT NULL,
  top_geos jsonb NOT NULL,
  related_topics jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS graph_edges (
  id text PRIMARY KEY,
  from_type text NOT NULL,
  from_id text NOT NULL,
  to_type text NOT NULL,
  to_id text NOT NULL,
  edge_type text NOT NULL,
  weight real NOT NULL
);
`;

// Singleton across HMR reloads in dev and across route handlers in prod.
const globalForDb = globalThis as unknown as { __dbPromise?: Promise<Db> };

async function init(): Promise<Db> {
  // File-backed locally for fast restarts; in-memory in production/serverless,
  // where the filesystem is read-only. The dataset is read-only seed data, so
  // an in-memory DB reseeds identically on each cold start.
  const persistent = process.env.NODE_ENV !== "production" && !process.env.VERCEL;
  const pglite = persistent ? new PGlite(path.join(process.cwd(), ".pglite")) : new PGlite();
  await pglite.exec(DDL);
  const db = drizzle(pglite, { schema });
  const existing = await db.select({ id: schema.creators.id }).from(schema.creators).limit(1);
  if (existing.length === 0) {
    await seed(db);
  }
  return db;
}

export function getDb(): Promise<Db> {
  if (!globalForDb.__dbPromise) {
    globalForDb.__dbPromise = init();
  }
  return globalForDb.__dbPromise;
}
