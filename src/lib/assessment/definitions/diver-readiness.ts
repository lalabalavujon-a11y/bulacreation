import type { AssessmentDef } from "../types";
import { DEFAULT_TIERS, standardZones } from "../types";

// Diver Readiness Index — diagnostic for professional divers.
// 6 pillars, 30 points, ~1000-point index, 400/600 thresholds.

export const diverReadiness: AssessmentDef = {
  key: "diver-readiness",
  name: "Diver Readiness Diagnostic",
  tagline: "Competence → knowledge → certification → training gaps",
  indexLabel: "Diver Readiness Index",
  shortIndex: "Readiness",
  description:
    "A readiness diagnostic for professional divers, decomposing competence, knowledge, fitness, safety, equipment and environmental judgement into an actionable readiness score.",
  tiers: DEFAULT_TIERS,
  accent: "var(--gold)",
  coachProOnly: true, // Coach Pro exclusive library
  zones: standardZones("Diver Readiness Index"),
  gatingPointId: 4,
  pillars: [
    { index: 0, roman: "I", name: "Competence & Skills", focus: "Core in-water ability" },
    {
      index: 1,
      roman: "II",
      name: "Knowledge & Certification",
      focus: "Theory · certs · site knowledge",
    },
    { index: 2, roman: "III", name: "Physical Fitness", focus: "Cardio · composure · endurance" },
    {
      index: 3,
      roman: "IV",
      name: "Safety & Risk Management",
      focus: "Checks · limits · response",
    },
    {
      index: 4,
      roman: "V",
      name: "Equipment & Maintenance",
      focus: "Reliability · redundancy · thermal",
    },
    {
      index: 5,
      roman: "VI",
      name: "Conditions & Environment",
      focus: "Judgement · navigation · logging",
    },
  ],
  points: [
    // I — Competence (176)
    {
      id: 1,
      pillar: 0,
      name: "Core Diving Skills",
      focus: "Foundational in-water control",
      weight: 36,
    },
    {
      id: 2,
      pillar: 0,
      name: "Buoyancy Control",
      focus: "Hover without visual reference",
      weight: 36,
    },
    { id: 3, pillar: 0, name: "Equipment Handling", focus: "Don/ditch/swap mid-water", weight: 34 },
    {
      id: 4,
      pillar: 0,
      name: "Dive Planning",
      focus: "Gas, depth, time calculated",
      weight: 36,
      gating: true,
    },
    {
      id: 5,
      pillar: 0,
      name: "Emergency Procedures",
      focus: "Drilled out-of-air / freeflow",
      weight: 34,
    },
    // II — Knowledge & Certification (168)
    {
      id: 6,
      pillar: 1,
      name: "Certification Level",
      focus: "Current for intended dive",
      weight: 34,
    },
    {
      id: 7,
      pillar: 1,
      name: "Theory Mastery",
      focus: "Physics & physiology understood",
      weight: 34,
    },
    { id: 8, pillar: 1, name: "Local Site Knowledge", focus: "Hazards & layout known", weight: 33 },
    {
      id: 9,
      pillar: 1,
      name: "Decompression Understanding",
      focus: "Models & limits applied",
      weight: 34,
    },
    {
      id: 10,
      pillar: 1,
      name: "Gas Management Theory",
      focus: "Rule-of-thirds / rock bottom",
      weight: 33,
    },
    // III — Physical Fitness (170)
    {
      id: 11,
      pillar: 2,
      name: "Cardiovascular Fitness",
      focus: "Sustained exertion tolerance",
      weight: 34,
    },
    { id: 12, pillar: 2, name: "Breath-Hold & Composure", focus: "Calm under stress", weight: 34 },
    {
      id: 13,
      pillar: 2,
      name: "Strength & Endurance",
      focus: "Carry gear & swim against current",
      weight: 34,
    },
    {
      id: 14,
      pillar: 2,
      name: "Flexibility & Mobility",
      focus: "Full range for kit handling",
      weight: 34,
    },
    {
      id: 15,
      pillar: 2,
      name: "Hydration & Nutrition",
      focus: "Fuelled & hydrated pre-dive",
      weight: 34,
    },
    // IV — Safety & Risk (168)
    {
      id: 16,
      pillar: 3,
      name: "Buddy Discipline",
      focus: "Stays in contact, communicates",
      weight: 34,
    },
    { id: 17, pillar: 3, name: "Pre-Dive Checks", focus: "BWRAF drilled every dive", weight: 34 },
    {
      id: 18,
      pillar: 3,
      name: "Risk Assessment",
      focus: "Go/no-go decision disciplined",
      weight: 34,
    },
    { id: 19, pillar: 3, name: "Incident Response", focus: "Can lead a rescue", weight: 33 },
    {
      id: 20,
      pillar: 3,
      name: "Conservative Limits",
      focus: "Never pushes the margin",
      weight: 33,
    },
    // V — Equipment (160)
    { id: 21, pillar: 4, name: "Gear Reliability", focus: "Serviced & trustworthy", weight: 32 },
    { id: 22, pillar: 4, name: "Maintenance Routine", focus: "Rinsed, stored, logged", weight: 32 },
    { id: 23, pillar: 4, name: "Redundancy", focus: "Backup gas / SMB / torch", weight: 32 },
    {
      id: 24,
      pillar: 4,
      name: "Thermal Suit Adequacy",
      focus: "Matched to exposure duration",
      weight: 32,
    },
    { id: 25, pillar: 4, name: "Tool & Spares Kit", focus: "Field-repair capable", weight: 32 },
    // VI — Conditions & Environment (158)
    {
      id: 26,
      pillar: 5,
      name: "Conditions Judgement",
      focus: "Reads current & viz accurately",
      weight: 32,
    },
    {
      id: 27,
      pillar: 5,
      name: "Underwater Navigation",
      focus: "Compass & natural nav reliable",
      weight: 32,
    },
    {
      id: 28,
      pillar: 5,
      name: "Current & Viz Adaptation",
      focus: "Adjusts technique to conditions",
      weight: 32,
    },
    {
      id: 29,
      pillar: 5,
      name: "Environmental Awareness",
      focus: "Protects reef, leaves no trace",
      weight: 31,
    },
    {
      id: 30,
      pillar: 5,
      name: "Dive Logging Discipline",
      focus: "Every dive recorded & reviewed",
      weight: 31,
    },
  ],
};
