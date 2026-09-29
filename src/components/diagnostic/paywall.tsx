// Paywall components — a feature gate wrapper and an upgrade modal.
//
// Usage:
//   <PaywallGate feature="voiceCoach" title="Voice Coaching">
//     <VoiceCoach ... />
//   </PaywallGate>
//
// When the active plan lacks the feature, children are replaced by a locked
// card with an "Upgrade" button that opens the UpgradeModal.

import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Lock, Sparkles, Check, X } from "lucide-react";
import { useSubscription } from "@/lib/diagnostic/subscription-context";
import {
  PLANS,
  PLAN_LIST,
  hasFeature,
  planRank,
  type PlanKey,
  type PlanLimits,
} from "@/lib/diagnostic/subscription";
import { cn } from "@/lib/utils";

type FeatureKey = keyof PlanLimits;

export function PaywallGate({
  feature,
  title,
  description,
  children,
}: {
  feature: FeatureKey;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const { entitlements } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (hasFeature(entitlements, feature)) {
    return <>{children}</>;
  }

  // Find the cheapest plan that includes this feature.
  const upgradePlan = PLAN_LIST.find((p) => {
    const v = p.limits[feature];
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v !== 0;
    return false;
  });

  return (
    <>
      <div className="panel relative overflow-hidden p-0">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent" />
        <div className="relative flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-gold/15">
            <Lock className="size-5 text-gold" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
            {description && (
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {upgradePlan && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setShowUpgrade(true)}
                className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-gold-bright"
              >
                <Sparkles className="size-4" />
                Unlock with {upgradePlan.name}
              </button>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                See all plans
              </Link>
            </div>
          )}
          {upgradePlan && (
            <p className="text-xs text-muted-foreground">
              From {upgradePlan.priceLabel}/month · 14-day free trial
            </p>
          )}
        </div>
      </div>
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} feature={feature} />
    </>
  );
}

export function UpgradeModal({
  open,
  onClose,
  feature,
}: {
  open: boolean;
  onClose: () => void;
  feature?: FeatureKey;
}) {
  const { activatePlan, plan: currentPlan } = useSubscription();

  if (!open) return null;

  // Plans that unlock the feature (or all plans if no feature specified).
  const candidates = feature
    ? PLAN_LIST.filter((p) => {
        const v = p.limits[feature];
        if (typeof v === "boolean") return v;
        if (typeof v === "number") return v !== 0;
        return false;
      })
    : PLAN_LIST.filter((p) => p.key !== "free");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Choose your plan</h2>
            <p className="text-sm text-muted-foreground">
              Start a 14-day free trial. Cancel anytime.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2">
          {candidates.map((p) => {
            const isCurrent = p.key === currentPlan;
            const isDowngrade = planRank(p.key) < planRank(currentPlan);
            return (
              <div
                key={p.key}
                className={cn(
                  "rounded-lg border p-5",
                  p.featured ? "border-gold/50 bg-gold/5" : "border-border bg-muted/20",
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-semibold text-foreground">{p.name}</h3>
                  {p.featured && (
                    <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold">
                      Popular
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{p.tagline}</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-2xl font-bold text-foreground">
                    {p.priceLabel}
                  </span>
                  <span className="text-xs text-muted-foreground">/month</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {p.features.slice(0, 6).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-foreground">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  disabled={isCurrent}
                  onClick={() => {
                    activatePlan(p.key, true);
                    onClose();
                  }}
                  className={cn(
                    "mt-5 w-full rounded-md px-4 py-2.5 text-sm font-semibold transition-colors",
                    isCurrent
                      ? "cursor-default border border-border text-muted-foreground"
                      : isDowngrade
                        ? "border border-border text-foreground hover:bg-accent"
                        : "bg-gold text-background hover:bg-gold-bright",
                  )}
                >
                  {isCurrent
                    ? "Current plan"
                    : isDowngrade
                      ? "Switch to this plan"
                      : `Start free trial`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Small inline badge showing the active plan, for the sidebar / header. */
export function PlanBadge() {
  const { plan, status, onTrial } = useSubscription();
  const p = PLANS[plan];
  if (plan === "free" && status === "none") {
    return (
      <Link
        to="/pricing"
        className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[11px] font-medium text-gold transition-colors hover:bg-gold/20"
      >
        <Sparkles className="size-3" />
        Upgrade
      </Link>
    );
  }
  const isSuperAdmin = plan === "coach_pro" && status === "active" && !onTrial;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-medium text-gold">
      {isSuperAdmin && <Sparkles className="size-3" />}
      {p.name}
      {onTrial && <span className="text-gold-soft">· trial</span>}
    </span>
  );
}
