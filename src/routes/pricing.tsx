import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Sparkles, Crown, ArrowRight } from "lucide-react";
import { useSubscription } from "@/lib/diagnostic/subscription-context";
import {
  PLAN_LIST,
  PLANS,
  planRank,
  displayPrice,
  billedAmount,
  annualSavingsPct,
  type PlanKey,
  type BillingCycle,
} from "@/lib/diagnostic/subscription";
import { BillingToggle } from "@/components/diagnostic/billing-toggle";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Creation Algorithm" },
      {
        name: "description",
        content:
          "Plans from free to coach. Run the full Creation loop — audit, leverage, AI mentor, trajectory — or scale it across your coaching practice.",
      },
      { property: "og:title", content: "Pricing — Creation Algorithm" },
      {
        property: "og:description",
        content:
          "AI Goal Execution System pricing. Free baseline, Pro at £19/mo, Performance at £39/mo, Coach from £149/mo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingComponent,
});

function PricingComponent() {
  const { plan: currentPlan, status, cancelPlan } = useSubscription();
  const navigate = useNavigate();
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  const choose = (key: PlanKey) => {
    if (key === "free") {
      cancelPlan();
      return;
    }
    navigate({
      to: "/checkout/$plan",
      params: { plan: key },
      search: billing === "yearly" ? { billing: "yearly" } : {},
    });
  };

  return (
    <div className="space-y-8">
      <header className="text-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold-soft">Pricing</span>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Turn your goal into a <span className="gold-text">measurable loop.</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          The 40-Point Creation Algorithm is a personal operating system: audit → diagnose →
          prioritise → act → measure → coach → repeat. Pick the tier that matches your ambition.
          14-day free trial on every paid plan. Cancel anytime.
        </p>
      </header>

      <BillingToggle billing={billing} onChange={setBilling} />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PLAN_LIST.map((p) => {
          const isCurrent = p.key === currentPlan;
          const isFree = p.priceMonthly === 0;
          const monthlyPrice = displayPrice(p, billing);
          const billed = billedAmount(p, billing);
          const savings = annualSavingsPct(p);
          return (
            <div
              key={p.key}
              className={cn(
                "relative flex flex-col rounded-xl border p-6",
                p.featured ? "border-gold/50 bg-gold/5 gold-glow" : "border-border bg-muted/20",
              )}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-background">
                  Most Popular
                </span>
              )}
              <div className="flex items-center gap-2">
                {p.key === "coach" || p.key === "coach_pro" ? (
                  <Crown className="size-4 text-gold" />
                ) : (
                  <Sparkles className="size-4 text-gold" />
                )}
                <h2 className="font-display text-lg font-semibold text-foreground">{p.name}</h2>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{p.tagline}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-gold-soft">
                {p.audience}
              </p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-lg font-bold text-gold">£</span>
                <span className="font-display text-3xl font-bold text-foreground tabular-nums">
                  {isFree ? "0" : monthlyPrice.toFixed(monthlyPrice % 1 === 0 ? 0 : 2)}
                </span>
                <span className="text-xs text-muted-foreground">/mo</span>
              </div>
              {!isFree && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {billing === "yearly" ? `Billed £${billed}/yr` : "Billed monthly"}
                  {billing === "yearly" && savings > 0 && (
                    <span className="ml-1 font-semibold text-gold">· Save {savings}%</span>
                  )}
                </p>
              )}

              <ul className="mt-5 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-foreground">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-gold" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                disabled={isCurrent}
                onClick={() => choose(p.key)}
                className={cn(
                  "mt-6 w-full rounded-md px-4 py-2.5 text-sm font-semibold transition-colors",
                  isCurrent
                    ? "cursor-default border border-border text-muted-foreground"
                    : p.featured
                      ? "bg-gold text-background hover:bg-gold-bright"
                      : "border border-border text-foreground hover:bg-accent",
                )}
              >
                {isCurrent
                  ? "Current plan"
                  : p.key === "free"
                    ? "Switch to Free"
                    : "Secure checkout"}
              </button>
            </div>
          );
        })}
      </section>

      {/* One-time intensive */}
      <section className="panel gold-glow overflow-hidden p-0">
        <div className="grid gap-0 md:grid-cols-[1.4fr_1fr]">
          <div className="p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-gold" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold-soft">
                One-time · Fully AI-led
              </span>
            </div>
            <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-foreground">
              Creation Calibration Intensive
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Don't want a recurring plan? Buy one intensive and an autonomous AI agent — the
              Calibration Director — runs the entire deep session for you: diagnoses your top
              constraint, writes your Creation Plan, and launches a 60-day accountability loop.
              Includes 60 days of Coach-tier access. No calendar booking, no founder time, starts
              the moment you enter.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                "Autonomous deep diagnostic session",
                "Written Creation Plan",
                "60-day accountability loop",
                "60 days Coach-tier access",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-foreground">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-gold" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-center border-t border-border bg-muted/20 p-6 text-center md:border-l md:border-t-0">
            <div className="flex items-baseline justify-center gap-1">
              <span className="font-display text-lg font-bold text-gold">£</span>
              <span className="font-display text-4xl font-bold text-foreground tabular-nums">
                299
              </span>
              <span className="text-xs text-muted-foreground">one-time</span>
            </div>
            <button
              onClick={() => navigate({ to: "/checkout/calibration" })}
              className="mt-4 w-full rounded-md bg-gold px-4 py-2.5 text-sm font-bold text-background transition-colors hover:bg-gold-bright"
            >
              Enter the Intensive
            </button>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Delivered by the Calibration Director AI agent.
            </p>
          </div>
        </div>
      </section>

      {/* Active plan status */}
      <section className="panel flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Active plan
          </div>
          <div className="mt-1 font-display text-lg font-semibold text-foreground">
            {PLANS[currentPlan].name}
            {status === "trialing" && (
              <span className="ml-2 text-sm font-normal text-gold">· on trial</span>
            )}
            {status === "expired" && (
              <span className="ml-2 text-sm font-normal text-destructive">· trial expired</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {currentPlan !== "free" && (
            <button
              onClick={cancelPlan}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Cancel plan
            </button>
          )}
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to dashboard <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="panel p-6">
        <h2 className="font-display text-base font-semibold">Plan comparison</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Feature</th>
                {PLAN_LIST.map((p) => (
                  <th key={p.key} className="px-3 py-2 text-center font-medium">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareRow
                label="Audit snapshots"
                row={PLAN_LIST.map((p) =>
                  p.limits.snapshots < 0 ? "∞" : String(p.limits.snapshots),
                )}
              />
              <CompareRow
                label="AI Mentor (text)"
                row={PLAN_LIST.map((p) =>
                  p.limits.aiMessagesPerDay < 0 ? "∞" : String(p.limits.aiMessagesPerDay),
                )}
              />
              <CompareRow
                label="Voice coaching"
                bools={PLAN_LIST.map((p) => p.limits.voiceCoach)}
              />
              <CompareRow
                label="Leverage Engine"
                bools={PLAN_LIST.map((p) => p.limits.leverageEngine)}
              />
              <CompareRow
                label="Trajectory history"
                bools={PLAN_LIST.map((p) => p.limits.trajectory)}
              />
              <CompareRow label="Forecasting" bools={PLAN_LIST.map((p) => p.limits.forecasting)} />
              <CompareRow
                label="Intervention analytics"
                bools={PLAN_LIST.map((p) => p.limits.interventionAnalytics)}
              />
              <CompareRow label="Digital Twin" bools={PLAN_LIST.map((p) => p.limits.digitalTwin)} />
              <CompareRow
                label="Multiple Chief Aims"
                bools={PLAN_LIST.map((p) => p.limits.multipleAims)}
              />
              <CompareRow
                label="All philosophies"
                bools={PLAN_LIST.map((p) => p.limits.philosophies)}
              />
              <CompareRow
                label="Monthly Report"
                bools={PLAN_LIST.map((p) => p.limits.monthlyReport)}
              />
              <CompareRow label="Coach OS" bools={PLAN_LIST.map((p) => p.limits.coachOs)} />
              <CompareRow
                label="Client slots"
                row={PLAN_LIST.map((p) => String(p.limits.clientSlots))}
              />
              <CompareRow
                label="Custom branding"
                bools={PLAN_LIST.map((p) => p.limits.customBranding)}
              />
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-center text-xs text-muted-foreground">
        Prices in GBP. V1 entitlements are managed locally; connect a billing provider at launch to
        activate live checkout. The 40-Point Creation Algorithm™ is a proprietary methodology.
      </p>
    </div>
  );
}

function CompareRow({ label, row, bools }: { label: string; row?: string[]; bools?: boolean[] }) {
  return (
    <tr className="border-b border-border/50">
      <td className="py-2.5 pr-4 text-foreground">{label}</td>
      {(bools ?? row ?? []).map((v, i) => (
        <td key={i} className="px-3 py-2.5 text-center tabular-nums">
          {bools ? (
            v ? (
              <Check className="mx-auto size-4 text-gold" />
            ) : (
              <span className="text-muted-foreground">—</span>
            )
          ) : (
            <span className="text-foreground">{v}</span>
          )}
        </td>
      ))}
    </tr>
  );
}
