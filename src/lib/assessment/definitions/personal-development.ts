import type { AssessmentDef } from "../types";
import { DEFAULT_TIERS, standardZones } from "../types";

export const personalDevelopment: AssessmentDef = {
  key: "personal-development",
  name: "Personal Development Diagnostic",
  tagline: "Discipline · habits · emotional mastery · focus · vitality · life vision",
  indexLabel: "Personal Development Index",
  shortIndex: "PD Index",
  description:
    "A foundational life system diagnostic decomposing daily habits, emotional resilience, attention management, vitality, and life design into an actionable development index.",
  tiers: DEFAULT_TIERS,
  accent: "var(--gold)",
  coachProOnly: false, // Free bonus for all users
  gatingPointId: 1, // Self-governance & Radical Responsibility is master governor
  gatingFormula: (score: number) => 0.5 + 0.5 * score,
  zones: standardZones("Personal Development Index"),
  pillars: [
    {
      index: 0,
      roman: "I",
      name: "Sovereignty & Radical Responsibility",
      focus: "Internal locus of control · integrity · emotional ownership",
    },
    {
      index: 1,
      roman: "II",
      name: "Habit Architecture & Daily Execution",
      focus: "Morning/evening cadence · deep work cycles · friction reduction",
    },
    {
      index: 2,
      roman: "III",
      name: "Cognitive Focus & Dopamine Control",
      focus: "Attention sovereignty · screen discipline · cognitive endurance",
    },
    {
      index: 3,
      roman: "IV",
      name: "Emotional Mastery & State Regulation",
      focus: "Somatic awareness · stress transmutation · nervous system regulation",
    },
    {
      index: 4,
      roman: "V",
      name: "Physical Vitality & Energetic Baseline",
      focus: "Sleep architecture · cellular nutrition · athletic conditioning",
    },
    {
      index: 5,
      roman: "VI",
      name: "Life Architecture & Strategic Aim",
      focus: "Chief life vision · relationships · legacy & financial autonomy",
    },
  ],
  points: [
    // Pillar I (200 pts)
    {
      id: 1,
      pillar: 0,
      name: "Radical Responsibility",
      focus: "Zero victim mentality · absolute locus of control",
      weight: 50,
      gating: true,
    },
    {
      id: 2,
      pillar: 0,
      name: "Identity Standards",
      focus: "Non-negotiable personal floor vs aspirations",
      weight: 40,
    },
    {
      id: 3,
      pillar: 0,
      name: "Integrity Ratio",
      focus: "Say-to-do ratio across private and public commitments",
      weight: 40,
    },
    {
      id: 4,
      pillar: 0,
      name: "Emotional Ownership",
      focus: "Disowning projection and blame during high-pressure events",
      weight: 35,
    },
    {
      id: 5,
      pillar: 0,
      name: "Boundary Sovereignty",
      focus: "Ruthless capacity to say no to distractions & misaligned demands",
      weight: 35,
    },

    // Pillar II (170 pts)
    {
      id: 6,
      pillar: 1,
      name: "Morning Priming Cadence",
      focus: "Uninterrupted first 90 minutes dedicated to state & high-leverage work",
      weight: 35,
    },
    {
      id: 7,
      pillar: 1,
      name: "Deep Work Blocks",
      focus: "Protected 90-120 minute uninterrupted deep execution sessions",
      weight: 40,
    },
    {
      id: 8,
      pillar: 1,
      name: "Evening Shutdown Protocol",
      focus: "Deliberate cognitive detachment, review & next-day lock",
      weight: 30,
    },
    {
      id: 9,
      pillar: 1,
      name: "Environment Architecture",
      focus: "Friction removal for virtue, barrier addition for vice",
      weight: 35,
    },
    {
      id: 10,
      pillar: 1,
      name: "Weekly Audit Review",
      focus: "Consistent weekly cybernetic retrospective & goal calibration",
      weight: 30,
    },

    // Pillar III (160 pts)
    {
      id: 11,
      pillar: 2,
      name: "Dopamine Sovereignty",
      focus: "Control over cheap novelty, infinite feeds, and compulsive checking",
      weight: 35,
    },
    {
      id: 12,
      pillar: 2,
      name: "Attention Span Depth",
      focus: "Ability to sustain uninterrupted focus for 60+ minutes without drift",
      weight: 35,
    },
    {
      id: 13,
      pillar: 2,
      name: "Information Diet",
      focus: "High-signal reading, zero-noise curation, intentional consumption",
      weight: 30,
    },
    {
      id: 14,
      pillar: 2,
      name: "Context Switching Guard",
      focus: "Batching communication and minimising reactive multi-tasking",
      weight: 30,
    },
    {
      id: 15,
      pillar: 2,
      name: "Cognitive Endurance",
      focus: "Mental sharpness sustained through end-of-day execution",
      weight: 30,
    },

    // Pillar IV (160 pts)
    {
      id: 16,
      pillar: 3,
      name: "Stress Transmutation",
      focus: "Converting acute physiological stress into heightened presence",
      weight: 35,
    },
    {
      id: 17,
      pillar: 3,
      name: "Somatic Awareness",
      focus: "Catching tension, shallow breathing and anxiety in real time",
      weight: 35,
    },
    {
      id: 18,
      pillar: 3,
      name: "Nervous System Reset",
      focus: "Active use of breathwork, cold, and physiological sigh protocols",
      weight: 30,
    },
    {
      id: 19,
      pillar: 3,
      name: "Rejection Immunity",
      focus: "Separating outcome feedback from identity and self-worth",
      weight: 30,
    },
    {
      id: 20,
      pillar: 3,
      name: "Constructive Disgust",
      focus: "Leveraging healthy intolerance for complacency as fuel",
      weight: 30,
    },

    // Pillar V (160 pts)
    {
      id: 21,
      pillar: 4,
      name: "Sleep Architecture",
      focus: "7.5-8.5 hours with consistent sleep/wake times and high deep/REM ratio",
      weight: 40,
    },
    {
      id: 22,
      pillar: 4,
      name: "Cellular Nutrition & Hydration",
      focus: "Whole food micronutrient density, optimal electrolytes & clean fuel",
      weight: 30,
    },
    {
      id: 23,
      pillar: 4,
      name: "Strength & Resistance Training",
      focus: "Heavy progressive overload 3-5x/week for structural resilience",
      weight: 30,
    },
    {
      id: 24,
      pillar: 4,
      name: "Cardiovascular Engine",
      focus: "Zone 2 aerobic base + VO2 max anaerobic capacity",
      weight: 30,
    },
    {
      id: 25,
      pillar: 4,
      name: "Daily Energetic Peak",
      focus: "Sustained high physical energy from morning until shutdown",
      weight: 30,
    },

    // Pillar VI (150 pts)
    {
      id: 26,
      pillar: 5,
      name: "Definite Chief Aim",
      focus: "Crystal-clear, sensory-defined 1-3 year milestone",
      weight: 35,
    },
    {
      id: 27,
      pillar: 5,
      name: "Mastermind & Inner Circle",
      focus: "Surrounding oneself with high-standard, growth-oriented peers",
      weight: 30,
    },
    {
      id: 28,
      pillar: 5,
      name: "Relational Quality",
      focus: "Deep, communicative, nourishing core relationships",
      weight: 30,
    },
    {
      id: 29,
      pillar: 5,
      name: "Financial Trajectory",
      focus: "Living below means, aggressive investing, clear wealth milestone",
      weight: 30,
    },
    {
      id: 30,
      pillar: 5,
      name: "Personal Legacy Alignment",
      focus: "Daily actions congruently aligned with lifetime impact",
      weight: 25,
    },
  ],
};
