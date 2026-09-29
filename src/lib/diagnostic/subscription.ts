// Subscription & entitlement layer (spec §13).
//
// Defines the commercial plan ladder and the feature gates that map each plan
// to a set of entitlements. The provider (subscription-context.tsx) persists
// the active plan + trial state to localStorage and exposes a `useSubscription`
// hook that routes/components use to gate premium features behind a paywall.
//
// V1 note: this is a local entitlement layer (no billing backend yet). It is
// structured so a real billing provider (Stripe / platform subscriptions) can
// later write the same `PlanKey` + `status` into the persisted shape — the
// gating logic below stays unchanged.

export type PlanKey = "free" | "pro" | "performance" | "coach" | "coach_pro";

export type SubscriptionStatus = "active" | "trialing" | "expired" | "none";

/** Billing cycle for checkout + pricing display. */
export type BillingCycle = "monthly" | "yearly";

export interface Plan {
  key: PlanKey;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  /** Short price label for cards. */
  priceLabel: string;
  /** Highlighted on the pricing page. */
  featured?: boolean;
  /** Audience label. */
  audience: string;
  features: string[];
  /** Entitlements consumed by the gate logic. */
  limits: PlanLimits;
}

export interface PlanLimits {
  /** Max audit snapshots retained. -1 = unlimited. */
  snapshots: number;
  /** Max AI coach messages per day. -1 = unlimited. 0 = blocked. */
  aiMessagesPerDay: number;
  /** Realtime voice coaching. */
  voiceCoach: boolean;
  /** Leverage engine / bottleneck sorter. */
  leverageEngine: boolean;
  /** Trajectory history + line chart. */
  trajectory: boolean;
  /** Advanced forecasting (days-to-threshold). */
  forecasting: boolean;
  /** Intervention effectiveness analytics. */
  interventionAnalytics: boolean;
  /** Digital Twin longitudinal model. */
  digitalTwin: boolean;
  /** Multiple Chief Aims. */
  multipleAims: boolean;
  /** Selectable coaching philosophies (false = performance only). */
  philosophies: boolean;
  /** Monthly Creation Report. */
  monthlyReport: boolean;
  /** Coach OS dashboard. */
  coachOs: boolean;
  /** Max client slots in Coach OS. 0 = none. */
  clientSlots: number;
  /** Custom branding / methodologies. */
  customBranding: boolean;
  /** Spaced Repetition System (SM-2 review deck). */
  spacedRepetition: boolean;
}

export const PLANS: Record<PlanKey, Plan> = {
  free: {
    key: "free",
    name: "Free",
    tagline: "Establish your baseline.",
    priceMonthly: 0,
    priceYearly: 0,
    priceLabel: "£0",
    audience: "Anyone starting the loop",
    features: [
      "40-point baseline audit",
      "Creation Voltage score",
      "Basic pillar analysis",
      "1 AI interpretation per day",
      "Up to 3 trajectory snapshots",
      "Private Mode (local-only)",
    ],
    limits: {
      snapshots: 3,
      aiMessagesPerDay: 1,
      voiceCoach: false,
      leverageEngine: false,
      trajectory: true,
      forecasting: false,
      interventionAnalytics: false,
      digitalTwin: false,
      multipleAims: false,
      philosophies: false,
      monthlyReport: false,
      coachOs: false,
      clientSlots: 0,
      customBranding: false,
      spacedRepetition: false,
    },
  },
  pro: {
    key: "pro",
    name: "Creation Pro",
    tagline: "Run the full weekly loop.",
    priceMonthly: 19,
    priceYearly: 190,
    priceLabel: "£19",
    featured: true,
    audience: "The committed individual",
    features: [
      "Everything in Free",
      "Unlimited audits & snapshots",
      "Full analytics + radar",
      "Leverage Engine (top constraints)",
      "Trajectory history & trends",
      "AI Mentor (unlimited text)",
      "48-hour assignment tracking",
      "Weekly high-leverage protocol",
      "Spaced Repetition training deck",
      "All coaching philosophies",
    ],
    limits: {
      snapshots: -1,
      aiMessagesPerDay: -1,
      voiceCoach: false,
      leverageEngine: true,
      trajectory: true,
      forecasting: false,
      interventionAnalytics: false,
      digitalTwin: false,
      multipleAims: false,
      philosophies: true,
      monthlyReport: false,
      coachOs: false,
      clientSlots: 0,
      customBranding: false,
      spacedRepetition: true,
    },
  },
  performance: {
    key: "performance",
    name: "Creation Performance",
    tagline: "Deep memory, voice, forecasting.",
    priceMonthly: 39,
    priceYearly: 390,
    priceLabel: "£39",
    audience: "High-performance individuals",
    features: [
      "Everything in Pro",
      "Realtime voice coaching (WebRTC)",
      "Digital Twin — personalised intelligence",
      "Advanced forecasting (days to threshold)",
      "Intervention effectiveness analytics",
      "Multiple Chief Aims",
      "Daily interventions",
      "Monthly Creation Report",
    ],
    limits: {
      snapshots: -1,
      aiMessagesPerDay: -1,
      voiceCoach: true,
      leverageEngine: true,
      trajectory: true,
      forecasting: true,
      interventionAnalytics: true,
      digitalTwin: true,
      multipleAims: true,
      philosophies: true,
      monthlyReport: true,
      coachOs: false,
      clientSlots: 0,
      customBranding: false,
      spacedRepetition: true,
    },
  },
  coach: {
    key: "coach",
    name: "Creation Coach",
    tagline: "A coach operating system.",
    priceMonthly: 149,
    priceYearly: 1490,
    priceLabel: "£149",
    audience: "Professional coaches (≤25 clients)",
    features: [
      "Everything in Performance",
      "Coach OS dashboard",
      "Up to 25 client slots",
      "Per-client Creation Voltage",
      "Overdue assignment alerts",
      "Top recurring constraint across book",
      "Session summaries & client reports",
    ],
    limits: {
      snapshots: -1,
      aiMessagesPerDay: -1,
      voiceCoach: true,
      leverageEngine: true,
      trajectory: true,
      forecasting: true,
      interventionAnalytics: true,
      digitalTwin: true,
      multipleAims: true,
      philosophies: true,
      monthlyReport: true,
      coachOs: true,
      clientSlots: 25,
      customBranding: false,
      spacedRepetition: true,
    },
  },
  coach_pro: {
    key: "coach_pro",
    name: "Creation Coach Pro",
    tagline: "Scale the coaching practice.",
    priceMonthly: 399,
    priceYearly: 3990,
    priceLabel: "£399",
    audience: "Teams & multi-coach practices",
    features: [
      "Everything in Coach",
      "Up to 100 client slots",
      "Custom branding & methodologies",
      "Team coaches",
      "Automations & CRM sync",
      "API / webhooks",
      "Advanced analytics",
    ],
    limits: {
      snapshots: -1,
      aiMessagesPerDay: -1,
      voiceCoach: true,
      leverageEngine: true,
      trajectory: true,
      forecasting: true,
      interventionAnalytics: true,
      digitalTwin: true,
      multipleAims: true,
      philosophies: true,
      monthlyReport: true,
      coachOs: true,
      clientSlots: 100,
      customBranding: true,
      spacedRepetition: true,
    },
  },
};

export const PLAN_LIST: Plan[] = [
  PLANS.free,
  PLANS.pro,
  PLANS.performance,
  PLANS.coach,
  PLANS.coach_pro,
];

export const DEFAULT_PLAN: PlanKey = "free";

/** Plans ordered for upgrade comparison. */
const PLAN_RANK: Record<PlanKey, number> = {
  free: 0,
  pro: 1,
  performance: 2,
  coach: 3,
  coach_pro: 4,
};

export function planRank(key: PlanKey): number {
  return PLAN_RANK[key] ?? 0;
}

export function resolvePlan(key: string | undefined | null): PlanKey {
  if (key && key in PLANS) return key as PlanKey;
  return DEFAULT_PLAN;
}

// ── Entitlement checks ─────────────────────────────────────────────────────

export interface Entitlements {
  plan: PlanKey;
  status: SubscriptionStatus;
  limits: PlanLimits;
  /** Trial end timestamp (ms) when trialing. */
  trialEndsAt: number | null;
  /** Whether the user is within an active trial. */
  onTrial: boolean;
}

export function entitle(
  plan: PlanKey,
  status: SubscriptionStatus,
  trialEndsAt: number | null,
): Entitlements {
  const onTrial = status === "trialing" && trialEndsAt !== null && trialEndsAt > Date.now();
  // A trialing user gets the full plan limits.
  const effectiveStatus: SubscriptionStatus = onTrial ? "active" : status;
  const limits = effectiveStatus === "active" || onTrial ? PLANS[plan].limits : PLANS.free.limits;
  return { plan, status: effectiveStatus, limits, trialEndsAt, onTrial };
}

/** True when the active entitlements permit a given feature key. */
export function hasFeature(ents: Entitlements, feature: keyof PlanLimits): boolean {
  const v = ents.limits[feature];
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  return false;
}

/** Remaining snapshot slots, or null for unlimited. */
export function snapshotCapacity(ents: Entitlements): number | null {
  return ents.limits.snapshots < 0 ? null : ents.limits.snapshots;
}

// ── Billing display helpers ──────────────────────────────────────────────────

/** Per-month price for a given billing cycle (annual divides yearly by 12). */
export function displayPrice(plan: Plan, billing: BillingCycle): number {
  if (plan.priceMonthly === 0) return 0;
  return billing === "yearly" ? plan.priceYearly / 12 : plan.priceMonthly;
}

/** Savings percentage vs monthly when paying annually (0 for free). */
export function annualSavingsPct(plan: Plan): number {
  if (plan.priceMonthly === 0 || plan.priceYearly === 0) return 0;
  const monthlyAnnual = plan.priceMonthly * 12;
  return Math.round(((monthlyAnnual - plan.priceYearly) / monthlyAnnual) * 100);
}

/** Billed-now amount for a given cycle (monthly = priceMonthly, yearly = priceYearly). */
export function billedAmount(plan: Plan, billing: BillingCycle): number {
  return billing === "yearly" ? plan.priceYearly : plan.priceMonthly;
}
