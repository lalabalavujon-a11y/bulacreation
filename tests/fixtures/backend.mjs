// Local-only fake email transport + real embedded PostgreSQL for manual browser QA.
// Never deploy this fixture. No real emails are sent; only @example.com is accepted.
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
const pg = new PGlite();
await pg.exec(
  "create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key);",
);
await pg.exec(
  await readFile(
    new URL("../../supabase/migrations/202610100001_secure_accounts.sql", import.meta.url),
    "utf8",
  ),
);
const users = new Map(),
  codes = new Set();
const tables = new Set([
  "bula_accounts",
  "bula_sessions",
  "bula_entitlements",
  "bula_progress",
  "bula_audits",
]);
const identifier = (s) => {
  if (!/^[a-z_]+$/.test(s)) throw Error("Invalid identifier");
  return s;
};
const server = createServer(async (req, res) => {
  const send = (status, data) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  };
  try {
    const url = new URL(req.url, "http://127.0.0.1:4319");
    let raw = "";
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > 1100000) throw Error("Large body");
    }
    const body = raw ? JSON.parse(raw) : {};
    if (url.pathname.startsWith("/auth/v1/")) {
      if (!body.email?.endsWith("@example.com"))
        return send(400, { error: "Fixture accepts example.com only" });
      if (url.pathname.endsWith("/otp")) {
        codes.add(body.email);
        return send(200, {});
      }
      if (url.pathname.endsWith("/verify") && body.token === "123456" && codes.delete(body.email)) {
        let id = users.get(body.email);
        if (!id) {
          id = randomUUID();
          users.set(body.email, id);
          await pg.query("insert into auth.users values($1)", [id]);
        }
        return send(200, {
          user: { id, email: body.email, email_confirmed_at: new Date().toISOString() },
        });
      }
      return send(403, { error: "Invalid or used test code" });
    }
    if (req.headers.apikey !== "fixture-service-key") return send(403, {});
    const path = url.pathname.replace("/rest/v1/", "");
    if (path.startsWith("rpc/")) {
      const name = identifier(path.slice(4));
      if (!["bula_save_progress", "bula_consume_usage", "bula_apply_billing"].includes(name))
        return send(404, {});
      const names = Object.keys(body);
      const r = await pg.query(
        `select public.${name}(${names.map((k, i) => `${identifier(k)} => $${i + 1}`).join(",")}) as result`,
        Object.values(body).map((v) => (v && typeof v === "object" ? JSON.stringify(v) : v)),
      );
      return send(200, r.rows[0].result);
    }
    if (!tables.has(path)) return send(404, {});
    const filters = [...url.searchParams].filter(([, v]) => v.startsWith("eq."));
    const where = filters.length
      ? " where " + filters.map(([k], i) => `${identifier(k)} = $${i + 1}`).join(" and ")
      : "";
    if (req.method === "GET") {
      const r = await pg.query(
        `select * from public.${path}${where}`,
        filters.map(([, v]) => v.slice(3)),
      );
      return send(200, r.rows);
    }
    if (req.method === "DELETE") {
      await pg.query(
        `delete from public.${path}${where}`,
        filters.map(([, v]) => v.slice(3)),
      );
      return send(200, null);
    }
    if (req.method === "POST") {
      const cols = Object.keys(body).map(identifier);
      await pg.query(
        `insert into public.${path}(${cols.join(",")}) values(${cols.map((_, i) => "$" + (i + 1)).join(",")}) on conflict do nothing`,
        Object.values(body).map((v) => (v && typeof v === "object" ? JSON.stringify(v) : v)),
      );
      return send(200, null);
    }
    send(405, {});
  } catch (e) {
    console.error(e.message);
    send(500, { error: "Fixture database error" });
  }
});
server.listen(4319, "127.0.0.1", () =>
  console.log("Local test email provider + PostgreSQL ready on 4319. Test code: 123456."),
);
