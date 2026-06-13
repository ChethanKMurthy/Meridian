# Meridian — Growth Intelligence Platform

A decision engine for creator-driven growth. A brand states **Product X, Budget Y, Goal Z**; the platform answers with ranked creators, a budget allocation, and a revenue forecast — backed by a creator graph and measured outcomes, not follower counts.

Built per the Founding Engineering Brief: not a marketplace, not a CRM — an intelligence layer.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. The embedded Postgres database (PGlite, stored in `.pglite/`) creates and seeds itself on first request — no external services needed. Delete `.pglite/` to reset to seed data.

**AI Command Console** (the primary interface) needs an Anthropic API key:

```bash
echo 'ANTHROPIC_API_KEY=sk-ant-...' > .env.local
```

Without a key, the Creators / Campaigns / Trends pages still work fully — they hit the intelligence engines directly.

## Architecture

```
src/lib/db/          Creator graph: creators, audiences, brands, products,
                     campaigns, trends, typed graph edges (Drizzle + PGlite)
src/lib/engines/
  recommendation.ts  Multi-factor creator scoring: category fit, audience fit,
                     realized performance, quality (fraud-adjusted), value
  prediction.ts      Funnel forecasting: reach → clicks → conversions → revenue
                     → ROAS, with confidence bands
  planner.ts         Budget allocation against a revenue goal + risk assessment
  attribution.ts     Predicted vs actual, per-creator track records (the flywheel)
  trends.ts          Opportunity-ranked market signals + positioned creators
src/lib/ai/          Engines exposed as Claude tools
src/app/api/chat/    Tool-use loop — AI orchestrates the engines, UI renders
                     tool results as data tables
src/app/             Command console, Creators, Campaigns, Trends
```

The data flywheel is wired in: completed campaigns store predicted *and* actual outcomes; the recommendation engine weights realized ROAS (category-weighted) into every ranking, and the Campaigns page reports forecast error.

## What's seeded

20 India-market creators across 8 niches with audience intelligence (demographics, geos, purchase intent, income profiles), 6 brands, 10 products, 8 campaigns (6 completed with attribution, 2 in flight), and 12 market trends.

## Try in the console

- *"Launch a new protein supplement in South India with a budget of ₹20L"*
- *"I need ₹50L in revenue from a skincare campaign. Budget ₹15L. Who do I work with?"*
- *"Which creators have actually driven revenue for us?"*

## Not yet built

- Auth (better-auth is installed but unwired — single-tenant for now)
- Live ingestion (googleapis installed for future YouTube ingestion; data is seeded)
- Neon for production (swap PGlite for `@neondatabase/serverless` via `src/lib/db/client.ts`)
