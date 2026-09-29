// Digital Twin — the persistent longitudinal model (spec §9).
//
// Aggregates every signal the app has accumulated about this user into a
// single coherent profile:
//   • aims          → current Chief Aim + history
//   • state         → current 40-point profile + zone
//   • behaviour     → commitments + completion patterns
//   • constraints   → recurring bottlenecks
//   • trajectory    → improvement history
//   • interventions→ what the AI recommended
//   • outcomes      → whether those interventions worked
//
// The twin answers two questions the raw metrics can't:
//   1. "Who is this user — their creation signature?"
//   2. "What actually causes *this* person to move?"
//
// Pure, browser-safe — reads from localStorage-backed stores only.

import type { ScoreResult } from "./scoring";
import type { Snapshot, ChiefAim } from "./context";
import type { Commitment } from "./protocol";
import type { Intervention, EffectivenessResult } from "./interventions";
import { effectiveness, constraintRecurrence } from "./interventions";
import { POINTS, PILLARS } from "./points";

// ── Twin profile ───────────────────────────────────────────────────────────

export interface ConstraintPattern {
  pointId: number;
  name: string;
  pillar: string;
  count: number;
  /** 0..1 share of all interventions targeting this point. */
  share: number;
}

export interface BehaviourSignature {
  totalCommitments: number;
  completed: number;
  missed: number;
  open: number;
  completionRate: number; // 0..1
  /** Avg hours to completion (settled only). */
  avgCompletionHours: number | null;
  /** "follows through" | "starts but stalls" | "rarely acts" */
  pattern: string;
}

export interface TrajectorySignature {
  snapshots: number;
  peak: number;
  current: number;
  netDelta: number;
  slopePerSnapshot: number;
  /** "accelerating" | "progressing" | "plateaued" | "declining" | "just started" */
  trajectory: string;
  weeksActive: number;
}

export interface CreationSignature {
  /** Dominant pillar strengths (top 2 by efficiency). */
  strengths: { name: string; efficiency: number }[];
  /** Dominant weaknesses (bottom 2 by efficiency, < 60%). */
  weaknesses: { name: string; efficiency: number }[];
  /** The zone they spend the most time in. */
  dominantZone: string;
  /** Philosophy currently selected. */
  philosophy: string;
}

export interface TwinProfile {
  chiefAim: string;
  believability: number;
  voltage: number;
  zone: string;
  /** The single highest-leverage constraint right now. */
  primaryConstraint: { id: number; name: string } | null;
  /** Constraints that recur — where the user keeps getting stuck. */
  recurringConstraints: ConstraintPattern[];
  /** Behaviour pattern — how reliably they follow through. */
  behaviour: BehaviourSignature;
  /** Trajectory shape — what the longitudinal trend looks like. */
  trajectory: TrajectorySignature;
  /** Creation signature — their distinctive strengths/weaknesses. */
  signature: CreationSignature;
  /** What works — intervention effectiveness summary. */
  whatWorks: EffectivenessResult;
  /** One-paragraph narrative summary — human-readable twin description. */
  narrative: string;
  /** Honest readiness — do we have enough data to reason? */
  ready: boolean;
}

// ── Build ──────────────────────────────────────────────────────────────────

export function buildTwin(
  result: ScoreResult,
  aim: ChiefAim,
  snapshots: Snapshot[],
  commitments: Commitment[],
  interventions: Intervention[],
  philosophy: string,
): TwinProfile {
  // ── Primary constraint ──
  const top = result.bottlenecks[0];
  const primaryConstraint = top ? { id: top.point.id, name: top.point.name } : null;

  // ── Recurring constraints ──
  const recurrence = constraintRecurrence(interventions);
  const totalIv = interventions.length || 1;
  const recurringConstraints: ConstraintPattern[] = recurrence
    .filter((r) => r.count >= 1)
    .slice(0, 5)
    .map((r) => {
      const pt = POINTS.find((p) => p.id === r.pointId);
      const pillar = PILLARS.find((pl) => pl.index === pt?.pillar);
      return {
        pointId: r.pointId,
        name: pt?.name ?? `Point #${r.pointId}`,
        pillar: pillar?.name ?? "—",
        count: r.count,
        share: r.count / totalIv,
      };
    });

  // ── Behaviour signature ──
  const settled = commitments.filter((c) => c.status === "done");
  const missed = commitments.filter((c) => c.status === "open" && Date.now() > c.dueTs);
  const completed = settled.length;
  const openC = commitments.length - completed;
  const completionRate = commitments.length > 0 ? completed / commitments.length : 0;

  const completionHours: number[] = [];
  for (const c of settled) {
    if (c.completedTs) {
      completionHours.push((c.completedTs - c.issuedTs) / 3.6e6);
    }
  }
  const avgCompletionHours =
    completionHours.length > 0
      ? Math.round(completionHours.reduce((a, b) => a + b, 0) / completionHours.length)
      : null;

  let pattern = "no data yet";
  if (commitments.length >= 3) {
    if (completionRate >= 0.7) pattern = "follows through";
    else if (completionRate >= 0.4) pattern = "starts but stalls";
    else pattern = "rarely acts";
  }

  const behaviour: BehaviourSignature = {
    totalCommitments: commitments.length,
    completed,
    missed: missed.length,
    open: openC - missed.length,
    completionRate,
    avgCompletionHours,
    pattern,
  };

  // ── Trajectory signature ──
  const peak = snapshots.reduce((m, s) => Math.max(m, s.final), 0);
  const current =
    snapshots.length > 0 ? snapshots[snapshots.length - 1].final : result.finalRounded;
  const netDelta =
    snapshots.length >= 2 ? snapshots[snapshots.length - 1].final - snapshots[0].final : 0;

  let slopePerSnapshot = 0;
  if (snapshots.length >= 2) {
    const n = snapshots.length;
    const xs = snapshots.map((_, i) => i);
    const ys = snapshots.map((s) => s.final);
    const meanX = xs.reduce((a, b) => a + b, 0) / n;
    const meanY = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - meanX) * (ys[i] - meanY);
      den += (xs[i] - meanX) ** 2;
    }
    slopePerSnapshot = den === 0 ? 0 : num / den;
  }

  let trajectory = "just started";
  if (snapshots.length >= 4) {
    if (slopePerSnapshot > 200) trajectory = "accelerating";
    else if (slopePerSnapshot > 0) trajectory = "progressing";
    else if (slopePerSnapshot === 0) trajectory = "plateaued";
    else trajectory = "declining";
  } else if (snapshots.length >= 2) {
    trajectory = slopePerSnapshot > 0 ? "progressing" : "flat";
  }

  // Weeks active — from first snapshot to now
  const weeksActive =
    snapshots.length > 0
      ? Math.max(1, Math.round((Date.now() - snapshots[0].ts) / (7 * 24 * 60 * 60 * 1000)))
      : 0;

  const trajectorySig: TrajectorySignature = {
    snapshots: snapshots.length,
    peak,
    current,
    netDelta,
    slopePerSnapshot: Math.round(slopePerSnapshot),
    trajectory,
    weeksActive,
  };

  // ── Creation signature ──
  const sortedPillars = [...result.pillars].sort((a, b) => b.efficiency - a.efficiency);
  const strengths = sortedPillars.slice(0, 2).map((p) => ({
    name: p.name,
    efficiency: Math.round(p.efficiency * 100),
  }));
  const weaknesses = sortedPillars
    .filter((p) => p.efficiency < 0.6)
    .slice(-2)
    .reverse()
    .map((p) => ({ name: p.name, efficiency: Math.round(p.efficiency * 100) }));

  // Dominant zone across snapshots
  const zoneCounts: Record<string, number> = {};
  for (const s of snapshots) zoneCounts[s.zone] = (zoneCounts[s.zone] ?? 0) + 1;
  const dominantZone =
    Object.entries(zoneCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? result.zone;

  const signature: CreationSignature = {
    strengths,
    weaknesses,
    dominantZone,
    philosophy,
  };

  // ── What works ──
  const whatWorks = effectiveness(interventions);

  // ── Readiness ──
  // Ready when we have at least 3 snapshots AND 3 settled interventions
  const ready = snapshots.length >= 3 && whatWorks.settled >= 3;

  // ── Narrative ──
  const narrative = buildNarrative({
    aim: aim.text,
    voltage: result.finalRounded,
    zone: result.zone,
    philosophy,
    behaviour,
    trajectory: trajectorySig,
    signature,
    whatWorks,
    recurringConstraints,
    ready,
  });

  return {
    chiefAim: aim.text || "(not yet defined)",
    believability: aim.believability,
    voltage: result.finalRounded,
    zone: result.zone,
    primaryConstraint,
    recurringConstraints,
    behaviour,
    trajectory: trajectorySig,
    signature,
    whatWorks,
    narrative,
    ready,
  };
}

// ── Narrative builder ──────────────────────────────────────────────────────

function buildNarrative(d: {
  aim: string;
  voltage: number;
  zone: string;
  philosophy: string;
  behaviour: BehaviourSignature;
  trajectory: TrajectorySignature;
  signature: CreationSignature;
  whatWorks: EffectivenessResult;
  recurringConstraints: ConstraintPattern[];
  ready: boolean;
}): string {
  const parts: string[] = [];

  // Opening — who they are
  if (d.aim && d.aim !== "(not yet defined)") {
    parts.push(
      `This user is working toward: "${d.aim}". Their Creation Voltage sits at ${d.voltage.toLocaleString()} (${d.zone} zone) under a ${d.philosophy} framework.`,
    );
  } else {
    parts.push(
      `This user's Chief Aim is not yet defined. Their Creation Voltage sits at ${d.voltage.toLocaleString()} (${d.zone} zone) under a ${d.philosophy} framework.`,
    );
  }

  // Strengths
  if (d.signature.strengths.length > 0) {
    const s = d.signature.strengths.map((x) => `${x.name} (${x.efficiency}%)`).join(", ");
    parts.push(`Their dominant strengths are ${s}.`);
  }

  // Weaknesses
  if (d.signature.weaknesses.length > 0) {
    const w = d.signature.weaknesses.map((x) => `${x.name} (${x.efficiency}%)`).join(", ");
    parts.push(`Their weakest domains are ${w}.`);
  }

  // Trajectory
  parts.push(
    `Their trajectory is ${d.trajectory.trajectory} (${d.trajectory.snapshots} snapshots, ${d.trajectory.weeksActive} weeks active, net Δ${d.trajectory.netDelta >= 0 ? "+" : ""}${d.trajectory.netDelta}).`,
  );

  // Behaviour
  if (d.behaviour.totalCommitments >= 3) {
    parts.push(
      `Behaviour pattern: ${d.behaviour.pattern} — ${Math.round(d.behaviour.completionRate * 100)}% completion across ${d.behaviour.totalCommitments} commitments.`,
    );
  }

  // Recurring constraints
  if (d.recurringConstraints.length > 0) {
    const top = d.recurringConstraints[0];
    parts.push(
      `Their recurring constraint is Point #${top.pointId} (${top.name}) — targeted ${top.count}×.`,
    );
  }

  // What works
  if (d.whatWorks.ready) {
    parts.push(
      `Intervention data shows completed actions produce +${Math.round(d.whatWorks.meanDeltaDone)} ΔV vs +${Math.round(d.whatWorks.meanDeltaMissed)} when missed.`,
    );
  } else {
    parts.push(`Intervention effectiveness data is still accumulating (needs 3+ settled).`);
  }

  return parts.join(" ");
}

// ── Twin digest for coach context injection ─────────────────────────────────

/**
 * Compact twin digest to inject into the coach's system prompt — gives the
 * agent a longitudinal sense of who this user is and what's worked before,
 * not just their current snapshot.
 */
export function twinDigest(twin: TwinProfile): string {
  const parts = [
    `Voltage ${twin.voltage.toLocaleString()} (${twin.zone})`,
    `trajectory: ${twin.trajectory.trajectory}`,
    `behaviour: ${twin.behaviour.pattern}`,
  ];
  if (twin.recurringConstraints.length > 0) {
    const top = twin.recurringConstraints[0];
    parts.push(`recurring constraint: #${top.pointId} ${top.name} (${top.count}×)`);
  }
  if (twin.whatWorks.ready) {
    parts.push(`what works: +${Math.round(twin.whatWorks.meanDeltaDone)} per completed action`);
  }
  return parts.join(" · ");
}
