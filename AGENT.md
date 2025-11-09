# AGENT.md

This file provides comprehensive guidance for AI agents (Warp, Cursor, Claude, etc.) when working with code in this repository.

## Project Overview

**10,000hours.com** is a comprehensive 24-hour time tracking web application focused on helping users understand how they spend every hour of their day and track progress toward mastery goals using the 10,000-hour rule.

**Core Philosophy:**
- Time truth over focus hacks (ledger, not a pomodoro babysitter)
- 24-hour coverage (log everything, including sleep, eating, leisure)
- Notes-first approach (every time block can have a note)
- Mastery tracking (progress toward 10,000 quality-weighted hours)

## Current Implementation Status

### ✅ What's Already Built (DO NOT RECREATE)

**Core Infrastructure:**
- ✅ Next.js 15.0.3 with App Router, React 18.3.1, TypeScript 5
- ✅ Tailwind CSS 3.4.1 with complete dark theme design tokens in `tailwind.config.ts`
- ✅ All design system colors (#0B0D10 base, #111418 surface, #151A1F elevated)
- ✅ 8 category accent colors (pink, teal, blue, violet, lime, amber, red, cyan)
- ✅ Typography scale (hero/h1/h2/h3/body/label/small with proper weights)
- ✅ Spacing system (8px grid), border radius (10px component, 16px chip, 999px pill)
- ✅ Animations (150-200ms transitions with prefers-reduced-motion support)
- ✅ PostCSS with autoprefixer, ESLint configuration

**UI Components in `components/ui/` (FULLY FUNCTIONAL):**
1. `button.tsx` - 3 variants (primary/secondary/ghost), 3 sizes (default/lg/icon)
2. `category-chip.tsx` - Color dot + label, active state, accepts CategoryColor type
3. `input.tsx` - Text input with border-subtle, focus states with cta-pink ring
4. `label.tsx` - Form labels with proper text-label styling
5. `dialog.tsx` - Complete modal system (Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription)

**Utility Files in `lib/`:**
1. `utils.ts`:
   - `cn()` function for className merging
   - `CATEGORY_COLORS` constant with hex values for all 8 colors
   - `CategoryColor` type (union of 8 color names)
   - `CATEGORY_COLOR_OPTIONS` array for color picker
   
2. `types.ts`:
   - `Category` interface (with _id, userId, name, color, type, countsTowardMastery, etc.)
   - `Session` interface (with start, end, durationMin, quality, tags, noteId)
   - `Note` interface (with sessionIds array, body, tags, AI fields)
   - `Summary` interface (for day/week/month aggregates)
   - `User` interface (with clerkId, settings object)
   
3. `schemas.ts`:
   - Complete Zod schemas for validation (createCategorySchema, updateCategorySchema, createSessionSchema, etc.)
   - All schemas match TypeScript types

**Implemented Pages:**

1. **`app/page.tsx` (Landing Page):**
   - Hero section with "know where your time goes. master what matters."
   - CTA button linking to /app
   - 4 feature cards (24-hour tracking, beautiful insights, mastery progress, private & free)
   - Dark theme, Inter font, proper spacing

2. **`app/app/layout.tsx` (App Shell):**
   - Desktop: Left sidebar (264px) with 6 nav items
   - Mobile: Bottom nav bar with 5 items (Settings hidden on mobile)
   - Navigation: Clock (now), Calendar (timeline), BarChart3 (insights), FileText (notes), FolderKanban (categories), Settings
   - Active state detection using usePathname()
   - Pink accent (#F11D75) for active items
   - Responsive at lg breakpoint (1024px)

3. **`app/app/now/page.tsx` (Timer Page - FUNCTIONAL UI):**
   - Category selector showing 4 chips (coding/blue, cs girlies/teal, sleep/pink, exercise/lime)
   - Activity input with placeholder "e.g., building time tracking app"
   - Timer display showing "00:00:00" or "00:42:15" (mock)
   - Start/Pause/Finish buttons with Lucide icons
   - 3 suggestion cards with hardcoded data
   - Empty state: "press start logging or pick a time on the timeline."
   - **State:** Uses useState for isRunning and title (NOT PERSISTED)

4. **`app/app/categories/page.tsx` (Category Management - FUNCTIONAL UI):**
   - Header with "add category" button
   - 4 hardcoded CategoryRow components (coding, cs girlies, sleep, exercise)
   - Each row shows: CategoryChip, type badge, mastery badge, edit button
   - Add category dialog with:
     - Name input
     - 8-color picker grid (clickable circles with ring on selection)
     - Type dropdown (skill/life/admin/social/other)
     - "counts toward mastery" checkbox
     - Create/Cancel buttons
   - Tip box: "pick colors that read well on dark. you can change anytime."
   - **State:** Dialog open/close, selected color (NOT SAVED TO DB)

5. **`app/app/timeline/page.tsx` (Empty Placeholder):**
   - Shows: "no logs yet. drag anywhere to add a block or press S to start a timer."

6. **`app/app/insights/page.tsx` (Empty Placeholder):**
   - Header: "insights" with tagline "truth over vibes. here's where your week actually went."
   - Shows: "log some time to see insights appear here."

7. **`app/app/notes/page.tsx` (Empty Placeholder):**
   - Shows: "write it down while it's fresh. what worked? what hurt?"

8. **`app/app/settings/page.tsx` (Empty Placeholder):**
   - Shows: "settings coming soon"

**Global Styles in `app/globals.css`:**
- Tailwind directives (@tailwind base/components/utilities)
- Dark theme body styles (bg-bg-base, text-text-primary)
- prefers-reduced-motion media query (sets all animations to 0.01ms)
- Font feature settings for ligatures

**Root Layout in `app/layout.tsx`:**
- Inter font loaded from next/font/google
- Dark class on <html>
- Metadata with title and description
- Font variable applied to body

### ⏳ NOT YET IMPLEMENTED (PRIORITIZE THESE)

**Critical Backend Setup:**
1. MongoDB connection (`lib/mongodb.ts` needed)
2. API routes in `app/api/`:
   - `sessions/route.ts` (POST, GET)
   - `sessions/[id]/route.ts` (PATCH, DELETE)
   - `categories/route.ts` (POST, GET)
   - `categories/[id]/route.ts` (PATCH, DELETE)
   - `notes/route.ts` (POST, GET)
   - `insights/summary/route.ts` (GET)
3. Clerk authentication:
   - ClerkProvider wrapper in root layout
   - Middleware for protected routes
   - Sign in/sign up pages

**State Management:**
1. React Query provider and setup
2. Zustand store for timer state (with localStorage persistence)
3. Real timer logic (setInterval, elapsed time calculation)
4. Optimistic updates for mutations

**Missing UI Components:**
1. `TimerDial` - Canvas/SVG circular dial with accessibility fallback
2. `TimeBlock` - Draggable/resizable session rectangle for timeline
3. `TimelineGrid` - 24-hour vertical grid or 7-day week grid
4. `SessionEditorSheet` - Right-side panel (480px desktop, full mobile)
5. `NoteComposer` - Large textarea with session linking
6. `NoteCard` - Note display in list with left color spine
7. `InsightCard` - Metric cards with trends
8. `StackedBarChart` - Daily/weekly distribution (ECharts/Recharts)
9. `RadialProgress` - Mastery tracking ring
10. `Textarea` component (similar to Input but multiline)
11. `Select` component (Radix UI select primitive)
12. `Tabs` component (Radix UI tabs)
13. `Toast` component (notifications)

**Feature Implementation Needed:**
1. **Real Timer Logic:**
   - Track start time in ISO format
   - Calculate elapsed time with setInterval
   - Persist to localStorage
   - POST to /api/sessions on stop
   
2. **Category CRUD:**
   - Connect add category dialog to API
   - Fetch categories from database
   - Update and delete operations
   - Validation with Zod schemas
   
3. **Timeline Views:**
   - Day view: 24-hour vertical column (midnight to midnight)
   - Week view: 7 columns (configurable start day)
   - Drag to resize/move blocks
   - Click empty space to create session
   - Conflict detection for overlaps
   
4. **Session Management:**
   - Create from timer or manual entry
   - Edit via side panel sheet
   - Quality rating (1-5 stars) on stop
   - Tags input and display
   - Delete confirmation
   
5. **Notes System:**
   - Rich text editor
   - Auto-link to running session
   - Link to multiple sessions
   - Full-text search
   - AI summarization (optional)
   
6. **Insights Dashboard:**
   - 4 overview cards (total logged, avg/day, most time category, unassigned)
   - Stacked bar chart (categories × days)
   - Radial progress rings (mastery categories)
   - Heat map (hour × category)
   - Streak tracker
   - Date range filters
   
7. **Mastery Tracking:**
   - Quality-weighted calculation: `duration * (quality/5)`
   - 8-week rolling average for pace
   - Projected completion date
   - Required weekly hours calculator
   
8. **Keyboard Shortcuts:**
   - S - start/stop timer
   - P - pause/resume
   - N - add note
   - [ / ] - adjust time ±1 minute
   - ⌘K - quick add global

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Tests (not yet configured)
npm run test          # Vitest
npm run test:e2e      # Playwright
```

## File Structure Reference

```
tenthousandhours/
├── app/
│   ├── globals.css                    # Tailwind + custom styles
│   ├── layout.tsx                     # Root layout with Inter font
│   ├── page.tsx                       # Landing page
│   └── app/
│       ├── layout.tsx                 # App shell with sidebar/bottom nav
│       ├── page.tsx                   # Redirects to /app/now
│       ├── now/page.tsx              # ✅ Timer page (functional UI)
│       ├── timeline/page.tsx         # ⏳ Empty placeholder
│       ├── insights/page.tsx         # ⏳ Empty placeholder
│       ├── notes/page.tsx            # ⏳ Empty placeholder
│       ├── categories/page.tsx       # ✅ Category management (functional UI)
│       └── settings/page.tsx         # ⏳ Empty placeholder
├── components/ui/
│   ├── button.tsx                     # ✅ 3 variants, 3 sizes
│   ├── category-chip.tsx             # ✅ Color dot + label
│   ├── input.tsx                      # ✅ Text input
│   ├── label.tsx                      # ✅ Form label
│   └── dialog.tsx                     # ✅ Modal system
├── lib/
│   ├── utils.ts                       # ✅ cn(), CATEGORY_COLORS
│   ├── types.ts                       # ✅ All TypeScript interfaces
│   └── schemas.ts                     # ✅ Zod validation schemas
├── docs/                              # Comprehensive planning docs
│   ├── PRD.md                         # Product requirements (1,350 lines)
│   ├── tech-stack-overview.md        # Technical architecture
│   ├── app-flow.md                   # User journeys and data contracts
│   ├── ui-guidelines.md              # Design system (colors, typography, etc.)
│   └── plan.md                       # Core principles and roadmap
├── package.json                       # All dependencies installed
├── tsconfig.json                      # TypeScript config
├── tailwind.config.ts                # ✅ Complete design tokens
├── postcss.config.js                 # PostCSS with autoprefixer
├── next.config.js                    # Next.js config
├── .env.example                      # Environment variables template
├── .eslintrc.json                    # ESLint config
├── README.md                         # Setup instructions
├── WARP.md                           # This file
└── AGENT.md                          # Agent-specific guidance
```

## Design System (STRICTLY ENFORCED)

### Colors (Dark Theme Only)
```typescript
// Backgrounds
bg-base: '#0B0D10'
bg-surface: '#111418'
bg-elevated: '#151A1F'

// Text
text-primary: '#E9EDF1'
text-secondary: '#B2BCC9'
text-muted: '#6B7684'

// Borders
border-subtle: '#1D232B'

// CTA (primary buttons ONLY)
cta-pink: '#F11D75'

// Category Accents (8 colors)
accent-pink: '#F11D75'
accent-teal: '#16C7A8'
accent-blue: '#3A8DFF'
accent-violet: '#8B5CF6'
accent-lime: '#45E06F'
accent-amber: '#FFB020'
accent-red: '#FF5C5C'
accent-cyan: '#22D3EE'

// State
success: '#26D07C'
warning: '#FFB020'
danger: '#FF5C5C'
```

### Typography Scale
```css
text-hero: 48px / 3rem (weight 600)
text-h1: 32px / 2rem (weight 600)
text-h2: 24px / 1.5rem (weight 600)
text-h3: 20px / 1.25rem (weight 600)
text-body: 16px / 1rem (weight 400)
text-label: 14px / 0.875rem (weight 500)
text-small: 12px / 0.75rem (weight 400)
```

### Spacing & Radius
- Spacing: 8px grid (common: 12px, 16px, 20px, 24px)
- Component radius: 10px (`rounded-component`)
- Chip radius: 16px (`rounded-chip`)
- Pill radius: 999px (`rounded-pill`)

### Motion Rules
- Duration: 150-200ms for all transitions
- Easing: ease-out for entrance, ease-in for exit
- **NO gradients, NO glassmorphism, NO neumorphism - FLAT ONLY**
- Respect `prefers-reduced-motion` (already configured in globals.css)

### Microcopy (USE EXACT PHRASES)
- Timer input: "what are you doing?"
- Note placeholder: "what happened? any highlights or blockers?"
- Stop timer: "how'd it go?" (with 1-5 star rating)
- Quality note prompt: "add a quick note so future-you learns faster."
- Insights header: "truth over vibes. here's where your week actually went."
- Mastery pacing: "at your current pace (14.2h/week) you'll hit coding mastery nov 2030. +4.3h/week pulls it into jul 2029."
- Notes empty: "write it down while it's fresh. what worked? what hurt?"
- Timeline empty: "no logs yet. drag anywhere to add a block or press S to start a timer."
- Categories tip: "pick colors that read well on dark. you can change anytime."

**Copy Guidelines:**
- Sentence case (not Title Case)
- No exclamation marks in system UI
- Short, friendly, direct
- No "focus" or "productivity" language (use "logging", "tracking", "time")

## Code Patterns & Conventions

### Component Structure
```typescript
// Client components use "use client" directive
"use client"

// Import order: React, Next.js, UI components, icons, utils/types
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"

// TypeScript for all files (.tsx for components, .ts for utilities)
export default function ComponentName() {
  // State
  const [state, setState] = useState<Type>(initialValue)
  
  // Event handlers
  const handleClick = () => {
    // ...
  }
  
  // Render with Tailwind classes
  return (
    <div className="flex flex-col gap-4">
      {/* Components */}
    </div>
  )
}
```

### Styling Patterns
- Use Tailwind utility classes (NOT inline styles except for dynamic colors)
- Use `cn()` for conditional classes
- Category colors: Use inline `style={{ backgroundColor: CATEGORY_COLORS[color] }}`
- Responsive: Mobile-first with `lg:` prefix for desktop
- Dark theme: All colors are from design tokens (no hardcoded hex)

### Data Flow (When Implemented)
1. **Server State:** React Query for fetching (sessions, categories, notes)
2. **Local State:** Zustand for timer (with localStorage persistence)
3. **Forms:** react-hook-form + Zod validation
4. **Mutations:** Optimistic updates, then invalidate queries

### TypeScript Guidelines
- All function parameters typed
- Use interfaces from `lib/types.ts`
- Validate with Zod schemas from `lib/schemas.ts`
- No `any` types (use `unknown` if truly needed)

## Common Tasks for Agents

### 1. Adding a New UI Component
```bash
# Create file in components/ui/
touch components/ui/component-name.tsx

# Follow Button/Input pattern:
# - Use React.forwardRef
# - Accept className prop
# - Use cn() for merging classes
# - Export named component
```

### 2. Creating an API Route
```bash
# Create route file
mkdir -p app/api/resource
touch app/api/resource/route.ts

# Structure:
# - Export async GET/POST/PATCH/DELETE functions
# - Validate with Zod schemas
# - Use NextRequest/NextResponse
# - Filter by userId for security
```

### 3. Adding a New Page
```bash
# Create page in app/app/
touch app/app/pagename/page.tsx

# Structure:
# - Use existing layout (inherits app shell)
# - Header with border-b, h2 title
# - Content area with proper padding (p-6 pb-24 lg:pb-6)
# - Empty states with text-text-muted
```

### 4. Implementing Timer Logic
```typescript
// In Zustand store:
interface TimerState {
  isRunning: boolean
  startTime: Date | null
  categoryId: string | null
  title: string
  elapsedSeconds: number
  start: (categoryId: string, title: string) => void
  stop: () => void
  tick: () => void
}

// Use setInterval for tick
// Persist to localStorage
// POST to /api/sessions on stop
```

### 5. Database Schema
```typescript
// MongoDB collections (use MongoDB driver or Mongoose):
// - users (clerkId, email, name, tz, settings)
// - categories (userId, name, color, type, countsTowardMastery)
// - sessions (userId, categoryId, title, start, end, durationMin, quality, tags)
// - notes (userId, sessionIds, body, tags, AI fields)
// - summaries (userId, granularity, startDate, endDate, totalsByCategory)

// Indexes:
// sessions: { userId: 1, start: 1 }, { userId: 1, categoryId: 1, start: 1 }
// categories: { userId: 1, name: 1 }
// notes: { userId: 1, createdAt: -1 }, full-text on body
```

## Testing Checklist

Before marking work complete:
- [ ] TypeScript compiles with no errors (`npm run type-check`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Component renders on all screen sizes (mobile, tablet, desktop)
- [ ] Dark theme colors used (no hardcoded colors)
- [ ] Proper spacing (8px grid)
- [ ] Transitions are 150-200ms
- [ ] Microcopy matches guidelines
- [ ] Keyboard accessible (focus rings visible)
- [ ] No console errors in browser

## Important Constraints

- **Free forever:** No paywalls or paid tiers in V1
- **Dark theme only:** No light theme in V1
- **Responsive web:** No native mobile apps in V1
- **Single user:** No team/collaborative features in V1
- **Privacy-first:** AI is optional and transparent; user data never sold
- **Row-level security:** Every query MUST filter by userId
- **Timezone handling:** Store UTC, render in user timezone
- **Error handling:** Never lose running timer data (autosave + localStorage)

## Key Documentation Files

When making decisions, reference these in order of priority:
1. `/docs/ui-guidelines.md` - Design system (colors, typography, components)
2. `/docs/app-flow.md` - User journeys, screens, data contracts
3. `/docs/tech-stack-overview.md` - Architecture, database, analytics
4. `/docs/PRD.md` - Complete product requirements (1,350 lines)
5. `/docs/plan.md` - Core principles, data model, roadmap

## Next Priority Tasks

When asked to continue development, prioritize in this order:

1. **MongoDB Connection & API Setup**
   - Create `lib/mongodb.ts` with connection helper
   - Implement `/api/categories` routes (POST, GET)
   - Test with Postman or Thunder Client

2. **Real Category Management**
   - Connect categories page to API
   - Save/load from database
   - Update UI to show real data

3. **Timer Backend Logic**
   - Create Zustand store with localStorage
   - Implement real timer with setInterval
   - POST session to API on stop

4. **Session Creation**
   - Build `/api/sessions` routes
   - Connect timer to session creation
   - Show created sessions in suggestions

5. **Timeline Day View**
   - Build TimelineGrid component
   - Fetch sessions for current day
   - Render TimeBlock components
   - Empty state for gaps

This app reveals time truth without judgment, embraces 24-hour tracking (not just "productive" time), and helps users progress toward mastery goals through awareness and reflection.
