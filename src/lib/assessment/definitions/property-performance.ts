import type { AssessmentDef } from "../types";
import { DEFAULT_TIERS, standardZones } from "../types";

// Property Performance Index — diagnostic for short-let / rental portfolios.
// 6 pillars, 30 points, ~1000-point index, 400/600 thresholds.

export const propertyPerformance: AssessmentDef = {
  key: "property-performance",
  name: "Property Performance Diagnostic",
  tagline: "Occupancy → pricing → reviews → operations → revenue",
  indexLabel: "Property Performance Index",
  shortIndex: "Performance",
  description:
    "A performance diagnostic for short-let and rental property portfolios, decomposing occupancy, pricing, guest experience, operations, listing quality and asset compliance into a revenue-optimising index.",
  tiers: DEFAULT_TIERS,
  accent: "var(--gold)",
  coachProOnly: true, // Coach Pro exclusive library
  zones: standardZones("Property Performance Index"),
  gatingPointId: 17,
  pillars: [
    { index: 0, roman: "I", name: "Occupancy & Demand", focus: "Fill rate · lead time · repeat" },
    { index: 1, roman: "II", name: "Pricing & Revenue", focus: "ADR · RevPAR · dynamic pricing" },
    { index: 2, roman: "III", name: "Guest Experience", focus: "Reviews · response · resolution" },
    { index: 3, roman: "IV", name: "Operations", focus: "Turnover · maintenance · staffing" },
    {
      index: 4,
      roman: "V",
      name: "Listing & Marketing",
      focus: "Listing quality · channels · SEO",
    },
    {
      index: 5,
      roman: "VI",
      name: "Asset & Compliance",
      focus: "Safety · insurance · refurbishment",
    },
  ],
  points: [
    // I — Occupancy & Demand (168)
    { id: 1, pillar: 0, name: "Occupancy Rate", focus: "Above market average", weight: 34 },
    { id: 2, pillar: 0, name: "Booking Lead Time", focus: "Booked well in advance", weight: 34 },
    { id: 3, pillar: 0, name: "Seasonality Balance", focus: "Off-peak demand managed", weight: 34 },
    { id: 4, pillar: 0, name: "Cancellation Rate", focus: "Low, with firm policy", weight: 33 },
    { id: 5, pillar: 0, name: "Repeat-Guest Rate", focus: "Guests return or refer", weight: 33 },
    // II — Pricing & Revenue (170)
    {
      id: 6,
      pillar: 1,
      name: "ADR Optimisation",
      focus: "Average daily rate maximised",
      weight: 34,
    },
    { id: 7, pillar: 1, name: "RevPAR", focus: "Revenue per available room strong", weight: 34 },
    {
      id: 8,
      pillar: 1,
      name: "Dynamic Pricing Discipline",
      focus: "Rates adjusted to demand",
      weight: 34,
    },
    {
      id: 9,
      pillar: 1,
      name: "Length-of-Stay Mix",
      focus: "Min-stay & gaps optimised",
      weight: 34,
    },
    {
      id: 10,
      pillar: 1,
      name: "Discount Discipline",
      focus: "Discounts strategic, not reactive",
      weight: 34,
    },
    // III — Guest Experience (168)
    { id: 11, pillar: 2, name: "Review Score", focus: "4.8+ average across channels", weight: 34 },
    { id: 12, pillar: 2, name: "Response Time", focus: "Messages answered < 1 hour", weight: 34 },
    {
      id: 13,
      pillar: 2,
      name: "Cleanliness Consistency",
      focus: "Spotless every turnover",
      weight: 34,
    },
    {
      id: 14,
      pillar: 2,
      name: "Check-In Friction",
      focus: "Self-check-in, zero confusion",
      weight: 33,
    },
    {
      id: 15,
      pillar: 2,
      name: "Complaint Resolution",
      focus: "Issues fixed before review",
      weight: 33,
    },
    // IV — Operations (160)
    { id: 16, pillar: 3, name: "Turnover Reliability", focus: "Cleaners never miss", weight: 32 },
    {
      id: 17,
      pillar: 3,
      name: "Maintenance Backlog",
      focus: "Zero open issues > 7 days",
      weight: 32,
      gating: true,
    },
    {
      id: 18,
      pillar: 3,
      name: "Supply Restock Discipline",
      focus: "Consumables never empty",
      weight: 32,
    },
    { id: 19, pillar: 3, name: "Staffing Coverage", focus: "Backup cleaners & hosts", weight: 32 },
    { id: 20, pillar: 3, name: "Cost Control", focus: "Operating costs benchmarked", weight: 32 },
    // V — Listing & Marketing (166)
    {
      id: 21,
      pillar: 4,
      name: "Listing Quality",
      focus: "Title, copy, amenities optimised",
      weight: 34,
    },
    { id: 22, pillar: 4, name: "Photo Currency", focus: "Professional, recent photos", weight: 34 },
    {
      id: 23,
      pillar: 4,
      name: "Channel Diversification",
      focus: "Multiple platforms + direct",
      weight: 33,
    },
    { id: 24, pillar: 4, name: "SEO & Visibility", focus: "Ranks for target searches", weight: 33 },
    {
      id: 25,
      pillar: 4,
      name: "Direct-Booking Share",
      focus: "Growing direct, OTA-light",
      weight: 32,
    },
    // VI — Asset & Compliance (168)
    {
      id: 26,
      pillar: 5,
      name: "Safety Compliance",
      focus: "Gas, fire, electrics certified",
      weight: 34,
    },
    {
      id: 27,
      pillar: 5,
      name: "Insurance Coverage",
      focus: "Short-let-specific cover in place",
      weight: 34,
    },
    {
      id: 28,
      pillar: 5,
      name: "Documentation Currency",
      focus: "Licences & registrations valid",
      weight: 34,
    },
    {
      id: 29,
      pillar: 5,
      name: "Depreciation Tracking",
      focus: "Capital allowances captured",
      weight: 33,
    },
    { id: 30, pillar: 5, name: "Refurbishment Plan", focus: "Scheduled refresh cycle", weight: 33 },
  ],
};
