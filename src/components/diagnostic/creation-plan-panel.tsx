// Creation Plan panel — renders the AI-generated execution plan on the
// Overview page. Shows Chief Aim, Voltage, Primary Constraint, Why,
// 72-hour intervention, this week's actions, distractions to avoid, and
// next audit date. "BEGIN EXECUTION" converts the plan into tracked
// commitments.

import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useDiagnostic } from "@/lib/diagnostic/context";
import { zoneMeta } from "@/lib/diagnostic/scoring";
import { generateCreationPlan, type CreationPlan } from "@/lib/diagnostic/creation-plan.functions";
import { buildCoachContext, formatContextBlock } from "@/lib/diagnostic/coach-context";
import { PHILOSOPHIES } from "@/lib/diagnostic/philosophy";
import {
  parseAssignment,
  saveCommitments,
  loadCommitments,
  type Commitment,
} from "@/lib/diagnostic/protocol";
import { recordIntervention } from "@/lib/diagnostic/interventions";
import { cn } from "@/lib/utils";
import {
  Rocket,
  Loader2,
  Target,
  Zap,
  Ban,
  CalendarClock,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

export function CreationPlanPanel() {
  const { result, chiefAim, philosophy, creationPlan: plan, setCreationPlan: setPlan } = useDiagnostic();
  const generate = useServerFn(generateCreationPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executed, setExecuted] = useState(false);

  const phil = PHILOSOPHIES[philosophy];
  const persona = phil.defaultPersona;
  const zone = zoneMeta(result.zone);
  const topBottleneck = result.bottlenecks[0];

  async function generatePlan() {
    if (!topBottleneck) {
      setError("No bottlenecks detected — every answered point is at Mastered.");
      return;
    }
    setLoading(true);
    setError(null);
    setExecuted(false);
    try {
      const ctx = buildCoachContext(result, chiefAim, "none");
      const res = await generate({ data: {
        persona,
        philosophy,
        voltage: result.finalRounded,
        zone: result.zone,
        chiefAim: chiefAim.text || "(not yet defined)",
        believability: chiefAim.believability,
        constraintId: topBottleneck.point.id,
        constraintName: topBottleneck.point.name,
        constraintTier:
          ["Friction", "Emerging", "Aligned", "Mastered"][
            [0, 0.33, 0.66, 1].indexOf(topBottleneck.tier)
          ] || "Friction",
        openCommitments: 0,
        contextBlock: formatContextBlock(ctx),
      } });
      setPlan(res);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function beginExecution() {
    if (!plan) return;
    // Convert the 72h intervention + this week's actions into tracked commitments.
    const existing = loadCommitments();
    const newCmts: Commitment[] = [];
    const now = Date.now();
    const voltage = result.finalRounded;

    const { commitment } = parseAssignment(`ASSIGNMENT: ${plan.intervention72h}`, persona);
    if (commitment) {
      newCmts.push(commitment);
      recordIntervention({
        commitmentId: commitment.id,
        label: commitment.text,
        source: persona,
        pointId: plan.constraintId,
        voltageAtPrescription: voltage,
      });
    }

    plan.thisWeek.forEach((action) => {
      const c = parseAssignment(`ASSIGNMENT: ${action}`, persona).commitment;
      if (c) {
        // Weekly actions get a 7-day deadline.
        c.dueTs = now + 7 * 24 * 60 * 60 * 1000;
        newCmts.push(c);
        recordIntervention({
          commitmentId: c.id,
          label: c.text,
          source: persona,
          pointId: plan.constraintId,
          voltageAtPrescription: voltage,
        });
      }
    });

    saveCommitments([...newCmts, ...existing]);
    setExecuted(true);
  }

  return (
    <section className="panel gold-glow p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Rocket className="size-4 text-gold" />
          <h2 className="font-display text-lg font-semibold">Your Creation Plan</h2>
        </div>
        {!plan && !loading && (
          <button
            onClick={generatePlan}
            disabled={!topBottleneck}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <Zap className="size-4" /> Generate Plan
          </button>
        )}
        {plan && !executed && (
          <button
            onClick={generatePlan}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="size-3.5" /> Regenerate
          </button>
        )}
      </div>

      {loading && (
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-gold" />
          Generating your execution plan...
        </div>
      )}

      {error && !loading && (
        <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}

      {!plan && !loading && !error && (
        <p className="mt-3 text-sm text-muted-foreground">
          Run an audit, then generate a personalised execution plan. The AI identifies your
          highest-leverage constraint and prescribes exactly what to do next — not just a score.
        </p>
      )}

      {plan && !loading && (
        <div className="mt-5 space-y-4">
          {/* Header row */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Chief Aim
              </div>
              <div className="mt-1 text-sm font-medium text-foreground">{plan.chiefAim}</div>
            </div>
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Creation Voltage
              </div>
              <div className="mt-1 font-display text-lg font-bold tabular-nums text-gold">
                {plan.voltage.toLocaleString()}{" "}
                <span className="text-xs font-normal text-muted-foreground">— {zone.label}</span>
              </div>
            </div>
          </div>

          {/* Primary constraint */}
          <div className="rounded-md border border-gold/30 bg-gold/5 p-4">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-gold" />
              <span className="text-[10px] uppercase tracking-wider text-gold-soft">
                Primary Constraint
              </span>
            </div>
            <div className="mt-1 text-sm font-semibold text-foreground">
              Point #{plan.constraintId} — {plan.constraintName}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{plan.why}</p>
          </div>

          {/* 72h intervention */}
          <div className="rounded-md border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-gold" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                72-Hour Intervention
              </span>
            </div>
            <p className="mt-1.5 text-sm text-foreground">{plan.intervention72h}</p>
          </div>

          {/* This week + do not focus on */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-card p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                This Week
              </div>
              <ul className="mt-2 space-y-1.5">
                {plan.thisWeek.map((a, i) => (
                  <li key={i} className="flex gap-2 text-xs text-foreground">
                    <span className="text-gold-soft">{i + 1}.</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <Ban className="size-3.5 text-muted-foreground" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Do NOT Focus On
                </span>
              </div>
              <ul className="mt-2 space-y-1.5">
                {plan.doNotFocusOn.map((a, i) => (
                  <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                    <span>—</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Next audit + begin execution */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarClock className="size-3.5" />
              Next audit: <span className="text-foreground">{plan.nextAudit}</span>
            </div>
            {executed ? (
              <div className="flex items-center gap-2 rounded-md border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-medium text-gold">
                <CheckCircle2 className="size-4" />
                Execution started — {plan.thisWeek.length + 1} commitments tracked
              </div>
            ) : (
              <button
                onClick={beginExecution}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 gold-glow"
              >
                <Rocket className="size-4" /> BEGIN EXECUTION
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
