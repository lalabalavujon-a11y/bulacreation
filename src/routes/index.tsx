import { createFileRoute, Link } from "@tanstack/react-router";
import { useDiagnostic } from "@/lib/diagnostic/context";
import { zoneMeta } from "@/lib/diagnostic/scoring";
import { PILLARS } from "@/lib/diagnostic/points";
import { ScoreRing, RadarChart, ZoneBadge, KpiCard } from "@/components/diagnostic/charts";
import { CloudSyncPanel } from "@/components/diagnostic/cloud-sync-panel";
import { PhilosophySelector } from "@/components/diagnostic/philosophy-selector";
import { CreationPlanPanel } from "@/components/diagnostic/creation-plan-panel";
import { RetentionSignals } from "@/components/diagnostic/retention-signals";
import { ArrowRight, Zap, TrendingUp, Target } from "lucide-react";

const OG_IMAGE =
  "https://vibe.filesafe.space/1790355857187699269/assets/775d4b64-c105-4de4-89d5-5535d60b0c4b.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Bula Creation Algorithm" },
      {
        name: "description",
        content:
          "Bula Creation: Your personal operating system for goal execution. Live Creation Voltage, pillar analytics, and your AI-generated execution plan.",
      },
      { property: "og:title", content: "Bula Creation — AI Goal Execution System" },
      {
        property: "og:description",
        content:
          "Turn your single most important goal into a measurable feedback loop. Diagnose the constraint, prescribe the next move, track whether you moved with Bula Creation.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
  }),
  component: OverviewComponent,
});

function OverviewComponent() {
  const { result, snapshots, chiefAim, philosophy } = useDiagnostic();
  const zone = zoneMeta(result.zone);
  const peak = snapshots.reduce((m, s) => Math.max(m, s.final), 0);
  const delta =
    snapshots.length >= 2
      ? snapshots[snapshots.length - 1].final - snapshots[snapshots.length - 2].final
      : 0;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold-soft">
          AI Goal Execution System
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          What are you <span className="gold-text">creating?</span>
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          {chiefAim.text ? (
            <>
              Your Chief Aim: <span className="text-foreground">{chiefAim.text}</span>
            </>
          ) : (
            "Define your single, definite Chief Aim in the Audit module to centre the entire system on it."
          )}
        </p>
      </header>

      {/* Chief Aim centred — the question that drives everything */}
      <section className="panel grid gap-4 p-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <Target className="size-4 text-gold" />
            <h2 className="font-display text-lg font-semibold">Chief Aim</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {chiefAim.text ||
              "No chief aim defined yet. Everything in Creation answers: does this move the aim?"}
          </p>
          {chiefAim.text && (
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span>
                Believability: <span className="text-gold">{chiefAim.believability}/10</span>
              </span>
              <span>Specificity: {chiefAim.specificity ? "set" : "—"}</span>
              <span>Disgust factor: {chiefAim.disgust ? "set" : "—"}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Link
            to="/audit"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Run Audit <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/leverage"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Zap className="size-4 text-gold" /> Find Leverage
          </Link>
        </div>
      </section>

      {/* Creation Plan — the flagship "here's your move" panel */}
      <CreationPlanPanel />

      {/* Loop health — retention / anti-churn signals */}
      <RetentionSignals />

      {/* Score + KPIs */}
      <section className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <div className="panel flex flex-col items-center justify-center gap-4 p-8">
          <ScoreRing result={result} />
          <ZoneBadge result={result} />
          <div className="text-center text-xs text-muted-foreground">
            Teachability governor at {Math.round(result.teachabilityFactor * 100)}%
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <KpiCard
            label="Raw Points"
            value={Math.round(result.raw).toLocaleString()}
            sub="Pre-governor output"
          />
          <KpiCard
            label="Teachability"
            value={`${Math.round(result.teachabilityFactor * 100)}%`}
            sub="Point #2 governor"
            accent
          />
          <KpiCard label="Points Answered" value={`${result.answered}/40`} sub="Audit coverage" />
          <KpiCard
            label="Peak Voltage"
            value={peak ? peak.toLocaleString() : "—"}
            sub="Historical high"
          />
          <KpiCard
            label="Net Delta"
            value={delta ? `${delta > 0 ? "+" : ""}${delta}` : "—"}
            sub="Last snapshot Δ"
          />
          <KpiCard label="Snapshots" value={`${snapshots.length}`} sub="Trajectory logs" />
        </div>
      </section>

      <CloudSyncPanel />

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-6">
          <h2 className="font-display text-lg font-semibold">Pillar Equilibrium</h2>
          <p className="mb-2 text-xs text-muted-foreground">
            Dashed line = 60% execution threshold (6,000 pts)
          </p>
          <RadarChart result={result} />
        </div>

        <div className="panel p-6">
          <h2 className="font-display text-lg font-semibold">Pillar Ledger</h2>
          <div className="mt-4 space-y-3">
            {result.pillars.map((p) => (
              <div key={p.index}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    <span className="text-gold-soft">{p.roman}.</span> {p.name}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {Math.round(p.earned)} / {p.max}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${p.efficiency * 100}%`,
                      background: p.efficiency >= 0.6 ? "var(--gold-bright)" : "var(--gold-soft)",
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy selector */}
      <PhilosophySelector />

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Target,
            title: "Friction Zone",
            body: "0–3,999. Random chaos. Re-anchor the 4 basics and teachability.",
            active: result.zone === "friction",
          },
          {
            icon: Zap,
            title: "Emergence Zone",
            body: "4,000–5,999. Transitional momentum. Clear counter-intentions.",
            active: result.zone === "emergence",
          },
          {
            icon: TrendingUp,
            title: "Execution Active",
            body: "6,000–10,000. Execution loop sustained. Hold the standard.",
            active: result.zone === "operative",
          },
        ].map((c) => (
          <div key={c.title} className={`panel p-5 ${c.active ? "gold-glow" : ""}`}>
            <c.icon
              className={`size-5 ${c.active ? "text-gold-bright" : "text-muted-foreground"}`}
            />
            <h3 className="mt-3 font-display text-base font-semibold">{c.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{c.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
