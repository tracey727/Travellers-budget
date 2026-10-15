# Wayfarer release verification — 15 October 2026

The real application targets `wayfarer-budget`. `travellers-budget` is a legacy placeholder and must not be scored as this application or used as its credential source.

## Verified provider and source state

- Canonical production branch: `claude/travellers-budget-audit-build-m1pw1v`.
- Cloudflare build settings now use `npm run cf:build` then `npx wrangler deploy`.
- Earlier build failed because it used `npm run build`. The corrected build of commit `557bd5a8d30d79226b53b3c35d30e1c5f8dc35c8` compiled successfully with `npm run cf:build`, then deployment stopped because SESSION_SECRET was missing.
- At 10:20 AEST on 15 October, both DATABASE_URL and SESSION_SECRET are verified as `secret_text` on the correct Worker. The owner saved the missing secret. Values, entropy and database target were not read or certified.
- workers.dev is disabled in provider settings; the release config now explicitly enables the intended public app address.
- Public `/api/health` rendered Cloudflare's empty-site page. Application deployment and database/schema readiness are unverified.
- Saving the secret created a dashboard version, but did not rebuild the application. The direct build retry API returned an authentication error. This documentation-only update retries the configured GitHub build path without changing the already CI-passing application code.

## Release gate

1. Configure a cryptographically random SESSION_SECRET of at least 32 bytes as an encrypted secret on `wayfarer-budget`; preserve the existing DATABASE_URL secret.
2. Configure the exact public origin and enable the intended public domain.
3. Deploy the exact CI-passing canonical commit using the current Cloudflare build command.
4. Require JSON `service=wayfarer-budget, status=ok, database=ok` at GET /api/health. This uses only SELECT 1 and does not migrate schema.
5. Verify the dedicated database identity, five expected schema tables, then synthetic signup/login, trip, category and expense persistence, owner isolation and logout. Do not enable billing or import another program's database.
6. Update the Control Centre source mapping and attach only the approved read-only health route after deployed proof. Preserve the legacy credential incident until old credential invalidation is independently established.

A successful health check alone does not close the operational gate.
