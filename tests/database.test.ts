import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
const a = "00000000-0000-4000-8000-000000000001",
  b = "00000000-0000-4000-8000-000000000002";
let db: PGlite;
beforeAll(async () => {
  db = new PGlite();
  await db.exec(
    "create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key); grant usage on schema public to anon, authenticated, service_role;",
  );
  await db.exec(
    await readFile(
      new URL("../supabase/migrations/202610100001_secure_accounts.sql", import.meta.url),
      "utf8",
    ),
  );
  await db.query("insert into auth.users values ($1),($2)", [a, b]);
  await db.query(
    "insert into public.bula_accounts(id,email,name) values ($1,'a@example.com','A'),($2,'b@example.com','B')",
    [a, b],
  );
}, 30000);
afterAll(async () => {
  await db.close();
});
async function save(user: string, version: number, data: unknown) {
  const res = await db.query<{ v: number | null }>(
    "select public.bula_save_progress($1,$2,$3) as v",
    [user, version, JSON.stringify(data)],
  );
  return res.rows[0]!.v;
}
describe("actual PostgreSQL migration and transactions", () => {
  it("starts every account as a member", async () => {
    const r = await db.query<{ role: string }>("select role from public.bula_accounts");
    expect(r.rows.map((x) => x.role)).toEqual(["member", "member"]);
  });
  it("keeps goals, audit and plan together across independent reads", async () => {
    const data = {
      chiefAim: { text: "Goal" },
      scores: { 1: 0.66 },
      creationPlan: { why: "Because" },
    };
    expect(await save(a, 0, data)).toBe(1);
    const r = await db.query<{ data: unknown }>(
      "select data from public.bula_progress where user_id=$1",
      [a],
    );
    expect(r.rows[0]!.data).toEqual(data);
  });
  it("rejects duplicate initial saves and stale device writes", async () => {
    expect(await save(a, 0, { bad: true })).toBeNull();
    expect(await save(a, 1, { new: true })).toBe(2);
    expect(await save(a, 1, { old: true })).toBeNull();
  });
  it("keeps a second account independent", async () => {
    expect(await save(b, 0, { owner: "B" })).toBe(1);
    const r = await db.query<{ data: unknown }>(
      "select data from public.bula_progress where user_id=$1",
      [a],
    );
    expect(r.rows[0]!.data).toEqual({ new: true });
  });
  it("permits only one simultaneous write at the same version", async () => {
    const r = await Promise.all([save(a, 2, { first: true }), save(a, 2, { second: true })]);
    expect(r.filter((x) => x === 3)).toHaveLength(1);
    expect(r.filter((x) => x === null)).toHaveLength(1);
  });
  it("enforces the free AI allowance atomically", async () => {
    const results = await Promise.all(
      Array.from({ length: 4 }, () =>
        db.query<{ ok: boolean }>("select public.bula_consume_usage($1,1) as ok", [a]),
      ),
    );
    expect(results.filter((r) => r.rows[0]!.ok)).toHaveLength(1);
  });
  it("deduplicates billing events and ignores out-of-order updates", async () => {
    const apply = async (id: string, plan: string, time: string) => {
      const r = await db.query<{ ok: boolean }>(
        "select public.bula_apply_billing($1,'a@example.com',$2,'active','2099-01-01',$3) as ok",
        [id, plan, time],
      );
      return r.rows[0]!.ok;
    };
    expect(await apply("new", "performance", "2026-10-10")).toBe(true);
    expect(await apply("new", "coach_pro", "2026-10-11")).toBe(false);
    expect(await apply("old", "pro", "2026-10-09")).toBe(true);
    const r = await db.query<{ plan: string }>(
      "select plan from public.bula_entitlements where email='a@example.com'",
    );
    expect(r.rows[0]!.plan).toBe("performance");
  });
  it("cancellation removes access and stale renewal cannot reactivate it", async () => {
    await db.query(
      "select public.bula_apply_billing('cancel','a@example.com','free','cancelled','2026-10-11','2026-10-11')",
    );
    await db.query(
      "select public.bula_apply_billing('stale-renew','a@example.com','coach','active','2099-01-01','2026-10-10')",
    );
    const r = await db.query<{ status: string }>(
      "select status from public.bula_entitlements where email='a@example.com'",
    );
    expect(r.rows[0]!.status).toBe("cancelled");
  });
  it("browser roles cannot read progress, mint sessions, update roles or call privileged RPCs", async () => {
    for (const role of ["anon", "authenticated"]) {
      await db.exec(`set role ${role}`);
      for (const sql of [
        "select * from public.bula_progress",
        "select * from public.bula_sessions",
        "update public.bula_accounts set role='admin'",
        `select public.bula_save_progress('${a}',0,'{}')`,
        `select public.bula_consume_usage('${a}',500)`,
      ])
        await expect(db.exec(sql)).rejects.toThrow(/permission denied/);
      await db.exec("reset role");
    }
  });
});
