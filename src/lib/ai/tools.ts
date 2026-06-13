import type Anthropic from "@anthropic-ai/sdk";
import { recommendCreators, searchCreators } from "../engines/recommendation";
import { planCampaign } from "../engines/planner";
import { predictCreatorCampaign, aggregateForecasts } from "../engines/prediction";
import { getTrendOpportunities } from "../engines/trends";
import {
  getCampaignReports,
  getCreatorTrackRecords,
  getPlatformSummary,
} from "../engines/attribution";
import { getDb } from "../db/client";
import { creators, audiences } from "../db/schema";
import { inArray } from "drizzle-orm";

export const TOOLS: Anthropic.Tool[] = [
  {
    name: "recommend_creators",
    description:
      "Rank creators for a product category and budget using the recommendation engine (category fit, audience fit, historical performance, quality, value). Call this when the user asks which creators to work with.",
    input_schema: {
      type: "object",
      properties: {
        category: { type: "string", description: "Product category, e.g. 'protein supplement', 'skincare', 'fintech app'" },
        budget_inr: { type: "number", description: "Total campaign budget in INR" },
        geo: { type: "string", description: "Target geography: a city or region like 'South India'" },
        target_gender: { type: "string", enum: ["male", "female", "all"] },
        price_inr: { type: "number", description: "Unit price of the product in INR, if known" },
        limit: { type: "number", description: "Max creators to return (default 8)" },
      },
      required: ["category", "budget_inr"],
    },
  },
  {
    name: "plan_campaign",
    description:
      "Build a full campaign plan: creator lineup, budget allocation, aggregate forecast (reach/clicks/conversions/revenue/ROAS), goal coverage, and risks. Call this when the user gives a product + budget and wants a launch/campaign plan or has a revenue goal.",
    input_schema: {
      type: "object",
      properties: {
        category: { type: "string" },
        budget_inr: { type: "number" },
        revenue_goal_inr: { type: "number", description: "Revenue target in INR, if the user stated one" },
        geo: { type: "string" },
        target_gender: { type: "string", enum: ["male", "female", "all"] },
        price_inr: { type: "number" },
      },
      required: ["category", "budget_inr"],
    },
  },
  {
    name: "predict_campaign",
    description:
      "Forecast outcomes for a specific set of creators and a budget: reach, impressions, engagement, clicks, conversions, revenue, ROAS with confidence bands. Budget is split across creators proportional to their standard rates.",
    input_schema: {
      type: "object",
      properties: {
        creator_ids: { type: "array", items: { type: "string" }, description: "Creator IDs, e.g. from a prior recommendation" },
        budget_inr: { type: "number" },
        price_inr: { type: "number", description: "Unit price of the product in INR" },
      },
      required: ["creator_ids", "budget_inr", "price_inr"],
    },
  },
  {
    name: "search_creators",
    description:
      "Search the creator graph with filters (niche, geography, follower floor, fee ceiling, free-text query). Use for exploratory questions like 'which fitness creators do we have in Mumbai under ₹5L'.",
    input_schema: {
      type: "object",
      properties: {
        niche: { type: "string", description: "fitness | beauty | tech | food | finance | fashion | gaming | travel" },
        geo: { type: "string" },
        min_followers: { type: "number" },
        max_fee_inr: { type: "number" },
        query: { type: "string", description: "Free-text topic search, e.g. 'running shoes'" },
        limit: { type: "number" },
      },
      required: [],
    },
  },
  {
    name: "get_trends",
    description:
      "Get ranked market trend opportunities (velocity, growth, sentiment, momentum) with the creators best positioned to ride each trend. Call when the user asks what's trending or where attention is moving.",
    input_schema: {
      type: "object",
      properties: {
        category: { type: "string", description: "Optional filter: fitness | beauty | tech | food | finance | fashion" },
      },
      required: [],
    },
  },
  {
    name: "get_campaign_performance",
    description:
      "Attribution data: past and active campaigns with predicted vs actual ROAS/revenue, per-creator realized track records, and platform-level forecast accuracy. Call for 'how did X perform', 'which creators actually drive revenue', or accuracy questions.",
    input_schema: { type: "object", properties: {}, required: [] },
  },
];

export async function executeTool(name: string, input: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case "recommend_creators": {
      const recs = await recommendCreators({
        category: String(input.category),
        budgetInr: Number(input.budget_inr),
        geo: input.geo ? String(input.geo) : undefined,
        targetGender: input.target_gender as "male" | "female" | "all" | undefined,
        priceInr: input.price_inr ? Number(input.price_inr) : undefined,
        limit: input.limit ? Number(input.limit) : 8,
      });
      // Trim payload for the model: drop bulky nested objects it doesn't need.
      return recs.map((r) => ({
        creatorId: r.creator.id,
        name: r.creator.name,
        niche: r.creator.niche,
        location: r.creator.location,
        totalFollowers: r.creator.totalFollowers,
        engagementRate: r.creator.engagementRate,
        feeInr: r.creator.ratePerCampaignInr,
        platforms: r.creator.platforms,
        matchScore: r.matchScore,
        scores: r.scores,
        confidence: r.confidence,
        historicalRoas: r.historicalRoas,
        rationale: r.rationale,
        forecastAtStandardRate: {
          reach: r.forecast.reach,
          conversions: r.forecast.conversions,
          revenueInr: r.forecast.revenueInr,
          roas: r.forecast.roas,
        },
      }));
    }
    case "plan_campaign": {
      return planCampaign({
        category: String(input.category),
        budgetInr: Number(input.budget_inr),
        revenueGoalInr: input.revenue_goal_inr ? Number(input.revenue_goal_inr) : undefined,
        geo: input.geo ? String(input.geo) : undefined,
        targetGender: input.target_gender as "male" | "female" | "all" | undefined,
        priceInr: input.price_inr ? Number(input.price_inr) : undefined,
      });
    }
    case "predict_campaign": {
      const ids = (input.creator_ids as string[]).map(String);
      const budget = Number(input.budget_inr);
      const price = Number(input.price_inr);
      const db = await getDb();
      const cs = await db.select().from(creators).where(inArray(creators.id, ids));
      const auds = await db.select().from(audiences).where(inArray(audiences.creatorId, ids));
      const audByCreator = new Map(auds.map((a) => [a.creatorId, a]));
      const totalRate = cs.reduce((a, c) => a + c.ratePerCampaignInr, 0) || 1;
      const parts = cs.map((c) => {
        const spend = Math.round((c.ratePerCampaignInr / totalRate) * budget);
        return {
          creatorId: c.id,
          name: c.name,
          spendInr: spend,
          forecast: predictCreatorCampaign(c, audByCreator.get(c.id), spend, price, 0.7),
        };
      });
      return {
        perCreator: parts,
        aggregate: aggregateForecasts(parts.map((p) => ({ spendInr: p.spendInr, forecast: p.forecast }))),
      };
    }
    case "search_creators": {
      const rows = await searchCreators({
        niche: input.niche ? String(input.niche) : undefined,
        geo: input.geo ? String(input.geo) : undefined,
        minFollowers: input.min_followers ? Number(input.min_followers) : undefined,
        maxFeeInr: input.max_fee_inr ? Number(input.max_fee_inr) : undefined,
        query: input.query ? String(input.query) : undefined,
        limit: input.limit ? Number(input.limit) : 15,
      });
      return rows.map(({ creator: c, audience: a }) => ({
        creatorId: c.id,
        name: c.name,
        niche: c.niche,
        location: c.location,
        totalFollowers: c.totalFollowers,
        engagementRate: c.engagementRate,
        feeInr: c.ratePerCampaignInr,
        platforms: c.platforms,
        audienceQuality: c.audienceQuality,
        topics: c.contentTopics,
        topGeos: a?.topGeos,
        purchaseIntent: a?.purchaseIntent,
      }));
    }
    case "get_trends": {
      const t = await getTrendOpportunities(input.category ? String(input.category) : undefined);
      return t.map((x) => ({
        id: x.id,
        topic: x.topic,
        category: x.category,
        description: x.description,
        opportunityScore: x.opportunityScore,
        velocity: x.velocity,
        growthRateWoW: x.growthRateWoW,
        sentiment: x.sentiment,
        momentum: x.momentum,
        topGeos: x.topGeos,
        ridingCreators: x.ridingCreators,
      }));
    }
    case "get_campaign_performance": {
      const [reports, trackRecords, summary] = await Promise.all([
        getCampaignReports(),
        getCreatorTrackRecords(),
        getPlatformSummary(),
      ]);
      return { summary, campaigns: reports, creatorTrackRecords: trackRecords };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
