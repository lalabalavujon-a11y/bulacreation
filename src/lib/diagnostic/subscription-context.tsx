// Subscription provider — persists the active plan + trial to localStorage and
// exposes `useSubscription` for gating premium features.
//
// V1: local entitlement layer. `activatePlan` simulates a successful checkout
// (and optionally starts a 14-day trial). A real billing provider can later
// call the same persistence shape.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import {
  PLANS,
  DEFAULT_PLAN,
  resolvePlan,
  entitle,
  type PlanKey,
  type SubscriptionStatus,
  type Entitlements,
} from "./subscription";

const LS_KEY = "creation-subscription-v1";
const TRIAL_DAYS = 14;

interface PersistShape {
  plan: PlanKey;
  status: SubscriptionStatus;
  trialEndsAt: number | null;
  /** Daily AI message counter for free-tier limiting. */
  aiMessageDate: string | null;
  aiMessageCount: number;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function load(): PersistShape {
  const base: PersistShape = {
    plan: DEFAULT_PLAN,
    status: "none",
    trialEndsAt: null,
    aiMessageDate: null,
    aiMessageCount: 0,
  };
  if (typeof window === "undefined") return base;
  try {
    // Check if the currently authenticated user is a known Super Admin.
    const authRaw = window.localStorage.getItem("40pt_auth_user");
    if (authRaw) {
      try {
        const auth = JSON.parse(authRaw) as { email?: string };
        if (auth.email && auth.email.trim().toLowerCase() === "lalabalavu.jon@gmail.com") {
          return {
            plan: "coach_pro",
            status: "active",
            trialEndsAt: null,
            aiMessageDate: null,
            aiMessageCount: 0,
          };
        }
      } catch {
        /* ignore */
      }
    }
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<PersistShape>;
    return {
      plan: resolvePlan(parsed.plan),
      status: parsed.status ?? "none",
      trialEndsAt: parsed.trialEndsAt ?? null,
      aiMessageDate: parsed.aiMessageDate ?? null,
      aiMessageCount: parsed.aiMessageCount ?? 0,
    };
  } catch {
    return base;
  }
}

interface SubscriptionState {
  plan: PlanKey;
  status: SubscriptionStatus;
  entitlements: Entitlements;
  /** Activate a plan (simulated checkout). Starts a trial when `trial` is true. */
  activatePlan: (plan: PlanKey, trial?: boolean) => void;
  /** Cancel — drops back to free at period end (immediate in V1). */
  cancelPlan: () => void;
  /** Increment the daily AI message counter; returns false if over limit. */
  consumeAiMessage: () => boolean;
  /** Remaining AI messages today (null = unlimited). */
  aiMessagesRemaining: number | null;
  /** Owner-only: simulate any tier without logging out. null = no override. */
  simulatedTier: PlanKey | null;
  setSimulatedTier: (plan: PlanKey | null) => void;
  hydrated: boolean;
}

const SIM_KEY = "creation-sim-tier-v1";

function loadSim(): PlanKey | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SIM_KEY);
    return raw ? (resolvePlan(raw as PlanKey) as PlanKey) : null;
  } catch {
    return null;
  }
}

const SubscriptionContext = createContext<SubscriptionState | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanKey>(DEFAULT_PLAN);
  const [status, setStatus] = useState<SubscriptionStatus>("none");
  const [trialEndsAt, setTrialEndsAt] = useState<number | null>(null);
  const [aiMessageDate, setAiMessageDate] = useState<string | null>(null);
  const [aiMessageCount, setAiMessageCount] = useState(0);
  const [simulatedTier, setSimulatedTierState] = useState<PlanKey | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const data = load();
    setPlan(data.plan);
    setStatus(data.status);
    setTrialEndsAt(data.trialEndsAt);
    setAiMessageDate(data.aiMessageDate);
    setAiMessageCount(data.aiMessageCount);
    setSimulatedTierState(loadSim());
    setHydrated(true);
  }, []);

  // Listen for storage / login events so an existing session re-evaluates Super Admin instantly
  useEffect(() => {
    if (!hydrated) return;
    if (typeof window === "undefined") return;
    const authRaw = window.localStorage.getItem("40pt_auth_user");
    if (authRaw) {
      try {
        const auth = JSON.parse(authRaw) as { email?: string };
        if (auth.email && auth.email.trim().toLowerCase() === "lalabalavu.jon@gmail.com") {
          if (plan !== "coach_pro" || status !== "active") {
            setPlan("coach_pro");
            setStatus("active");
            setTrialEndsAt(null);
          }
        }
      } catch {
        /* ignore */
      }
    }
  }, [hydrated, plan, status]);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    const payload: PersistShape = {
      plan,
      status,
      trialEndsAt,
      aiMessageDate,
      aiMessageCount,
    };
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
  }, [plan, status, trialEndsAt, aiMessageDate, aiMessageCount, hydrated]);

  // Expire trials automatically.
  useEffect(() => {
    if (!hydrated) return;
    if (status === "trialing" && trialEndsAt !== null && trialEndsAt <= Date.now()) {
      setStatus("expired");
    }
  }, [status, trialEndsAt, hydrated]);

  const activatePlan = useCallback((nextPlan: PlanKey, trial = false) => {
    if (nextPlan === "free") {
      setPlan("free");
      setStatus("none");
      setTrialEndsAt(null);
      return;
    }
    setPlan(nextPlan);
    if (trial) {
      setStatus("trialing");
      setTrialEndsAt(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
    } else {
      setStatus("active");
      setTrialEndsAt(null);
    }
  }, []);

  const cancelPlan = useCallback(() => {
    setPlan("free");
    setStatus("none");
    setTrialEndsAt(null);
  }, []);

  const consumeAiMessage = useCallback(() => {
    const effectivePlan = simulatedTier ?? plan;
    const ents = entitle(effectivePlan, status, trialEndsAt);
    const cap = ents.limits.aiMessagesPerDay;
    if (cap < 0) return true; // unlimited
    const today = todayKey();
    const count = aiMessageDate === today ? aiMessageCount : 0;
    if (count >= cap) return false;
    setAiMessageDate(today);
    setAiMessageCount(count + 1);
    return true;
  }, [plan, simulatedTier, status, trialEndsAt, aiMessageDate, aiMessageCount]);

  const entitlements = useMemo(
    () => entitle(simulatedTier ?? plan, simulatedTier ? "active" : status, trialEndsAt),
    [plan, simulatedTier, status, trialEndsAt],
  );

  const setSimulatedTier = useCallback((next: PlanKey | null) => {
    setSimulatedTierState(next);
    try {
      if (next) window.localStorage.setItem(SIM_KEY, next);
      else window.localStorage.removeItem(SIM_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const aiMessagesRemaining = useMemo(() => {
    const cap = entitlements.limits.aiMessagesPerDay;
    if (cap < 0) return null;
    const today = todayKey();
    const used = aiMessageDate === today ? aiMessageCount : 0;
    return Math.max(0, cap - used);
  }, [entitlements, aiMessageDate, aiMessageCount]);

  const value: SubscriptionState = {
    plan,
    status,
    entitlements,
    activatePlan,
    cancelPlan,
    consumeAiMessage,
    aiMessagesRemaining,
    simulatedTier,
    setSimulatedTier,
    hydrated,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription(): SubscriptionState {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
}

/** Convenience: the plan display object for the active plan. */
export function useActivePlan() {
  const { plan } = useSubscription();
  return PLANS[plan];
}
