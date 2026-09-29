// Standalone export — Professional Diver brand (professionaldiver.app).
// All pillar/point data moved verbatim from the BULA Creation assessment
// definition. Drop this + src/engine/diagnosticEngine.ts into the PD app.
import {
  type DiagnosticConfig,
  DEFAULT_TIERS,
  standardZones,
} from "@/engine/diagnosticEngine";

export const DiverReadinessDiagnostic: DiagnosticConfig = {
  id: "diver-readiness",
  name: "Diver Readiness Diagnostic",
  indexName: "Diver Readiness Index",
  maxScore: 1000,
  governor: { pointId: 4 }, // Dive Planning
  zones: standardZones("Diver Readiness Index"),
  theme: {
    primaryColor: "#0077b6", // PD ocean blue
    accentColor: "#00b4d8",
    bgColor: "#03045e",
  },
  pillars: [
    { id: "competence", index: 0, name: "Competence & Skills", maxScore: 176 },
    { id: "knowledge", index: 1, name: "Knowledge & Certification", maxScore: 168 },
    { id: "fitness", index: 2, name: "Physical Fitness", maxScore: 170 },
    { id: "safety", index: 3, name: "Safety & Risk Management", maxScore: 168 },
    { id: "equipment", index: 4, name: "Equipment & Maintenance", maxScore: 160 },
    { id: "conditions", index: 5, name: "Conditions & Environment", maxScore: 158 },
  ],
  points: [
    // I — Competence (176)
    { id: 1, pillar: 0, name: "Core Diving Skills", focus: "Foundational in-water control", weight: 36, tiers: DEFAULT_TIERS },
    { id: 2, pillar: 0, name: "Buoyancy Control", focus: "Hover without visual reference", weight: 36, tiers: DEFAULT_TIERS },
    { id: 3, pillar: 0, name: "Equipment Handling", focus: "Don/ditch/swap mid-water", weight: 34, tiers: DEFAULT_TIERS },
    { id: 4, pillar: 0, name: "Dive Planning", focus: "Gas, depth, time calculated", weight: 36, gating: true, tiers: DEFAULT_TIERS },
    { id: 5, pillar: 0, name: "Emergency Procedures", focus: "Drilled out-of-air / freeflow", weight: 34, tiers: DEFAULT_TIERS },
    // II — Knowledge & Certification (168)
    { id: 6, pillar: 1, name: "Certification Level", focus: "Current for intended dive", weight: 34, tiers: DEFAULT_TIERS },
    { id: 7, pillar: 1, name: "Theory Mastery", focus: "Physics & physiology understood", weight: 34, tiers: DEFAULT_TIERS },
    { id: 8, pillar: 1, name: "Local Site Knowledge", focus: "Hazards & layout known", weight: 33, tiers: DEFAULT_TIERS },
    { id: 9, pillar: 1, name: "Decompression Understanding", focus: "Models & limits applied", weight: 34, tiers: DEFAULT_TIERS },
    { id: 10, pillar: 1, name: "Gas Management Theory", focus: "Rule-of-thirds / rock bottom", weight: 33, tiers: DEFAULT_TIERS },
    // III — Physical Fitness (170)
    { id: 11, pillar: 2, name: "Cardiovascular Fitness", focus: "Sustained exertion tolerance", weight: 34, tiers: DEFAULT_TIERS },
    { id: 12, pillar: 2, name: "Breath-Hold & Composure", focus: "Calm under stress", weight: 34, tiers: DEFAULT_TIERS },
    { id: 13, pillar: 2, name: "Strength & Endurance", focus: "Carry gear & swim against current", weight: 34, tiers: DEFAULT_TIERS },
    { id: 14, pillar: 2, name: "Flexibility & Mobility", focus: "Full range for kit handling", weight: 34, tiers: DEFAULT_TIERS },
    { id: 15, pillar: 2, name: "Hydration & Nutrition", focus: "Fuelled & hydrated pre-dive", weight: 34, tiers: DEFAULT_TIERS },
    // IV — Safety & Risk (168)
    { id: 16, pillar: 3, name: "Buddy Discipline", focus: "Stays in contact, communicates", weight: 34, tiers: DEFAULT_TIERS },
    { id: 17, pillar: 3, name: "Pre-Dive Checks", focus: "BWRAF drilled every dive", weight: 34, tiers: DEFAULT_TIERS },
    { id: 18, pillar: 3, name: "Risk Assessment", focus: "Go/no-go decision disciplined", weight: 34, tiers: DEFAULT_TIERS },
    { id: 19, pillar: 3, name: "Incident Response", focus: "Can lead a rescue", weight: 33, tiers: DEFAULT_TIERS },
    { id: 20, pillar: 3, name: "Conservative Limits", focus: "Never pushes the margin", weight: 33, tiers: DEFAULT_TIERS },
    // V — Equipment (160)
    { id: 21, pillar: 4, name: "Gear Reliability", focus: "Serviced & trustworthy", weight: 32, tiers: DEFAULT_TIERS },
    { id: 22, pillar: 4, name: "Maintenance Routine", focus: "Rinsed, stored, logged", weight: 32, tiers: DEFAULT_TIERS },
    { id: 23, pillar: 4, name: "Redundancy", focus: "Backup gas / SMB / torch", weight: 32, tiers: DEFAULT_TIERS },
    { id: 24, pillar: 4, name: "Thermal Suit Adequacy", focus: "Matched to exposure duration", weight: 32, tiers: DEFAULT_TIERS },
    { id: 25, pillar: 4, name: "Tool & Spares Kit", focus: "Field-repair capable", weight: 32, tiers: DEFAULT_TIERS },
    // VI — Conditions & Environment (158)
    { id: 26, pillar: 5, name: "Conditions Judgement", focus: "Reads current & viz accurately", weight: 32, tiers: DEFAULT_TIERS },
    { id: 27, pillar: 5, name: "Underwater Navigation", focus: "Compass & natural nav reliable", weight: 32, tiers: DEFAULT_TIERS },
    { id: 28, pillar: 5, name: "Current & Viz Adaptation", focus: "Adjusts technique to conditions", weight: 32, tiers: DEFAULT_TIERS },
    { id: 29, pillar: 5, name: "Environmental Awareness", focus: "Protects reef, leaves no trace", weight: 31, tiers: DEFAULT_TIERS },
    { id: 30, pillar: 5, name: "Dive Logging Discipline", focus: "Every dive recorded & reviewed", weight: 31, tiers: DEFAULT_TIERS },
  ],
};
