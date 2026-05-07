# Life Planner — Product Requirements Document

## 1. Overview

A personal life-planning web app that lets a user map out long-term life trajectories (5–10+ years) as a connected graph of milestones. Each milestone is an event, decision, or goal (e.g., "Take LSAT," "Apply to law schools," "Start TechCongress fellowship") with a target date, status, and optional dependencies on other milestones.

The app should support two primary views of the same underlying data:
1. **Graph view** — milestones as nodes, dependencies as directed edges (default view).
2. **Timeline view** — milestones plotted horizontally on a time axis (Gantt-style).

This is initially a single-user app. Auth is in scope so that the app can be deployed publicly and used from any device, but multi-user collaboration features (sharing plans, commenting, etc.) are explicitly out of scope for v1.

## 2. Goals & Non-Goals

### Goals
- Let a user create multiple "plans" (e.g., "Career," "Education," "Personal").
- Within a plan, create, edit, and delete milestones with rich metadata.
- Visualize milestones as a dependency graph and as a horizontal timeline.
- Persist all data to a Postgres database with row-level security.
- Deploy to Vercel with zero manual infra setup.

### Non-Goals (v1)
- Sharing plans with other users.
- Real-time collaboration.
- Mobile-native apps (web responsive is enough).
- AI-generated planning suggestions (may be a v2 feature).
- Calendar integration / external calendar sync.
- Notifications / email reminders.

## 3. Target User

A single technical user (the developer) who wants to plan long-term life trajectories combining career, education, and personal goals. Comfortable with web apps, expects a clean modern UI, and will use the app on both desktop and mobile.

## 4. Tech Stack

### Frontend
- **Next.js 15** with App Router and TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** for base components (buttons, dialogs, forms, dropdowns)
- **React Flow** (`@xyflow/react`) for the graph view
- **vis-timeline** (or equivalent) for the timeline view
- **Zustand** for client-side UI state (selected node, view mode, filters)
- **TanStack Query** (`@tanstack/react-query`) for server state and caching
- **React Hook Form** + **Zod** for forms and validation

### Backend
- **Next.js Server Actions** for mutations (create/update/delete)
- **Next.js API Routes** for any non-mutation endpoints if needed
- **Drizzle ORM** for database access
- **Zod** for input validation on all server actions

### Database & Auth
- **PostgreSQL** hosted on **Supabase**
- **Supabase Auth** for authentication (email/password + Google OAuth)
- Row-level security (RLS) policies enforced at the database level so a user can only access their own data

### Hosting
- **Vercel** for the Next.js app
- **Supabase** for database, auth, and (if needed) file storage

### Tooling
- **pnpm** as the package manager
- **ESLint** + **Prettier**
- **GitHub** + **GitHub Actions** for CI (typecheck, lint, build on PRs)
- **Vitest** for unit tests on utility functions
- **Sentry** (optional, can be added later)

## 5. Data Model

### Tables

**`users`** — managed by Supabase Auth, referenced by `auth.users.id`.

**`plans`**
- `id` (uuid, PK)
- `user_id` (uuid, FK → `auth.users.id`, not null)
- `title` (text, not null)
- `description` (text, nullable)
- `color` (text, nullable) — hex color for UI theming
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

**`milestones`**
- `id` (uuid, PK)
- `plan_id` (uuid, FK → `plans.id`, on delete cascade, not null)
- `user_id` (uuid, FK → `auth.users.id`, not null) — denormalized for RLS
- `title` (text, not null)
- `description` (text, nullable)
- `target_date` (date, nullable) — when this milestone is targeted
- `completed_date` (date, nullable) — when actually completed
- `status` (enum: `not_started`, `in_progress`, `completed`, `blocked`, `abandoned`)
- `category` (text, nullable) — free-text tag like "career", "education"
- `position_x` (float, nullable) — saved position in the graph view
- `position_y` (float, nullable)
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

**`dependencies`**
- `id` (uuid, PK)
- `from_milestone_id` (uuid, FK → `milestones.id`, on delete cascade, not null)
- `to_milestone_id` (uuid, FK → `milestones.id`, on delete cascade, not null)
- `user_id` (uuid, FK → `auth.users.id`, not null) — denormalized for RLS
- `created_at` (timestamptz, default now())
- Unique constraint on (`from_milestone_id`, `to_milestone_id`)
- Check constraint: `from_milestone_id != to_milestone_id`

### Row-Level Security
Every table must have RLS enabled with policies restricting `SELECT`, `INSERT`, `UPDATE`, `DELETE` to rows where `user_id = auth.uid()`.

## 6. Routes & Pages

| Route | Purpose |
|---|---|
| `/` | Landing page if logged out; redirect to `/dashboard` if logged in |
| `/login` | Email/password + Google OAuth sign-in |
| `/signup` | Sign-up form |
| `/dashboard` | List of all plans, with create-plan button |
| `/plans/[id]` | Plan detail page with graph/timeline view toggle |
| `/plans/[id]/settings` | Rename, change color, delete plan |
| `/account` | User profile, sign out |

## 7. Core User Flows

### 7.1 Create a plan
User clicks "New Plan" on the dashboard, enters a title and optional description and color, submits, and is redirected to the new plan's detail page.

### 7.2 Add a milestone
On the plan detail page, user clicks "Add Milestone" (or double-clicks the canvas in graph view). A dialog opens with fields for title, description, target date, status, and category. On save, the milestone appears as a node in the graph and a bar in the timeline.

### 7.3 Connect milestones (dependency)
In graph view, user drags from the edge of one milestone node to another. A directed edge is created representing "milestone A must complete before milestone B." The system should prevent circular dependencies.

### 7.4 Edit a milestone
User clicks a milestone node (graph) or bar (timeline). A side panel opens showing all fields, editable inline. Changes save on blur or via a Save button.

### 7.5 Switch views
A toggle at the top of the plan page switches between Graph and Timeline view. Both views show the same data; selection state is preserved across views when possible.

### 7.6 Delete a milestone
From the side panel, user can delete a milestone. Confirmation required. All connected dependencies are also deleted (cascade).

## 8. UI / UX Requirements

- **Design system:** clean, minimal, modern. Use shadcn/ui defaults with light and dark mode support.
- **Graph view:**
  - Pan and zoom with mouse / trackpad
  - Nodes are rounded rectangles showing title, target date, and a status indicator (color-coded)
  - Edges are directed arrows
  - Auto-layout option (use `dagre` or React Flow's built-in) for first-time arrangement; user can then drag nodes freely and positions are persisted
  - Mini-map in corner
- **Timeline view:**
  - Horizontal time axis with adjustable zoom (months / quarters / years)
  - Milestones rendered as bars or points based on duration
  - Group rows by category if categories are present
- **Status colors:**
  - `not_started` — gray
  - `in_progress` — blue
  - `completed` — green
  - `blocked` — red
  - `abandoned` — muted/strikethrough
- **Responsive:** must work on a phone screen, though the graph view can fall back to a simpler list/timeline on small viewports.

## 9. Non-Functional Requirements

- **Performance:** initial page load under 2s on a typical connection. Graph view should handle 200+ nodes without noticeable lag.
- **Security:** all DB access goes through RLS. No service-role keys in the client. Server actions validate all input with Zod.
- **Accessibility:** keyboard navigation for all interactive elements; semantic HTML; sufficient color contrast.
- **Type safety:** end-to-end TypeScript. Drizzle schema types reused on the frontend via shared types.

## 10. File / Folder Structure

```
/app
  /(auth)
    /login/page.tsx
    /signup/page.tsx
  /(app)
    /dashboard/page.tsx
    /plans/[id]/page.tsx
    /plans/[id]/settings/page.tsx
    /account/page.tsx
  /api
    (only if needed for non-mutation endpoints)
  layout.tsx
  page.tsx
/components
  /ui                  (shadcn components)
  /graph               (React Flow wrapper, custom nodes, edges)
  /timeline            (vis-timeline wrapper)
  /milestones          (milestone forms, side panel)
  /plans               (plan list, plan card)
/lib
  /db                  (Drizzle schema, client, queries)
  /auth                (Supabase client helpers)
  /validation          (Zod schemas)
  /actions             (server actions)
/hooks
/stores                (Zustand stores)
/types
```

## 11. MVP Phasing

Build in this order. Each phase should be functional and deployable before moving to the next.

### Phase 1 — Foundation
- Next.js 15 + TypeScript + Tailwind + shadcn/ui project scaffold
- Supabase project, schema migration via Drizzle, RLS policies
- Supabase Auth: email/password + Google OAuth
- Login, signup, sign-out, protected routes

### Phase 2 — Plans CRUD
- Dashboard listing all plans for the logged-in user
- Create / rename / delete plans
- Plan detail page (empty state)

### Phase 3 — Milestones CRUD (no graph yet)
- Add, edit, delete milestones in a simple list view on the plan page
- All milestone fields working with form validation

### Phase 4 — Graph view
- React Flow integration
- Custom milestone node component
- Drag-to-connect for dependencies
- Auto-layout for first arrangement
- Persist node positions
- Cycle detection on dependency creation

### Phase 5 — Timeline view
- vis-timeline integration
- View toggle on plan page
- Shared selection state

### Phase 6 — Polish
- Dark mode
- Responsive mobile layout
- Filtering / search within a plan
- Deploy to Vercel

## 12. Open Questions

- Should milestones support sub-milestones (parent/child hierarchy)? *Default: no for v1, can be added later by adding a `parent_id` to `milestones`.*
- Should the timeline view support drag-to-reschedule? *Default: read-only in v1, edit via side panel.*
- Should there be a "today" marker that shows what's currently in progress vs. overdue? *Yes, include in v1.*

## 13. Acceptance Criteria

The MVP is complete when:
- A new user can sign up, create a plan, add at least 10 milestones with dependencies, and see them rendered in both graph and timeline views.
- Refreshing the page preserves all data and node positions.
- Logging out and back in (or signing in from another device) shows the same data.
- Another user signing up sees an empty dashboard and cannot access the first user's data even by guessing URLs.
- The app is deployed to a Vercel URL and accessible publicly.
