# Traveller Budget / Wayfarer — controlled production cutover

**Date:** 14 October 2026, Australia/Brisbane. **State:** SECURITY HOLD until Cloudflare and Neon production checks pass. This is a preparation and operator plan, not a claim of production activation.

## Confirmed identities

- GitHub application: `tracey727/Travellers-budget`; current default source branch `claude/travellers-budget-audit-build-m1pw1v`.
- Source `wrangler.jsonc` Worker target: **`wayfarer-budget`**. The real Next.js app is NOT installed on that Worker yet.
- Existing Cloudflare Worker: **`travellers-budget`** — standalone dashboard Hello World template, no Next.js/Neon logic or `/api/health`. `DATABASE_URL` is currently a **plain_text** variable containing a Neon PostgreSQL URL. Its database host matches the Neon `traveller budget` project's production compute; the URL uses `neondb_owner`. Do not copy its secret from Cloudflare.
- Dedicated Neon project: **`traveller budget`** / `cold-mountain-30167874`, production branch `br-tiny-cell-a7wckk9p`, `neondb` in Australia region. The production schema contained no application tables at the time of audit.
- A temporary Neon migration branch successfully built the five tables from `drizzle/0000_nostalgic_jimmy_woo.sql`, with five foreign keys, no user/trip/expense records. **The production migration has NOT been applied.** Its completion requires a separate approved Neon step.

## Mandatory cutover order

1. Confirm production migration approval. Complete only the reviewed initial schema migration on the dedicated `traveller budget` project, then verify five tables, foreign keys and zero or expected records. Do not run `db:push` on production.
2. Create a unique *least-privilege* SQL login role **through reviewed SQL**, not the Neon `create_postgres_role` API. An isolated test found that the API-created role inherited `neon_superuser`, `CREATEROLE`, `CREATEDB` and `BYPASSRLS`; attempts to revoke `neon_superuser` membership were denied. A raw SQL `CREATE ROLE ... NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS` test in the temporary branch produced a properly restricted role. For the real runtime, create a unique high-entropy password privately via Neon SQL Editor. Grant `CONNECT` on `neondb`, `USAGE` on the `public` schema, and `SELECT,INSERT,UPDATE,DELETE` on exactly the application tables. Check the runtime role is not a member of `neon_superuser`, cannot create schemas/tables, and has no RLS-bypass privileges.
3. Configure **only** the `wayfarer-budget` Worker with the newly scoped Neon pooled `DATABASE_URL` as **Secret**, and a new unique `SESSION_SECRET` as **Secret**. Do not paste any credential into ChatGPT/GitHub/CI logs or plaintext Wrangler variables. `NEXT_PUBLIC_APP_URL` should point to the verified new Worker origin. Source `wrangler.jsonc` requires the two secret names before deployment.
4. Deploy the Next.js application to `wayfarer-budget` using the reviewed GitHub default branch and Cloudflare Workers Builds or an approved scoped Wrangler token. Verify deployed code is the same GitHub commit as passing CI.
5. Check `GET /api/health` returns `status:ok,database:ok`. Perform *synthetic test accounts only* for signup, login, trip creation, budget categories, expenses, ownership isolation and logout. Do not record real personal trips or payment information during acceptance. Only then promote independent application readiness.
6. Once the replacement app and scoped role are verified, **remove** the old `travellers-budget` Worker `plain_text DATABASE_URL` binding. **Rotate the old `neondb_owner` password** (or disable/revoke the old credential once the role dependencies are checked), confirm the old connection is invalid, and confirm the new Worker continues to work. Keep the old placeholder Worker retired or unlisted; do not overwrite it until verified.
7. Only after these gates consider a specific identity-only read-only service binding from the GENEVIEVE Command Centre; never bridge user records, account sessions or passwords.

## Non-negotiable holds

- A 200 from a placeholder Worker is not product readiness.
- A Neon `SELECT 1` health check does not prove tenant isolation or correct CRUD behaviour.
- The user must approve final production migration through the Neon review workflow. Cloudflare console or a permissioned scoped deploy credential is required to upload encrypted secrets; the existing connector rejected secret writes. Do not rotate the old credential before the replacement is live.
