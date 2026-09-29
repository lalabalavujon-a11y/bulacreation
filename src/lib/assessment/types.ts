// Generic Agentic Assessment Engine — shared types.
// The Creation 40-Point Algorithm is one instance of this pattern.
// New portfolio assessments (Business Growth, Diver Readiness, etc.)
// reuse the same engine by supplying a different AssessmentDef.

export interface TierDef {
  value: number; // 0..1 multiplier on point weight
  label: string;
  note: string;
}

export interface PointDef {
  id: number;
  pillar: number; // index into pillars
  name: string;
  focus: string;
  weight: number; // max raw points contributed
  gating?: boolean; // governor point
}

export interface PillarDef {
  index: number;
  roman: string;
  name: string;
  focus: string;
}

export interface ZoneDef {
  key: string;
  label: string;
  min: number; // inclusive lower bound
  note: string;
  color: string; // design token name for accent
}

export interface AssessmentDef {
  key: string;
  name: string;
  tagline: string;
  indexLabel: string; // e.g. "Business Growth Voltage"
  shortIndex: string; // e.g. "Voltage"
  description: string;
  tiers: TierDef[];
  pillars: PillarDef[];
  points: PointDef[];
  zones: ZoneDef[]; // sorted ascending by min
  gatingPointId?: number;
  gatingFormula?: (score: number) => number;
  accent: string; // css token e.g. "var(--gold)"
  /** When true, the diagnostic is only available to Coach / Coach Pro users. */
  coachProOnly?: boolean;
}

export const DEFAULT_TIERS: TierDef[] = [
  { value: 0, label: "Blocked", note: "Opposing / absent" },
  { value: 0.33, label: "Patchy", note: "Partial / inconsistent" },
  { value: 0.66, label: "Working", note: "Competent / stable" },
  { value: 1, label: "Optimised", note: "Refined / operative" },
];

/** Standard 3-zone split for a 1000-point index. */
export function standardZones(indexLabel: string): ZoneDef[] {
  return [
    {
      key: "friction",
      label: "Friction Zone",
      min: 0,
      note: `${indexLabel} is structurally blocked — re-anchor the fundamentals.`,
      color: "var(--gold-soft)",
    },
    {
      key: "emergence",
      label: "Emergence Zone",
      min: 400,
      note: `${indexLabel} is building momentum — clear the dominant constraint.`,
      color: "var(--gold)",
    },
    {
      key: "operative",
      label: "Execution Active",
      min: 600,
      note: `${indexLabel} is operative — hold the standard and compound.`,
      color: "var(--gold-bright)",
    },
  ];
}
