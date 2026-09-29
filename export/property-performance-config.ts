// Standalone export — Bula Properties brand.
// All pillar/point data moved verbatim from the BULA Creation assessment
// definition. Drop this + src/engine/diagnosticEngine.ts into the BP app.
import {
  type DiagnosticConfig,
  DEFAULT_TIERS,
  standardZones,
} from "@/engine/diagnosticEngine";

export const PropertyPerformanceDiagnostic: DiagnosticConfig = {
  id: "property-performance",
  name: "Property Performance Diagnostic",
  indexName: "Property Performance Index",
  maxScore: 1000,
  governor: { pointId: 17 }, // Maintenance Backlog
  zones: standardZones("Property Performance Index"),
  theme: {
    primaryColor: "#b08968", // warm neutral
    accentColor: "#ddb892",
    bgColor: "#1a1410",
  },
  pillars: [
    { id: "occupancy", index: 0, name: "Occupancy & Demand", maxScore: 168 },
    { id: "pricing", index: 1, name: "Pricing & Revenue", maxScore: 170 },
    { id: "guest", index: 2, name: "Guest Experience", maxScore: 168 },
    { id: "operations", index: 3, name: "Operations", maxScore: 160 },
    { id: "listing", index: 4, name: "Listing & Marketing", maxScore: 166 },
    { id: "asset", index: 5, name: "Asset & Compliance", maxScore: 168 },
  ],
  points: [
    // I — Occupancy & Demand (168)
    { id: 1, pillar: 0, name: "Occupancy Rate", focus: "Above market average", weight: 34, tiers: DEFAULT_TIERS },
    { id: 2, pillar: 0, name: "Booking Lead Time", focus: "Booked well in advance", weight: 34, tiers: DEFAULT_TIERS },
    { id: 3, pillar: 0, name: "Seasonality Balance", focus: "Off-peak demand managed", weight: 34, tiers: DEFAULT_TIERS },
    { id: 4, pillar: 0, name: "Cancellation Rate", focus: "Low, with firm policy", weight: 33, tiers: DEFAULT_TIERS },
    { id: 5, pillar: 0, name: "Repeat-Guest Rate", focus: "Guests return or refer", weight: 33, tiers: DEFAULT_TIERS },
    // II — Pricing & Revenue (170)
    { id: 6, pillar: 1, name: "ADR Optimisation", focus: "Average daily rate maximised", weight: 34, tiers: DEFAULT_TIERS },
    { id: 7, pillar: 1, name: "RevPAR", focus: "Revenue per available room strong", weight: 34, tiers: DEFAULT_TIERS },
    { id: 8, pillar: 1, name: "Dynamic Pricing Discipline", focus: "Rates adjusted to demand", weight: 34, tiers: DEFAULT_TIERS },
    { id: 9, pillar: 1, name: "Length-of-Stay Mix", focus: "Min-stay & gaps optimised", weight: 34, tiers: DEFAULT_TIERS },
    { id: 10, pillar: 1, name: "Discount Discipline", focus: "Discounts strategic, not reactive", weight: 34, tiers: DEFAULT_TIERS },
    // III — Guest Experience (168)
    { id: 11, pillar: 2, name: "Review Score", focus: "4.8+ average across channels", weight: 34, tiers: DEFAULT_TIERS },
    { id: 12, pillar: 2, name: "Response Time", focus: "Messages answered < 1 hour", weight: 34, tiers: DEFAULT_TIERS },
    { id: 13, pillar: 2, name: "Cleanliness Consistency", focus: "Spotless every turnover", weight: 34, tiers: DEFAULT_TIERS },
    { id: 14, pillar: 2, name: "Check-In Friction", focus: "Self-check-in, zero confusion", weight: 33, tiers: DEFAULT_TIERS },
    { id: 15, pillar: 2, name: "Complaint Resolution", focus: "Issues fixed before review", weight: 33, tiers: DEFAULT_TIERS },
    // IV — Operations (160)
    { id: 16, pillar: 3, name: "Turnover Reliability", focus: "Cleaners never miss", weight: 32, tiers: DEFAULT_TIERS },
    { id: 17, pillar: 3, name: "Maintenance Backlog", focus: "Zero open issues > 7 days", weight: 32, gating: true, tiers: DEFAULT_TIERS },
    { id: 18, pillar: 3, name: "Supply Restock Discipline", focus: "Consumables never empty", weight: 32, tiers: DEFAULT_TIERS },
    { id: 19, pillar: 3, name: "Staffing Coverage", focus: "Backup cleaners & hosts", weight: 32, tiers: DEFAULT_TIERS },
    { id: 20, pillar: 3, name: "Cost Control", focus: "Operating costs benchmarked", weight: 32, tiers: DEFAULT_TIERS },
    // V — Listing & Marketing (166)
    { id: 21, pillar: 4, name: "Listing Quality", focus: "Title, copy, amenities optimised", weight: 34, tiers: DEFAULT_TIERS },
    { id: 22, pillar: 4, name: "Photo Currency", focus: "Professional, recent photos", weight: 34, tiers: DEFAULT_TIERS },
    { id: 23, pillar: 4, name: "Channel Diversification", focus: "Multiple platforms + direct", weight: 33, tiers: DEFAULT_TIERS },
    { id: 24, pillar: 4, name: "SEO & Visibility", focus: "Ranks for target searches", weight: 33, tiers: DEFAULT_TIERS },
    { id: 25, pillar: 4, name: "Direct-Booking Share", focus: "Growing direct, OTA-light", weight: 32, tiers: DEFAULT_TIERS },
    // VI — Asset & Compliance (168)
    { id: 26, pillar: 5, name: "Safety Compliance", focus: "Gas, fire, electrics certified", weight: 34, tiers: DEFAULT_TIERS },
    { id: 27, pillar: 5, name: "Insurance Coverage", focus: "Short-let-specific cover in place", weight: 34, tiers: DEFAULT_TIERS },
    { id: 28, pillar: 5, name: "Documentation Currency", focus: "Licences & registrations valid", weight: 34, tiers: DEFAULT_TIERS },
    { id: 29, pillar: 5, name: "Depreciation Tracking", focus: "Capital allowances captured", weight: 33, tiers: DEFAULT_TIERS },
    { id: 30, pillar: 5, name: "Refurbishment Plan", focus: "Scheduled refresh cycle", weight: 33, tiers: DEFAULT_TIERS },
  ],
};
