// Generic scoring engine — parameterised by an AssessmentDef.
// Mirrors the Creation 40-pt scoring model (weighted tiers + gating governor
// + bottleneck/leverage sort) but works for any assessment definition.

import type { AssessmentDef, PointDef } from "./types";

export type GenericScores = Record<number, number>;

export interface GPillarResult {
  index: number;
  roman: string;
  name: string;
  focus: string;
  max: number;
  earned: number;
  deficit: number;
  efficiency: number; // 0..1
}

export interface GBottleneck {
  point: PointDef;
  deficit: number;
  leverage: number;
  tier: number;
}

export interface GScoreResult {
  raw: number;
  maxScore: number;
  gatingScore: number;
  gatingFactor: number;
  final: number;
  finalRounded: number;
  zone: string;
  zoneLabel: string;
  zoneNote: string;
  pillars: GPillarResult[];
  bottlenecks: GBottleneck[];
  answered: number;
  totalPoints: number;
}

function resolveZone(def: AssessmentDef, finalRounded: number) {
  const sorted = [...def.zones].sort((a, b) => a.min - b.min);
  for (let i = 0; i < sorted.length; i++) {
    const z = sorted[i];
    const next = sorted[i + 1]?.min ?? Infinity;
    if (finalRounded >= z.min && finalRounded < next) {
      return { key: z.key, label: z.label, note: z.note };
    }
  }
  const last = sorted[sorted.length - 1];
  return { key: last?.key ?? "unknown", label: last?.label ?? "", note: last?.note ?? "" };
}

export function computeGenericScore(def: AssessmentDef, scores: GenericScores): GScoreResult {
  const maxScore = def.points.reduce((s, p) => s + p.weight, 0);

  // Per-pillar weight totals (used as the pillar cap).
  const pillarMax: number[] = def.pillars.map(() => 0);
  for (const p of def.points) pillarMax[p.pillar] += p.weight;

  let raw = 0;
  const pillarEarned: number[] = def.pillars.map(() => 0);
  for (const p of def.points) {
    const s = scores[p.id] ?? 0;
    raw += p.weight * s;
    pillarEarned[p.pillar] += p.weight * s;
  }

  const gatingId = def.gatingPointId;
  const gatingScore = gatingId != null ? (scores[gatingId] ?? 0) : 1;
  const gatingFactor =
    gatingId != null
      ? def.gatingFormula
        ? def.gatingFormula(gatingScore)
        : 0.5 + 0.5 * gatingScore
      : 1;

  const final = raw * gatingFactor;
  const finalRounded = Math.round(final);

  const pillars: GPillarResult[] = def.pillars.map((pl, i) => {
    const earned = pillarEarned[i];
    const max = pillarMax[i];
    return {
      index: i,
      roman: pl.roman,
      name: pl.name,
      focus: pl.focus,
      max,
      earned,
      deficit: max - earned,
      efficiency: max > 0 ? earned / max : 0,
    };
  });

  // Reference weight for leverage normalisation (median).
  const weights = def.points.map((p) => p.weight).sort((a, b) => a - b);
  const median = weights[Math.floor(weights.length / 2)] || 1;

  const bottlenecks: GBottleneck[] = def.points
    .map((p) => {
      const s = scores[p.id] ?? 0;
      const earned = p.weight * s;
      const deficit = p.weight - earned;
      return { point: p, deficit, leverage: deficit * (p.weight / median), tier: s };
    })
    .filter((b) => b.deficit > 0)
    .sort((a, b) => b.leverage - a.leverage);

  const zone = resolveZone(def, finalRounded);

  const answered = Object.keys(scores).filter(
    (k) => scores[Number(k)] !== undefined && scores[Number(k)] > 0,
  ).length;

  return {
    raw,
    maxScore,
    gatingScore,
    gatingFactor,
    final,
    finalRounded,
    zone: zone.key,
    zoneLabel: zone.label,
    zoneNote: zone.note,
    pillars,
    bottlenecks,
    answered,
    totalPoints: def.points.length,
  };
}

export function pillarColor(efficiency: number): string {
  return efficiency >= 0.6 ? "var(--gold-bright)" : "var(--gold-soft)";
}
