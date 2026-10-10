import type { PlanKey } from "../diagnostic/subscription";
export interface Account {
  id: string;
  email: string;
  name: string;
  role: "member" | "admin";
  plan: PlanKey;
  planExpiresAt: number | null;
}
