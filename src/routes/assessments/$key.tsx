import { accountStorage } from "@/lib/diagnostic/local-storage";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import type { GPillarResult } from "@/lib/assessment/engine";
import { getAssessment } from "@/lib/assessment/registry";
import { computeGenericScore, type GenericScores } from "@/lib/assessment/engine";
import { ArrowRight, Zap, RotateCcw, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { useSubscription } from "@/lib/diagnostic/subscription-context";
import { planRank } from "@/lib/diagnostic/subscription";

export const Route = createFileRoute("/assessments/$key")({
  head: () => ({
    meta: [
      { title: "Diagnostic — Creation Assessment Engine" },
      {
        name: "description",
        content:
          "Run a weighted multi-pillar diagnostic with bottleneck ranking and a gating governor. Find your highest-leverage constraint.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssessmentRunner,
});

const LS_PREFIX = "assessment-scores-";

function AssessmentRunner() {
  const { key } = useParams({ from: "/assessments/$key" });
  const def = getAssessment(key);
  const { entitlements, hydrated: subHydrated } = useSubscription();
  const isCoachPro = planRank(entitlements.plan) >= 4;

  const [scores, setScores] = useState<GenericScores>({});
  const [hydrated, setHydrated] = useState(false);
  const [openPillar, setOpenPillar] = useState<number | null>(0);
  const [showAllBottlenecks, setShowAllBottlenecks] = useState(false);

  useEffect(() => {
    if (!def) return;
    try {
      const raw = accountStorage.getItem(LS_PREFIX + def.key);
      if (raw) setScores(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [def]);

  useEffect(() => {
    if (!hydrated || !def) return;
    try {
      accountStorage.setItem(LS_PREFIX + def.key, JSON.stringify(scores));
    } catch {
      /* ignore */
    }
  }, [scores, def, hydrated]);

  const result = useMemo(() => (def ? computeGenericScore(def, scores) : null), [def, scores]);

  if (!def || !result) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Assessment not found.</p>
        <Link
          to="/assessments"
          className="inline-flex items-center gap-2 text-sm font-medium text-gold"
        >
          <ArrowRight className="size-4 rotate-180" /> Back to assessments
        </Link>
      </div>
    );
  }

  // Coach-Pro-gated diagnostic: block non-Coach-Pro users until they upgrade.
  if (def.coachProOnly && subHydrated && !isCoachPro) {
    return (
      <div className="space-y-6">
        <Link
          to="/assessments"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="size-3 rotate-180" /> All assessments
        </Link>
        <div className="panel flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-gold/10">
            <Lock className="size-6 text-gold" />
          </div>
          <div className="flex-1 space-y-2">
            <h1 className="font-display text-2xl font-bold">{def.name}</h1>
            <p className="text-sm text-muted-foreground">
              This diagnostic is part of the Coach Pro library. Upgrade to Creation Coach Pro to
              unlock the full portfolio of diagnostics — Diver Readiness, Financial Readiness,
              Property Performance, Rugby Personal Development, and Sales &amp; Marketing.
            </p>
          </div>
          <Link
            to="/pricing"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Upgrade to Coach Pro <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  const maxScore = result.maxScore;
  const pct = maxScore > 0 ? (result.finalRounded / maxScore) * 100 : 0;
  const top3 = result.bottlenecks.slice(0, 3);
  const shownBottlenecks = showAllBottlenecks ? result.bottlenecks : top3;

  function setTier(pointId: number, value: number) {
    setScores((prev) => ({ ...prev, [pointId]: value }));
  }

  function reset() {
    setScores({});
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <Link
          to="/assessments"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="size-3 rotate-180" /> All assessments
        </Link>
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{def.name}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{def.description}</p>
      </header>

      {/* Score summary */}
      <section className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <div className="panel flex flex-col items-center justify-center gap-3 p-8">
          <div className="text-[11px] uppercase tracking-[0.25em] text-gold-soft">
            {def.indexLabel}
          </div>
          <div className="font-display text-5xl font-bold tabular-nums gold-text">
            {result.finalRounded.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">/ {maxScore.toLocaleString()}</div>
          <div className="mt-1 rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
            {result.zoneLabel}
          </div>
          {def.gatingPointId != null && (
            <div className="mt-1 text-center text-xs text-muted-foreground">
              Governor at {Math.round(result.gatingFactor * 100)}%
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Kpi
            label="Raw Points"
            value={Math.round(result.raw).toLocaleString()}
            sub="Pre-governor"
          />
          <Kpi
            label="Governor"
            value={`${Math.round(result.gatingFactor * 100)}%`}
            sub="Gating factor"
            accent
          />
          <Kpi label="Answered" value={`${result.answered}/${result.totalPoints}`} sub="Coverage" />
          <Kpi label="Max Index" value={maxScore.toLocaleString()} sub="Full marks" />
          <Kpi label="Index %" value={`${Math.round(pct)}%`} sub="Of maximum" />
          <Kpi label="Bottlenecks" value={`${result.bottlenecks.length}`} sub="Open deficits" />
        </div>
      </section>

      {/* Zone note */}
      <section className="panel p-5">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{result.zoneLabel}.</span> {result.zoneNote}
        </p>
      </section>

      {/* Top leverage */}
      <section className="panel p-6">
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-gold" />
          <h2 className="font-display text-lg font-semibold">Highest-Leverage Constraints</h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Ranked by immediate yield (deficit × weight). Fix these first.
        </p>
        {shownBottlenecks.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No open deficits — every point is optimised. Hold the standard.
          </p>
        ) : (
          <>
            <div className="mt-4 space-y-3">
              {shownBottlenecks.map((b, i) => (
                <div
                  key={b.point.id}
                  className="flex items-center gap-4 rounded-md border border-border bg-muted/30 p-4"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold/15 font-display text-sm font-bold text-gold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      #{b.point.id} · {b.point.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{b.point.focus}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold tabular-nums text-gold">
                      +{Math.round(b.deficit)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">points available</div>
                  </div>
                </div>
              ))}
            </div>
            {result.bottlenecks.length > 3 && (
              <button
                onClick={() => setShowAllBottlenecks((v) => !v)}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-gold hover:text-gold-bright"
              >
                {showAllBottlenecks ? (
                  <>
                    <ChevronUp className="size-3.5" /> Show top 3 only
                  </>
                ) : (
                  <>
                    <ChevronDown className="size-3.5" /> Show all {result.bottlenecks.length}{" "}
                    bottlenecks
                  </>
                )}
              </button>
            )}
          </>
        )}
      </section>

      {/* Pillar equilibrium — radar + ledger */}
      <section className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <div className="panel flex flex-col items-center gap-3 p-6">
          <h2 className="font-display text-lg font-semibold self-start">Pillar Equilibrium</h2>
          <p className="text-xs text-muted-foreground self-start -mt-1">
            6-axis radar · dashed ring is the 60% operative threshold.
          </p>
          <PillarRadar pillars={result.pillars} />
        </div>

        <div className="panel p-6">
          <h2 className="font-display text-lg font-semibold">Pillar Ledger</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Earned points against each pillar cap. Deficit is unlocked yield.
          </p>
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
                <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{Math.round(p.efficiency * 100)}% efficiency</span>
                  <span className={p.deficit > 0 ? "text-gold-soft" : "text-muted-foreground"}>
                    {p.deficit > 0 ? `${Math.round(p.deficit)} deficit` : "Cleared"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Point scoring — collapsible per pillar */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Score the Points</h2>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5" /> Reset
          </button>
        </div>
        {def.pillars.map((pillar) => {
          const pts = def.points.filter((p) => p.pillar === pillar.index);
          const open = openPillar === pillar.index;
          return (
            <div key={pillar.index} className="panel overflow-hidden">
              <button
                onClick={() => setOpenPillar(open ? null : pillar.index)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <div>
                  <div className="font-display text-sm font-semibold">
                    <span className="text-gold-soft">{pillar.roman}.</span> {pillar.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{pillar.focus}</div>
                </div>
                {open ? (
                  <ChevronUp className="size-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-4 text-muted-foreground" />
                )}
              </button>
              {open && (
                <div className="divide-y divide-border border-t border-border">
                  {pts.map((p) => {
                    const current = scores[p.id] ?? -1;
                    return (
                      <div key={p.id} className="px-5 py-3">
                        <div className="flex items-baseline justify-between gap-3">
                          <div>
                            <span className="text-sm font-medium">
                              #{p.id} · {p.name}
                              {p.gating && (
                                <span className="ml-2 rounded bg-gold/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-gold">
                                  Governor
                                </span>
                              )}
                            </span>
                            <p className="text-xs text-muted-foreground">{p.focus}</p>
                          </div>
                          <span className="text-[10px] tabular-nums text-muted-foreground">
                            w{p.weight}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {def.tiers.map((t) => (
                            <button
                              key={t.value}
                              onClick={() => setTier(p.id, t.value)}
                              className={
                                "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors " +
                                (current === t.value
                                  ? "border-gold/50 bg-gold/15 text-gold"
                                  : "border-border text-muted-foreground hover:text-foreground")
                              }
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}

function Kpi({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className="panel p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className={
          "mt-1 font-display text-2xl font-bold tabular-nums " + (accent ? "gold-text" : "")
        }
      >
        {value}
      </div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function PillarRadar({ pillars, size = 320 }: { pillars: GPillarResult[]; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 40;
  const n = pillars.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i: number, rad: number) => [
    cx + Math.cos(angle(i)) * rad,
    cy + Math.sin(angle(i)) * rad,
  ];

  const dataPts = pillars.map((p, i) => pt(i, r * p.efficiency));
  const dataPath = dataPts.map((p) => p.join(",")).join(" ");
  const thresholdPts = pillars.map((_, i) => pt(i, r * 0.6));
  const thresholdPath = thresholdPts.map((p) => p.join(",")).join(" ");
  const grid = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <svg width={size} height={size} className="mx-auto">
      {grid.map((g) => {
        const pts = pillars.map((_, i) => pt(i, r * g).join(",")).join(" ");
        return (
          <polygon
            key={g}
            points={pts}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1}
            opacity={g === 0.6 ? 0.6 : 0.3}
          />
        );
      })}
      <polygon
        points={thresholdPath}
        fill="none"
        stroke="var(--gold)"
        strokeWidth={1.5}
        strokeDasharray="4 4"
        opacity={0.7}
      />
      {pillars.map((_, i) => {
        const [x, y] = pt(i, r);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="var(--border)"
            strokeWidth={1}
            opacity={0.4}
          />
        );
      })}
      <polygon
        points={dataPath}
        fill="var(--gold)"
        fillOpacity={0.18}
        stroke="var(--gold-bright)"
        strokeWidth={2}
      />
      {dataPts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={3.5} fill="var(--gold-bright)" />
      ))}
      {pillars.map((p, i) => {
        const [x, y] = pt(i, r + 18);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground"
            style={{ fontSize: 10, fontFamily: "var(--font-display)" }}
          >
            {p.roman}
          </text>
        );
      })}
    </svg>
  );
}
