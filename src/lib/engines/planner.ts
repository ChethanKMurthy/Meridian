import { recommendCreators, type ScoredCreator } from "./recommendation";
import { predictCreatorCampaign, aggregateForecasts, type Forecast } from "./prediction";

export type PlanInput = {
  category: string;
  budgetInr: number;
  revenueGoalInr?: number;
  geo?: string;
  targetGender?: "male" | "female" | "all";
  priceInr?: number;
};

export type Allocation = {
  creatorId: string;
  name: string;
  niche: string;
  matchScore: number;
  feeInr: number;
  forecast: Forecast;
  rationale: string[];
};

export type CampaignPlan = {
  input: PlanInput;
  allocations: Allocation[];
  totalSpendInr: number;
  remainingBudgetInr: number;
  forecast: Forecast;
  goalCoverage: number | null; // % of revenue goal covered by expected revenue
  risks: string[];
};

// Greedy budget allocation: highest predicted-revenue-per-rupee first, with a
// diversification cap so one niche doesn't absorb the whole budget.
export async function planCampaign(input: PlanInput): Promise<CampaignPlan> {
  const candidates = await recommendCreators({
    category: input.category,
    budgetInr: input.budgetInr,
    geo: input.geo,
    targetGender: input.targetGender,
    priceInr: input.priceInr,
    limit: 20,
  });

  const byEfficiency = [...candidates].sort(
    (a, b) =>
      b.forecast.revenueInr / b.creator.ratePerCampaignInr -
      a.forecast.revenueInr / a.creator.ratePerCampaignInr
  );

  const allocations: Allocation[] = [];
  const nicheSpend = new Map<string, number>();
  let remaining = input.budgetInr;

  for (const cand of byEfficiency) {
    if (allocations.length >= 8) break;
    const fee = cand.creator.ratePerCampaignInr;
    if (fee > remaining) continue;
    if (cand.matchScore < 35) continue;
    const nicheTotal = (nicheSpend.get(cand.creator.niche) ?? 0) + fee;
    if (allocations.length >= 2 && nicheTotal > input.budgetInr * 0.65) continue;

    allocations.push({
      creatorId: cand.creator.id,
      name: cand.creator.name,
      niche: cand.creator.niche,
      matchScore: cand.matchScore,
      feeInr: fee,
      forecast: cand.forecast,
      rationale: cand.rationale,
    });
    nicheSpend.set(cand.creator.niche, nicheTotal);
    remaining -= fee;
    if (remaining < 100000) break;
  }

  const forecast = aggregateForecasts(
    allocations.map((a) => ({ spendInr: a.feeInr, forecast: a.forecast }))
  );
  const totalSpend = input.budgetInr - remaining;

  const risks = assessRisks(input, allocations, candidates, forecast);
  const goalCoverage = input.revenueGoalInr
    ? Math.round((forecast.revenueInr / input.revenueGoalInr) * 100)
    : null;
  if (goalCoverage !== null && goalCoverage < 80) {
    risks.push(
      `Expected revenue covers only ${goalCoverage}% of the goal — consider raising budget, lowering the goal, or adding performance channels.`
    );
  }

  return {
    input,
    allocations,
    totalSpendInr: totalSpend,
    remainingBudgetInr: remaining,
    forecast,
    goalCoverage,
    risks,
  };
}

function assessRisks(
  input: PlanInput,
  allocations: Allocation[],
  candidates: ScoredCreator[],
  forecast: Forecast
): string[] {
  const risks: string[] = [];
  if (allocations.length === 0) {
    risks.push("No affordable creators matched this category — broaden the category or raise the budget.");
    return risks;
  }
  if (allocations.length <= 2) {
    risks.push("Concentration risk: fewer than 3 creators carry the whole budget.");
  }
  const topShare = Math.max(...allocations.map((a) => a.feeInr)) / Math.max(1, allocations.reduce((s, a) => s + a.feeInr, 0));
  if (topShare > 0.55) {
    risks.push("Over 55% of spend sits with a single creator — outcomes hinge on one bet.");
  }
  const fraudFlagged = allocations.filter((a) => {
    const c = candidates.find((x) => x.creator.id === a.creatorId);
    return c && c.creator.fraudRisk >= 10;
  });
  if (fraudFlagged.length > 0) {
    risks.push(`Elevated fraud risk on: ${fraudFlagged.map((f) => f.name).join(", ")} — verify audience before contracting.`);
  }
  if (forecast.confidence < 0.55) {
    risks.push("Low forecast confidence — limited historical data for parts of this lineup; start with a pilot tranche.");
  }
  const noHistory = allocations.filter((a) => {
    const c = candidates.find((x) => x.creator.id === a.creatorId);
    return c && c.historicalRoas === null;
  });
  if (noHistory.length > 0) {
    risks.push(`First campaign on platform for: ${noHistory.map((f) => f.name).join(", ")} — forecasts use category baselines.`);
  }
  return risks;
}

export { predictCreatorCampaign };
