# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**10,000hours.com** is a comprehensive 24-hour time tracking web application focused on helping users understand how they spend every hour of their day and track progress toward mastery goals using the 10,000-hour rule.

**Core Philosophy:**
- Time truth over focus hacks (ledger, not a pomodoro babysitter)
- 24-hour coverage (log everything, including sleep, eating, leisure)
- Notes-first approach (every time block can have a note)
- Mastery tracking (progress toward 10,000 quality-weighted hours)

## Development Commands

This is an **early-stage project** with documentation but minimal implementation. The project structure is being set up.

### Project Setup (Expected)
```bash
# Install dependencies (when package.json exists)
npm install
# or
pnpm install

# Run development server (Next.js)
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
# or
npx tsc --noEmit

# Linting
npm run lint

# Testing (when configured)
npm run test          # Unit tests with Vitest
npm run test:e2e      # E2E tests with Playwright
```

## Tech Stack

### Frontend
- **Framework:** Next.js 14+ (App Router) with React 18, TypeScript
- **Styling:** Tailwind CSS + Radix UI primitives (shadcn/ui components)
- **State Management:**
  - Server data: TanStack Query (React Query)
  - Ephemeral state: Zustand (timer state, UI toggles)
- **Forms:** react-hook-form + Zod validation
- **Date/Time:** Day.js or Luxon (timezone-aware)
- **Charts:** Apache ECharts or Recharts
- **Authentication:** Clerk React SDK

### Backend
- **Framework:** Next.js API routes (Edge for light endpoints, Node runtime for AI)
- **Database:** MongoDB Atlas
- **ORM:** Mongoose or official MongoDB Node driver
- **Validation:** Zod (shared schemas between client and server)
- **Authentication:** Clerk (JWT verification)
- **Background Jobs:** Vercel Cron or lightweight worker (Railway/Render)
- **AI Integration:** OpenAI API (GPT-4o mini) via Vercel AI SDK

### Infrastructure
- **Hosting:** Vercel
- **Database:** MongoDB Atlas
- **Caching:** Upstash Redis
- **Real-time:** Pusher Channels or Ably (WebSockets for timer sync)
- **Observability:** Sentry (errors), Logtail (logs), Highlight.io (session replay)

## Architecture

### Data Model (MongoDB Collections)

**users**
- `clerkId` (unique), email, name, timezone
- Settings: rounding, weekStart, aiEnabled, timeFormat

**categories**
- User-defined labels with color (from fixed palette), type (skill/life/admin/social/other)
- `countsTowardMastery` flag, `targetWeeklyHours`, optional `parentId` for grouping

**sessions** (time-series collection)
- Time blocks: `start`, `end`, `durationMin`, `categoryId`, `title`, `quality` (1-5)
- Tags, optional `noteId` reference
- Indexes: `{ userId: 1, start: 1 }`, `{ userId: 1, categoryId: 1, start: 1 }`

**notes**
- Free text linked to one or more sessions
- `sessionIds` array, full-text index on body
- Optional AI summary, sentiment, keywords

**summaries**
- Pre-computed day/week/month aggregates for fast insights
- `totalsByCategory`, `unassignedMin`, optional `aiSummary`
- Updated incrementally via background jobs when sessions change

### Key API Endpoints

```
POST   /api/session              Create running or fixed session
PATCH  /api/session/:id          Update/stop session, split
DELETE /api/session/:id          Delete session
GET    /api/sessions             Query sessions (date range, category filter)

POST   /api/category             Create category
GET    /api/categories           List user's categories
PATCH  /api/category/:id         Update category
DELETE /api/category/:id         Archive category

POST   /api/notes                Create note
GET    /api/notes                Search/filter notes
PATCH  /api/notes/:id            Update note

GET    /api/insights/summary     Aggregated time data
GET    /api/insights/mastery     10k-hour progress for category

POST   /api/ai/summarize         Generate summaries for notes/days
POST   /api/ai/insights          Weekly insights

GET    /api/export/csv           Export sessions as CSV
GET    /api/export/json          Export all user data
```

### Application Routes

```
/                   Landing page
/app                Authenticated shell
/app/now            Timer / Quick Log
/app/timeline       Day and Week views
/app/insights       Analytics dashboard
/app/notes          Notes list + editor
/app/categories     Manage categories
/app/settings       Profile, preferences, data export
```

### Analytics Architecture (Mongo-Only)

- **Time-series collection** for sessions with automatic bucketing
- **Materialized summaries** (day/week/month) updated incrementally via Change Streams or cron
- **Aggregation pipelines** for all charts (stacked bars, heatmaps, rolling averages)
- **Quality-weighted hours** for mastery tracking: `duration * (quality / 5)`
- Store `durationMin` at write time; all dates in UTC, render in user timezone

### State Management Patterns

- **Server data:** React Query for sessions, categories, insights (with optimistic updates)
- **Timer state:** Zustand + localStorage for persistence across refreshes
- **Offline support:** IndexedDB caches last 30 days; sync queue with `clientGeneratedId`
- **Autosave:** Notes and running logs autosave every 5 seconds

## Design System

### Colors (Dark Theme Only)

**Backgrounds:**
- `#0B0D10` base
- `#111418` surface
- `#151A1F` elevated

**Text:**
- `#E9EDF1` primary
- `#B2BCC9` secondary
- `#6B7684` muted

**Borders:** `#1D232B` (1px hairlines)

**CTA:** `#F11D75` pink (primary buttons only)

**Category Accent Pool (8 flat colors):**
- Pink `#F11D75`, Teal `#16C7A8`, Blue `#3A8DFF`, Violet `#8B5CF6`
- Lime `#45E06F`, Amber `#FFB020`, Red `#FF5C5C`, Cyan `#22D3EE`

### Visual Rules

- **Flat only:** No gradients, no glassmorphism, no neumorphism
- **Motion:** 150-200ms transitions; respect `prefers-reduced-motion`
- **Typography:** Inter (weights: 400, 500, 600); scale: 32/24/20/16/14/12
- **Spacing:** 8px grid; common paddings: 12, 16, 20, 24
- **Radius:** 10px for components, 16px for chips, 999px for pills
- **Contrast:** WCAG AA minimum (4.5:1 for normal text)

### Chart Guidelines

- Use flat fills only (no drop shadows or gradients)
- Category colors must be stable across all visualizations
- ECharts or Recharts with custom color tokens
- Provide data tables as alternative for accessibility
- Add patterns/stripes for color-blind users

## Development Guidelines

### Code Style & Patterns

- **TypeScript throughout** - all files `.ts` or `.tsx`
- **Shared validation** - Zod schemas used on both client and server
- **Row-level security** - every query scoped by `userId`
- **Timezone handling** - store UTC, render in user timezone using Day.js/Luxon
- **Error handling** - never lose running timer data; autosave + localStorage backup

### Component Structure

Key reusable components to build:
- `CategoryChip` - color dot + name (used everywhere)
- `CategoryPickerModal` - grid of 8 accent colors
- `TimerDial` - canvas/SVG dial with numeric fallback for accessibility
- `TimeBlock` - draggable/resizable session rectangle in timeline
- `TimelineGrid` - 24-hour day or 7-day week view
- `SessionEditorSheet` - side panel for editing sessions
- `NoteComposer` + `NoteCard` - note creation and display
- `InsightCard`, `StackedBarChart`, `RadialProgress` - analytics visualizations
- `AIInsightTile` - auto-generated insight cards

### Data Flow Patterns

**Creating a session:**
1. User starts timer or manually adds block
2. POST to `/api/session` with `start`, optional `end`, `categoryId`, `title`
3. Background job updates summaries for affected day/week
4. React Query invalidates relevant queries
5. UI updates optimistically

**Editing timeline:**
1. Drag to resize or move block
2. Optimistic update in UI
3. PATCH to `/api/session/:id` with new times
4. Validate no overlaps; if conflict, show resolution UI
5. Background job recomputes summaries

**Mastery calculation:**
1. Query sessions for category where `countsTowardMastery = true`
2. Sum quality-weighted minutes: `Σ(duration * quality/5)`
3. Progress = `totalHours / 10,000`
4. Pace = 8-week rolling average using `$setWindowFields`
5. Projection = `remainingHours / (avgWeeklyHours / 52)`

### Testing Strategy

- **Unit tests (Vitest):** Mastery math, pace calculations, overlap detection
- **Component tests:** Storybook + Testing Library for UI states
- **E2E tests (Playwright):** Timer flow, timeline editing, insights filters, notes autosave
- **Performance:** Lighthouse CI with budgets (FCP ≤ 1.5s, JS < 250kb)

### Performance Requirements

- **First Contentful Paint:** ≤ 1.5s on mid-range phone
- **Time to Interactive:** ≤ 3.0s
- **JavaScript Bundle:** < 250kb initial load (code-split charts)
- **Optimization:** Lazy load charts/timeline, virtualize long lists, cache with React Query

### Security & Privacy

- **Authentication:** Clerk handles OAuth and email/password; JWTs verified on all API requests
- **Authorization:** Row-level security - all queries filtered by `userId`
- **Data privacy:** Encryption at rest (Atlas), TLS in transit, no data selling
- **AI transparency:** Users can disable AI features; clear disclosure of what data is sent
- **GDPR-friendly:** Export and delete account flows easily accessible

## Microcopy Guidelines

- **Timer activity input:** "what are you doing?"
- **Note placeholder:** "what happened? any highlights or blockers?"
- **Stop timer quality prompt:** "how'd it go?" (1-5 stars)
- **Quality note prompt:** "add a quick note so future-you learns faster."
- **Insights header:** "truth over vibes. here's where your week actually went."
- **Mastery pacing:** "at your current pace (14.2h/week) you'll hit coding mastery nov 2030. +4.3h/week pulls it into jul 2029."
- **Notes empty state:** "write it down while it's fresh. what worked? what hurt?"
- **Timeline empty (day):** "no logs yet. drag anywhere to add a block or press S to start a timer."
- **Categories tip:** "pick colors that read well on dark. you can change anytime."

Keep copy short, sentence-case, friendly. No exclamation marks in system UI.

## Project-Specific Context

### Terminology

- **Session/Log** - contiguous time block (not "task" or "event")
- **Category** - user-defined label with color (not "project" or "tag")
- **Quality** - 1-5 rating for session effectiveness
- **Mastery** - categories flagged for 10,000-hour tracking
- **Unassigned time** - gaps in 24-hour coverage

### Edge Cases

- **Overlapping sessions:** Prevent on create; if importing, flag for resolution
- **Zero/negative duration:** Block with validation error
- **DST/timezone shifts:** Store UTC, display in user timezone with proper DST handling
- **Running timer on multiple devices:** WebSockets ensure single active timer per user
- **Offline logging:** Queue in IndexedDB with `clientGeneratedId`; sync idempotently on reconnect
- **Very long sessions:** Warn if session exceeds 12 hours (likely an error)

### Keyboard Shortcuts

- `S` - start/stop timer
- `P` - pause/resume
- `N` - add note
- `[` / `]` - adjust time by 1 minute
- `⌘K` - quick add (global)

All interactions must be fully keyboard-accessible.

## Development Milestones

### Milestone 1 - Core Logging (Weeks 1-2)
Auth + categories CRUD + timer + manual entry + day timeline + basic insights + CSV export

### Milestone 2 - Notes + AI (Weeks 3-4)
Notes system + quality ratings + AI summaries + mastery tracking + keyboard shortcuts + tags

### Milestone 3 - Polish (Weeks 5-6)
Week view + advanced charts (heat map, radial rings, sparklines) + unassigned time prompts + import + onboarding

### Milestone 4 - Hardening (Ongoing)
Tests + accessibility audit + error telemetry + cron reliability + performance monitoring + security audit

## Important Constraints

- **Free forever:** No paywalls or paid tiers in V1
- **Dark theme only:** No light theme in V1
- **Responsive web:** No native mobile apps in V1
- **Single user:** No team/collaborative features in V1
- **Privacy-first:** AI is optional and transparent; user data never sold

## Key Documentation Files

- `/docs/PRD.md` - Complete product requirements (1,350 lines)
- `/docs/tech-stack-overview.md` - Detailed technical architecture
- `/docs/app-flow.md` - User journeys, screens, states, and data contracts
- `/docs/ui-guidelines.md` - Complete design system and component specs
- `/docs/plan.md` - Core principles, data model, and roadmap summary

When making changes, ensure consistency with the product philosophy: this app reveals time truth without judgment, embraces 24-hour tracking (not just "productive" time), and helps users progress toward mastery goals through awareness and reflection.
