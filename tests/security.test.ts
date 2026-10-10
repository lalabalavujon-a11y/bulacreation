import { beforeEach, describe, expect, it, vi } from "vitest";
import { createHmac } from "node:crypto";
const state = vi.hoisted(() => ({
  cookie: undefined as string | undefined,
  origin: "https://bulacreation.app",
  cookies: vi.fn(),
  clear: vi.fn(),
  db: vi.fn(),
  auth: vi.fn(),
}));
vi.mock("@tanstack/react-start/server", () => ({
  getCookie: () => state.cookie,
  setCookie: state.cookies,
  deleteCookie: state.clear,
  getRequest: () =>
    new Request("https://bulacreation.app/login", { headers: { origin: state.origin } }),
  setResponseHeader: vi.fn(),
}));
vi.mock("../src/lib/security/database.server", () => ({ db: state.db, authRequest: state.auth }));
import {
  currentAccount,
  requireAdmin,
  requireFeature,
  verifyCode,
  endSession,
  tokenHash,
  requestCode,
  consumeAi,
} from "../src/lib/security/session.server";
import { readProgress, writeProgress } from "../src/lib/security/progress.server";
import { checkoutWebhook } from "../src/lib/security/billing.server";
const account = { id: "test-user", name: "Carlos", email: "test@example.com", role: "member" };
const progress = {
  scores: { 1: 0.33 as const },
  evidenceNotes: { 1: "Evidence" },
  chiefAim: {
    text: "Test goal",
    specificity: "Specific",
    believability: 6,
    disgust: "",
    handwriting: "",
  },
  snapshots: [],
  philosophy: "performance" as const,
  onboarded: true,
  creationPlan: null,
};
function session(paid: unknown[] = [], role = "member") {
  state.cookie = "a".repeat(43);
  state.db.mockImplementation(async (path: string) => {
    if (path.startsWith("bula_sessions?"))
      return [{ user_id: account.id, expires_at: new Date(Date.now() + 100000).toISOString() }];
    if (path.startsWith("bula_accounts?")) return [{ ...account, role }];
    if (path.startsWith("bula_entitlements?")) return paid;
    if (path === "rpc/bula_consume_usage") return true;
    return [];
  });
}
beforeEach(() => {
  vi.clearAllMocks();
  state.db.mockReset();
  state.auth.mockReset();
  state.cookie = undefined;
  state.origin = "https://bulacreation.app";
  delete process.env.GHL_WEBHOOK_SECRET;
});
describe("verified identity and server permissions", () => {
  it("rejects missing and malformed sessions without database access", async () => {
    expect(await currentAccount()).toBeNull();
    state.cookie = '{"email":"lalabalavu.jon@gmail.com"}';
    expect(await currentAccount()).toBeNull();
    expect(state.db).not.toHaveBeenCalled();
  });
  it("rejects expired and revoked sessions", async () => {
    state.cookie = "a".repeat(43);
    state.db
      .mockResolvedValueOnce([{ user_id: account.id, expires_at: "2000-01-01" }])
      .mockResolvedValueOnce([]);
    expect(await currentAccount()).toBeNull();
    expect(await currentAccount()).toBeNull();
  });
  it("member cannot call admin or voice features", async () => {
    session();
    await expect(requireAdmin()).rejects.toThrow("Administrator");
    await expect(requireFeature("voiceCoach")).rejects.toThrow("current plan");
  });
  it("paid coach-pro is not an administrator", async () => {
    session([
      {
        plan: "coach_pro",
        status: "active",
        expires_at: new Date(Date.now() + 100000).toISOString(),
      },
    ]);
    expect((await currentAccount())?.plan).toBe("coach_pro");
    await expect(requireAdmin()).rejects.toThrow();
  });
  it("allows persisted admin roles and rejects expired/cancelled paid plans", async () => {
    session([], "admin");
    expect((await requireAdmin()).plan).toBe("coach_pro");
    session([{ plan: "coach", status: "active", expires_at: "2000-01-01" }]);
    expect((await currentAccount())?.plan).toBe("free");
    session([{ plan: "coach", status: "cancelled", expires_at: "2099-01-01" }]);
    expect((await currentAccount())?.plan).toBe("free");
  });
  it("sending a code never creates an authenticated session", async () => {
    state.auth.mockResolvedValue(new Response("{}"));
    await requestCode(" TEST@EXAMPLE.COM ");
    expect(state.auth).toHaveBeenCalledWith("otp", {
      email: "test@example.com",
      create_user: true,
    });
    expect(state.cookies).not.toHaveBeenCalled();
  });
  it("invalid code cannot create a session", async () => {
    state.auth.mockResolvedValue(new Response("{}", { status: 403 }));
    await expect(verifyCode(account.email, "123456", "Carlos")).rejects.toThrow(
      "invalid or expired",
    );
    expect(state.db).not.toHaveBeenCalled();
    expect(state.cookies).not.toHaveBeenCalled();
  });
  it("only verified matching emails create a hashed session with secure cookies", async () => {
    state.auth.mockResolvedValue(
      Response.json({
        user: { id: account.id, email: account.email, email_confirmed_at: "2026-01-01" },
      }),
    );
    state.db.mockResolvedValue([]);
    await verifyCode(account.email, "123456", "Carlos");
    const [, token, options] = state.cookies.mock.calls[0]!;
    expect(options).toMatchObject({ httpOnly: true, secure: true, sameSite: "lax", path: "/" });
    const write = state.db.mock.calls.find((c) => c[0] === "bula_sessions")!;
    expect(JSON.parse(write[1].body).token_hash).toBe(tokenHash(token));
    expect(write[1].body).not.toContain(token);
    const profile = JSON.parse(state.db.mock.calls[0]![1].body);
    expect(profile.role).toBeUndefined();
  });
  it("provider mismatch and cross-origin requests fail closed", async () => {
    state.auth.mockResolvedValue(
      Response.json({
        user: { id: account.id, email: "another@example.com", email_confirmed_at: "2026-01-01" },
      }),
    );
    await expect(verifyCode(account.email, "123456", "Carlos")).rejects.toThrow(
      "verification failed",
    );
    state.origin = "https://evil.example";
    await expect(requestCode(account.email)).rejects.toThrow("origin");
  });
  it("logout revokes the stored session before clearing cookie", async () => {
    state.cookie = "a".repeat(43);
    state.db.mockResolvedValue(undefined);
    await endSession();
    expect(state.db).toHaveBeenCalledWith(
      `bula_sessions?token_hash=eq.${tokenHash(state.cookie)}`,
      { method: "DELETE" },
    );
    expect(state.clear).toHaveBeenCalled();
  });
  it("exhausted AI allowance is denied", async () => {
    session();
    const base = state.db.getMockImplementation()!;
    state.db.mockImplementation((path, ...args) =>
      path === "rpc/bula_consume_usage" ? Promise.resolve(false) : base(path, ...args),
    );
    await expect(consumeAi()).rejects.toThrow("daily AI allowance");
  });
  it("active paid features expire at the server", async () => {
    session([
      {
        plan: "performance",
        status: "active",
        expires_at: new Date(Date.now() + 100000).toISOString(),
      },
    ]);
    await expect(requireFeature("digitalTwin")).resolves.toMatchObject({ plan: "performance" });
    session([{ plan: "performance", status: "active", expires_at: "2000-01-01" }]);
    await expect(requireFeature("digitalTwin")).rejects.toThrow();
  });
  it("daily AI limits come from the server", async () => {
    session();
    await expect(consumeAi()).resolves.toMatchObject({ id: account.id });
    expect(state.db).toHaveBeenCalledWith(
      "rpc/bula_consume_usage",
      expect.objectContaining({ body: JSON.stringify({ p_user: account.id, p_limit: 1 }) }),
    );
  });
});
describe("owned, versioned progress", () => {
  it("reads only the verified owner", async () => {
    session();
    await readProgress();
    expect(state.db).toHaveBeenCalledWith(
      expect.stringContaining(`bula_progress?user_id=eq.${account.id}&`),
    );
  });
  it("does not write in private mode", async () => {
    session();
    await expect(writeProgress(progress, 0, true)).rejects.toThrow("Private Mode");
    expect(state.db.mock.calls.some((c) => c[0] === "rpc/bula_save_progress")).toBe(false);
  });
  it("rejects stale writes without pretending they saved", async () => {
    session();
    const base = state.db.getMockImplementation()!;
    state.db.mockImplementation((path, ...args) =>
      path === "rpc/bula_save_progress" ? Promise.resolve(null) : base(path, ...args),
    );
    await expect(writeProgress(progress, 2, false)).rejects.toThrow("Newer progress");
  });
  it("saves all fields with owner selected server-side", async () => {
    session();
    const base = state.db.getMockImplementation()!;
    state.db.mockImplementation((path, ...args) =>
      path === "rpc/bula_save_progress" ? Promise.resolve(1) : base(path, ...args),
    );
    expect(await writeProgress(progress, 0, false)).toEqual({ version: 1 });
    expect(state.db).toHaveBeenCalledWith(
      "rpc/bula_save_progress",
      expect.objectContaining({
        body: JSON.stringify({ p_user: account.id, p_version: 0, p_data: progress }),
      }),
    );
  });
});
function signed(body: string, timestamp = String(Math.floor(Date.now() / 1000))) {
  return new Request("https://bulacreation.app/api/webhooks/checkout", {
    method: "POST",
    headers: {
      "X-Bula-Timestamp": timestamp,
      "X-Bula-Signature": createHmac("sha256", process.env.GHL_WEBHOOK_SECRET!)
        .update(`${timestamp}.${body}`)
        .digest("hex"),
    },
    body,
  });
}
describe("billing verification", () => {
  it("fails closed without a configured secret", async () => {
    expect(
      (
        await checkoutWebhook(
          new Request("https://bulacreation.app", { method: "POST", body: "{}" }),
        )
      ).status,
    ).toBe(503);
    expect(state.db).not.toHaveBeenCalled();
  });
  it("rejects unsigned and old signed requests", async () => {
    process.env.GHL_WEBHOOK_SECRET = "s".repeat(40);
    expect(
      (
        await checkoutWebhook(
          new Request("https://bulacreation.app", { method: "POST", body: "{}" }),
        )
      ).status,
    ).toBe(401);
    expect((await checkoutWebhook(signed("{}", "1000000000"))).status).toBe(401);
  });
  it("commits verified events and cannot grant an admin role", async () => {
    process.env.GHL_WEBHOOK_SECRET = "s".repeat(40);
    state.db.mockResolvedValue(true);
    const event = {
      eventId: "evt-1",
      email: account.email,
      plan: "pro",
      status: "active",
      expiresAt: "2099-01-01T00:00:00.000Z",
      occurredAt: new Date().toISOString(),
      role: "admin",
    };
    expect((await checkoutWebhook(signed(JSON.stringify(event)))).status).toBe(200);
    expect(state.db.mock.calls[0]![1].body).not.toContain("admin");
  });
  it("does not acknowledge a failed database write", async () => {
    process.env.GHL_WEBHOOK_SECRET = "s".repeat(40);
    state.db.mockRejectedValue(new Error("storage unavailable"));
    const event = {
      eventId: "evt-1",
      email: account.email,
      plan: "pro",
      status: "active",
      expiresAt: "2099-01-01T00:00:00.000Z",
      occurredAt: new Date().toISOString(),
    };
    await expect(checkoutWebhook(signed(JSON.stringify(event)))).rejects.toThrow("storage");
  });
});
