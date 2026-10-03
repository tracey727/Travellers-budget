# Wayfarer — Travel Budgeting, Done Beautifully

**Plan the trip, not the spreadsheet.** Wayfarer tracks every flight, night and
meal against your plan, in any currency, for any trip. Runs on Cloudflare
Workers with a Neon Postgres database — no bank connections, no card numbers,
no third-party billing.

- **Frontend/backend:** Next.js 15 (App Router, React 19, Server Actions)
- **Hosting:** Cloudflare Workers via `@opennextjs/cloudflare`
- **Database:** Neon serverless Postgres via Drizzle ORM (HTTP driver)
- **Source control:** GitHub
- **Photography:** real photographs served from Unsplash's CDN — no stock
  illustrations

This project deliberately has **no Vercel dependency of any kind** — it is
built, previewed and deployed entirely through Cloudflare's own tooling.

---

## What's in the box

- **Trips** — name, destination, dates, currency, total budget and a cover
  photo, picked from a curated set of real destination photography
- **Budget categories** — eight standard categories seeded automatically on
  every new trip (Flights, Accommodation, Food & Drink, Transport, Activities,
  Shopping, Insurance & Visas, Miscellaneous), each fully editable, with your
  own categories addable at any time
- **Expenses** — logged against a category, in any of 30+ currencies; an
  expense in a different currency to the trip converts to the trip currency
  using the rate you enter, so the budget stays in one clear number
- **Live progress bars** everywhere money is committed — per category and for
  the trip as a whole, with an explicit "over budget" state rather than a bar
  that silently caps at 100%
- **Dashboard** — every trip at a glance: status, dates, spend vs budget
- **Account settings** — profile, home currency default, password change
- A marketing home page built to sell the product on its own merits: a real
  photographic hero, a feature grid, a destination gallery, a "how it works"
  walkthrough and an old-way-vs-Wayfarer comparison — no fabricated user
  counts or testimonials, because there aren't any yet

### Deliberately not included (yet)

- **No payments.** The whole app is free to use as shipped. If you want a
  paid tier later, `src/lib/actions/account.ts` and the `users` table are the
  places to add a `plan` column and gate features — the same pattern the
  sibling Genevieve App budgeting app uses with Stripe.
- **No email sending.** Sign-up and login work without it. There's no
  password-reset-by-email flow; a signed-in user changes their password from
  Settings instead. Add Resend (or similar) later if you want it.
- **No live FX rates API.** Exchange rates are entered by hand at the moment
  you log an expense. This keeps the app deployable with zero extra API keys;
  wiring up a live rates provider is a contained change to
  `src/lib/actions/expenses.ts`.

---

## Deploying to production

You need two accounts: **Neon** and **Cloudflare**. Budget about 15 minutes.

### 1. Create the Neon database

1. Create a project at [console.neon.tech](https://console.neon.tech).
2. Copy the **pooled** connection string (the host contains `-pooler`).

Apply the schema. Either paste
[`setup/database-setup.sql`](setup/database-setup.sql) into Neon's SQL Editor —
no tooling required — or run the migration from a terminal:

```bash
npm install
DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require" \
  npm run db:migrate
```

This creates 5 tables: `users`, `sessions`, `trips`, `budget_categories` and
`expenses`.

### 2. Deploy to Cloudflare

**Through the dashboard (no terminal needed).** Workers &rarr; Create &rarr;
Import a repository &rarr; this repo, then set:

| Setting | Value |
|---|---|
| Build command | `npm run cf:build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |
| Production branch | your default branch |
| Node version | Read from `.node-version` (22) |

Add the secrets below under **Settings &rarr; Variables and Secrets**, as
*Secrets* rather than plain text:

- `DATABASE_URL` — the Neon pooled connection string from step 1
- `SESSION_SECRET` — `openssl rand -base64 32`
- `NEXT_PUBLIC_APP_URL` — your production origin, no trailing slash

Two things that catch people out:

- The Worker's `workers.dev` address is **off by default** — enable it under
  **Domains** or the site has no public URL.
- Saving build settings does **not** start a build. A build runs when a
  commit is pushed, or when you trigger one from **Deployments**.
- `wrangler.jsonc` intentionally has **no `vars` block**. `wrangler deploy`
  replaces all plain-text variables with whatever that block contains, so a
  single entry there silently wipes every variable set in the dashboard — all
  configuration lives in the dashboard or via `wrangler secret put` instead.

**Through the command line:**

```bash
npx wrangler login

# Set your production origin in wrangler.jsonc first, or set it as a secret:
npx wrangler secret put DATABASE_URL
npx wrangler secret put SESSION_SECRET
npx wrangler secret put NEXT_PUBLIC_APP_URL

npm run cf:deploy
```

### 3. Verify

```bash
curl https://your-domain/api/health
```

Expect `{"status":"ok","database":"ok","missingEnv":[]}`. A `503` names
exactly which variable is missing or whether the database is unreachable — it
never echoes secret values.

Then run a live smoke test: sign up, create a trip, log an expense.

### Custom domain

In the Cloudflare dashboard → Workers & Pages → `wayfarer-budget` → Settings →
Domains & Routes → **Add custom domain**. Cloudflare provisions the TLS
certificate automatically. Update `NEXT_PUBLIC_APP_URL` and redeploy.

---

## Local development

```bash
npm install
cp .env.example .env.local     # fill in your values
npm run dev                    # http://localhost:3000
```

To run against the real Workers runtime (recommended before any deploy):

```bash
cp .dev.vars.example .dev.vars # fill in your values
npm run cf:preview
```

### Commands

| Command | What it does |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production Next.js build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Password hashing, money and budget-math test suites |
| `npm run db:generate` | Generate a migration from schema changes |
| `npm run db:migrate` | Apply migrations to `DATABASE_URL` |
| `npm run db:studio` | Drizzle Studio |
| `npm run cf:build` | Build the Cloudflare Worker |
| `npm run cf:preview` | Run the Worker locally |
| `npm run cf:deploy` | Deploy to Cloudflare |

---

## Security

- Passwords hashed with **PBKDF2-SHA256, 100,000 iterations**, verified in
  constant time — the strongest primitive `SubtleCrypto` offers inside a
  Cloudflare Worker, at a cost the runtime can actually afford per request.
- **Session tokens are stored as SHA-256 hashes** — a database dump cannot be
  replayed to sign in as a user. Cookies are HttpOnly, SameSite=Lax, Secure in
  production.
- **Every query is scoped by `user_id`**, and trip ownership is re-checked
  server-side on every category and expense mutation.
- Login reports one message for both unknown-email and wrong-password, and
  runs a hash verification either way to avoid leaking which accounts exist.
- **Login lockout.** 10 consecutive failed attempts on an account lock it for
  15 minutes; the counter resets on the next successful sign-in.
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`,
  `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy`) are
  set on every response.

---

## Before you launch

- [ ] Fill in real operator details in [`src/lib/business.ts`](src/lib/business.ts)
      — the placeholders there deliberately are not a real business identity,
      and the Terms, Privacy Policy, legal index and Contact page all read
      from that one file.
- [ ] Get your own legal review of the Terms of Use and Privacy Policy before
      any public launch — the drafts here are a reasonable starting point,
      not legal advice.
- [ ] Set `NEXT_PUBLIC_APP_URL` to your live origin and redeploy.
- [ ] Confirm `/api/health` returns `status: ok`.
- [ ] Decide whether you want a paid tier, live FX rates, or email-based
      password reset — see "Deliberately not included" above.

---

## Project layout

```
src/
  app/
    page.tsx                  Marketing home page
    login/  signup/           Authentication
    legal/  terms/  privacy/  contact/
    app/                      Authenticated application
      page.tsx                Dashboard — every trip at a glance
      trips/new/               Create a trip
      trips/[id]/              Trip detail: categories, expenses, budget
      trips/[id]/edit/         Edit trip details
      settings/                Profile, home currency, password
    api/
      health/                  Deployment health check
  lib/
    currencies.ts  money.ts  dates.ts   Domain helpers
    categories.ts  photos.ts            Category icons, curated destination photos
    business.ts                        Operator identity for legal pages
    env.ts                             Lazy, Workers-safe environment access
    auth/                               PBKDF2 passwords, hashed sessions, route guards
    db/                                 Drizzle schema and Neon client
    data/queries.ts                    Trip, category and expense read queries
    actions/                           Server actions (auth, trips, categories, expenses, account)
  components/
    marketing/                         Site header/footer, feature icons, mock app preview
    app/                                Trip cards, category/expense rows, stat tiles
drizzle/                              Generated SQL migrations
setup/database-setup.sql              Same SQL, ready to paste into Neon's SQL Editor
scripts/migrate.ts                    Migration runner
tests/                                Password hashing, money and budget-math tests
```

---

## Disclaimer

Wayfarer is a travel record-keeping tool. It does not connect to bank
accounts, does not move money, and does not provide financial advice.
Exchange rate conversions are only as accurate as the rate entered by the
person logging the expense.
