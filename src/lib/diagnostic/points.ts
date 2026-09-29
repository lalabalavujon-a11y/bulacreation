// The 40-Point Creation Algorithm — point definitions & pillar matrix.
// Each point carries a weight; sum of all weights = 10,000 (the max raw score).

export type Tier = 0 | 0.33 | 0.66 | 1;

export const TIERS: { value: Tier; label: string; note: string }[] = [
  { value: 0, label: "Friction", note: "Opposing / chaotic" },
  { value: 0.33, label: "Emerging", note: "Partial / transitional" },
  { value: 0.66, label: "Aligned", note: "Competent / stable" },
  { value: 1, label: "Mastered", note: "Transmuted / operative" },
];

export interface PointDef {
  id: number;
  pillar: number;
  name: string;
  focus: string;
  weight: number; // max raw points contributed
  gating?: boolean; // teachability governor
}

export interface PillarDef {
  index: number;
  roman: string;
  name: string;
  focus: string;
  max: number;
}

// Neutral default pillar names. Metaphysical philosophies (Neville, Spiritual)
// override these via the philosophy layer (philosophy.ts). The engine never
// changes — only the display label.
export const PILLARS: PillarDef[] = [
  {
    index: 0,
    roman: "I",
    name: "Epistemic Foundation",
    focus: "Mentorship · Teachability · 90/10 Balance",
    max: 2150,
  },
  {
    index: 1,
    roman: "II",
    name: "Intent Engineering",
    focus: "Chief Aim · Specificity · Disgust",
    max: 1350,
  },
  {
    index: 2,
    roman: "III",
    name: "State & Alignment",
    focus: "Somatic Feeling · Detachment · Gratitude",
    max: 1450,
  },
  {
    index: 3,
    roman: "IV",
    name: "Mental Models & Resistance",
    focus: "Counter-Intentions · Envy · Resistance",
    max: 2050,
  },
  {
    index: 4,
    roman: "V",
    name: "Integrity & Recovery Ledger",
    focus: "Restitution · Physical Integrity · Environment",
    max: 1750,
  },
  {
    index: 5,
    roman: "VI",
    name: "Execution & Alignment",
    focus: "Mastermind · Metrics · Burning Boats",
    max: 1250,
  },
];

export const POINTS: PointDef[] = [
  // Pillar I — 2150
  {
    id: 1,
    pillar: 0,
    name: "Mentorship & Guidance Seeking",
    focus: "Active relationship with a living mentor",
    weight: 300,
  },
  {
    id: 2,
    pillar: 0,
    name: "Teachability Index",
    focus: "Master governor — gates total output",
    weight: 350,
    gating: true,
  },
  {
    id: 3,
    pillar: 0,
    name: "90/10 Balance",
    focus: "Input-to-output ratio of consumption vs creation",
    weight: 300,
  },
  {
    id: 4,
    pillar: 0,
    name: "Epistemic Humility",
    focus: "Willingness to be wrong and re-derive",
    weight: 300,
  },
  {
    id: 5,
    pillar: 0,
    name: "Coachability Under Pressure",
    focus: "Receptivity when challenged or corrected",
    weight: 300,
  },
  {
    id: 6,
    pillar: 0,
    name: "Feedback Integration Speed",
    focus: "Velocity from signal to behavior change",
    weight: 300,
  },
  {
    id: 7,
    pillar: 0,
    name: "Foundational Knowledge Base",
    focus: "Depth of operative first-principles",
    weight: 300,
  },

  // Pillar II — 1350
  {
    id: 8,
    pillar: 1,
    name: "Chief Aim Definition",
    focus: "Single, definite, written primary aim",
    weight: 250,
  },
  {
    id: 9,
    pillar: 1,
    name: "Extreme Specificity",
    focus: "Sensory-defined, measurable target",
    weight: 225,
  },
  {
    id: 10,
    pillar: 1,
    name: "Believability Sweet Spot",
    focus: "1–10 gauge of creative tension vs panic",
    weight: 225,
  },
  {
    id: 11,
    pillar: 1,
    name: "Jim Rohn Disgust Factor",
    focus: "Non-negotiable boundary / visceral intolerance",
    weight: 225,
  },
  {
    id: 12,
    pillar: 1,
    name: "Linguistic Precision",
    focus: "Exactness of language describing the aim",
    weight: 200,
  },
  {
    id: 13,
    pillar: 1,
    name: "Written Transcription",
    focus: "Pen-to-paper handwriting of the aim",
    weight: 225,
  },

  // Pillar III — 1450
  {
    id: 14,
    pillar: 2,
    name: "Somatic Feeling State",
    focus: "Embodied feeling of the wish fulfilled",
    weight: 250,
  },
  {
    id: 15,
    pillar: 2,
    name: "Radical Detachment",
    focus: "Freedom from anxious attachment to outcome",
    weight: 250,
  },
  {
    id: 16,
    pillar: 2,
    name: "Gratitude Frequency",
    focus: "Sustained appreciative carrier state",
    weight: 240,
  },
  {
    id: 17,
    pillar: 2,
    name: "Emotional Coherence",
    focus: "Alignment of thought, feeling, and word",
    weight: 240,
  },
  {
    id: 18,
    pillar: 2,
    name: "State Stability",
    focus: "Consistency of state across the day",
    weight: 235,
  },
  {
    id: 19,
    pillar: 2,
    name: "Recovery Velocity",
    focus: "Return rate after disturbance",
    weight: 235,
  },

  // Pillar IV — 2050
  {
    id: 20,
    pillar: 3,
    name: "Counter-Intention Detection",
    focus: "Awareness of opposing inner programs",
    weight: 260,
  },
  {
    id: 21,
    pillar: 3,
    name: "Mental Reprogramming",
    focus: "Active installation of new commands",
    weight: 260,
  },
  {
    id: 22,
    pillar: 3,
    name: "Resistance Clearing",
    focus: "Release of somatic/emotional charge",
    weight: 260,
  },
  {
    id: 23,
    pillar: 3,
    name: "Envy & Comparison Clearing",
    focus: "Transmutation of comparison energy",
    weight: 255,
  },
  {
    id: 24,
    pillar: 3,
    name: "Limiting Belief Excavation",
    focus: "Surface and dissolve root beliefs",
    weight: 255,
  },
  {
    id: 25,
    pillar: 3,
    name: "Inner Conflict Resolution",
    focus: "Reconcile competing desires",
    weight: 255,
  },
  {
    id: 26,
    pillar: 3,
    name: "Shadow Integration",
    focus: "Own and include disowned parts",
    weight: 255,
  },
  {
    id: 27,
    pillar: 3,
    name: "Identity Congruence",
    focus: "Self-concept matches the aim",
    weight: 250,
  },

  // Pillar V — 1750
  {
    id: 28,
    pillar: 4,
    name: "Moral Restitution",
    focus: "Clean the relational ledger with others",
    weight: 255,
  },
  {
    id: 29,
    pillar: 4,
    name: "Physical Integrity",
    focus: "Body as a clear instrument",
    weight: 250,
  },
  {
    id: 30,
    pillar: 4,
    name: "Energetic Hygiene",
    focus: "Boundaries, grounding, clearing",
    weight: 250,
  },
  {
    id: 31,
    pillar: 4,
    name: "Reciprocity Balance",
    focus: "Reciprocity and right action",
    weight: 250,
  },
  {
    id: 32,
    pillar: 4,
    name: "Environmental Load",
    focus: "Minimize environmental / toxic burden",
    weight: 250,
  },
  {
    id: 33,
    pillar: 4,
    name: "Sleep & Recovery",
    focus: "Restorative depth and rhythm",
    weight: 245,
  },
  {
    id: 34,
    pillar: 4,
    name: "Nutritional Integrity",
    focus: "Fuel aligned with the instrument",
    weight: 250,
  },

  // Pillar VI — 1250
  {
    id: 35,
    pillar: 5,
    name: "Mastermind Alignment",
    focus: "Harmonic group field of intent",
    weight: 215,
  },
  {
    id: 36,
    pillar: 5,
    name: "Metrics & Tracking",
    focus: "Measured feedback on the aim",
    weight: 210,
  },
  {
    id: 37,
    pillar: 5,
    name: "Burning Boats",
    focus: "Irrevocable commitment / no retreat",
    weight: 210,
  },
  {
    id: 38,
    pillar: 5,
    name: "Action Velocity",
    focus: "Physical action toward the aim",
    weight: 205,
  },
  {
    id: 39,
    pillar: 5,
    name: "Feedback Loop Closure",
    focus: "Complete the loop on every signal",
    weight: 205,
  },
  {
    id: 40,
    pillar: 5,
    name: "Cybernetic Self-Correction",
    focus: "Automatic course-correction system",
    weight: 205,
  },
];

export const MAX_SCORE = 10000;
export const OPERATIVE_THRESHOLD = 6000;
export const EMERGENCE_THRESHOLD = 4000;

export function pointsByPillar(pillarIndex: number): PointDef[] {
  return POINTS.filter((p) => p.pillar === pillarIndex);
}
