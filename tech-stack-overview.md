# Tenthousandhours Tech Stack Overview

This document outlines the proposed technology stack for building **tenthousandhours**, a dark-mode-first time logging and mastery tracking application. The stack is designed to support the product principles in `plan.md`, emphasizing accurate time tracking, rich note taking, AI-assisted insights, and responsive performance across desktop and mobile.

## Architecture Summary

| Layer | Technology | Rationale |
| --- | --- | --- |
| Client | Next.js (App Router) + React 18 + TypeScript | Modern SSR/ISR support, responsive routing, excellent DX, tight integration with Vercel, and rich component ecosystem. |
| Styling | Tailwind CSS + Radix UI primitives | Enables rapid iteration on the flat, dark UI palette described in the plan while maintaining accessibility and consistent spacing/typography tokens. |
| State & Data Fetching | React Query + Zustand | React Query handles server data caching/invalidation; Zustand manages lightweight local state (timer status, dialogs) without the verbosity of Redux. |
| Real-time Timer Sync | WebSockets via Pusher Channels (or Ably) | Ensures single active timer per user across devices and instant updates on session changes. |
| Backend API | Next.js Route Handlers + tRPC | Allows colocated type-safe APIs, enabling both server actions and statically typed client hooks. |
| Persistent Storage | MongoDB Atlas (Document DB) | Aligns with plan’s mention of Atlas, supports flexible schemas for time blocks, notes, and category metadata. |
| Analytics Engine | MongoDB Atlas Time Series + Aggregation Pipelines | Keeps analytics unified in MongoDB with time-series collections and $match/$group/$setWindowFields pipelines tailored to per-user rollups. |
| Authentication | Clerk | Satisfies plan’s requirement for Clerk JWT-based auth with minimal setup and excellent multi-device support. |
| Edge Caching | Vercel Edge & Redis (Upstash) | Caches read-heavy timelines/insights and provides queueing for AI summarization tasks. |
| AI & ML | OpenAI GPT-4o mini via Vercel AI SDK | Powers note summarization and pacing insights with streaming responses. |
| Background Jobs | Vercel Cron + Inngest Workers | Schedules weekly summaries, AI batch processing, and data hygiene jobs with idempotent retries. |
| Telemetry | Sentry (errors), Logtail (logs), Highlight.io (session replay) | Full observability for Milestone 4 hardening. |

## Frontend Stack Details

### Framework & Routing
- **Next.js 14 App Router** for hybrid rendering: Server Components for data-heavy insights pages, Client Components for interactive timeline and timer UI.
- **Vercel deployment** to leverage automatic ISR for public brag cards (a nice-to-have) and fast edge delivery.

### UI System
- **Tailwind CSS** configured with the palette from the plan (background, surface, elevated, accent tokens) and typography scale with Inter/Söhne.
- **Radix UI primitives** supply accessible base components (Dialogs, Popovers, Menus) aligning with the plan’s modal and dropdown interactions.
- **Framer Motion** or native CSS transitions for 150–200ms animations per the motion guidelines; keep dependencies light to stay under the 250kb JS budget.

### State Management
- **React Query** for fetching timeline blocks, insights, categories with optimistic updates for drag-resize interactions.
- **Zustand** for view-level state (active tab, keyboard shortcut modals). Persist timer state in localStorage to survive reloads and handle offline logging.
- **Immer** to simplify immutable updates on complex nested state (calendar blocks).

### Accessibility & Internationalization
- WCAG AA contrast checked for the dark palette.
- Next-intl for localization-ready copy; key strings (“what are you doing?”, etc.) live in JSON resource files.
- Keyboard shortcuts implemented via `@react-aria/interactions` ensuring screen reader compatibility.

## Backend & API Layer

### API Design
- **tRPC routers** colocated with Next.js route handlers for type-safe procedures: `timer`, `timeline`, `notes`, `insights`, `categories`, `profile`.
- **Rate limiting** using Upstash Redis to protect AI endpoints and exports.
- **Row-level security** enforced by validating Clerk-issued JWTs and scoping queries by `userId`.

### Business Logic Modules
- **Timer Service** ensures only one active session; uses MongoDB transactions to close an active block before opening a new one.
- **Insight Service** runs MongoDB aggregation pipelines over time-series collections, producing per-user rollups (stacked bars, radial mastery rings, heat maps) without duplicating data in a separate warehouse.
- **Notes Service** handles autosave via IndexedDB sync, merges offline drafts with server data using CRDT-like version vectors.

### Background Processing
- **Inngest** orchestrates:
  - Daily/weekly AI summaries (per Milestone 2).
  - Pace calculations and 8-week rolling averages (Mastery Math).
  - CSV export generation and email delivery.
- **Vercel Cron** triggers nightly data hygiene (resolve overlaps, recompute projections) and sends notifications.

## Data Layer

### MongoDB Atlas
Collections:
- `users`: Clerk `userId`, profile, settings, mastery targets.
- `categories`: color tokens, grouping, `countsTowardMastery` flag.
- `sessions`: start/end, category, quality rating, notes reference, tags, `clientGeneratedId` for offline sync.
- `notes`: rich text, linked session IDs, AI summaries, tags.
- `insight_snapshots`: cached aggregates to keep dashboards snappy when offline.

Indexes prioritize 24h coverage queries (e.g., `sessions` compound index on `userId + day`), and TTL indices clean up stale offline drafts.

### Mongo-Only Analytics Plan

The analytics architecture uses MongoDB exclusively, leveraging time-series collections, materialized summaries, and aggregation pipelines to power all dashboards and insights without requiring a separate data warehouse.

#### 1. Time-Series Collection for Sessions

Sessions are stored in a time-series collection for efficient range queries and automatic bucketing:

```javascript
// create as time-series for efficient range queries
db.createCollection("sessions", {
  timeseries: {
    timeField: "start",
    metaField: "meta",
    granularity: "minutes"
  }
})
```

**Document shape:**
```javascript
{
  userId,                       // duplicate in meta for efficient filtering
  categoryId,
  title,                        // "website fix"
  start, end,                   // ISODate
  durationMin,                  // store computed minutes
  quality,                      // 1..5 (optional)
  tags: ["coding","web"],
  meta: { userId, categoryId }, // time-series meta
  createdAt, updatedAt
}
```

**Indexes (besides TS bucketing):**
```javascript
db.sessions.createIndex({ userId: 1, start: 1 })
db.sessions.createIndex({ userId: 1, categoryId: 1, start: 1 })
```

#### 2. Materialized Summaries (Cheap, Fast Dashboards)

Keep raw events and small rollup collections you refresh incrementally:
- `summaries_day`: one doc per user per day with totalsByCategory, unassignedMin, qualityStats…
- `summaries_week`, `summaries_month`: same idea.

**Incremental update flow:**

On insert/update/delete to sessions, a Change Stream or scheduled cron runs an aggregation for the affected day/week and writes back with `$merge`. This keeps dashboards snappy without full scans.

```javascript
// recompute a single day for a user
db.sessions.aggregate([
  {$match: { userId, start: { $gte: dayStart, $lt: dayEnd } }},
  {$group: {
    _id: "$categoryId",
    minutes: { $sum: "$durationMin" },
    qSum:    { $sum: { $multiply: ["$durationMin", "$quality"] } },
    qCount:  { $sum: { $cond: [{$ifNull:["$quality",false]}, 1, 0] } }
  }},
  {$project: { categoryId: "$_id", minutes: 1, avgQuality: {
    $cond: [{$gt:["$qCount",0]}, {$divide:["$qSum","$qCount"]}, null]
  }}},
  {$group: {
    _id: null,
    byCategory: { $push: { k: {$toString:"$categoryId"}, v: "$minutes" } },
    total: { $sum: "$minutes" }
  }},
  {$project: {
    _id: 0,
    userId,
    day: dayStart,
    totalsByCategory: { $arrayToObject: "$byCategory" },
    totalMinutes: "$total",
    unassignedMin: { $max: [0, 1440 - "$total"] }
  }},
  {$merge: { into: "summaries_day", on: ["userId", "day"], whenMatched:"replace", whenNotMatched:"insert" }}
])
```

#### 3. Queries That Power Your Charts

**Stacked bar: minutes by category per day (range)**
```javascript
db.sessions.aggregate([
  {$match:{ userId, start:{ $gte: from, $lt: to }}},
  {$project:{
    categoryId:1,
    minutes:"$durationMin",
    day:{ $dateTrunc:{ date:"$start", unit:"day", timezone: tz }}
  }},
  {$group:{ _id:{day:"$day", cat:"$categoryId"}, minutes:{ $sum:"$minutes" }}},
  {$group:{
    _id:"$_id.day",
    pairs:{ $push:{ k:{ $toString:"$_id.cat" }, v:"$minutes" } }
  }},
  {$project:{ day:"$_id", byCategory:{ $arrayToObject:"$pairs" }, _id:0 }},
  {$sort:{ day:1 }}
])
```

**Heatmap: minutes by hour-of-day × category**
```javascript
db.sessions.aggregate([
  {$match:{ userId, start:{ $gte: from, $lt: to }}},
  {$project:{
    categoryId:1,
    minutes:"$durationMin",
    hod:{ $hour: { date:"$start", timezone: tz } }
  }},
  {$group:{ _id:{ h:"$hod", cat:"$categoryId" }, minutes:{ $sum:"$minutes" }}},
  {$project:{ hour:"$_id.h", categoryId:"$_id.cat", minutes:1, _id:0 }},
  {$sort:{ hour:1 }}
])
```

**Rolling average (8-week pace) with window functions**
```javascript
db.summaries_week.aggregate([
  {$match:{ userId, categoryId }},
  {$set:{ weekStart:{ $dateTrunc: { date:"$weekStart", unit:"week", timezone: tz }}}},
  {$setWindowFields:{
    sortBy:{ weekStart:1 },
    output:{
      rollingAvgMin:{ $avg:"$minutes", window:{ range:[-7,0], unit:"week" } }
    }
  }},
  {$project:{ weekStart:1, rollingAvgHours:{ $divide:["$rollingAvgMin",60] } }}
])
```

**10,000-hour progress (quality-weighted)**
```javascript
db.sessions.aggregate([
  {$match:{ userId, categoryId }},
  {$project:{ qmins:{ $multiply:["$durationMin", { $divide:["$quality",5] }] }}},
  {$group:{ _id:null, totalQMin:{ $sum:"$qmins" }}},
  {$project:{ hoursToDate:{ $divide:["$totalQMin",60] } }}
])
```

#### 4. Atlas Extras You Can Use (Optional)

- **Atlas SQL**: run SQL over your Mongo data for Tableau/BI without moving it.
- **Data Federation / Data Lake**: query cold historical data in S3 + live Atlas in one shot.
- **Atlas Triggers**: serverless change-stream jobs if you don't want your own worker.

#### Schema Tips That Make Analytics Painless

- Store `durationMin` at write time (don't recompute on every read).
- Keep a `meta` object for time-series with userId/categoryId duplicated.
- UTC in storage, render in timezone with `$dateTrunc` using timezone.
- Don't over-normalize; small duplications (category name/color) in summaries save joins.
- Cap your chart windows (e.g., 180 days) and lazy-load longer ranges.
- Precompute `unassignedMin` in daily summaries so the "truth gaps" are instant.

#### Mongo or Postgres?

**Mongo-only** (recommended): Least friction, perfect for time-block logs + rollups, rich aggregations, easy real-time updates with change streams. Do this now.

**Postgres instead of Mongo**: Also viable, but you'll end up building very similar summaries and window queries; you lose native time-series bucketing and document flexibility you liked.

**Two databases**: Save this for later, if you prove you need heavy columnar analytics or broad SQL BI for teams.

#### Quick Next Steps

1. Create `sessions` as time-series; write with `durationMin`.
2. Build `summaries_day`/`week`/`month` + a tiny worker to recompute affected windows on changes.
3. Wire the charts to summaries first; fall back to on-the-fly aggs for ad-hoc ranges.
4. Add a single "pace to 10k" endpoint that reads rolling averages from summaries.

Stay with Mongo, ship faster, and keep life un-messy. If you ever outgrow it, bolt on a read-only warehouse later without rewriting your app.

### Offline Support
- IndexedDB (via `idb-keyval`) caches the last 30 days of sessions and category metadata, satisfying the plan’s offline logging requirement. Sync workers reconcile pending changes when connectivity returns.

## Integrations

- **Clerk**: Handles email/password, OAuth, and session management. JWT is verified in middleware for all API requests.
- **OpenAI**: Provides AI-generated notes summaries, weekly insights (“you spent 12h…”), and pace guidance with deterministic prompts.
- **ECharts or Recharts**: Component library for charts. For the dark theme, use custom color tokens and disable gradients.
- **Resend** or **Postmark**: Transactional email for exports and weekly reports.
- **Stripe (future)**: Enable subscriptions for pro features post-v1.

## Infrastructure & DevOps

- **Vercel** hosts the frontend and serverless APIs. Edge Functions used for latency-sensitive endpoints (timer start/stop).
- **GitHub Actions** for CI: lint (ESLint), type check (tsc), tests (Vitest + Playwright), bundle size checks (<250kb goal).
- **Docker** used for local development to spin up MongoDB and Redis.
- **Terraform** manages external resources (Atlas clusters, Redis) with environment-specific workspaces.

## Observability & Reliability

- **Sentry** captures frontend and backend exceptions with release tracking.
- **Logtail** centralizes structured logs from serverless functions.
- **Highlight.io** records anonymized session replays to debug UX issues (with user consent).
- **Datadog RUM** optional for performance budgets (FCP ≤ 1.5s).

## Security & Compliance

- All API routes enforce Clerk authentication and authorize by `userId`.
- Data encrypted at rest in Atlas, TLS everywhere; secrets managed via Vercel environment variables.
- Implement audit logging for exports/deletes, satisfying privacy requirements.
- Provide GDPR-compliant data export and deletion flows surfaced in profile/settings per plan.

## Testing Strategy

- **Unit Tests**: Vitest for pure logic (mastery math, pace calculations, overlap detection).
- **Component Tests**: Storybook + Testing Library to validate UI states (timer controls, timeline drag-drop).
- **E2E Tests**: Playwright covering timer flow, timeline adjustments, insights filters, notes autosave.
- **Performance Testing**: Lighthouse CI ensures dark theme stays performant, with budgets aligned to plan.
- **Chaos/Resilience**: Simulate offline mode, network latency, and clock skew to harden timer reliability.

## Roadmap Alignment

- **Milestone 1** focuses on implementing core logging with Clerk auth, MongoDB sessions, timeline UI, and basic insights using server-side aggregates.
- **Milestone 2** layers notes, AI summarization via OpenAI, quality ratings, and pace calculations stored in analytics store.
- **Milestone 3** introduces advanced visualizations (heat maps via ECharts, radial mastery rings), unassigned time prompts, and import tooling (serverless CSV parsers).
- **Milestone 4** expands test coverage, observability, and reliability tooling, ensuring the stack can scale and handle edge cases like DST and offline sync.

## Future Enhancements

- **Background Timer Notifications**: Integrate Push API and Service Workers to deliver PWA background timers.
- **Public Brag Cards**: Static OG image generation via @vercel/og, cached on edge.
- **Open API**: Publish tRPC procedures via OpenAPI bridge for power-user integrations.
- **Friend View**: Implement shareable read-only insights with signed tokens and row-level permission checks.

This stack ensures the product can deliver precise time tracking, rich insights, and AI-powered summaries while adhering to the performance, visual, and reliability standards outlined in the plan.
