import { accountStorage } from "@/lib/diagnostic/local-storage";
// Agentic protocol engine — pure, browser-safe.
// Generates the daily high-leverage protocol from the bottleneck sort,
// forecasts days-to-zone from the snapshot trend, and parses structured
// mentor outputs (ASSIGNMENT: / SATS: / FORECAST: / etc.) into tracked
// commitments. Shared by the Coach and Trajectory routes.

import type { ScoreResult } from "./scoring";
import { zoneMeta } from "./scoring";
import { EMERGENCE_THRESHOLD, OPERATIVE_THRESHOLD } from "./points";
import type { Snapshot } from "./context";

export interface DailyProtocol {
  headline: string;
  bottleneck: {
    id: number;
    name: string;
    pillar: string;
    deficit: number;
    leverage: number;
  };
  action: string;
  rationale: string;
  pillarFocus: string;
  checkpoint: string;
}

/**
 * Build today's single highest-leverage protocol from the bottleneck sort.
 * Returns null when there are no bottlenecks (all points mastered).
 */
export function buildDailyProtocol(result: ScoreResult): DailyProtocol | null {
  const top = result.bottlenecks[0];
  if (!top || top.deficit <= 0) return null;
  const pillarName = result.pillars[top.point.pillar]?.name ?? "—";
  const pillarFocus = result.pillars[top.point.pillar]?.focus ?? "";

  const action = actionForPoint(top.point.id, top.point.name, top.tier);
  const rationale = `Lifting Point #${top.point.id} (${top.point.name}) earns ~${Math.round(
    top.leverage,
  )} leverage — the single highest-yield constraint right now. Move it and the whole pillar follows.`;

  return {
    headline: `Today's highest-leverage move: close the gap on Point #${top.point.id}`,
    bottleneck: {
      id: top.point.id,
      name: top.point.name,
      pillar: pillarName,
      deficit: Math.round(top.deficit),
      leverage: Math.round(top.leverage),
    },
    action,
    rationale,
    pillarFocus,
    checkpoint: `Confirm at next snapshot: does Point #${top.point.id} tier rise? Voltage should jump ~${Math.round(
      top.leverage,
    )}+ pts.`,
  };
}

function actionForPoint(id: number, name: string, tier: number): string {
  const verb = tier === 0 ? "Begin" : "Advance";
  return `${verb} a 20-minute block on ${name} (Point #${id}) before any reactive input today.`;
}

export interface Forecast {
  toEmergence: number | null; // days, or null if already past / unreachable
  toOperative: number | null;
  current: number;
  slope: number; // voltage per snapshot
  message: string;
}

/**
 * Forecast days-to-zone from the snapshot slope. Uses a simple linear fit over
 * the last N snapshots (treated as ~weekly cadence). Honest about the limits:
 * returns null when the trend is flat, negative, or there's too little data.
 */
export function forecast(snapshots: Snapshot[]): Forecast {
  const cur = snapshots[snapshots.length - 1]?.final ?? 0;
  if (snapshots.length < 2) {
    return {
      toEmergence: null,
      toOperative: null,
      current: cur,
      slope: 0,
      message: "Not enough snapshots to forecast — log at least 2 milestones to see trajectory.",
    };
  }
  // Linear regression slope (voltage per snapshot)
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
  const slope = den === 0 ? 0 : num / den;

  if (slope <= 0) {
    return {
      toEmergence: null,
      toOperative: null,
      current: cur,
      slope,
      message:
        slope < 0
          ? `Trajectory is declining (${Math.round(slope)} pts/snapshot). Re-anchor the 4 Basics before forecasting.`
          : "Trajectory is flat — no upward slope detected yet.",
    };
  }

  // Assume ~1 snapshot per week → convert to days
  const daysPerSnap = 7;
  const toEmergence =
    cur >= EMERGENCE_THRESHOLD
      ? null
      : Math.max(1, Math.round((EMERGENCE_THRESHOLD - cur) / slope) * daysPerSnap);
  const toOperative =
    cur >= OPERATIVE_THRESHOLD
      ? null
      : Math.max(1, Math.round((OPERATIVE_THRESHOLD - cur) / slope) * daysPerSnap);

  const parts: string[] = [];
  if (toOperative !== null) parts.push(`~${toOperative} days to Operative Active`);
  if (toEmergence !== null) parts.push(`~${toEmergence} days to Emergence Zone`);
  const message = parts.length
    ? `At current slope (+${Math.round(slope)} pts/snapshot): ${parts.join(" · ")}.`
    : "Already past Operative Active threshold — hold the standard.";

  return { toEmergence, toOperative, current: cur, slope, message };
}

// ── Intervention analytics ────────────────────────────────────────────────

export interface TrajectoryMetrics {
  velocity: number; // ΔVoltage per snapshot (slope)
  momentum: number; // rolling 3-snapshot velocity trend
  completionRate: number; // 0..1 — done / (done+missed) over rolling window
  openCount: number;
  overdueCount: number;
  consistency: number; // consecutive snapshots logged (proxy for weekly consistency)
}

/**
 * Compute longitudinal intervention metrics from snapshots + commitments.
 * These are the V1 intervention-analytics signals: velocity, momentum,
 * commitment completion rate, and consistency.
 */
export function trajectoryMetrics(
  snapshots: Snapshot[],
  commitments: Commitment[],
): TrajectoryMetrics {
  // Velocity = linear regression slope (voltage per snapshot)
  let velocity = 0;
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
    velocity = den === 0 ? 0 : num / den;
  }

  // Momentum = rolling 3-snapshot velocity trend (compare recent half to older half)
  let momentum = 0;
  if (snapshots.length >= 4) {
    const mid = Math.floor(snapshots.length / 2);
    const recent = snapshots.slice(mid);
    const older = snapshots.slice(0, mid);
    const recentAvg = recent.reduce((a, b) => a + b.final, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b.final, 0) / older.length;
    momentum = recentAvg - olderAvg;
  }

  // Completion rate over rolling window (last 10 commitments)
  const recent = commitments.slice(0, 10);
  const done = recent.filter((c) => c.status === "done").length;
  const total = recent.length;
  const completionRate = total > 0 ? done / total : 0;

  const openCount = commitments.filter((c) => c.status === "open").length;
  const overdueCount = commitments.filter(
    (c) => c.status === "open" && Date.now() > c.dueTs,
  ).length;

  // Consistency = consecutive snapshots (proxy for weekly consistency streak)
  const consistency = snapshots.length;

  return { velocity, momentum, completionRate, openCount, overdueCount, consistency };
}

export interface Commitment {
  id: string;
  text: string;
  persona: string;
  pointId: number | null;
  issuedTs: number;
  dueTs: number; // 48h
  status: "open" | "done";
  completedTs?: number;
}

const COMMITMENT_KEY = "creation-algorithm-commitments-v1";

export function loadCommitments(): Commitment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = accountStorage.getItem(COMMITMENT_KEY);
    return raw ? (JSON.parse(raw) as Commitment[]) : [];
  } catch {
    return [];
  }
}

export function saveCommitments(list: Commitment[]): void {
  if (typeof window === "undefined") return;
  try {
    accountStorage.setItem(COMMITMENT_KEY, JSON.stringify(list));
  } catch {
    /* ignore quota */
  }
}

/**
 * Parse a mentor's structured output for an ASSIGNMENT: line and, if found,
 * create a 48-hour commitment. Returns the commitment (or null) and the
 * cleaned assistant text with the ASSIGNMENT: line preserved for display.
 */
export function parseAssignment(
  assistantText: string,
  persona: string,
): { commitment: Commitment | null; text: string } {
  const m = assistantText.match(/ASSIGNMENT:\s*(.+)/i);
  if (!m) return { commitment: null, text: assistantText };
  const task = m[1].trim().slice(0, 280);
  const now = Date.now();
  const commitment: Commitment = {
    id: `cmt_${now}_${Math.random().toString(36).slice(2, 8)}`,
    text: task,
    persona,
    pointId: null,
    issuedTs: now,
    dueTs: now + 48 * 60 * 60 * 1000,
    status: "open",
  };
  return { commitment, text: assistantText };
}

export function markDone(id: string, list: Commitment[]): Commitment[] {
  const next = list.map((c) =>
    c.id === id ? { ...c, status: "done" as const, completedTs: Date.now() } : c,
  );
  saveCommitments(next);
  return next;
}

export function removeCommitment(id: string, list: Commitment[]): Commitment[] {
  const next = list.filter((c) => c.id !== id);
  saveCommitments(next);
  return next;
}

/** Count open commitments — surfaced into the coach context. */
export function openCount(list: Commitment[]): number {
  return list.filter((c) => c.status === "open").length;
}

/** A compact commitments digest injected into the live coach context. */
export function commitmentsDigest(list: Commitment[]): string {
  const open = list.filter((c) => c.status === "open");
  if (open.length === 0) return "none — no open assignments";
  return open
    .slice(0, 3)
    .map((c) => {
      const overdue = Date.now() > c.dueTs ? " (OVERDUE)" : "";
      const hrs = Math.max(0, Math.round((c.dueTs - Date.now()) / 3.6e6));
      return `• [${c.persona}] ${c.text}${overdue ? "" : ` (${hrs}h left)`}${overdue}`;
    })
    .join("\n");
}

// ── Retention / anti-churn signals (spec §13.4) ────────────────────────────

export interface RetentionSignals {
  /** Consecutive missed weekly audits (≥2 = churn risk). */
  missedAudits: number;
  /** True if velocity is ≤0 over 3+ snapshots (stagnation). */
  stagnant: boolean;
  /** True if commitment completion < 30% with ≥3 commitments. */
  lowCompletion: boolean;
  /** Philosophy switches count (>3 = indecision). */
  philosophyChurn: boolean;
  /** Overall risk level. */
  risk: "none" | "watch" | "intervene";
  /** Human-readable list of active signals. */
  alerts: { label: string; detail: string; severity: "watch" | "intervene" }[];
}

/**
 * Compute anti-churn retention signals from snapshots, commitments, and
 * philosophy-switch history. Each signal triggers a re-engagement intervention
 * (spec §13.4). Philosophy switch history is read from localStorage.
 */
export function retentionSignals(
  snapshots: Snapshot[],
  commitments: Commitment[],
  philosophyHistory: string[] = [],
): RetentionSignals {
  const alerts: RetentionSignals["alerts"] = [];

  // Missed consecutive audits — if last snapshot is >14 days old, count weeks.
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  let missedAudits = 0;
  if (snapshots.length > 0) {
    const lastSnap = snapshots[snapshots.length - 1];
    const weeksSince = Math.floor((now - lastSnap.ts) / weekMs);
    missedAudits = Math.max(0, weeksSince);
  } else {
    // No snapshots at all after onboarding = never audited.
    missedAudits = 0;
  }
  if (missedAudits >= 2) {
    alerts.push({
      label: `${missedAudits} consecutive missed audits`,
      detail: "You haven't logged a snapshot in 2+ weeks. Re-anchor with a quick audit.",
      severity: missedAudits >= 3 ? "intervene" : "watch",
    });
  }

  // Stagnant velocity — ≤0 over 3+ snapshots.
  const metrics = trajectoryMetrics(snapshots, commitments);
  const stagnant = snapshots.length >= 3 && metrics.velocity <= 0;
  if (stagnant) {
    alerts.push({
      label: "Stagnant trajectory",
      detail: "Velocity is flat or declining over 3+ snapshots. Switch your leverage target.",
      severity: "intervene",
    });
  }

  // Low completion rate.
  const settled = commitments.filter((c) => c.status === "done").length;
  const lowCompletion = commitments.length >= 3 && metrics.completionRate < 0.3;
  if (lowCompletion) {
    alerts.push({
      label: `Low completion (${Math.round(metrics.completionRate * 100)}%)`,
      detail:
        "Interventions aren't converting into action. Shrink to one smaller 48-hour commitment.",
      severity: "intervene",
    });
  }

  // Philosophy churn — >3 switches.
  const philosophyChurn = philosophyHistory.length > 3;
  if (philosophyChurn) {
    alerts.push({
      label: `Framework switched ${philosophyHistory.length}×`,
      detail: "Frequent framework switching signals indecision. Commit to one for 30 days.",
      severity: "watch",
    });
  }

  const hasIntervene = alerts.some((a) => a.severity === "intervene");
  const risk: RetentionSignals["risk"] =
    alerts.length === 0 ? "none" : hasIntervene ? "intervene" : "watch";

  return {
    missedAudits,
    stagnant,
    lowCompletion,
    philosophyChurn,
    risk,
    alerts,
  };
}
