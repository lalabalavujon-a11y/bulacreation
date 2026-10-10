import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useDiagnostic } from "@/lib/diagnostic/context";
import { buildTwin, twinDigest, type TwinProfile } from "@/lib/diagnostic/twin";
import { twinReasoning } from "@/lib/diagnostic/twin.functions";
import { loadCommitments, type Commitment } from "@/lib/diagnostic/protocol";
import { loadInterventions, type Intervention } from "@/lib/diagnostic/interventions";
import { zoneMeta } from "@/lib/diagnostic/scoring";
import { PaywallGate } from "@/components/diagnostic/paywall";
import {
  Brain,
  Target,
  TrendingUp,
  Repeat,
  Activity,
  Sparkles,
  AlertCircle,
  Loader2,
  Send,
} from "lucide-react";

export const Route = createFileRoute("/twin")({
  head: () => ({
    meta: [
      { title: "Digital Twin — Creation Algorithm" },
      {
        name: "description",
        content:
          "Your Personal Digital Twin: a persistent longitudinal model that learns what actually causes you to move. Creation signature, behaviour pattern, trajectory, and intervention intelligence.",
      },
      { property: "og:title", content: "Digital Twin — Creation Algorithm" },
      {
        property: "og:description",
        content:
          "A persistent model of your aims, state, behaviour, constraints, trajectory, and outcomes — the AI learns what causes you to move.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TwinComponent,
});

function TwinComponent() {
  const { result, chiefAim, snapshots, philosophy } = useDiagnostic();
  const reason = useServerFn(twinReasoning);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [question, setQuestion] = useState("What should I focus on next based on my history?");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCommitments(loadCommitments());
    setInterventions(loadInterventions());
  }, []);

  const twin: TwinProfile = buildTwin(
    result,
    chiefAim,
    snapshots,
    commitments,
    interventions,
    philosophy,
  );
  const z = zoneMeta(result.zone);

  async function ask() {
    if (!question.trim() || loading) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const digest = twinDigest(twin);
      const res = await reason({ data: { twinDigest: digest, question: question.trim() } });
      if (res.ok) {
        setAnswer(res.content);
      } else {
        setError(res.error);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold-soft">Evolution 03</span>
        <h1 className="mt-1 flex items-center gap-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
          <Brain className="size-8 text-gold" /> Personal Digital Twin
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          A persistent longitudinal model that aggregates your aims, state, behaviour, constraints,
          trajectory, and intervention outcomes into a single coherent profile. Over time, the AI
          learns what actually causes <span className="text-foreground">you</span> to move — not
          generic advice.
        </p>
      </header>

      <PaywallGate
        feature="digitalTwin"
        title="Digital Twin"
        description="The Personal Digital Twin — your longitudinal model that learns what actually causes you to move — is part of Creation Performance."
      >
        {/* ── Readiness gate ─────────────────────────────────────────────── */}
        {!twin.ready ? (
          <div className="panel flex items-start gap-3 border-gold/20 p-5">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-gold-soft" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Twin is accumulating</p>
              <p className="mt-1">
                The twin needs at least <span className="text-gold">3 snapshots</span> and{" "}
                <span className="text-gold">3 settled interventions</span> to reason honestly. You
                have {twin.trajectory.snapshots} snapshot
                {twin.trajectory.snapshots === 1 ? "" : "s"} and {twin.whatWorks.settled} settled
                intervention
                {twin.whatWorks.settled === 1 ? "" : "s"}. Log milestones in the Trajectory module
                and complete 48-hour assignments in the Coach module to activate the twin.
              </p>
            </div>
          </div>
        ) : (
          <div className="panel flex items-center gap-3 border-gold/30 bg-gold/5 p-5">
            <Sparkles className="size-5 text-gold" />
            <p className="text-sm font-medium text-gold">
              Twin is live — the AI can now reason over your specific history.
            </p>
          </div>
        )}

        {/* ── Twin overview cards ────────────────────────────────────────── */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TwinCard
            icon={<Activity className="size-4 text-gold" />}
            label="Creation Voltage"
            value={twin.voltage.toLocaleString()}
            sub={z.label}
          />
          <TwinCard
            icon={<TrendingUp className="size-4 text-gold" />}
            label="Trajectory"
            value={twin.trajectory.trajectory}
            sub={`${twin.trajectory.snapshots} snapshots · ${twin.trajectory.weeksActive}w active`}
          />
          <TwinCard
            icon={<Target className="size-4 text-gold" />}
            label="Behaviour"
            value={twin.behaviour.pattern}
            sub={`${Math.round(twin.behaviour.completionRate * 100)}% completion`}
          />
          <TwinCard
            icon={<Brain className="size-4 text-gold" />}
            label="Interventions"
            value={`${twin.whatWorks.settled}`}
            sub={`${twin.whatWorks.pending} pending`}
          />
        </section>

        {/* ── Creation Signature ────────────────────────────────────────── */}
        <section className="panel p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Sparkles className="size-4 text-gold" /> Creation Signature
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Your distinctive profile — the strengths and weaknesses that make your pattern unique.
          </p>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gold-soft">
                Dominant strengths
              </div>
              <div className="mt-2 space-y-2">
                {twin.signature.strengths.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No strengths above 60% yet — keep auditing.
                  </p>
                ) : (
                  twin.signature.strengths.map((s) => (
                    <div key={s.name} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{s.name}</span>
                      <span className="font-display text-sm font-bold tabular-nums text-gold">
                        {s.efficiency}%
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Weakest domains (below 60%)
              </div>
              <div className="mt-2 space-y-2">
                {twin.signature.weaknesses.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    All pillars above 60% — no critical weakness.
                  </p>
                ) : (
                  twin.signature.weaknesses.map((s) => (
                    <div key={s.name} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{s.name}</span>
                      <span className="font-display text-sm font-bold tabular-nums text-muted-foreground">
                        {s.efficiency}%
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Recurring constraints ──────────────────────────────────────── */}
        {twin.recurringConstraints.length > 0 && (
          <section className="panel p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <Repeat className="size-4 text-gold" /> Recurring Constraints
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Where you keep getting stuck — the points the AI keeps targeting because they keep
              resurfacing.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {twin.recurringConstraints.map((c) => (
                <div
                  key={c.pointId}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2"
                >
                  <span className="text-sm font-medium text-foreground">
                    #{c.pointId} {c.name}
                  </span>
                  <span className="rounded-full bg-gold/15 px-1.5 py-0.5 text-[10px] font-bold text-gold">
                    {c.count}×
                  </span>
                  <span className="text-[10px] text-muted-foreground">{c.pillar}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── What works for you ─────────────────────────────────────────── */}
        {twin.whatWorks.ready && (
          <section className="panel border-gold/20 p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <Activity className="size-4 text-gold" /> What Works For You
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              The twin has learned what intervention types actually produce movement for you.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-md border border-gold/30 bg-gold/5 p-3">
                <div className="text-[10px] uppercase tracking-wider text-gold-soft">
                  Mean ΔV (completed)
                </div>
                <div className="mt-1 font-display text-2xl font-bold tabular-nums text-gold">
                  {twin.whatWorks.meanDeltaDone > 0 ? "+" : ""}
                  {Math.round(twin.whatWorks.meanDeltaDone)}
                </div>
              </div>
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Mean ΔV (missed)
                </div>
                <div className="mt-1 font-display text-2xl font-bold tabular-nums">
                  {twin.whatWorks.meanDeltaMissed > 0 ? "+" : ""}
                  {Math.round(twin.whatWorks.meanDeltaMissed)}
                </div>
              </div>
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Net movement
                </div>
                <div className="mt-1 font-display text-2xl font-bold tabular-nums">
                  {twin.whatWorks.netMovement > 0 ? "+" : ""}
                  {Math.round(twin.whatWorks.netMovement)}
                </div>
              </div>
            </div>
            {twin.whatWorks.bySource.length > 0 && (
              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Effectiveness by mentor persona
                </div>
                <div className="mt-2 space-y-1.5">
                  {twin.whatWorks.bySource.map((s) => (
                    <div
                      key={s.source}
                      className="flex items-center gap-3 rounded-md border border-border bg-muted/20 px-3 py-2"
                    >
                      <span className="flex-1 text-xs font-medium capitalize text-foreground">
                        {s.source}
                      </span>
                      <span className="text-[10px] tabular-nums text-muted-foreground">
                        {s.count}×
                      </span>
                      <span
                        className={
                          "font-display text-sm font-bold tabular-nums " +
                          (s.meanDelta > 0 ? "text-gold" : "text-muted-foreground")
                        }
                      >
                        {s.meanDelta > 0 ? "+" : ""}
                        {Math.round(s.meanDelta)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Twin narrative ─────────────────────────────────────────────── */}
        <section className="panel p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Brain className="size-4 text-gold" /> Twin Narrative
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Auto-generated from your accumulated data. This is how the AI sees you.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-foreground">{twin.narrative}</p>
        </section>

        {/* ── Ask the Twin ────────────────────────────────────────────────── */}
        <section className="panel p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Sparkles className="size-4 text-gold" /> Ask Your Twin
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            The AI reasons over your specific longitudinal history — not generic advice. Best used
            when the twin is live (3+ snapshots + 3+ settled interventions).
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  ask();
                }
              }}
              rows={2}
              placeholder="What should I focus on next based on my history?"
              className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={ask}
              disabled={loading || !question.trim()}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Ask
            </button>
          </div>
          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {answer && (
            <div className="mt-3 rounded-md border border-gold/30 bg-gold/5 p-4 text-sm leading-relaxed text-foreground">
              {answer}
            </div>
          )}
        </section>
      </PaywallGate>
    </div>
  );
}

function TwinCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="panel p-4">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="mt-2 font-display text-xl font-bold capitalize text-foreground">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}
