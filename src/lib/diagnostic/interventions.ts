import { accountStorage } from "@/lib/diagnostic/local-storage";
// Intervention Effectiveness Engine — the "Learn" stage of the agent loop
// (spec §6.1, §8.2). Pure, browser-safe.
//
// When a commitment is created (from a coach ASSIGNMENT: or a Creation Plan),
// we record the user's Creation Voltage at that moment. When the commitment is
// marked done (or missed), we record the outcome. At the next snapshot we
// attribute the ΔVoltage to the interventions that closed in that window.
//
// Over time this answers: "When this user gets stuck, does intervention type Y
// actually produce movement?" — the deepest moat (personalised cybernetic
// intelligence).

import type { Snapshot } from "./context";

export interface Intervention {
  id: string;
  /** The commitment id this intervention produced (1:1). */
  commitmentId: string;
  /** Free-text label of the prescribed action. */
  label: string;
  /** Which persona / philosophy prescribed it. */
  source: string;
  /** Targeted point id, if known. */
  pointId: number | null;
  /** Voltage at prescription time. */
  voltageAtPrescription: number;
  prescribedTs: number;
  /** Outcome — set when the commitment closes. */
  outcome: "pending" | "done" | "missed";
  outcomeTs?: number;
  /** Voltage at outcome time (snapshot taken near close). */
  voltageAtOutcome?: number;
  /** Attributed voltage delta (outcome - prescription). */
  delta?: number;
}

const KEY = "creation-interventions-v1";

export function loadInterventions(): Intervention[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = accountStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Intervention[]) : [];
  } catch {
    return [];
  }
}

export function saveInterventions(list: Intervention[]): void {
  if (typeof window === "undefined") return;
  try {
    accountStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore quota */
  }
}

/** Record a new intervention when a commitment is created. */
export function recordIntervention(input: {
  commitmentId: string;
  label: string;
  source: string;
  pointId: number | null;
  voltageAtPrescription: number;
}): Intervention {
  const list = loadInterventions();
  const iv: Intervention = {
    id: `iv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    commitmentId: input.commitmentId,
    label: input.label,
    source: input.source,
    pointId: input.pointId,
    voltageAtPrescription: input.voltageAtPrescription,
    prescribedTs: Date.now(),
    outcome: "pending",
  };
  saveInterventions([iv, ...list]);
  return iv;
}

/**
 * Settle pending interventions against the latest snapshot voltage.
 * Called when a commitment is marked done/missed OR when a new snapshot is
 * logged. We attribute the ΔVoltage between prescription and the most recent
 * snapshot to any intervention that closes now.
 */
export function settleInterventions(
  currentVoltage: number,
  settledCommitmentIds: string[],
  outcomes: Record<string, "done" | "missed">,
): Intervention[] {
  const list = loadInterventions();
  if (list.length === 0) return [];
  const next = list.map((iv) => {
    if (iv.outcome !== "pending") return iv;
    const settled = settledCommitmentIds.includes(iv.commitmentId);
    if (!settled) return iv;
    const outcome = outcomes[iv.commitmentId] ?? "done";
    const delta = currentVoltage - iv.voltageAtPrescription;
    return {
      ...iv,
      outcome,
      outcomeTs: Date.now(),
      voltageAtOutcome: currentVoltage,
      delta,
    };
  });
  saveInterventions(next);
  return next;
}

export interface EffectivenessResult {
  /** Mean ΔVoltage after completed (done) interventions. */
  meanDeltaDone: number;
  /** Mean ΔVoltage after missed interventions. */
  meanDeltaMissed: number;
  /** Count of settled interventions. */
  settled: number;
  /** Count still pending. */
  pending: number;
  /** Per-source (persona/philosophy) effectiveness ranking. */
  bySource: { source: string; count: number; meanDelta: number }[];
  /** Net movement attributable to interventions (sum of done deltas). */
  netMovement: number;
  /** Honest readiness flag — need ≥3 settled before this is meaningful. */
  ready: boolean;
}

/**
 * Compute intervention-effectiveness analytics. This is the personalised
 * "what works for you" signal. Returns a `ready: false` flag until there are
 * enough settled interventions to be statistically honest.
 */
export function effectiveness(interventions: Intervention[]): EffectivenessResult {
  const settled = interventions.filter((i) => i.outcome !== "pending");
  const done = settled.filter((i) => i.outcome === "done");
  const missed = settled.filter((i) => i.outcome === "missed");
  const pending = interventions.length - settled.length;

  const mean = (arr: Intervention[]) =>
    arr.length === 0 ? 0 : arr.reduce((s, i) => s + (i.delta ?? 0), 0) / arr.length;

  const meanDeltaDone = mean(done);
  const meanDeltaMissed = mean(missed);
  const netMovement = done.reduce((s, i) => s + (i.delta ?? 0), 0);

  // Group by source.
  const sourceMap = new Map<string, Intervention[]>();
  for (const iv of settled) {
    const arr = sourceMap.get(iv.source) ?? [];
    arr.push(iv);
    sourceMap.set(iv.source, arr);
  }
  const bySource = Array.from(sourceMap.entries())
    .map(([source, arr]) => ({
      source,
      count: arr.length,
      meanDelta: mean(arr),
    }))
    .sort((a, b) => b.meanDelta - a.meanDelta);

  return {
    meanDeltaDone,
    meanDeltaMissed,
    settled: settled.length,
    pending,
    bySource,
    netMovement,
    ready: settled.length >= 3,
  };
}

/** Constraint recurrence — how often each point appears as the top bottleneck
 *  across the intervention history (spec §8.2). Returns points sorted by
 *  recurrence desc. */
export function constraintRecurrence(interventions: Intervention[]): {
  pointId: number;
  count: number;
}[] {
  const map = new Map<number, number>();
  for (const iv of interventions) {
    if (iv.pointId == null) continue;
    map.set(iv.pointId, (map.get(iv.pointId) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([pointId, count]) => ({ pointId, count }))
    .sort((a, b) => b.count - a.count);
}

/** A compact "what works for you" digest injected into the live coach context
 *  so the agent reasons over its own track record (spec §6.3). */
export function effectivenessDigest(interventions: Intervention[]): string {
  const eff = effectiveness(interventions);
  if (!eff.ready) return "insufficient data (<3 settled interventions)";
  const top = eff.bySource[0];
  const worst = eff.bySource[eff.bySource.length - 1];
  const parts = [`${eff.settled} settled · mean ΔV done ${Math.round(eff.meanDeltaDone)}`];
  if (top) parts.push(`best: ${top.source} (+${Math.round(top.meanDelta)})`);
  if (worst && worst.source !== top?.source)
    parts.push(`weakest: ${worst.source} (${Math.round(worst.meanDelta)})`);
  return parts.join(" · ");
}

/** Settle any still-pending interventions against the latest snapshot when a
 *  new snapshot is logged — attributes ΔVoltage to open interventions. */
export function settleOnSnapshot(snapshot: Snapshot): Intervention[] {
  const list = loadInterventions();
  if (list.length === 0) return [];
  // Auto-close pending interventions older than 7 days as "missed" if a new
  // snapshot arrives and they were never marked done.
  const cutoff = snapshot.ts - 7 * 24 * 60 * 60 * 1000;
  const next = list.map((iv) => {
    if (iv.outcome !== "pending") return iv;
    if (iv.prescribedTs < cutoff) {
      return {
        ...iv,
        outcome: "missed" as const,
        outcomeTs: snapshot.ts,
        voltageAtOutcome: snapshot.final,
        delta: snapshot.final - iv.voltageAtPrescription,
      };
    }
    return iv;
  });
  saveInterventions(next);
  return next;
}
