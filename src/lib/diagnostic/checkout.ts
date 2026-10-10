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

/** Plan tags describe billing tiers only; they never confer an admin role. */
export function planFromTag(tag: string): PlanKey | null {
  for (const [key, value] of Object.entries(PLAN_TAGS)) if (value === tag) return key as PlanKey;
  return null;
}

const env = import.meta.env as Record<string, string | undefined>;

export const CHECKOUT_URLS: Record<Exclude<PlanKey, "free">, string> = {
  pro: env['VITE_CHECKOUT_PRO_URL'] ?? "",
  performance: env['VITE_CHECKOUT_PERFORMANCE_URL'] ?? "",
  coach: env['VITE_CHECKOUT_COACH_URL'] ?? "",
  coach_pro: env['VITE_CHECKOUT_COACH_PRO_URL'] ?? "",
};

/** Annual variant URLs. Missing annual forms must not charge monthly instead. */
export const CHECKOUT_URLS_ANNUAL: Record<Exclude<PlanKey, "free">, string> = {
  pro: env['VITE_CHECKOUT_PRO_ANNUAL_URL'] ?? "",
  performance: env['VITE_CHECKOUT_PERFORMANCE_ANNUAL_URL'] ?? "",
  coach: env['VITE_CHECKOUT_COACH_ANNUAL_URL'] ?? "",
  coach_pro: env['VITE_CHECKOUT_COACH_PRO_ANNUAL_URL'] ?? "",
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
  const url = billing === "yearly" ? CHECKOUT_URLS_ANNUAL[plan] : monthly;
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
    url: env['VITE_CHECKOUT_CALIBRATION_URL'] ?? "",
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
