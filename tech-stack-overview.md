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

### Analytics Store
- **MongoDB Time Series collections** (e.g., `session_metrics_daily`, `session_metrics_weekly`) store compressed buckets keyed by user and period, enabling efficient date-range queries.
- Aggregation pipelines ($match, $project, $dateTrunc, $group, $bucket, $facet, $setWindowFields) compute metrics such as pace-to-10k, rolling averages, and category heatmaps directly within MongoDB.
- Materialized summaries maintained via `$merge` targets (triggered by change streams or scheduled cron jobs) keep daily/weekly/monthly totals ready for dashboards while writes remain modest.

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
