// Display-only entitlements from the verified server session. Every paid server
// operation also checks the database; changing this UI cannot grant access.
import { createContext, useContext, useState, type ReactNode } from "react";
import { PLANS, entitle, type PlanKey, type SubscriptionStatus } from "./subscription";
import { useAuth } from "./auth-context";
function useStateValue() {
  const { account, isAdmin, hydrated } = useAuth();
  const [preview, setPreview] = useState<PlanKey | null>(null);
  const plan = account?.plan ?? "free";
  const status: SubscriptionStatus = plan === "free" ? "none" : "active";
  const simulatedTier = isAdmin ? preview : null;
  const entitlements = entitle(simulatedTier ?? plan, simulatedTier ? "active" : status, null);
  return {
    plan,
    status,
    entitlements,
    hydrated,
    simulatedTier,
    setSimulatedTier: (next: PlanKey | null) => {
      if (isAdmin) setPreview(next);
    },
    consumeAiMessage: () => true, // Server enforces the atomic daily allowance.
    aiMessagesRemaining: null as number | null,
  };
}
const Context = createContext<ReturnType<typeof useStateValue> | null>(null);
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={useStateValue()}>{children}</Context.Provider>;
}
export function useSubscription() {
  const state = useContext(Context);
  if (!state) throw new Error("SubscriptionProvider required");
  return state;
}
export function useActivePlan() {
  return PLANS[useSubscription().plan];
}
