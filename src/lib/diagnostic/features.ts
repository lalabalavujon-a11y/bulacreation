// Features registry — the single source of truth for every module in the app.
//
// The Guide auto-renders from this list, so adding a new feature here
// (a new file under src/routes/) automatically surfaces it in the Success
// Playbook. The pricing page, sidebar visibility, and onboarding all read
// their own sources; this module is the canonical *catalogue* used by the
// Guide and any "what's inside" surface.
//
// Keep this in sync with src/routes/ — one FEATURE entry per route.

import type { ComponentType } from "react";
import {
  LayoutDashboard,
  ClipboardCheck,
  Radar,
  Workflow,
  TrendingUp,
  Layers,
  Sparkles,
  Brain,
  Users,
  LayoutGrid,
  CreditCard,
  Compass,
  type LucideIcon,
} from "lucide-react";

export type FeatureTier = "free" | "pro" | "performance" | "coach" | "coach_pro";

export interface FeatureEntry {
  /** Route path. */
  to: string;
  /** Display label. */
  label: string;
  /** Short tagline. */
  tagline: string;
  /** One-sentence description for the Guide. */
  description: string;
  /** Icon component. */
  icon: LucideIcon | ComponentType<{ className?: string }>;
  /** Lowest plan tier that unlocks it. */
  tier: FeatureTier;
  /** Group for the Guide layout. */
  group: "loop" | "agent" | "platform" | "commerce";
}

export const FEATURES: FeatureEntry[] = [
  {
    to: "/",
    label: "Overview",
    tagline: "Your command deck",
    description:
      "Creation Voltage score ring, six-pillar ledger, pillar-equilibrium radar, and your live framework choice — all on one screen.",
    icon: LayoutDashboard,
    tier: "free",
    group: "loop",
  },
  {
    to: "/audit",
    label: "The Audit",
    tagline: "40-point baseline",
    description:
      "Score all 40 points across six pillars on the 4-tier rubric (Friction → Emerging → Aligned → Mastered), with the Teachability governor scoring first and Chief Aim intake at the top.",
    icon: ClipboardCheck,
    tier: "free",
    group: "loop",
  },
  {
    to: "/analytics",
    label: "Analytics",
    tagline: "Pillar equilibrium",
    description:
      "Six-axis spider chart and efficiency table exposing pillar imbalance and deficit percentages against the 60% threshold line.",
    icon: Radar,
    tier: "free",
    group: "loop",
  },
  {
    to: "/leverage",
    label: "Leverage",
    tagline: "Find the constraint",
    description:
      "Bottleneck Sorter ranks all 40 points by immediate point yield (deficit × weight) so you attack only the top 3 highest-leverage constraints. Includes the 4-Step Reflex Circuit.",
    icon: Workflow,
    tier: "pro",
    group: "loop",
  },
  {
    to: "/trajectory",
    label: "Trajectory",
    tagline: "Longitudinal movement",
    description:
      "Voltage trend line, milestone log, snapshot capture, linear-regression forecast (days to Emergence / Operative), and intervention effectiveness analytics.",
    icon: TrendingUp,
    tier: "free",
    group: "loop",
  },
  {
    to: "/srs",
    label: "Spaced Repetition",
    tagline: "Make it durable",
    description:
      "An SM-2 review deck that turns your audit friction points into daily training cards so behaviour compounds instead of fading. One-click import from your lowest-scored points.",
    icon: Layers,
    tier: "pro",
    group: "loop",
  },
  {
    to: "/coach",
    label: "AI Coach",
    tagline: "Trained mentors",
    description:
      "Three personas — Brotherhood Master, Mystical Assumption (Neville), Cybernetics Engineer (Maltz) — each with a curated knowledge base and structured skills. Live score, chief aim, and open commitments are injected automatically. Text + realtime voice.",
    icon: Sparkles,
    tier: "pro",
    group: "agent",
  },
  {
    to: "/twin",
    label: "Digital Twin",
    tagline: "Personalised intelligence",
    description:
      "A persistent longitudinal model of your aims, state, behaviour, constraints, trajectory, and intervention outcomes — so over time it learns what actually moves you.",
    icon: Brain,
    tier: "performance",
    group: "agent",
  },
  {
    to: "/coach-os",
    label: "Coach OS",
    tagline: "Run a practice",
    description:
      "Multi-client dashboard for professional coaches: average voltage, overdue assignments, top recurring constraint across the book, and per-client drill-downs.",
    icon: Users,
    tier: "coach",
    group: "agent",
  },
  {
    to: "/assessments",
    label: "Assessments",
    tagline: "Reusable engine",
    description:
      "The 40-point engine tuned to other domains — Business Growth, Personal Development, Spiritual Development (free bonus), plus 10 Coach-Pro diagnostics: Diver, Finance, Property, Rugby, Sales & Marketing, MMA, Memory, Polymath, AI OS, and Master Sales.",
    icon: LayoutGrid,
    tier: "free",
    group: "platform",
  },
  {
    to: "/pricing",
    label: "Pricing",
    tagline: "Plan ladder",
    description:
      "Five-tier ladder from Free to Coach Pro with a monthly/annual billing toggle. Checkout routes to your connected order forms and re-entitles the app on payment.",
    icon: CreditCard,
    tier: "free",
    group: "commerce",
  },
  {
    to: "/guide",
    label: "Guide",
    tagline: "This playbook",
    description:
      "The Success Operating System protocol — auto-generated from the feature catalogue so it never drifts from the live app.",
    icon: Compass,
    tier: "free",
    group: "platform",
  },
];

/** Features grouped for Guide rendering. */
export const FEATURE_GROUPS: { key: FeatureEntry["group"]; title: string; blurb: string }[] = [
  {
    key: "loop",
    title: "The Weekly Loop",
    blurb: "The cybernetic control loop: audit → diagnose → prioritise → act → measure → repeat.",
  },
  {
    key: "agent",
    title: "Agentic Capabilities",
    blurb:
      "The instrument acts on your data — trained mentors, protocol engine, commitment tracker, twin.",
  },
  {
    key: "platform",
    title: "Platform & Methodology",
    blurb: "The reusable engine and the playbook that keeps you on the loop.",
  },
  {
    key: "commerce",
    title: "Plans & Access",
    blurb: "The commercial ladder and how access is gated.",
  },
];

/** Tier display label + colour token. */
export const TIER_META: Record<FeatureTier, { label: string; token: string }> = {
  free: { label: "Free", token: "var(--muted-foreground)" },
  pro: { label: "Pro+", token: "var(--gold)" },
  performance: { label: "Performance+", token: "var(--gold)" },
  coach: { label: "Coach+", token: "var(--gold)" },
  coach_pro: { label: "Coach Pro", token: "var(--gold-bright)" },
};
