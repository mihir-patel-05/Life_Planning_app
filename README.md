# Arc — Life Planner

A web app for mapping the long arc of your life: career, education, relationships,
travel, and the rest. Milestones live on a horizontal timeline, fork into what-if
branches, and reconverge as you decide. A separate bucket list captures the
things you want before the credits roll.

The visual language is the **Arc** design — deep navy + warm gold, Geist sans
and Geist Mono, a quiet journal-feeling canvas.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** + design tokens defined in `app/globals.css`
- **Supabase** Postgres + Auth (email/password + Google OAuth)
- **Drizzle ORM** with hand-written RLS policies (see `drizzle/0000_init.sql`)
- **React 19** with `useActionState` for form server actions
- **Zustand**, **TanStack Query**, **React Hook Form** + **Zod** wired in
  package.json for the next iteration

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in your Supabase + DB credentials
pnpm dev
```

Open <http://localhost:3000>. The landing page redirects signed-in users to the
dashboard, where the **Career & life** card opens the Arc timeline with seed
data (the design’s default plan).

### Supabase setup

1. Create a Supabase project at <https://supabase.com>.
2. From **Project settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `Project API keys → anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. From **Project settings → Database → Connection string**, copy the **Session
   pooler** URI → `DATABASE_URL`. (For migrations only; the app itself talks to
   Supabase via the JS SDK using the anon key + RLS.)
4. Run the schema migration once. Either:
   - Paste `drizzle/0000_init.sql` into the Supabase SQL editor and run it, or
   - `pnpm db:push` after wiring `drizzle-kit` to your remote DB.
5. Enable Google OAuth in **Authentication → Providers**, set the callback URL
   to `${SITE_URL}/auth/callback`.

### What's wired vs. what's stubbed

This is the **Phase 1** ("Foundation") deliverable from the PRD:

| Wired                                                    | Stubbed for next phase                            |
| -------------------------------------------------------- | ------------------------------------------------- |
| Next.js scaffold, design tokens, Geist fonts             | Plan CRUD via Drizzle (the dashboard is a shell)  |
| Supabase server/browser/middleware clients               | Persisting milestones, dependencies, bucket items |
| Auth: signup, login, Google OAuth, sign-out, callback    | Plan settings page                                |
| Protected-route middleware                               | Filtering / search                                |
| Drizzle schema + RLS migration                           | Mobile responsive polish                          |
| Full Arc UI (timeline, bucket, modals, onboarding) using seed data |                                          |

## Structure

```
app/
  (auth)/login, (auth)/signup        — auth pages, share /(auth)/layout
  (app)/dashboard                    — list of plans
  (app)/plans/[id]                   — Arc timeline + bucket + modals
  (app)/account                      — profile, sign out
  auth/callback/route.ts             — OAuth code exchange
  page.tsx                           — landing (redirects signed-in users)
  layout.tsx, globals.css            — root shell + design tokens
components/
  arc/                               — Arc design components (translated from
                                       the prototype in 1:1 fidelity)
  auth/                              — auth form + Google button
lib/
  actions/auth.ts                    — server actions: login/signup/oauth/logout
  db/schema.ts, db/index.ts          — Drizzle schema + client
  supabase/{client,server,middleware} — three Supabase clients per @supabase/ssr
  validation/                        — Zod schemas
middleware.ts                        — refreshes session + protects routes
drizzle/0000_init.sql                — schema + RLS policies
```

## Scripts

- `pnpm dev` — Next.js dev server
- `pnpm build` — production build
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm db:generate` — drizzle-kit migration generation
- `pnpm db:push` — push schema to DB
- `pnpm db:studio` — drizzle-kit studio
