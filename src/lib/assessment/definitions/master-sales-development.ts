import type { AssessmentDef } from "../types";
import { DEFAULT_TIERS, standardZones } from "../types";

export const masterSalesDevelopment: AssessmentDef = {
  key: "master-sales-development",
  name: "Master Sales Development Diagnostic",
  tagline: "Discovery · objection conviction · pipeline hygiene · enterprise negotiation · closing",
  indexLabel: "Master Sales Execution Index",
  shortIndex: "Sales Mastery Index",
  description:
    "An enterprise sales diagnostic auditing diagnosis-based discovery, pain excavation, deal architecture, objection conviction, economic buyer alignment, and closing velocity.",
  tiers: DEFAULT_TIERS,
  accent: "var(--gold)",
  coachProOnly: true, // Coach Pro exclusive
  gatingPointId: 1, // Discovery & Pain Excavation is master governor
  gatingFormula: (score: number) => 0.5 + 0.5 * score,
  zones: standardZones("Master Sales Execution Index"),
  pillars: [
    {
      index: 0,
      roman: "I",
      name: "Diagnosis & Deep Pain Excavation",
      focus: "Gap selling · quantifying the cost of inaction · unearthing root cause bleeding",
    },
    {
      index: 1,
      roman: "II",
      name: "Economic Buyer Alignment & MEDDPICC",
      focus: "Accessing true decision makers · decision criteria · paper process · champions",
    },
    {
      index: 2,
      roman: "III",
      name: "Value Architecture & Solution Engineering",
      focus: "ROI modeling · bespoke commercial proposals · compelling event linkage",
    },
    {
      index: 3,
      roman: "IV",
      name: "Objection Conviction & Frame Control",
      focus:
        "Status alignment · neutralizing price resistance · holding firm commercial boundaries",
    },
    {
      index: 4,
      roman: "V",
      name: "Pipeline Hygiene & Outbound Velocity",
      focus: "Strict deal qualification · staging accuracy · multi-threaded prospecting",
    },
    {
      index: 5,
      roman: "VI",
      name: "Closing Mechanics & Expansion Compounding",
      focus: "Mutual Action Plans (MAPs) · signing cadence · land-and-expand account growth",
    },
  ],
  points: [
    // Pillar I (190 pts)
    {
      id: 1,
      pillar: 0,
      name: "Pain Quantified In Dollars",
      focus: "Translating vague frustration into specific monthly financial leakage",
      weight: 50,
      gating: true,
    },
    {
      id: 2,
      pillar: 0,
      name: "Diagnostic Questioning Cadence",
      focus: "Peeling 3 levels deep past surface symptoms to structural bottlenecks",
      weight: 35,
    },
    {
      id: 3,
      pillar: 0,
      name: "Cost of Inaction (COI) Anchor",
      focus: "Proving that doing nothing is 5-10x more expensive than solving the problem",
      weight: 35,
    },
    {
      id: 4,
      pillar: 0,
      name: "Emotional Driver Identification",
      focus: "Uncovering personal career risk, promotion upside, and executive vanity",
      weight: 35,
    },
    {
      id: 5,
      pillar: 0,
      name: "Equal Business Stature",
      focus: "Interviewing as a peer consultant rather than subservient vendor",
      weight: 35,
    },

    // Pillar II (165 pts)
    {
      id: 6,
      pillar: 1,
      name: "Economic Buyer Access",
      focus: "Sitting directly with the P&L owner who holds checkbook authority",
      weight: 40,
    },
    {
      id: 7,
      pillar: 1,
      name: "Internal Champion Development",
      focus: "Equipping an internal ally with collateral to sell on your behalf",
      weight: 35,
    },
    {
      id: 8,
      pillar: 1,
      name: "Decision Criteria Control",
      focus: "Influencing RFP / evaluation rubrics in favor of your unique differentiators",
      weight: 30,
    },
    {
      id: 9,
      pillar: 1,
      name: "Paper Process Mapping",
      focus: "Clear visibility into legal, procurement, and infosec timelines early",
      weight: 30,
    },
    {
      id: 10,
      pillar: 1,
      name: "Competition & Alternative Neutralization",
      focus: "Preemptively addressing internal builds, inertia, and legacy rivals",
      weight: 30,
    },

    // Pillar III (165 pts)
    {
      id: 11,
      pillar: 2,
      name: "Financial Business Case Modeling",
      focus: "Demonstrating clear 5x+ ROI with conservative, client-verified math",
      weight: 40,
    },
    {
      id: 12,
      pillar: 2,
      name: "Compelling Event Attachment",
      focus: "Tying deployment to a critical external board or regulatory deadline",
      weight: 35,
    },
    {
      id: 13,
      pillar: 2,
      name: "Tailored Executive Presentation",
      focus: "Zero generic slide decks; every word mapped to client's specific pain",
      weight: 30,
    },
    {
      id: 14,
      pillar: 2,
      name: "Scarcity & Exclusivity Framing",
      focus: "Positioning capacity limits and onboarding bandwidth naturally",
      weight: 30,
    },
    {
      id: 15,
      pillar: 2,
      name: "Risk Reversal Architecture",
      focus: "Structuring milestone-based proofs or performance guarantees cleanly",
      weight: 30,
    },

    // Pillar IV (160 pts)
    {
      id: 16,
      pillar: 3,
      name: "Price Resistance Disarmament",
      focus: "Recalling quantified pain whenever price is challenged; never discounting early",
      weight: 40,
    },
    {
      id: 17,
      pillar: 3,
      name: "Frame Dominance & Composure",
      focus: "Unflinching silence and calm when prospects push back aggressively",
      weight: 35,
    },
    {
      id: 18,
      pillar: 3,
      name: "Preemptive Objection Inoculation",
      focus: "Surfacing hidden doubts before the buyer voices them",
      weight: 30,
    },
    {
      id: 19,
      pillar: 3,
      name: "Give-Get Negotiation Trading",
      focus: "Never conceding price without extracting terms, case studies or prepay",
      weight: 30,
    },
    {
      id: 20,
      pillar: 3,
      name: "Walk-Away Threshold Discipline",
      focus: "Total willingness to politely disqualify bad-fit or abusive clients",
      weight: 25,
    },

    // Pillar V (160 pts)
    {
      id: 21,
      pillar: 4,
      name: "Ruthless Qualification Scoring",
      focus: "Disqualifying non-buyers in call 1 to protect closing bandwidth",
      weight: 40,
    },
    {
      id: 22,
      pillar: 4,
      name: "Multi-Threaded Stakeholder Coverage",
      focus: "Engaging 3+ decision makers across finance, operations, and IT",
      weight: 35,
    },
    {
      id: 23,
      pillar: 4,
      name: "Daily Prospecting Cadence",
      focus: "Non-negotiable morning blocks dedicated to personalized high-value outreach",
      weight: 30,
    },
    {
      id: 24,
      pillar: 4,
      name: "CRM Pipeline Cleanliness",
      focus: "Real close dates, verified next steps, and zero zombie deals in pipeline",
      weight: 30,
    },
    {
      id: 25,
      pillar: 4,
      name: "Follow-Up Urgency & Velocity",
      focus: "Returning notes, proposals, and answers within 2 business hours",
      weight: 25,
    },

    // Pillar VI (160 pts)
    {
      id: 26,
      pillar: 5,
      name: "Mutual Action Plan (MAP) Execution",
      focus: "Joint agreed calendar of steps leading to signature and go-live date",
      weight: 40,
    },
    {
      id: 27,
      pillar: 5,
      name: "Direct Assumptive Closes",
      focus: "Asking for business clearly without hesitation, apology, or awkwardness",
      weight: 35,
    },
    {
      id: 28,
      pillar: 5,
      name: "Smooth Hand-Off to Customer Success",
      focus: "Zero drop in momentum between contract signature and initial value delivery",
      weight: 30,
    },
    {
      id: 29,
      pillar: 5,
      name: "Early Case Study & Referral Capture",
      focus: "Securing glowing testimonials within the first 60 days of client win",
      weight: 30,
    },
    {
      id: 30,
      pillar: 5,
      name: "Expansion & Upsell Revenue Engine",
      focus: "Predictable account growth through seat expansion and tiered add-ons",
      weight: 25,
    },
  ],
};
