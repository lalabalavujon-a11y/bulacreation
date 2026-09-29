// Stripe / CRM product + price reference for BULA Creation.
//
// Products and prices were provisioned in the BULA Creation sub-account
// (Stripe connected via Payments → Integrations). This module is a reference
// record of the live IDs so checkout, reporting, and future direct-Stripe
// integrations can map a plan + billing cycle to a price without re-querying.
//
// IMPORTANT: the app's live checkout still flows through CRM order forms
// (see checkout.ts → CHECKOUT_URLS / ONE_TIME_PRODUCTS). Set those env-var
// URLs to point at the published order forms; the IDs below are for reference,
// webhook reconciliation, and any future price-level Stripe checkout links.

export interface ProductRef {
  /** Plan key (or "calibration" for the one-time intensive). */
  key: string;
  /** Human product name in Stripe. */
  name: string;
  /** CRM product id. */
  productId: string;
  /** Monthly recurring price id (null for one-time). */
  monthlyPriceId: string | null;
  /** Annual recurring price id (null for one-time). */
  annualPriceId: string | null;
  /** One-time price id (null for recurring). */
  oneTimePriceId: string | null;
  /** GBP amount for the recurring monthly / one-time charge. */
  amountMonthly: number | null;
  /** GBP amount for the annual charge. */
  amountAnnual: number | null;
}

export const PRODUCTS: Record<string, ProductRef> = {
  pro: {
    key: "pro",
    name: "Creation Pro",
    productId: "bula-creation-pro",
    monthlyPriceId: "6ab96e752942fe57390705f2",
    annualPriceId: "6ab96e7584b957aca1544fba",
    oneTimePriceId: null,
    amountMonthly: 19,
    amountAnnual: 190,
  },
  performance: {
    key: "performance",
    name: "Creation Performance",
    productId: "bula-creation-performance",
    monthlyPriceId: "6ab96e7549b162cedc8218b3",
    annualPriceId: "6ab96e7584b957aca1544fc6",
    oneTimePriceId: null,
    amountMonthly: 39,
    amountAnnual: 390,
  },
  coach: {
    key: "coach",
    name: "Creation Coach",
    productId: "bula-creation-coach",
    monthlyPriceId: "6ab96e75d885033ef3eeb023",
    annualPriceId: "6ab96e75d885033ef3eeb036",
    oneTimePriceId: null,
    amountMonthly: 149,
    amountAnnual: 1490,
  },
  coach_pro: {
    key: "coach_pro",
    name: "Creation Coach Pro",
    productId: "bula-creation-coach-pro",
    monthlyPriceId: "6ab96e75d885033ef3eeb03f",
    annualPriceId: "6ab96e75d885033ef3eeb028",
    oneTimePriceId: null,
    amountMonthly: 399,
    amountAnnual: 3990,
  },
  calibration: {
    key: "calibration",
    name: "Creation Calibration Intensive",
    productId: "bula-creation-calibration",
    monthlyPriceId: null,
    annualPriceId: null,
    oneTimePriceId: "6ab96e75e3234eb832c1a74b",
    amountMonthly: 299,
    amountAnnual: null,
  },
};

/** Look up a product reference by plan key. */
export function getProduct(key: string): ProductRef | undefined {
  return PRODUCTS[key];
}

/** Resolve the price id for a plan + billing cycle. */
export function resolvePriceId(key: string, billing: "monthly" | "yearly"): string | null {
  const p = PRODUCTS[key];
  if (!p) return null;
  if (p.oneTimePriceId) return p.oneTimePriceId;
  return billing === "yearly" ? p.annualPriceId : p.monthlyPriceId;
}
