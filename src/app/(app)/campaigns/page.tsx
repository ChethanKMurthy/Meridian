import { getCampaignReports, getPlatformSummary } from "@/lib/engines/attribution";
import { formatInr } from "@/lib/format";
import { PageHeader, StatCard, Pill, Th, Td } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const [reports, summary] = await Promise.all([getCampaignReports(), getPlatformSummary()]);

  return (
    <div>
      <PageHeader
        title="Campaign Attribution"
        subtitle="Predicted versus realized outcomes. Every campaign sharpens the prediction engine."
      />
      <div className="space-y-6 px-8 py-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatCard label="Active" value={summary.campaignsActive} tone="accent" />
          <StatCard label="Completed" value={summary.campaignsCompleted} />
          <StatCard label="Total Spend" value={formatInr(summary.totalSpendInr)} />
          <StatCard label="Attributed Revenue" value={formatInr(summary.totalAttributedRevenueInr)} tone="positive" />
          <StatCard
            label="Forecast Error"
            value={summary.avgForecastErrorPct != null ? `±${summary.avgForecastErrorPct}%` : "—"}
            hint="avg ROAS deviation"
          />
        </div>

        <div className="space-y-4">
          {reports.map((r) => (
            <div key={r.id} className="card overflow-hidden">
              <div className="flex items-center gap-3 border-b border-edge px-4 py-3">
                <div>
                  <div className="text-[14px] font-medium">{r.name}</div>
                  <div className="text-[11.5px] text-faint">
                    {r.brand} · {r.product} · {r.objective}
                  </div>
                </div>
                <Pill tone={r.status === "active" ? "info" : "default"}>{r.status}</Pill>
                <div className="ml-auto flex items-center gap-6 font-mono text-[12.5px]">
                  <span className="text-muted">
                    Spend {formatInr(r.spendInr)} / {formatInr(r.budgetInr)}
                  </span>
                  <span className="text-muted">
                    Pred{" "}
                    <span className="text-foreground">{r.predictedRoas != null ? `${r.predictedRoas}x` : "—"}</span>
                  </span>
                  <span className="text-muted">
                    Actual{" "}
                    {r.actualRoas != null ? (
                      <span className={r.actualRoas >= (r.predictedRoas ?? 0) ? "text-positive" : "text-accent"}>
                        {r.actualRoas}x
                      </span>
                    ) : (
                      <span className="text-faint">in flight</span>
                    )}
                  </span>
                  {r.forecastErrorPct != null && (
                    <span className="text-faint">±{r.forecastErrorPct}%</span>
                  )}
                </div>
              </div>
              <table className="w-full">
                <thead className="border-b border-edge/60">
                  <tr>
                    <Th>Creator</Th>
                    <Th right>Fee</Th>
                    <Th right>Conversions</Th>
                    <Th right>Revenue</Th>
                    <Th right>ROAS</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-edge/40">
                  {r.creators.map((c) => (
                    <tr key={c.creatorId} className="hover:bg-surface-2/40">
                      <Td>{c.name}</Td>
                      <Td right mono>{formatInr(c.feeInr)}</Td>
                      <Td right mono>{c.conversions ?? "—"}</Td>
                      <Td right mono>{c.actualRevenueInr != null ? formatInr(c.actualRevenueInr) : "—"}</Td>
                      <Td right>
                        {c.actualRoas != null ? (
                          <span className={`font-mono ${c.actualRoas >= 3 ? "text-positive" : c.actualRoas < 1.5 ? "text-negative" : ""}`}>
                            {c.actualRoas}x
                          </span>
                        ) : (
                          <span className="text-faint">—</span>
                        )}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
