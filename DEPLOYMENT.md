# Secure accounts deployment

This release changes authentication and persistence. **Do not publish until the managed authentication service, database, email sender and payment adapter are configured and tested in staging.** Existing name/email-only sessions and browser payment flags are deliberately not trusted. This branch does not provision infrastructure or alter the live site.

The existing TanStack Start/LeadConnector deployment remains same-origin. Its Cloudflare runtime needs `nodejs_compat` and server runtime environment injection, as before. Database/auth requests use HTTPS REST, not a database connection in the browser.

## Authentication and database

1. Select or create a dedicated Supabase project for Bula Creation. Back up any existing database before applying migrations. Run `supabase/migrations/202610100001_secure_accounts.sql` through the project migration workflow.
2. Enable email authentication. Configure a production SMTP sender and verify its domain. Set the email template to show `{{ .Token }}`; this app uses an email verification code, not a link callback. Configure OTP expiry, rate limits and abuse protection appropriate for public signup. See [Supabase email OTP documentation](https://supabase.com/docs/guides/auth/auth-email-passwordless).
3. Inject `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` as server runtime settings. The service role key is a secret; never put it in a `VITE_` variable, client bundle, commit or chat. All Bula tables have RLS enabled and deny `anon`/`authenticated`; only the same-origin server accesses them. See [Supabase RLS documentation](https://supabase.com/docs/guides/database/postgres/row-level-security).
4. Verify a real test email in staging. The app creates a default **member**, stores a random session token's SHA-256 hash, and sends an HTTP-only, SameSite=Lax cookie (Secure on HTTPS). Sessions expire after seven days; logging out revokes the stored session. There is no password or admin-email shortcut.
5. To bootstrap the owner, independently verify the intended account UUID after email verification. An authorized database administrator can then run `update public.bula_accounts set role = 'admin' where id = '<verified-owner-uuid>';`. Buying Coach Pro never grants an admin role. Revoke by restoring `member`; the next server request reads the updated role.
6. Configure periodic cleanup of expired `bula_sessions` and an appropriate retention policy for usage and billing event records. Enable database backups and rehearse recovery. No cleanup scheduler is provisioned by this branch.

The server fails closed if configuration/storage is unavailable. Never deploy a fallback that recreates the old name/email login. Email sending and verification errors are user-visible. Existing users must verify their email once after the cutover.

## Progress and migration

- Private Mode defaults on. Audit answers, evidence, goal fields, framework, snapshots and the creation plan stay in account-scoped browser storage.
- Turn Private Mode off and choose **Save progress to account** before changing devices. On the other device, verify the same email, open **Your saved progress**, turn Private Mode off and choose **Restore from account**.
- These are explicit saves/restores, not automatic background sync. An account version prevents stale devices from overwriting newer saves. Export local progress before resolving a conflict. The JSON export is a safety copy; file import is not implemented.
- New-device setup includes a link to saved progress. The original unscoped browser audit is offered only through an explicit ownership-confirmed import. It remains intact, is not automatically assigned to the first person who signs in, and is not automatically uploaded. Do not clear browser storage during rollout.
- Secondary features (assessment results, SRS, coach roster, commitments, intervention history) remain account-scoped **device-local** data in this release. They are not included in cross-device progress yet.
- Existing in-memory server audit data cannot be recovered after its isolate disappears. CRM summary fields cannot reconstruct missing audit answers. Do not represent either as a recoverable full backup.
- The old unversioned `/api/audit/save` and `/api/trajectory/snapshot` writes return 410. The updated UI saves the complete versioned progress record. Cloud saves do not send audit contents to CRM.

## Plans and payments

The server reads plan, status and expiry from `bula_entitlements` on every authenticated operation. Free accounts have one AI request/day and three cloud snapshots. Paid feature checks protect voice, Digital Twin and Calibration; usage is atomically limited. Existing local-only premium calculations are UI features, not confidential server resources. Admin UI tier previews never change server permissions.

Client checkout return URLs and CRM tags do **not** activate a plan. A trusted payment adapter must verify payment/subscription state with the billing provider and send the contract below. An order form submission by itself is insufficient. This branch supplies the receiver, not a deployed provider adapter.

`POST /api/webhooks/checkout`:

```json
{
  "eventId": "unique-provider-event-id",
  "email": "verified-purchaser@example.com",
  "plan": "pro",
  "status": "active",
  "expiresAt": "2026-11-10T00:00:00.000Z",
  "occurredAt": "2026-10-10T00:00:00.000Z"
}
```

Set `GHL_WEBHOOK_SECRET` to a securely generated secret of at least 32 characters on the app and trusted adapter. Send `X-Bula-Timestamp` (current Unix seconds) and `X-Bula-Signature` (lowercase hex HMAC-SHA256 of `timestamp + '.' + exact raw JSON body`). Retries need a fresh timestamp/signature and the same event ID. Signatures expire after five minutes. The receiver caps bodies at 16 KiB, deduplicates events and ignores older entitlement updates in one database transaction. It acknowledges only after persistence succeeds.

Allowed plans: `free`, `pro`, `performance`, `coach`, `coach_pro`. Status: `active`, `trialing`, `cancelled`, `expired`. Cancellation immediately removes access: for cancel-at-period-end, send active with the paid-through expiry and cancel only when access should end. Trials need a verified provider expiry. A calibration purchase maps to Coach with its verified 60-day expiry. The adapter must preserve higher concurrent subscriptions: the receiver stores one effective entitlement per email, not a multi-subscription ledger. Treat equal-time conflicting events and refund/chargeback ordering through provider reconciliation before signing. Email changes and reconciliation require an operator workflow.

Populate the public checkout URLs in `.env.example` only after verifying each product, GBP price, interval and return destination. Annual URLs never fall back to monthly. Missing URLs show checkout unavailable. Use the same verified email at checkout. Do not enable purchases until the signed adapter is working; otherwise payments will not unlock access.

Required staging payment scenarios: free denied paid RPC, successful test purchase, renewal, expired trial, cancel-at-period-end, immediate refund, duplicate event, delayed older event, wrong email, failed persistence/retry and admin separation. No live charge is needed. The local suite covers receiver/entitlement behavior; it does not verify actual Stripe/GHL products, email delivery or checkout workflows.

## Local verification

Use Node 22+. `npm ci --ignore-scripts`, `npm test`, `npm run build`, `npm run typecheck`. `package-lock.json` pins the npm verification environment. Existing type errors and dependency audit findings are recorded in `SECURITY-QA.md`; do not interpret a successful Vite build as a clean typecheck.

For an isolated browser test with no external credentials or messages:

```sh
node tests/fixtures/backend.mjs
# In a second terminal:
SUPABASE_URL=http://127.0.0.1:4319 SUPABASE_ANON_KEY=fixture-public-key SUPABASE_SERVICE_ROLE_KEY=fixture-service-key npm run dev -- --host 127.0.0.1 --port 4320
```

The fixture runs the migration on embedded PostgreSQL, binds loopback only and accepts only `@example.com` test emails with code `123456`. It is not part of the app runtime and must never be exposed or used in production. HTTP backend URLs are rejected in production. The methodology fallback plan can be tested without an OpenAI key; real AI and voice require staging keys and separate validation.

## Cutover and rollback

Before publishing: verify real email delivery and expiry/reuse rejection, two independent devices and two distinct accounts, owner role bootstrap, cross-origin and unauthenticated rejection, backups, payment adapter, mobile login and sign-out. Preserve existing browser data. Deploy from the reviewed branch using the established platform workflow; no custom DNS or new Worker is required.

If the release fails, put the app into maintenance while repairing configuration or forward-fixing. Do not restore the insecure email-only login or trust old local entitlement flags. Database migration is additive; keep verified user/progress rows and backups during recovery. The signed webhook contract is a breaking integration change and must be coordinated with its sender.
