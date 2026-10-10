import { accountStorage } from "@/lib/diagnostic/local-storage";
// Cross-diagnostic friction extraction.
//
// Reads every portfolio assessment's persisted scores from localStorage,
// re-runs the generic scoring engine, and returns the points sitting at
// Friction / Emerging (tier < threshold). The SRS deck consumes these so a
// single training loop spans the 40-point Creation Algorithm AND every
// portfolio diagnostic (Diver Readiness, Financial Readiness, etc.).

import { ASSESSMENTS } from "@/lib/assessment/registry";
import { computeGenericScore, type GenericScores } from "@/lib/assessment/engine";

export interface AssessmentFrictionPoint {
  /** Assessment definition key, e.g. "diver-readiness". */
  key: string;
  /** Human-readable assessment name, e.g. "Diver Readiness Diagnostic". */
  assessmentName: string;
  /** Short index label for the assessment, e.g. "Diver Readiness Index". */
  indexLabel: string;
  /** The point id within that assessment. */
  pointId: number;
  /** Point name. */
  pointName: string;
  /** Point focus / remediation guidance. */
  focus: string;
  /** Tier score (0..1) — lower = worse. */
  tier: number;
  /** Stable composite key for dedupe, e.g. "diver-readiness:5". */
  composite: string;
}

const LS_PREFIX = "assessment-scores-";

/** Pull every assessment's friction points (tier < threshold, default 0.66). */
export function loadAssessmentFriction(threshold = 0.66): AssessmentFrictionPoint[] {
  if (typeof window === "undefined") return [];
  const out: AssessmentFrictionPoint[] = [];
  for (const def of ASSESSMENTS) {
    let scores: GenericScores = {};
    try {
      const raw = accountStorage.getItem(LS_PREFIX + def.key);
      if (raw) scores = JSON.parse(raw) as GenericScores;
    } catch {
      /* ignore corrupt entry */
    }
    // Skip assessments the user has never scored.
    if (!Object.keys(scores).length) continue;

    const result = computeGenericScore(def, scores);
    for (const b of result.bottlenecks) {
      if (b.tier < threshold) {
        out.push({
          key: def.key,
          assessmentName: def.name,
          indexLabel: def.indexLabel,
          pointId: b.point.id,
          pointName: b.point.name,
          focus: b.point.focus,
          tier: b.tier,
          composite: `${def.key}:${b.point.id}`,
        });
      }
    }
  }
  // Highest-leverage friction first (bottlenecks are pre-sorted by leverage).
  return out;
}

/** Which assessments have at least one friction point — for UI summary. */
export function assessmentFrictionSummary(
  points: AssessmentFrictionPoint[],
): { key: string; name: string; count: number }[] {
  const map = new Map<string, { key: string; name: string; count: number }>();
  for (const p of points) {
    const existing = map.get(p.key);
    if (existing) existing.count++;
    else map.set(p.key, { key: p.key, name: p.assessmentName, count: 1 });
  }
  return [...map.values()];
}
