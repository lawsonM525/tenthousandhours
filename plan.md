product principles

time truth > focus hacks. the app is a ledger for hours, not a pomodoro babysitter.

24h coverage. every minute of the day should either be logged or intentionally left unassigned.

categories are flexible. you create them, color them, group them, and choose which ones count toward “mastery.”

notes-first. every block of time can have a note; notes roll up into day/week summaries.

10,000-hour path. for any category flagged as a “skill,” show progress toward 10,000 quality hours and what pace gets you there.

information architecture (desktop → mobile responsive)

left sidebar (desktop) / bottom nav (mobile)

now (quick log / timer)

timeline (day & week calendar)

insights (analytics)

notes

categories

profile / settings

global actions: quick add (⌘K), search, export, theme toggle (dark only at v1), notifications.

color + type + visual language

backgrounds: #0B0D10 (base), #111418 (surface), #151A1F (elevated).

text: #E9EDF1 (primary), #B2BCC9 (secondary), #6B7684 (muted).

accents (flat, no gradient): a tight palette of vivid tokens used per-category.

pink #F11D75 • teal #16C7A8 • blue #3A8DFF • violet #8B5CF6 • lime #45E06F • amber #FFB020 • red #FF5C5C • cyan #22D3EE.

borders/shadows: 1px hairlines #1D232B, soft shadow only for modals.

type: Inter or Söhne; weight 500 for labels, 600 for section titles.

icon style: thin, rounded stroke; solid when active.

motion: snappy 150–200ms; ease-out for enter, ease-in for exit. no parallax, no glassmorphism, no gradient.

page-by-page: ui + copy + features
1) Now (quick log / timer)

top bar: category pill (color dot + name) ▸ dropdown; activity input; tags input (optional).

dial or time picker: 25:00 preset is allowed, but default to “start” with a running clock. plus/minus buttons adjust in 5-min increments. can also switch to manual start/end.

controls: Start / Pause / Stop; “add note” button; mute; break; overflow menu (split, duplicate, delete).

suggestions list: recent activities with their categories and last durations.

microcopy:

activity placeholder: “what are you doing?”

note placeholder: “what happened? any highlights or blockers?”

rules: only one running session at a time. stopping opens a mini-review: quality (1–5), optional note, tags.

keyboard: S start/stop, P pause, N note, [ ] tweak 1 min, ⌘K quick add.

2) Timeline (calendar)

views: day (24h column) and week (7 columns).

blocks: flat colored rectangles with readable white/near-white text, rounded 10px. sleep looks “pill-thick.”

interactions: drag to resize; drag to move; click to open side panel (edit category, title, note).

conflict resolution: overlaps show subtle outline; choose one to split or merge.

unassigned time: faint zebra stripes prompting “log this time.”

quick add: click on empty area → new block pre-filled with start/end.

3) Insights (analytics)

overview cards (top row):

this week total logged

avg / day

most time by category

hours unassigned

distribution charts (Apache ECharts or Recharts):

stacked bar per day (categories stacked; flat colors only).

radial progress per skill toward 10,000 (capped ring with hours + projected date).

day-part heat map (rows = categories, cols = hours).

streaks (days with ≥ X target hours for a skill).

ai insight tiles:

“you spent 12h (+30%) on coding vs. last week.”

“to hit 10k hours in ml engineering by 2028, average 18.5h/week (you’re at 14.2).”

filters: time range, categories (multi), skills-only toggle, include/exclude sleep & necessities.

4) Notes

composer: large textarea; attach to time block(s) or keep as free note.

auto-linker: if note written during a session, link automatically.

ai summary: summarize day/week notes into bullets; extract tasks & highlights.

search: full-text, tag filter, category filter.

list: chronological with category chips and duration totals on the right.

5) Categories

list: each row shows color dot, name, type badge, “counts toward mastery” toggle.

types: skill, life-maintenance (sleep/eat/errands), admin, social/spiritual, other.

color picker: fixed grid of accent tokens.

rollups (optional): group categories under a parent (e.g., “content” → script, film, edit).

defaults: target hours/week, quality reminder toggle.

copy: “pick colors that read well on dark. you can change anytime.”

6) Profile / Settings

account: clerk-managed; name, photo, email, timezone.

preferences: time rounding (1/5/15), week start day, targets, notifications.

data: csv/json export & import, delete account, backup snapshots.

ai: enable summaries, model provider key (optional), data usage disclosure.

integrations (v1 optional): google calendar import (read-only), apple/fitbit sleep csv import.

7) Landing / Onboarding

hero copy: “know where your time goes. master what matters.”

sub: “log your whole day, see the truth, and pace your path to 10,000 hours.”

cta: “start free” (it’s all free).

onboarding flow: pick 5 starter categories; flag which are skills; set weekly targets; choose colors; optional import.

data model (mongodb atlas)

Collections & key fields

users

_id, clerkId, email, name, tz, createdAt, settings (rounding, weekStart, aiEnabled…)

categories

_id, userId, name, color (token id), type (skill|life|admin|social|other), countsTowardMastery (bool), targetWeeklyHours (num), parentId?, createdAt, archived

index: { userId: 1, name: 1 }

sessions

_id, userId, categoryId, title (activity), start, end, durationMin, quality (1–5), tags [string], noteId?, createdAt, updatedAt

indexes: { userId: 1, start: 1 }, { userId: 1, categoryId: 1, start: 1 }

notes

_id, userId, sessionIds [ObjectId], body, createdAt, summary?, sentiment?, keywords?

index: full-text on body

summaries

_id, userId, granularity (day|week|month|year), startDate, endDate, totalsByCategory {categoryId: minutes}, unassignedMin, aiSummary?, milestones?

index: { userId: 1, startDate: 1, granularity: 1 }

targets (optional)

_id, userId, categoryId, goalType (weekly|total), valueMin

aggregation strategy

write sessions raw. upon create/update/delete, enqueue a job to update summaries for day/week/month that intersect the session. avoids heavy queries for insights.

backend architecture

framework: Next.js (App Router) with API routes (Edge for light endpoints; Node for AI calls).

db: MongoDB Atlas + Mongoose or the official Node driver.

auth: Clerk (<ClerkProvider/>, withAuth on API).

validation: Zod.

jobs: Vercel Cron or a lightweight worker (Railway/Render) to recompute aggregates + AI summaries nightly.

rate limits: per-user for AI endpoints.

testing: Vitest for logic, Playwright for E2E (create category, log session, view insights).

core endpoints

POST /api/session (create running or fixed)

PATCH /api/session/:id (stop, edit times, split)

DELETE /api/session/:id

GET /api/sessions?from&to&categoryId

POST /api/category | PATCH /:id | DELETE /:id

GET /api/insights/summary?granularity=week&from=...

POST /api/notes | GET /api/notes?query=

POST /api/ai/summary (summarize text or day)

GET /api/export.csv

frontend architecture

ui stack: React + Next.js, Tailwind + shadcn/ui (pruned, neutral styling), ECharts or Recharts for charts.

state: server data via TanStack Query; ephemeral timer state via Zustand.

forms: react-hook-form + zodResolver.

date/time: Day.js or Luxon (timezone-aware).

accessibility: WCAG AA contrast; focus rings; prefers-reduced-motion.

key components

CategoryChip, CategoryPickerModal (color grid)

TimerDial (Canvas/SVG; also numerical fallback)

TimeBlock and TimelineGrid

SessionEditorSheet (side panel)

NoteComposer + NoteCard

InsightCard, StackedBarChart, RadialProgress

AIInsightTile

EmptyState (per view)

ExportButton

copywriting (microcopy draft)

empty timeline (day):
“no logs yet. drag anywhere to add a block or press S to start a timer.”

stop timer dialog:
“how’d it go?” (⭐ 1–5) – “add a quick note so future-you learns faster.”

insights header:
“truth over vibes. here’s where your week actually went.”

10,000 hours module:
“at your current pace (14.2h/week) you’ll hit coding mastery nov 2030. +4.3h/week pulls it into jul 2029.”

notes empty:
“write it down while it’s fresh. what worked? what hurt?”

categories tip:
“toggle ‘counts toward mastery’ for skills you want to chase.”

ai features (privacy-respecting)

session note summarize: TL;DR plus action items.

daily brief: bullet summary of what you did + “tomorrow nudge” (optional notification).

weekly insight: anomalies, pace toward mastery per skill, time swings by category.

predictive pacing: given target mastery date for a skill, compute required weekly hours and show a simple progress plan.

auto-suggest category from text: lightweight classifier on your past data (client-side heuristic first; optional server model).

controls: clear switch to disable AI; display which text is sent; store summaries, not prompts, if disabled.

mastery math

each skill category accumulates qualityWeightedMinutes = duration * (quality/5) if enabled.

lifetime progress bar: total quality-weighted hours / 10,000.

pace calc: required weekly hours = remaining hours / weeks until target date.

show projected mastery date at current 8-week rolling average.

edge cases & data rules

overlaps: prevent on create; if importing, allow but flag and prompt to resolve.

zero/negative duration: block with friendly error.

dst/timezone shifts: store UTC, render in local tz.

unsaved typing: autosave notes every 5s.

offline: log to IndexedDB; sync when online (idempotent via clientGeneratedId).

rounding: display rounded; store exact minutes.

security & privacy

auth via Clerk (jwt → userId).

row-level security by userId on every query.

encryption at rest (Atlas) + TLS in transit.

export/delete account paths visible and simple.

performance budget

fcp ≤ 1.5s on mid phone; js < 250kb for first load (code-split charts, lazy load timeline).

charts: only render visible range; virtualize long notes lists.

launch plan (milestones)

milestone 1 — core logging (1–2 weeks)

auth + user settings

categories crud + color picker

start/stop timer, manual add, edit block

day timeline

basic insights (totals by category, week stack)

csv export

milestone 2 — notes + ai (1–2 weeks)

notes composer + linking

daily/weekly summaries & ai endpoint

quality rating, pace to 10k (basic)

keyboard shortcuts

milestone 3 — polish (1–2 weeks)

week view, heat map, radial mastery rings

unassigned time prompts

import (calendar/sleep csv)

empty states, microcopy, onboarding

milestone 4 — hardening (ongoing)

tests, accessibility pass, error telemetry, cron reliability

“most colorful and visual” charts (flat color)

stacked bars for day/week with category colors.

radial progress per skill: flat color ring with hours label in center.

heat map (hour x category) for patterns.

sparklines for each category’s last 30 days.

minimal component styling rules

flat fills only; no gradient, no glow, no glass.

8–12px rounding; 12–16px padding.

one primary pink for ctas; categories keep their own colors; never mix on a single button.

emphasize whitespace and alignment; never full-bleed color blocks.

nice-to-haves after v1

mobile pwa with background timer notification.

public “brag card” image: “this month: 42h coding, 12h design, 18h gym.”

templates (e.g., “deep work”, “editing”, “calls”).

friend view (read-only share of mastery progress).

api for power users.

quick acceptance checklist

can I log sleep without being asked if I was “focused”? ✅

can I see 24h of today and fill gaps fast? ✅

can I mark which categories count toward 10,000 hours and see a pace? ✅

can I write notes and get ai weekly takeaways? ✅

is everything flat color and readable on dark? ✅
