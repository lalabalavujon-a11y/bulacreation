# Security and progress verification — 10 October 2026

Status: **implementation prepared for review; not deployed or production-verified**.

## Automated results

- `npm test`: **33 tests passed**, three files. Covers invalid/expired sessions, verified matching email, hashed session cookies, logout revocation, same-origin checks, member/admin and paid/admin separation, paid expiry, daily usage rejection, owner-scoped progress, private-mode refusal, stale save rejection, verified billing and persistence failures.
- PostgreSQL tests apply the actual migration to PGlite. They exercise browser-role denial, atomic usage limits, concurrent progress saves, account isolation, duplicate and delayed billing events, and transaction rollback.
- `npm run build`: **passed**, including the final checkout copy/annual price fix.
- `npm run typecheck`: **fails with 94 existing errors**; the unmodified baseline under the same installed toolchain has 118. Comparison by source file/error code shows no increased counts. Existing issues include unchecked array accesses, optional properties, environment-key notation, and typed checkout links. New security modules report no errors. This does not replace fixing the repository's typecheck before release.
- `git diff --check`: passed.
- `npm audit`: **9 findings (5 high, 4 moderate, 0 critical)** in the existing LeadConnector vibe-tagger/Tailwind tooling chain. The new test dependencies were updated to avoid an earlier vulnerable Vitest version. No blanket forced dependency upgrade was applied; platform compatibility needs checking separately.

## Browser journey tested

Used loopback-only fake email transport with the actual migration on embedded PostgreSQL. No real emails, credentials, payments or production data were involved. `127.0.0.1` and `localhost` provided independent cookie/local-storage origins against the same test backend, simulating two devices.

1. New account: name/email → send test code → verify code → setup → goal → framework → audit.
2. Scored all 40 points: dashboard showed 40/40 answered and 2,195 voltage.
3. Generated the methodology fallback creation plan (no external AI key), then saved complete progress to the account with Private Mode off.
4. Reloaded the first origin; local progress and plan survived.
5. Signed in as the same test identity on the independent origin; it initially had no local progress. Restored the account copy and verified the exact goal, 40 answers, voltage and plan.
6. Tested the restored dashboard/plan at **390 × 844**, pricing and the annual Pro checkout route. Missing checkout configuration did not redirect or activate a plan. The annual billed amount display was corrected to the annual total.
7. Signed out on mobile, verified a different test email and observed an empty audit/goal/plan with Private Mode on. Tested the new returning-device setup link and signed out again. Viewport override reset.

Local screenshot evidence is saved outside the repository at `../qa-evidence/mobile-restored-plan.png`.

## Required staging acceptance before merge/publish

- Select the Bula Supabase project, apply the migration, configure production email sender, OTP template/rate limits and runtime secrets.
- Verify delivered codes, wrong/expired/reused codes, fresh HTTPS sessions, real separate devices, owner provisioning and database recovery.
- Deploy a trusted payment-event adapter and verify test-mode purchase, renewal, expiry, cancellation, refund and replay behavior against actual configured checkout products. A signed receiver exists; the external sender is not installed. Existing tags alone grant no access.
- Test paid AI/voice with staging keys. Local plan generation used the documented fallback, not a live model response.
- Resolve the existing typecheck and dependency findings before declaring production readiness.
- Confirm migration ownership for any old shared-browser data. The old global browser copy is preserved; secondary feature stores are scoped to accounts but still device-local.

See `DEPLOYMENT.md` for configuration, migration, payment contract, limits and rollback instructions. Production has not changed and Carlos's real account has not been revalidated under this new authentication flow.
