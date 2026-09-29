// Assessment registry — BULA Creation diagnostics.
//
// The 40-Point Creation Algorithm is the core product (its own scoring engine).
// BULA Creation ships:
//   • THREE free bonus diagnostics — Business Growth, Personal Development,
//     and Spiritual Development — available to all users.
//   • An expanded Coach Pro library of portfolio diagnostics:
//       1. Diver Readiness
//       2. Financial Readiness
//       3. Property Performance
//       4. Rugby Personal Development
//       5. Sales & Marketing
//       6. MMA Personal Development
//       7. Memory Development
//       8. Polymath Development
//       9. Agentic AI OS Development
//      10. Master Sales Development
//     gated strictly to Coach / Coach Pro entitlements.

import type { AssessmentDef } from "./types";
import { businessGrowth } from "./definitions/business-growth";
import { personalDevelopment } from "./definitions/personal-development";
import { spiritualDevelopment } from "./definitions/spiritual-development";
import { diverReadiness } from "./definitions/diver-readiness";
import { financialReadiness } from "./definitions/financial-readiness";
import { propertyPerformance } from "./definitions/property-performance";
import { rugbyPersonalDevelopment } from "./definitions/rugby-personal-development";
import { salesMarketing } from "./definitions/sales-marketing";
import { mmaPersonalDevelopment } from "./definitions/mma-personal-development";
import { memoryDevelopment } from "./definitions/memory-development";
import { polymathDevelopment } from "./definitions/polymath-development";
import { agenticAiOsDevelopment } from "./definitions/agentic-ai-os-development";
import { masterSalesDevelopment } from "./definitions/master-sales-development";

/** All diagnostics across both free bonus and Coach Pro tiers. */
export const ASSESSMENTS: AssessmentDef[] = [
  // Free Bonus Diagnostics (3)
  businessGrowth,
  personalDevelopment,
  spiritualDevelopment,

  // Coach Pro Library (10)
  diverReadiness,
  financialReadiness,
  propertyPerformance,
  rugbyPersonalDevelopment,
  salesMarketing,
  mmaPersonalDevelopment,
  memoryDevelopment,
  polymathDevelopment,
  agenticAiOsDevelopment,
  masterSalesDevelopment,
];

/** Free / public bonus diagnostics (no Coach Pro gate). */
export const PUBLIC_ASSESSMENTS: AssessmentDef[] = ASSESSMENTS.filter((a) => !a.coachProOnly);

/** Coach-Pro-gated diagnostics. */
export const COACH_PRO_ASSESSMENTS: AssessmentDef[] = ASSESSMENTS.filter((a) => a.coachProOnly);

export const ASSESSMENT_MAP: Record<string, AssessmentDef> = Object.fromEntries(
  ASSESSMENTS.map((a) => [a.key, a]),
);

export function getAssessment(key: string): AssessmentDef | undefined {
  return ASSESSMENT_MAP[key];
}
