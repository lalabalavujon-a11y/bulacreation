// Browser-safe checkout config — plan-tier order-form URLs + tags.
//
// Order-form URLs are provisioned in the BULA Creation sub-account
// (Payments → Integrations → Stripe connected, then one order form per paid
// tier). Until live URLs exist they fall back to a placeholder that explains
// checkout is not yet connected, so the CTA never silently 404s.
//
// To go live: set the env vars in your deploy (publishable, no secret):
//   VITE_CHECKOUT_PRO_URL, VITE_CHECKOUT_PERFORMANCE_URL,
//   VITE_CHECKOUT_COACH_URL,   VITE_CHECKOUT_COACH_PRO_URL
import type { PlanKey } from "./subscription";

/** CRM tag applied per paid tier on purchase (post-purchase workflow). */
export const PLAN_TAGS: Record<Exclude<PlanKey, "free">, string> = {
  pro: "bula-pro",
  performance: "bula-performance",
  coach: "bula-coach",
  coach_pro: "bula-coach-pro",
};

/** Super-admin / owner tags → full coach-pro entitlement (all features, no
 *  checkout, no trial). Applied manually to the owner's CRM contact. */
export const SUPER_ADMIN_TAGS = new Set(["bula-super-admin", "bula-owner", "super-admin", "owner"]);

/** Known Super Admin / Owner emails that always receive automatic full Coach Pro
 *  entitlement regardless of CRM connectivity or offline status. */
export const SUPER_ADMIN_EMAILS = new Set(["lalabalavu.jon@gmail.com"]);

export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.has(email.trim().toLowerCase());
}

export function isSuperAdminTag(tag: string): boolean {
  return SUPER_ADMIN_TAGS.has(tag);
}

/** Reverse lookup: tag → plan. Super-admin / owner tags resolve to coach_pro
 *  (the top of the plan ladder), granting full access without a checkout. */
export function planFromTag(tag: string): PlanKey | null {
  if (isSuperAdminTag(tag)) return "coach_pro";
  for (const [key, t] of Object.entries(PLAN_TAGS)) {
    if (t === tag) return key as PlanKey;
  }
  return null;
}

const env = import.meta.env as Record<string, string | undefined>;

export const CHECKOUT_URLS: Record<Exclude<PlanKey, "free">, string> = {
  pro: env.VITE_CHECKOUT_PRO_URL ?? "",
  performance: env.VITE_CHECKOUT_PERFORMANCE_URL ?? "",
  coach: env.VITE_CHECKOUT_COACH_URL ?? "",
  coach_pro: env.VITE_CHECKOUT_COACH_PRO_URL ?? "",
};

/** Annual variant URLs (optional — reuses monthly form if absent). */
export const CHECKOUT_URLS_ANNUAL: Record<Exclude<PlanKey, "free">, string> = {
  pro: env.VITE_CHECKOUT_PRO_ANNUAL_URL ?? "",
  performance: env.VITE_CHECKOUT_PERFORMANCE_ANNUAL_URL ?? "",
  coach: env.VITE_CHECKOUT_COACH_ANNUAL_URL ?? "",
  coach_pro: env.VITE_CHECKOUT_COACH_PRO_ANNUAL_URL ?? "",
};

export interface CheckoutTarget {
  url: string | null;
  /** True when a live order-form URL is configured. */
  live: boolean;
  plan: Exclude<PlanKey, "free">;
  billing: "monthly" | "yearly";
}

export function resolveCheckout(
  plan: Exclude<PlanKey, "free">,
  billing: "monthly" | "yearly" = "monthly",
): CheckoutTarget {
  const monthly = CHECKOUT_URLS[plan];
  const url = billing === "yearly" ? CHECKOUT_URLS_ANNUAL[plan] || monthly : monthly;
  return { url: url || null, live: Boolean(url), plan, billing };
}

// ── One-time products (no billing cycle) ──────────────────────────────────────
// The Creation Calibration Intensive is a one-time, fully AI-led deep session.
// To go live: set VITE_CHECKOUT_CALIBRATION_URL to the GHL order-form URL.

export interface OneTimeProduct {
  key: string;
  name: string;
  tagline: string;
  price: number;
  /** CRM tag applied on purchase. */
  tag: string;
  features: string[];
  url: string;
}

export const ONE_TIME_PRODUCTS: Record<string, OneTimeProduct> = {
  calibration: {
    key: "calibration",
    name: "Creation Calibration Intensive",
    tagline: "One-time. Fully AI-led. Zero founder time.",
    price: 299,
    tag: "bula-calibration",
    features: [
      "Autonomous deep diagnostic session with the Calibration Director",
      "Written Creation Plan (constraint → 72h intervention → weekly actions)",
      "60-day accountability loop inside the app",
      "60 days of Coach-tier access included",
      "No calendar booking — starts the moment you enter",
    ],
    url: env.VITE_CHECKOUT_CALIBRATION_URL ?? "",
  },
};

export type OneTimeKey = keyof typeof ONE_TIME_PRODUCTS;

export interface OneTimeCheckoutTarget {
  key: OneTimeKey;
  name: string;
  price: number;
  tagline: string;
  features: string[];
  url: string | null;
  live: boolean;
}

export function resolveOneTimeCheckout(key: string): OneTimeCheckoutTarget | null {
  const p = ONE_TIME_PRODUCTS[key];
  if (!p) return null;
  return {
    key: key as OneTimeKey,
    name: p.name,
    price: p.price,
    tagline: p.tagline,
    features: p.features,
    url: p.url || null,
    live: Boolean(p.url),
  };
}
