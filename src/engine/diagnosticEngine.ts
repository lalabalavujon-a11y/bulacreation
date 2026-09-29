// Standalone, exportable Agentic Assessment Engine.
//
// Pure, brand-agnostic scoring logic extracted from the 40-Point Creation
// Algorithm. Any brand app (Lead Recon, Professional Diver, MoneyHoney,
// Bula Properties, …) imports this module plus a `DiagnosticConfig` and gets
// the identical cybernetic loop: raw points × gating governor = final index,
// with bottleneck ranking by immediate yield.
//
// The math mirrors src/lib/diagnostic/scoring.ts and src/lib/assessment/engine.ts
// verbatim — only relocated and parameterised by config. Do not change the math.

export interface TierOption {
  name: string;
  score: number;
}

export interface PointDef {
  id: number;
  name: string;
  focus: string;
  weight: number;
  /** Index into config.pillars. */
  pillar: number;
  /** Governor point — gates the total. */
  gating?: boolean;
  /** Per-point tier override; defaults to DEFAULT_TIERS. */
  tiers?: TierOption[];
}

export interface PillarDef {
  id: string;
  index: number;
  name: string;
  /** Sum of point weights in this pillar. */
  maxScore: number;
}

export interface GovernorDef {
  /** The point id that gates the total. */
  pointId: number;
  /**
   * Optional explicit multipliers keyed by tier score (0 / 0.33 / 0.66 / 1).
   * When omitted, the canonical 0.5 + 0.5 × score formula is used — preserving
   * the 40-Point Teachability Governor behaviour exactly.
   */
  multipliers?: Record<number, number>;
}

export interface ZoneDef {
  name: string;
  min: number;
  max: number;
  description: string;
}

export interface BrandTheme {
  primaryColor: string;
  accentColor: string;
  bgColor: string;
}

export interface DiagnosticConfig {
  id: string;
  name: string;
  indexName: string;
  /** Computed from point weights; included for reference. */
  maxScore: number;
  pillars: PillarDef[];
  points: PointDef[];
  governor: GovernorDef;
  zones: ZoneDef[];
  theme: BrandTheme;
}

export const DEFAULT_TIERS: TierOption[] = [
  { name: "Friction", score: 0 },
  { name: "Emerging", score: 0.33 },
  { name: "Aligned", score: 0.66 },
  { name: "Mastered", score: 1 },
];

export interface BottleneckResult {
  point: PointDef;
  deficit: number;
  leverage: number;
  tier: number;
}

export interface IndexResult {
  rawScore: number;
  maxScore: number;
  governorScore: number;
  multiplier: number;
  finalIndex: number;
  pillarScores: Record<string, number>;
  zone: ZoneDef;
  topBottleneck: PointDef | null;
  bottlenecks: BottleneckResult[];
  answered: number;
}

/** Standard 3-zone split for a 1000-point index (400 / 600 thresholds). */
export function standardZones(indexName: string): ZoneDef[] {
  return [
    {
      name: "Friction Zone",
      min: 0,
      max: 399,
      description: `${indexName} is structurally blocked — re-anchor the fundamentals.`,
    },
    {
      name: "Emergence Zone",
      min: 400,
      max: 599,
      description: `${indexName} is building momentum — clear the dominant constraint.`,
    },
    {
      name: "Execution Active",
      min: 600,
      max: 1000,
      description: `${indexName} is operative — hold the standard and compound.`,
    },
  ];
}

/**
 * Pure scoring function — identical logic regardless of diagnostic.
 *
 * @param scores pointId → tier score (0 / 0.33 / 0.66 / 1)
 * @param config the brand diagnostic definition
 */
export function calculateIndex(
  scores: Record<number, number>,
  config: DiagnosticConfig,
): IndexResult {
  const maxScore = config.points.reduce((s, p) => s + p.weight, 0);

  let raw = 0;
  const pillarEarned: number[] = config.pillars.map(() => 0);

  for (const p of config.points) {
    const s = scores[p.id] ?? 0;
    raw += p.weight * s;
    pillarEarned[p.pillar] += p.weight * s;
  }

  const governorScore = scores[config.governor.pointId] ?? 0;
  const multiplier = config.governor.multipliers
    ? (config.governor.multipliers[governorScore] ?? 0.5)
    : 0.5 + 0.5 * governorScore;

  const finalIndex = Math.round(raw * multiplier);

  const pillarScores: Record<string, number> = {};
  config.pillars.forEach((pl, i) => {
    pillarScores[pl.id] = Math.round(pillarEarned[i]);
  });

  const zone =
    config.zones.find((z) => finalIndex >= z.min && finalIndex <= z.max) ??
    config.zones[config.zones.length - 1];

  // Reference weight for leverage normalisation (median).
  const weights = config.points.map((p) => p.weight).sort((a, b) => a - b);
  const median = weights[Math.floor(weights.length / 2)] || 1;

  const bottlenecks: BottleneckResult[] = config.points
    .map((p) => {
      const s = scores[p.id] ?? 0;
      const earned = p.weight * s;
      const deficit = p.weight - earned;
      return { point: p, deficit, leverage: deficit * (p.weight / median), tier: s };
    })
    .filter((b) => b.deficit > 0)
    .sort((a, b) => b.leverage - a.leverage);

  const answered = Object.keys(scores).filter(
    (k) => scores[Number(k)] !== undefined && scores[Number(k)] > 0,
  ).length;

  return {
    rawScore: Math.round(raw),
    maxScore,
    governorScore,
    multiplier,
    finalIndex,
    pillarScores,
    zone,
    topBottleneck: bottlenecks[0]?.point ?? null,
    bottlenecks,
    answered,
  };
}
