// Checkout redirect route: /checkout/$plan[?billing=yearly]
//
// - Free plan → send to /login (no order form needed).
// - Paid plan with a live order-form URL → redirect to the external GHL
//   order form (Stripe-backed). The order form handles payment, tagging,
//   pipeline-stage move, and the post-purchase magic-link workflow.
// - Paid plan with no configured URL → show a "checkout not yet connected"
//   panel so the CTA degrades gracefully instead of 404ing.
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Hexagon, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { resolveCheckout, resolveOneTimeCheckout } from "@/lib/diagnostic/checkout";
import { PLANS, type PlanKey } from "@/lib/diagnostic/subscription";

export const Route = createFileRoute("/checkout/$plan")({
  head: () => ({
    meta: [
      { title: "Checkout — Bula Creation | AI Goal Execution System" },
      {
        name: "description",
        content: "Secure checkout for your Bula Creation plan.",
      },
      { property: "og:title", content: "Checkout — Bula Creation" },
      { property: "og:description", content: "Secure checkout for your Bula Creation plan." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CheckoutComponent,
});

function CheckoutComponent() {
  const { plan: rawPlan } = Route.useParams() as { plan: string };
  const billing =
    (Route.useSearch() as { billing?: string }).billing === "yearly" ? "yearly" : "monthly";
  const navigate = useNavigate();

  const isOneTime = rawPlan === "calibration";
  const planKey = !isOneTime && (rawPlan as PlanKey) in PLANS ? (rawPlan as PlanKey) : null;

  useEffect(() => {
    if (isOneTime) {
      const ot = resolveOneTimeCheckout("calibration");
      if (ot?.live && ot.url) window.location.replace(ot.url);
      return;
    }
    if (!planKey || planKey === "free") {
      navigate({ to: "/login" });
      return;
    }
    const target = resolveCheckout(planKey as Exclude<PlanKey, "free">, billing);
    if (target.live && target.url) {
      // External order form — replace so the back button doesn't trap users.
      window.location.replace(target.url);
    }
  }, [planKey, billing, navigate, isOneTime]);

  if (isOneTime) {
    return <CalibrationCheckout />;
  }
  if (!planKey) {
    return <NotFound />;
  }
  if (planKey === "free") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-5 animate-spin text-gold" />
      </div>
    );
  }

  const plan = PLANS[planKey];
  const target = resolveCheckout(planKey as Exclude<PlanKey, "free">, billing);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-2xl">
        <div className="mb-5 flex items-center gap-2.5">
          <img
            src="https://vibe.filesafe.space/1790355857187699269/attachments/afa0cbd8-a353-48b8-8ed0-ecc90a8d6967.png"
            alt="Bula Creation Golden Hexagon Logo"
            className="size-7 rounded-sm object-contain"
          />
          <div className="font-display text-base font-bold tracking-tight">BULA CREATION</div>
        </div>

        {target.live ? (
          <div className="text-center">
            <Loader2 className="mx-auto size-6 animate-spin text-gold" />
            <h1 className="mt-4 font-display text-lg font-semibold">Redirecting to checkout…</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Taking you to secure checkout for <span className="text-foreground">{plan.name}</span>{" "}
              (
              {billing === "yearly"
                ? `${plan.priceLabel} billed annually`
                : `${plan.priceLabel}/mo`}
              ).
            </p>
            {target.url && (
              <a
                href={target.url}
                className="mt-4 inline-flex items-center gap-1.5 text-xs text-gold hover:underline"
              >
                Click here if you are not redirected <ArrowRight className="size-3.5" />
              </a>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-gold" />
              <div>
                <h1 className="font-display text-lg font-semibold">Checkout is connecting</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  The <span className="text-foreground">{plan.name}</span> order form is being
                  provisioned. Once Stripe is connected to the BULA Creation sub-account, this
                  button will take you straight to secure checkout.
                </p>
              </div>
            </div>
            <div className="mt-5 rounded-md border border-border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
              <div className="font-medium text-foreground">{plan.name}</div>
              <div className="mt-1">
                {plan.priceLabel}/mo · or £{plan.priceYearly}/year
              </div>
              <ul className="mt-3 space-y-1.5">
                {plan.features.slice(0, 4).map((f) => (
                  <li key={f} className="text-foreground/80">
                    • {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Start free instead <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Back to plans
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CalibrationCheckout() {
  const ot = resolveOneTimeCheckout("calibration");
  if (!ot) return <NotFound />;
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-gold/40 bg-card p-8 shadow-2xl gold-glow">
        <div className="mb-5 flex items-center gap-2.5">
          <img
            src="https://vibe.filesafe.space/1790355857187699269/attachments/afa0cbd8-a353-48b8-8ed0-ecc90a8d6967.png"
            alt="Bula Creation Golden Hexagon Logo"
            className="size-7 rounded-sm object-contain"
          />
          <div className="font-display text-base font-bold tracking-tight">BULA CREATION</div>
        </div>

        {ot.live ? (
          <div className="text-center">
            <Loader2 className="mx-auto size-6 animate-spin text-gold" />
            <h1 className="mt-4 font-display text-lg font-semibold">Redirecting to checkout…</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Taking you to secure checkout for the{" "}
              <span className="text-foreground">{ot.name}</span> (£{ot.price} one-time).
            </p>
            {ot.url && (
              <a
                href={ot.url}
                className="mt-4 inline-flex items-center gap-1.5 text-xs text-gold hover:underline"
              >
                Click here if you are not redirected <ArrowRight className="size-3.5" />
              </a>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-gold" />
              <div>
                <h1 className="font-display text-lg font-semibold">{ot.name}</h1>
                <p className="mt-1 text-xs uppercase tracking-wider text-gold-soft">{ot.tagline}</p>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-lg font-bold text-gold">£</span>
              <span className="font-display text-3xl font-bold text-foreground tabular-nums">
                {ot.price}
              </span>
              <span className="text-xs text-muted-foreground">one-time</span>
            </div>
            <ul className="mt-4 space-y-2">
              {ot.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-foreground">
                  <span className="mt-0.5 text-gold">✦</span>
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              The order form is being provisioned. Once Stripe is connected to the BULA Creation
              sub-account, this button takes you straight to secure checkout — no calendar booking,
              the intensive starts the moment you enter.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Start free instead <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Back to plans
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-bold gold-text">Plan not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          That plan doesn't exist. Pick from the pricing page.
        </p>
        <Link
          to="/pricing"
          className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          See plans <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
