// Standalone export — Lead Recon brand (leadrecon.io).
// All pillar/point data moved verbatim from the BULA Creation assessment
// definition. Drop this + src/engine/diagnosticEngine.ts into the LR app.
import {
  type DiagnosticConfig,
  DEFAULT_TIERS,
  standardZones,
} from "@/engine/diagnosticEngine";

export const BusinessGrowthDiagnostic: DiagnosticConfig = {
  id: "business-growth",
  name: "Business Growth Diagnostic",
  indexName: "Business Growth Voltage",
  maxScore: 1000,
  governor: { pointId: 28 }, // Accountability Cadence
  zones: standardZones("Business Growth Voltage"),
  theme: {
    primaryColor: "#3b82f6", // electric blue
    accentColor: "#22d3ee",
    bgColor: "#0a0a0a",
  },
  pillars: [
    { id: "market", index: 0, name: "Market & Offer", maxScore: 178 },
    { id: "leads", index: 1, name: "Lead Generation", maxScore: 179 },
    { id: "sales", index: 2, name: "Sales & Conversion", maxScore: 177 },
    { id: "delivery", index: 3, name: "Delivery & Operations", maxScore: 158 },
    { id: "finance", index: 4, name: "Finance & Capital", maxScore: 160 },
    { id: "team", index: 5, name: "Team & Leadership", maxScore: 148 },
  ],
  points: [
    // Pillar I — Market & Offer (178)
    { id: 1, pillar: 0, name: "Demand Clarity", focus: "Known, measurable unmet demand", weight: 30, tiers: DEFAULT_TIERS },
    { id: 2, pillar: 0, name: "Offer Specificity", focus: "Crystal, outcome-defined offer", weight: 30, tiers: DEFAULT_TIERS },
    { id: 3, pillar: 0, name: "Pricing Power", focus: "Value-based pricing above commodity", weight: 30, tiers: DEFAULT_TIERS },
    { id: 4, pillar: 0, name: "Niche Definition", focus: "Sharply defined ideal customer", weight: 28, tiers: DEFAULT_TIERS },
    { id: 5, pillar: 0, name: "Competitive Moat", focus: "Defensible differentiation", weight: 30, tiers: DEFAULT_TIERS },
    { id: 6, pillar: 0, name: "Value Articulation", focus: "Can state the transformation in one line", weight: 30, tiers: DEFAULT_TIERS },
    // Pillar II — Lead Generation (179)
    { id: 7, pillar: 1, name: "Pipeline Volume", focus: "Consistent qualified lead flow", weight: 36, tiers: DEFAULT_TIERS },
    { id: 8, pillar: 1, name: "Channel Diversification", focus: "Not dependent on one source", weight: 36, tiers: DEFAULT_TIERS },
    { id: 9, pillar: 1, name: "CAC Efficiency", focus: "Sustainable acquisition cost", weight: 36, tiers: DEFAULT_TIERS },
    { id: 10, pillar: 1, name: "Lead Quality", focus: "Leads match the ideal profile", weight: 35, tiers: DEFAULT_TIERS },
    { id: 11, pillar: 1, name: "Appointment Conversion", focus: "Lead → booked call rate", weight: 36, tiers: DEFAULT_TIERS },
    // Pillar III — Sales & Conversion (177)
    { id: 12, pillar: 2, name: "Close Rate", focus: "Opportunity → customer conversion", weight: 36, tiers: DEFAULT_TIERS },
    { id: 13, pillar: 2, name: "Sales Process Definition", focus: "Documented, repeatable stages", weight: 35, tiers: DEFAULT_TIERS },
    { id: 14, pillar: 2, name: "Sales Cycle Length", focus: "Short, disciplined, predictable", weight: 35, tiers: DEFAULT_TIERS },
    { id: 15, pillar: 2, name: "Follow-up Discipline", focus: "No lead goes cold", weight: 35, tiers: DEFAULT_TIERS },
    { id: 16, pillar: 2, name: "Objection Handling", focus: "Core objections pre-engineered", weight: 36, tiers: DEFAULT_TIERS },
    // Pillar IV — Delivery & Operations (158)
    { id: 17, pillar: 3, name: "Fulfilment Reliability", focus: "Promises kept consistently", weight: 32, tiers: DEFAULT_TIERS },
    { id: 18, pillar: 3, name: "Capacity & Scalability", focus: "Throughput can grow 3×", weight: 32, tiers: DEFAULT_TIERS },
    { id: 19, pillar: 3, name: "Quality Consistency", focus: "Output is uniform, not heroic", weight: 32, tiers: DEFAULT_TIERS },
    { id: 20, pillar: 3, name: "Client Onboarding", focus: "Frictionless start experience", weight: 30, tiers: DEFAULT_TIERS },
    { id: 21, pillar: 3, name: "SOP Documentation", focus: "Key processes written down", weight: 32, tiers: DEFAULT_TIERS },
    // Pillar V — Finance & Capital (160)
    { id: 22, pillar: 4, name: "Cash Runway", focus: "Months of buffer at current burn", weight: 32, tiers: DEFAULT_TIERS },
    { id: 23, pillar: 4, name: "Margin Health", focus: "Gross & net margin above benchmark", weight: 32, tiers: DEFAULT_TIERS },
    { id: 24, pillar: 4, name: "Revenue Predictability", focus: "Recurring / forecastable income", weight: 32, tiers: DEFAULT_TIERS },
    { id: 25, pillar: 4, name: "Unit Economics", focus: "Positive LTV:CAC per customer", weight: 32, tiers: DEFAULT_TIERS },
    { id: 26, pillar: 4, name: "Reinvestment Discipline", focus: "Profit reinvested into growth", weight: 32, tiers: DEFAULT_TIERS },
    // Pillar VI — Team & Leadership (148, gating)
    { id: 27, pillar: 5, name: "Role Clarity", focus: "Every seat has a defined scorecard", weight: 28, tiers: DEFAULT_TIERS },
    { id: 28, pillar: 5, name: "Accountability Cadence", focus: "Weekly KPIs held to account", weight: 36, gating: true, tiers: DEFAULT_TIERS },
    { id: 29, pillar: 5, name: "Hiring Pipeline", focus: "Bench of candidates, not reactive", weight: 28, tiers: DEFAULT_TIERS },
    { id: 30, pillar: 5, name: "Leadership Delegation", focus: "Founder not the bottleneck", weight: 28, tiers: DEFAULT_TIERS },
    { id: 31, pillar: 5, name: "Culture & Scoreboard", focus: "Visible metrics & shared standards", weight: 28, tiers: DEFAULT_TIERS },
  ],
};
