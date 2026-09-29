import { createFileRoute } from "@tanstack/react-router";
import { useDiagnostic } from "@/lib/diagnostic/context";
import { zoneMeta } from "@/lib/diagnostic/scoring";
import { RadarChart, KpiCard } from "@/components/diagnostic/charts";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Pillar Analytics — Creation Algorithm" },
      {
        name: "description",
        content:
          "Pillar analytics: 6-axis radar and live efficiency table against the 6,000-point execution threshold.",
      },
      { property: "og:title", content: "Pillar Analytics — Creation Algorithm" },
      {
        property: "og:description",
        content: "6-axis pillar radar and live efficiency table against the execution threshold.",
      },
    ],
  }),
  component: AnalyticsComponent,
});

function AnalyticsComponent() {
  const { result } = useDiagnostic();
  const zone = zoneMeta(result.zone);

  return (
    <div className="space-y-8">
      <header>
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold-soft">Module 02</span>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Pillar Analytics
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Pillar equilibrium charted against the 60% (6,000-point) execution threshold line.
          Identify imbalance and deficit to target your highest-leverage intervention.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-6">
          <h2 className="font-display text-lg font-semibold">6-Axis Radar</h2>
          <RadarChart result={result} size={340} />
          <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2.5 rounded-full bg-gold-bright" /> Current profile
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-0 w-4 border-t border-dashed border-gold" /> Execution
              threshold
            </span>
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="font-display text-lg font-semibold">Efficiency Table</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-2 pr-3 font-medium">Pillar</th>
                  <th className="pb-2 pr-3 text-right font-medium">Earned</th>
                  <th className="pb-2 pr-3 text-right font-medium">Max</th>
                  <th className="pb-2 pr-3 text-right font-medium">Deficit</th>
                  <th className="pb-2 font-medium">Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {result.pillars.map((p) => (
                  <tr key={p.index}>
                    <td className="py-2.5 pr-3">
                      <span className="text-gold-soft">{p.roman}.</span> {p.name}
                    </td>
                    <td className="py-2.5 pr-3 text-right tabular-nums">{Math.round(p.earned)}</td>
                    <td className="py-2.5 pr-3 text-right tabular-nums text-muted-foreground">
                      {p.max}
                    </td>
                    <td className="py-2.5 pr-3 text-right tabular-nums text-muted-foreground">
                      {Math.round(p.deficit)}
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${p.efficiency * 100}%`,
                              background:
                                p.efficiency >= 0.6 ? "var(--gold-bright)" : "var(--gold-soft)",
                            }}
                          />
                        </div>
                        <span className="tabular-nums text-xs text-muted-foreground">
                          {Math.round(p.efficiency * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border">
                  <td className="pt-2.5 font-semibold">Total</td>
                  <td className="pt-2.5 text-right tabular-nums font-semibold">
                    {Math.round(result.raw)}
                  </td>
                  <td className="pt-2.5 text-right tabular-nums text-muted-foreground">10,000</td>
                  <td className="pt-2.5 text-right tabular-nums text-muted-foreground">
                    {10000 - Math.round(result.raw)}
                  </td>
                  <td className="pt-2.5 text-xs text-muted-foreground">
                    Final: {result.finalRounded.toLocaleString()} ({zone.label})
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="Final Voltage" value={result.finalRounded.toLocaleString()} accent />
        <KpiCard label="Raw Output" value={Math.round(result.raw).toLocaleString()} />
        <KpiCard label="Governor" value={`${Math.round(result.teachabilityFactor * 100)}%`} />
        <KpiCard label="Zone" value={zone.label.split(" ")[0]} />
      </section>
    </div>
  );
}
