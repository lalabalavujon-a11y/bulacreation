# Deployment Guide — Bula Creation (40-Point Creation Algorithm)

This app runs **same-origin on TanStack Start** deployed to the **Cloudflare
Workers edge runtime** with `nodejs_compat`. All server logic lives inside the
app — there is no separate legacy Worker to deploy.

All server routes live in `src/routes/api/*`:

| Capability | Implementation |
| --- | --- |
| Audit persistence | `src/routes/api/audit/save.ts` → `src/lib/diagnostic/store.server.ts` (in-isolate store) + CRM mirror |
| Audit read | `src/routes/api/audit/$id.ts` |
| Trajectory snapshots | `src/routes/api/trajectory/snapshot.ts` |
| Realtime voice session | `src/routes/api/realtime/session.ts` (creates the OpenAI Realtime ephemeral token) |
| Checkout webhook | `src/routes/api/webhooks/checkout.ts` |
| Text coach | `src/lib/diagnostic/coach.functions.ts` (`createServerFn`) |
| CRM sync + zone tags | `src/lib/diagnostic/crm.server.ts` + `src/lib/diagnostic/crm-sync.functions.ts` |

---

## 1. Secrets (configure via the secrets tool)

The app reads these inside server handlers via `process.env` (injected at
request time on the edge runtime):

| Secret | Used by | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | `api/realtime/session`, `coach.functions.ts` | Realtime voice + text coach (gpt-4o-realtime-preview / gpt-4o-mini) |
| `GHL_ACCESS_TOKEN` | `crm.server.ts` | Upsert contact, push custom fields, swap zone tags |
| `GHL_LOCATION_ID` | `crm.server.ts` | Optional override for the CRM location (fallback `VILrXHbgEue1XhjlpuVJ`) |

Set both `OPENAI_API_KEY` and `GHL_ACCESS_TOKEN` before publishing. The scoring
engine, radar, leverage sorter, trajectory chart, and audit all work with no
secrets — voice/text coach and CRM sync return a clear "not configured" message
until the keys are set.

---

## 2. CRM custom fields & tags (one-time setup)

The app writes these custom field keys onto each contact. Create them in your
CRM under **Settings → Custom Fields → Contacts**:

- `40pt_voltage` (number)
- `40pt_raw_score` (number)
- `40pt_zone` (text)
- `40pt_teachability_pct` (number)
- `40pt_peak` (number)
- `40pt_snapshots` (number)
- `40pt_chief_aim` (text)

Zone tags are applied/removed automatically on every sync so a contact carries
exactly **one** active zone tag — the trigger signal for zone-crossing workflows:

- `40pt-friction-zone`
- `40pt-emergence-zone`
- `40pt-operative-active`

Recommended workflow triggers:
- Tag added = `40pt-emergence-zone` → "Emergence reached" coaching sequence
- Tag added = `40pt-operative-active` → "Operative Active" celebration + next-tier assignment
- Tag removed = `40pt-operative-active` → "Relapse check-in" sequence

---

## 3. Connecting Cloudflare D1 / KV / R2 (persistent storage)

> **Today** the app runs on the in-isolate store + CRM custom fields as its
> durable mirror — it is fully functional without D1/KV/R2. The bindings below
> upgrade persistence from "per-isolate, CRM-mirrored" to "shared durable
> across all isolates" so multi-user cloud sync survives cold starts. They are
> **optional** — add them when you are ready to scale beyond local/CRM storage.

### 3a. D1 — relational database (audit scores, snapshots, sessions)

D1 holds the durable rows: `audit_scores`, `chief_aims`,
`trajectory_snapshots`, and `coaching_sessions`.

```bash
# 1. Create the database
npx wrangler d1 create bula-creation-db
# Copy the returned database_id into wrangler.toml (see 3d)

# 2. Apply the schema
npx wrangler d1 execute bula-creation-db --file=./schema.sql
```

`schema.sql` (create at repo root):

```sql
CREATE TABLE IF NOT EXISTS audit_scores (
  contact_id    TEXT NOT NULL,
  point_number  INTEGER NOT NULL,
  tier          TEXT NOT NULL,
  points_earned REAL NOT NULL,
  updated_at    INTEGER NOT NULL,
  PRIMARY KEY (contact_id, point_number)
);

CREATE TABLE IF NOT EXISTS chief_aims (
  contact_id          TEXT PRIMARY KEY,
  aim                TEXT,
  specificity        TEXT,
  disgust_factor     TEXT,
  believability      REAL,
  handwriting_script TEXT,
  updated_at         INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS trajectory_snapshots (
  id                       TEXT PRIMARY KEY,
  contact_id               TEXT NOT NULL,
  total_voltage            INTEGER NOT NULL,
  raw_points               REAL NOT NULL,
  teachability_multiplier  REAL NOT NULL,
  pillar_scores            TEXT NOT NULL,
  zone                     TEXT NOT NULL,
  created_at               INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS coaching_sessions (
  id          TEXT PRIMARY KEY,
  contact_id  TEXT NOT NULL,
  persona     TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_scores_contact   ON audit_scores(contact_id);
CREATE INDEX IF NOT EXISTS idx_snap_contact_time ON trajectory_snapshots(contact_id, created_at DESC);
```

To consume the binding, read `env.DB` inside a `createServerFn` handler (or a
server route) — e.g. replace the in-isolate store in
`src/lib/diagnostic/store.server.ts` with D1 prepared statements. Keep the
`process.env`/binding reads **inside** the handler; the edge runtime injects
them at call time.

### 3b. KV — session / ephemeral state cache

KV is used for short-lived, read-often state (active session lookup, rate-limit
counters) that does not need D1's relational guarantees.

```bash
npx wrangler kv namespace create bula-creation-kv
# Copy the returned id into wrangler.toml
```

Use `env.KV` inside handlers: `env.KV.put(key, value)`, `env.KV.get(key)`. Keep
all binding access inside `createServerFn` handlers or server routes — never at
module scope.

### 3c. R2 — object storage (larger artifacts)

R2 is for larger blobs that do not belong in D1 or KV — exported audit reports,
audio transcripts, generated handwriting images, PDF "Creation Reports".

```bash
npx wrangler r2 bucket create bula-creation-assets
```

Access via `env.ASSETS` (`env.ASSETS.put(key, body)`, `env.ASSETS.get(key)`)
inside handlers. Same boundary rules as D1/KV.

### 3d. `wrangler.toml` (bindings)

Once the resources above exist, add a `wrangler.toml` at repo root so the
deploy picks up the bindings:

```toml
name = "bula-creation"
main = "dist/.output/server/index.mjs"
compatibility_date = "2024-12-01"
compatibility_flags = ["nodejs_compat"]

[vars]
# GHL_LOCATION_ID can also be set here, but a secret is safer.

[[d1_databases]]
binding       = "DB"
database_name = "bula-creation-db"
database_id   = "PASTE_D1_DATABASE_ID"

[[kv_namespaces]]
binding = "KV"
id      = "PASTE_KV_NAMESPACE_ID"

[[r2_buckets]]
binding = "ASSETS"
bucket_name = "bula-creation-assets"
```

> The current app is the same-origin TanStack build. The bindings above become
> available once you wire `store.server.ts` (and any new routes) to read them.
> They are additive — the app keeps working with the in-isolate store until you
> flip the implementation over.

---

## 4. Custom domain (`bulacreation.app`)

1. **Cloudflare DNS** — add the apex `bulacreation.app` and `www` as
   `CNAME`/`A` records pointing at the platform's deploy target (the publish
   action outputs the exact target). If the domain is already on Cloudflare,
   set the records to "Proxied".
2. **Publish** the app via the platform deploy action.
3. In the deploy dashboard, attach `bulacreation.app` (and `www`) as custom
   domains so the edge serves them with TLS.
4. (Optional) Point `api.bulacreation.app` at the Worker if you later split the
   API onto its own subdomain — not required for the same-origin build.

Verify after attaching:

- `https://bulacreation.app/login` loads the magic-link screen.
- `https://bulacreation.app/vsl` loads the public funnel.
- `https://bulacreation.app/terms`, `/privacy`, `/support` load the legal pages.

---

## 5. Run locally

```bash
npm install
npm run dev
```

Open the preview. The scoring engine, radar, leverage sorter, trajectory chart,
and audit all work with no secrets. Voice coach and text coach return a clear
"not configured" message until `OPENAI_API_KEY` is set.

---

## 6. Publish

Publish through the platform deploy action. Secrets are injected at request
time on the edge runtime — no `.env` file is shipped. After publishing, verify:

- `POST /api/audit/save` with an email → contact appears in CRM with zone tag.
- `/coach` → Start voice session connects over WebRTC.
- `/coach` text mode → returns a mentor reply.
- `/terms`, `/privacy`, `/support` → legal pages render.

---

## 7. What was removed vs. the legacy worker

| Legacy (separate wrangler worker) | Now |
| --- | --- |
| `wrangler d1 create` + `schema.sql` | Optional upgrade (Section 3a) — in-isolate store + CRM fields work today |
| `wrangler kv namespace create` | Optional upgrade (Section 3b) |
| `wrangler secret put` | Platform secrets tool (Section 1) |
| `wrangler deploy` | Platform publish |
| `VITE_WORKER_URL` | Not needed — same-origin `/api/*` routes |
| `LEAD RECON_API_KEY` | Renamed `GHL_ACCESS_TOKEN` (already set) |

---

## 8. Order-form build checklist (live checkout)

The Stripe products + prices are already provisioned (see
`src/lib/diagnostic/stripe-products.ts` for the live IDs). The app's checkout
CTAs route to CRM order-form URLs read from env vars. Until those URLs are set,
`/checkout/:plan` shows a clear "checkout not configured" state.

Build **9 order forms** in the CRM UI: **Payments → Order Forms → + New Order
Form**. For each form: pick the product + price below, set currency to **GBP**,
publish, then copy the generated URL into the matching env var.

### Recurring subscriptions (one product, two prices each)

| # | Order form name | Product | Price | Env var to set |
| --- | --- | --- | --- | --- |
| 1 | BULA Pro — Monthly | Creation Pro | £19 / month | `VITE_CHECKOUT_PRO_URL` |
| 2 | BULA Pro — Annual | Creation Pro | £190 / year | `VITE_CHECKOUT_PRO_ANNUAL_URL` |
| 3 | BULA Performance — Monthly | Creation Performance | £39 / month | `VITE_CHECKOUT_PERFORMANCE_URL` |
| 4 | BULA Performance — Annual | Creation Performance | £390 / year | `VITE_CHECKOUT_PERFORMANCE_ANNUAL_URL` |
| 5 | BULA Coach — Monthly | Creation Coach | £149 / month | `VITE_CHECKOUT_COACH_URL` |
| 6 | BULA Coach — Annual | Creation Coach | £1,490 / year | `VITE_CHECKOUT_COACH_ANNUAL_URL` |
| 7 | BULA Coach Pro — Monthly | Creation Coach Pro | £399 / month | `VITE_CHECKOUT_COACH_PRO_URL` |
| 8 | BULA Coach Pro — Annual | Creation Coach Pro | £3,990 / year | `VITE_CHECKOUT_COACH_PRO_ANNUAL_URL` |

### One-time offer

| # | Order form name | Product | Price | Env var to set |
| --- | --- | --- | --- | --- |
| 9 | BULA Calibration Intensive | Creation Calibration Intensive | £299 one-time | `VITE_CHECKOUT_CALIBRATION_URL` |

### Post-purchase automation (build once, applies to all forms)

Wire a single workflow triggered by **Order Form Submitted**:

1. Add the tier tag — `bula-pro` / `bula-performance` / `bula-coach` /
   `bula-coach-pro` (calibration → `bula-calibration` + 60-day `bula-coach` access).
2. Move pipeline stage → `Trial Access` (Pro/Performance) or `Coach Converted`
   (Coach/Coach Pro/Calibration).
3. Wait 2 min → send the magic-link email: **"Bula {first_name} — Your Algorithm
   Awaits"** with CTA `https://bulacreation.app/login?token={token}`.
4. Coach/Coach Pro → also send SMS: **"Bula {first_name} — your BULA Creation
   account is live. Coach access activated."**
5. Pro/Performance trial clock → Day 7 voltage reminder, Day 13 final warning,
   Day 14 → if not converted, move to `Churned`, remove tier tag, call
   `POST /api/webhooks/checkout` to downgrade to Free, then Day 44 win-back email.

### Verification (after env vars are set)

- `/pricing` and `/vsl` CTAs → land on the correct live order form.
- Monthly toggle → monthly URL; Annual toggle → annual URL.
- `/checkout/calibration` → lands on the £299 one-time form.
- After a test purchase, the contact appears in CRM with the correct tier tag +
  pipeline stage, and the magic-link email fires.
