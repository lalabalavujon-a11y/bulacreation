// Scoring engine for the 40-Point Creation Algorithm.
import {
  POINTS,
  PILLARS,
  MAX_SCORE,
  OPERATIVE_THRESHOLD,
  EMERGENCE_THRESHOLD,
  type Tier,
  type PointDef,
} from "./points";

export type Scores = Record<number, Tier>;

export interface PillarResult {
  index: number;
  roman: string;
  name: string;
  max: number;
  earned: number; // raw earned (pre-teachability)
  deficit: number;
  efficiency: number; // 0..1
}

export interface Bottleneck {
  point: PointDef;
  deficit: number; // max - earned
  leverage: number; // deficit * weight (priority weight)
  tier: Tier;
}

export interface ScoreResult {
  raw: number;
  teachabilityScore: Tier;
  teachabilityFactor: number; // 0.5 + 0.5*score
  final: number;
  finalRounded: number;
  zone: "friction" | "emergence" | "operative";
  pillars: PillarResult[];
  bottlenecks: Bottleneck[]; // sorted desc by leverage
  answered: number;
}

export function tierLabel(t: Tier): string {
  return t === 0 ? "Friction" : t === 0.33 ? "Emerging" : t === 0.66 ? "Aligned" : "Mastered";
}

export function computeScore(scores: Scores): ScoreResult {
  let raw = 0;
  let teachabilityScore: Tier = scores[2] ?? 0;

  const pillarEarned: number[] = PILLARS.map(() => 0);

  for (const p of POINTS) {
    const s = scores[p.id] ?? 0;
    raw += p.weight * s;
    pillarEarned[p.pillar] += p.weight * s;
  }

  const teachabilityFactor = 0.5 + 0.5 * teachabilityScore;
  const final = raw * teachabilityFactor;

  const pillars: PillarResult[] = PILLARS.map((pl, i) => {
    const earned = pillarEarned[i];
    return {
      index: i,
      roman: pl.roman,
      name: pl.name,
      max: pl.max,
      earned,
      deficit: pl.max - earned,
      efficiency: pl.max > 0 ? earned / pl.max : 0,
    };
  });

  const bottlenecks: Bottleneck[] = POINTS.map((p) => {
    const s = scores[p.id] ?? 0;
    const earned = p.weight * s;
    const deficit = p.weight - earned;
    return { point: p, deficit, leverage: deficit * (p.weight / 250), tier: s };
  })
    .filter((b) => b.deficit > 0)
    .sort((a, b) => b.leverage - a.leverage);

  const finalRounded = Math.round(final);
  const zone =
    finalRounded >= OPERATIVE_THRESHOLD
      ? "operative"
      : finalRounded >= EMERGENCE_THRESHOLD
        ? "emergence"
        : "friction";

  const answered = Object.keys(scores).filter(
    (k) => scores[Number(k)] !== undefined && scores[Number(k)] > 0,
  ).length;

  return {
    raw,
    teachabilityScore,
    teachabilityFactor,
    final,
    finalRounded,
    zone,
    pillars,
    bottlenecks,
    answered,
  };
}

export function zoneMeta(zone: ScoreResult["zone"]) {
  if (zone === "operative")
    return {
      label: "Execution Active",
      range: "6,000 – 10,000",
      note: "Execution loop sustained — hold the standard",
    };
  if (zone === "emergence")
    return {
      label: "Emergence Zone",
      range: "4,000 – 5,999",
      note: "Transitional momentum building",
    };
  return {
    label: "Friction Zone",
    range: "0 – 3,999",
    note: "Random chaos — re-anchor the basics",
  };
}

export { MAX_SCORE, OPERATIVE_THRESHOLD, EMERGENCE_THRESHOLD };
