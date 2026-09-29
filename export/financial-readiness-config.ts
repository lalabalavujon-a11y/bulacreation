// Standalone export — MoneyHoney brand (moneyhoney.app).
// All pillar/point data moved verbatim from the BULA Creation assessment
// definition. Drop this + src/engine/diagnosticEngine.ts into the MH app.
import {
  type DiagnosticConfig,
  DEFAULT_TIERS,
  standardZones,
} from "@/engine/diagnosticEngine";

export const FinancialReadinessDiagnostic: DiagnosticConfig = {
  id: "financial-readiness",
  name: "Financial Readiness Diagnostic",
  indexName: "Financial Readiness Index",
  maxScore: 1000,
  governor: { pointId: 3 }, // Cash Buffer
  zones: standardZones("Financial Readiness Index"),
  theme: {
    primaryColor: "#c9a84c", // gold
    accentColor: "#2e7d32", // growth green
    bgColor: "#0a0a0a",
  },
  pillars: [
    { id: "cashflow", index: 0, name: "Cashflow", maxScore: 168 },
    { id: "savings", index: 1, name: "Savings & Reserves", maxScore: 166 },
    { id: "debt", index: 2, name: "Debt & Liabilities", maxScore: 166 },
    { id: "tax", index: 3, name: "Tax & Compliance", maxScore: 166 },
    { id: "protection", index: 4, name: "Protection & Planning", maxScore: 166 },
    { id: "growth", index: 5, name: "Growth & Wealth", maxScore: 168 },
  ],
  points: [
    // I — Cashflow (168)
    { id: 1, pillar: 0, name: "Income Stability", focus: "Predictable, diversified income", weight: 34, tiers: DEFAULT_TIERS },
    { id: 2, pillar: 0, name: "Expense Discipline", focus: "Budgeted, tracked monthly", weight: 34, tiers: DEFAULT_TIERS },
    { id: 3, pillar: 0, name: "Cash Buffer", focus: "Working buffer beyond reserves", weight: 34, gating: true, tiers: DEFAULT_TIERS },
    { id: 4, pillar: 0, name: "Cashflow Forecasting", focus: "13-week rolling forecast", weight: 33, tiers: DEFAULT_TIERS },
    { id: 5, pillar: 0, name: "Receivables Management", focus: "Invoices paid on terms", weight: 33, tiers: DEFAULT_TIERS },
    // II — Savings & Reserves (166)
    { id: 6, pillar: 1, name: "Emergency Fund", focus: "3–6 months expenses liquid", weight: 34, tiers: DEFAULT_TIERS },
    { id: 7, pillar: 1, name: "Sinking Funds", focus: "Known future costs pre-funded", weight: 33, tiers: DEFAULT_TIERS },
    { id: 8, pillar: 1, name: "Goal-Based Savings", focus: "Named accounts per goal", weight: 33, tiers: DEFAULT_TIERS },
    { id: 9, pillar: 1, name: "Savings Automation", focus: "Pay-first automated transfer", weight: 33, tiers: DEFAULT_TIERS },
    { id: 10, pillar: 1, name: "Savings Rate", focus: "% saved consistently trending up", weight: 33, tiers: DEFAULT_TIERS },
    // III — Debt & Liabilities (166)
    { id: 11, pillar: 2, name: "Debt-to-Income Ratio", focus: "Within healthy threshold", weight: 34, tiers: DEFAULT_TIERS },
    { id: 12, pillar: 2, name: "High-Interest Clearing", focus: "Plan to eliminate toxic debt", weight: 34, tiers: DEFAULT_TIERS },
    { id: 13, pillar: 2, name: "Repayment Discipline", focus: "More than minimum, on time", weight: 33, tiers: DEFAULT_TIERS },
    { id: 14, pillar: 2, name: "Collateral Exposure", focus: "Secured debt understood & managed", weight: 33, tiers: DEFAULT_TIERS },
    { id: 15, pillar: 2, name: "Credit Utilisation", focus: "Below 30% of available", weight: 32, tiers: DEFAULT_TIERS },
    // IV — Tax & Compliance (166)
    { id: 16, pillar: 3, name: "Filing Currency", focus: "All returns filed on time", weight: 34, tiers: DEFAULT_TIERS },
    { id: 17, pillar: 3, name: "Deduction Optimisation", focus: "Legitimate offsets captured", weight: 33, tiers: DEFAULT_TIERS },
    { id: 18, pillar: 3, name: "Structure Efficiency", focus: "Right entity/structure for tax", weight: 33, tiers: DEFAULT_TIERS },
    { id: 19, pillar: 3, name: "Compliance Hygiene", focus: "No exposure to penalties", weight: 33, tiers: DEFAULT_TIERS },
    { id: 20, pillar: 3, name: "Record-Keeping", focus: "Books clean & up to date", weight: 33, tiers: DEFAULT_TIERS },
    // V — Protection & Planning (166)
    { id: 21, pillar: 4, name: "Insurance Coverage", focus: "Life, health, income protected", weight: 34, tiers: DEFAULT_TIERS },
    { id: 22, pillar: 4, name: "Estate & Will", focus: "Will & POA in place", weight: 33, tiers: DEFAULT_TIERS },
    { id: 23, pillar: 4, name: "Income Protection", focus: "Disability/illness cover adequate", weight: 33, tiers: DEFAULT_TIERS },
    { id: 24, pillar: 4, name: "Beneficiary Currency", focus: "All policies current", weight: 33, tiers: DEFAULT_TIERS },
    { id: 25, pillar: 4, name: "Goal Timeline", focus: "Financial goals dated & mapped", weight: 33, tiers: DEFAULT_TIERS },
    // VI — Growth & Wealth (168)
    { id: 26, pillar: 5, name: "Investment Allocation", focus: "Asset mix matches horizon & risk", weight: 34, tiers: DEFAULT_TIERS },
    { id: 27, pillar: 5, name: "Diversification", focus: "Not concentrated in one asset", weight: 34, tiers: DEFAULT_TIERS },
    { id: 28, pillar: 5, name: "Contribution Consistency", focus: "Invests every month", weight: 34, tiers: DEFAULT_TIERS },
    { id: 29, pillar: 5, name: "Knowledge Depth", focus: "Understands what they own", weight: 33, tiers: DEFAULT_TIERS },
    { id: 30, pillar: 5, name: "Net-Worth Tracking", focus: "Tracks & reviews net worth", weight: 33, tiers: DEFAULT_TIERS },
  ],
};
