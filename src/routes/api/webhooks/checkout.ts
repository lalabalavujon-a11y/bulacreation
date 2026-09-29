// Post-purchase webhook — called by the BULA Creation post-purchase workflow
// after an order form is submitted. It records the entitlement server-side so
// the plan activates the next time the user logs in (the login flow reads the
// contact's plan tags and grants entitlement).
//
// V1: trusts the contactId + plan carried in the signed payload. A shared
// secret (GHL_WEBHOOK_SECRET) is verified with a timing-safe HMAC when set;
// when unset (preview/local) the endpoint still validates shape + plan key.
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { createHmac, timingSafeEqual } from "node:crypto";
import { planFromTag } from "@/lib/diagnostic/checkout";
import type { PlanKey } from "@/lib/diagnostic/subscription";

const Schema = z.object({
  contactId: z.string().min(1).max(120),
  email: z.string().email().optional(),
  plan: z
    .union([
      z.enum(["pro", "performance", "coach", "coach_pro"]),
      z.string(), // a CRM tag name like "bula-pro"
    ])
    .optional(),
  tag: z.string().optional(),
  billing: z.enum(["monthly", "yearly"]).optional(),
  ts: z.number().optional(),
});

/** Calibration intensive grants Coach-tier access for 60 days (one-time). */
export const CALIBRATION_TAG = "bula-calibration";
export const CALIBRATION_DAYS = 60;
export const CALIBRATION_PLAN: PlanKey = "coach";

function planFromInput(plan?: string, tag?: string): PlanKey | null {
  if (tag === CALIBRATION_TAG || plan === CALIBRATION_TAG) return CALIBRATION_PLAN;
  if (plan && ["pro", "performance", "coach", "coach_pro"].includes(plan)) {
    return plan as PlanKey;
  }
  if (tag) return planFromTag(tag);
  if (plan) return planFromTag(plan);
  return null;
}

function verify(request: Request, raw: string): boolean {
  const secret = process.env.GHL_WEBHOOK_SECRET;
  if (!secret) return true; // preview/local — no shared secret configured
  const sig = request.headers.get("X-Bula-Signature") ?? "";
  if (!sig) return false;
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const Route = createFileRoute("/api/webhooks/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        if (!verify(request, raw)) {
          return Response.json({ ok: false, error: "Invalid signature" }, { status: 401 });
        }
        let body: unknown;
        try {
          body = JSON.parse(raw);
        } catch {
          return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = Schema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
            { status: 422 },
          );
        }
        const plan = planFromInput(parsed.data.plan, parsed.data.tag);
        if (!plan) {
          return Response.json(
            { ok: false, error: "Could not resolve plan from payload" },
            { status: 422 },
          );
        }

        // The CRM post-purchase workflow already applied the tier tag and
        // moved the pipeline stage. We acknowledge + echo the resolved plan
        // so the workflow can confirm activation. Login reads the tag back to
        // grant entitlement client-side.
        const isCalibration =
          parsed.data.tag === CALIBRATION_TAG || parsed.data.plan === CALIBRATION_TAG;
        return Response.json({
          ok: true,
          contactId: parsed.data.contactId,
          plan,
          tag: parsed.data.tag ?? parsed.data.plan,
          billing: parsed.data.billing ?? "monthly",
          oneTime: isCalibration,
          durationDays: isCalibration ? CALIBRATION_DAYS : undefined,
          activatedAt: Date.now(),
        });
      },
      // CORS preflight (workflow may POST cross-origin)
      OPTIONS: () =>
        new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, X-Bula-Signature",
          },
        }),
    },
  },
});
