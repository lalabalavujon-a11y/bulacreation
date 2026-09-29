import type { AssessmentDef } from "../types";
import { DEFAULT_TIERS, standardZones } from "../types";

// Financial Readiness Index — diagnostic for personal & business finances.
// 6 pillars, 30 points, ~1000-point index, 400/600 thresholds.

export const financialReadiness: AssessmentDef = {
  key: "financial-readiness",
  name: "Financial Readiness Diagnostic",
  tagline: "Cashflow → tax → savings → liabilities → compliance",
  indexLabel: "Financial Readiness Index",
  shortIndex: "Readiness",
  description:
    "A financial readiness diagnostic decomposing cashflow, savings, debt, tax compliance, protection and wealth growth into a measurable index with an AI intervention path.",
  tiers: DEFAULT_TIERS,
  accent: "var(--gold)",
  coachProOnly: true, // Coach Pro exclusive library
  zones: standardZones("Financial Readiness Index"),
  gatingPointId: 3,
  pillars: [
    { index: 0, roman: "I", name: "Cashflow", focus: "Income · expenses · buffer" },
    { index: 1, roman: "II", name: "Savings & Reserves", focus: "Emergency · goals · automation" },
    {
      index: 2,
      roman: "III",
      name: "Debt & Liabilities",
      focus: "Clearing · utilisation · exposure",
    },
    { index: 3, roman: "IV", name: "Tax & Compliance", focus: "Filing · structure · records" },
    { index: 4, roman: "V", name: "Protection & Planning", focus: "Insurance · estate · goals" },
    {
      index: 5,
      roman: "VI",
      name: "Growth & Wealth",
      focus: "Investing · diversification · tracking",
    },
  ],
  points: [
    // I — Cashflow (168)
    {
      id: 1,
      pillar: 0,
      name: "Income Stability",
      focus: "Predictable, diversified income",
      weight: 34,
    },
    {
      id: 2,
      pillar: 0,
      name: "Expense Discipline",
      focus: "Budgeted, tracked monthly",
      weight: 34,
    },
    {
      id: 3,
      pillar: 0,
      name: "Cash Buffer",
      focus: "Working buffer beyond reserves",
      weight: 34,
      gating: true,
    },
    {
      id: 4,
      pillar: 0,
      name: "Cashflow Forecasting",
      focus: "13-week rolling forecast",
      weight: 33,
    },
    {
      id: 5,
      pillar: 0,
      name: "Receivables Management",
      focus: "Invoices paid on terms",
      weight: 33,
    },
    // II — Savings & Reserves (166)
    { id: 6, pillar: 1, name: "Emergency Fund", focus: "3–6 months expenses liquid", weight: 34 },
    { id: 7, pillar: 1, name: "Sinking Funds", focus: "Known future costs pre-funded", weight: 33 },
    { id: 8, pillar: 1, name: "Goal-Based Savings", focus: "Named accounts per goal", weight: 33 },
    {
      id: 9,
      pillar: 1,
      name: "Savings Automation",
      focus: "Pay-first automated transfer",
      weight: 33,
    },
    {
      id: 10,
      pillar: 1,
      name: "Savings Rate",
      focus: "% saved consistently trending up",
      weight: 33,
    },
    // III — Debt & Liabilities (166)
    {
      id: 11,
      pillar: 2,
      name: "Debt-to-Income Ratio",
      focus: "Within healthy threshold",
      weight: 34,
    },
    {
      id: 12,
      pillar: 2,
      name: "High-Interest Clearing",
      focus: "Plan to eliminate toxic debt",
      weight: 34,
    },
    {
      id: 13,
      pillar: 2,
      name: "Repayment Discipline",
      focus: "More than minimum, on time",
      weight: 33,
    },
    {
      id: 14,
      pillar: 2,
      name: "Collateral Exposure",
      focus: "Secured debt understood & managed",
      weight: 33,
    },
    { id: 15, pillar: 2, name: "Credit Utilisation", focus: "Below 30% of available", weight: 32 },
    // IV — Tax & Compliance (166)
    { id: 16, pillar: 3, name: "Filing Currency", focus: "All returns filed on time", weight: 34 },
    {
      id: 17,
      pillar: 3,
      name: "Deduction Optimisation",
      focus: "Legitimate offsets captured",
      weight: 33,
    },
    {
      id: 18,
      pillar: 3,
      name: "Structure Efficiency",
      focus: "Right entity/structure for tax",
      weight: 33,
    },
    {
      id: 19,
      pillar: 3,
      name: "Compliance Hygiene",
      focus: "No exposure to penalties",
      weight: 33,
    },
    { id: 20, pillar: 3, name: "Record-Keeping", focus: "Books clean & up to date", weight: 33 },
    // V — Protection & Planning (166)
    {
      id: 21,
      pillar: 4,
      name: "Insurance Coverage",
      focus: "Life, health, income protected",
      weight: 34,
    },
    { id: 22, pillar: 4, name: "Estate & Will", focus: "Will & POA in place", weight: 33 },
    {
      id: 23,
      pillar: 4,
      name: "Income Protection",
      focus: "Disability/illness cover adequate",
      weight: 33,
    },
    { id: 24, pillar: 4, name: "Beneficiary Currency", focus: "All policies current", weight: 33 },
    {
      id: 25,
      pillar: 4,
      name: "Goal Timeline",
      focus: "Financial goals dated & mapped",
      weight: 33,
    },
    // VI — Growth & Wealth (168)
    {
      id: 26,
      pillar: 5,
      name: "Investment Allocation",
      focus: "Asset mix matches horizon & risk",
      weight: 34,
    },
    {
      id: 27,
      pillar: 5,
      name: "Diversification",
      focus: "Not concentrated in one asset",
      weight: 34,
    },
    {
      id: 28,
      pillar: 5,
      name: "Contribution Consistency",
      focus: "Invests every month",
      weight: 34,
    },
    { id: 29, pillar: 5, name: "Knowledge Depth", focus: "Understands what they own", weight: 33 },
    {
      id: 30,
      pillar: 5,
      name: "Net-Worth Tracking",
      focus: "Tracks & reviews net worth",
      weight: 33,
    },
  ],
};
