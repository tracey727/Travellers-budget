# Wayfarer release verification — 15 October 2026

The real application targets `wayfarer-budget`. `travellers-budget` is a legacy placeholder and must not be scored as this application or used as its credential source.

## Verified provider and source state

- Canonical production branch: `claude/travellers-budget-audit-build-m1pw1v`.
- Cloudflare build settings now use `npm run cf:build` then `npx wrangler deploy`.
- Last recorded build failed: it ran `npm run build`; OpenNext deployment could not find its compiled config.
- New Worker's DATABASE_URL binding is `secret_text`; SESSION_SECRET was absent. No credential values were read.
- Public `/api/health` rendered Cloudflare's empty-site page. Application deployment and database/schema readiness are unverified.
- Cloudflare connector refused the attempt to add SESSION_SECRET: "No access to the specified resource." No successful change is claimed.

## Release gate

1. Configure a cryptographically random SESSION_SECRET of at least 32 bytes as an encrypted secret on `wayfarer-budget`; preserve the existing DATABASE_URL secret.
2. Configure the exact public origin and enable the intended public domain.
3. Deploy the exact CI-passing canonical commit using the current Cloudflare build command.
4. Require JSON `service=wayfarer-budget, status=ok, database=ok` at GET /api/health. This uses only SELECT 1 and does not migrate schema.
5. Verify the dedicated database identity, five expected schema tables, then synthetic signup/login, trip, category and expense persistence, owner isolation and logout. Do not enable billing or import another program's database.
6. Update the Control Centre source mapping and attach only the approved read-only health route after deployed proof. Preserve the legacy credential incident until old credential invalidation is independently established.

A successful health check alone does not close the operational gate.
