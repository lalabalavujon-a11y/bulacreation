import { createHash, randomBytes } from "node:crypto";
import {
  getCookie,
  setCookie,
  deleteCookie,
  getRequest,
  setResponseHeader,
} from "@tanstack/react-start/server";
import { db, authRequest } from "./database.server";
import { PLANS, type PlanKey, type PlanLimits } from "../diagnostic/subscription";
import type { Account } from "./types";

const COOKIE = "bula-session-v2";
const AGE = 7 * 24 * 60 * 60;
export const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function assertSameOrigin() {
  const request = getRequest();
  if (request.headers.get("origin") !== new URL(request.url).origin)
    throw new Error("Request origin is not allowed.");
}
export function privateResponse() {
  setResponseHeader("Cache-Control", "private, no-store");
}

export async function requestCode(email: string) {
  assertSameOrigin();
  const response = await authRequest("otp", { email: normalizeEmail(email), create_user: true });
  if (!response.ok) throw new Error("Could not send a code. Wait a minute and try again.");
  return { ok: true as const };
}

export async function verifyCode(email: string, code: string, name: string) {
  assertSameOrigin();
  const response = await authRequest("verify", {
    email: normalizeEmail(email),
    token: code,
    type: "email",
  });
  if (!response.ok)
    throw new Error("This code is invalid or expired. Request a new code and try again.");
  const result = (await response.json()) as {
    user?: { id: string; email?: string; email_confirmed_at?: string };
  };
  const user = result.user;
  if (!user?.email_confirmed_at || normalizeEmail(user.email ?? "") !== normalizeEmail(email))
    throw new Error("Email verification failed.");
  // Never derive role or paid access from user metadata, email, CRM tags or the browser.
  await db("bula_accounts?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates" },
    body: JSON.stringify({ id: user.id, email: normalizeEmail(user.email!), name }),
  });
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + AGE * 1000).toISOString();
  await db("bula_sessions", {
    method: "POST",
    body: JSON.stringify({ token_hash: tokenHash(token), user_id: user.id, expires_at: expires }),
  });
  // Rotation revokes the previous browser session, if present.
  const old = getCookie(COOKIE);
  if (old && /^[A-Za-z0-9_-]{43}$/.test(old))
    await db(`bula_sessions?token_hash=eq.${tokenHash(old)}`, { method: "DELETE" });
  setCookie(COOKIE, token, {
    httpOnly: true,
    secure: new URL(getRequest().url).protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: AGE,
  });
  privateResponse();
  return { ok: true as const };
}

export async function currentAccount(): Promise<Account | null> {
  privateResponse();
  const token = getCookie(COOKIE);
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const sessions = await db<{ user_id: string; expires_at: string }[]>(
    `bula_sessions?token_hash=eq.${tokenHash(token)}&select=user_id,expires_at&limit=1`,
  );
  const session = sessions[0];
  if (!session || !(Date.parse(session.expires_at) > Date.now())) return null;
  const rows = await db<{ id: string; email: string; name: string; role: "member" | "admin" }[]>(
    `bula_accounts?id=eq.${encodeURIComponent(session.user_id)}&select=id,email,name,role&limit=1`,
  );
  const account = rows[0];
  if (!account) return null;
  const billing = await db<{ plan: PlanKey; status: string; expires_at: string }[]>(
    `bula_entitlements?email=eq.${encodeURIComponent(account.email)}&select=plan,status,expires_at&limit=1`,
  );
  const paid = billing[0];
  const active =
    paid &&
    (paid.status === "active" || paid.status === "trialing") &&
    Date.parse(paid.expires_at) > Date.now() &&
    Object.hasOwn(PLANS, paid.plan);
  return {
    ...account,
    plan: account.role === "admin" ? "coach_pro" : active ? paid.plan : "free",
    planExpiresAt: active ? Date.parse(paid.expires_at) : null,
  };
}

export async function requireAccount() {
  const account = await currentAccount();
  if (!account) throw new Error("Please sign in with your email code to continue.");
  return account;
}
export async function requireAdmin() {
  const account = await requireAccount();
  if (account.role !== "admin") throw new Error("Administrator access required.");
  return account;
}
export async function requireFeature(feature: keyof PlanLimits) {
  const account = await requireAccount();
  if (PLANS[account.plan].limits[feature] !== true)
    throw new Error("Your current plan does not include this feature.");
  return account;
}
export async function consumeAi() {
  const account = await requireAccount();
  // Even unlimited plans have a generous abuse ceiling on server-side requests.
  const cap = PLANS[account.plan].limits.aiMessagesPerDay;
  const allowed = await db<boolean>("rpc/bula_consume_usage", {
    method: "POST",
    body: JSON.stringify({ p_user: account.id, p_limit: cap < 0 ? 500 : cap }),
  });
  if (!allowed)
    throw new Error("Your daily AI allowance has been used. Please try again tomorrow.");
  return account;
}
export async function endSession() {
  assertSameOrigin();
  const token = getCookie(COOKIE);
  if (token && /^[A-Za-z0-9_-]{43}$/.test(token))
    await db(`bula_sessions?token_hash=eq.${tokenHash(token)}`, { method: "DELETE" });
  deleteCookie(COOKIE, { path: "/" });
  privateResponse();
  return { ok: true as const };
}
