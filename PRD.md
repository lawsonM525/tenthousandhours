# Product Requirements Document: 10,000hours.com

## Executive Summary

**Product Name:** 10,000hours.com  
**Version:** 1.0  
**Last Updated:** 2025-11-08  
**Document Owner:** Product Team

10,000hours.com is a comprehensive time tracking web application designed to help users gain insight into how they spend every hour of their day. Unlike traditional focus or productivity apps, this platform embraces the philosophy that awareness drives behavior change. By tracking all 24 hours daily—including sleep, eating, work, and leisure—users can see the truth about their time allocation and consciously work toward mastery in their chosen skills using the 10,000-hour rule.

---

## Vision & Philosophy

### Core Vision
"Know where your time goes. Master what matters."

### Guiding Principles

1. **Time Truth > Focus Hacks**  
   The app is a ledger for hours, not a pomodoro babysitter. We reveal reality without judgment.

2. **24-Hour Coverage**  
   Every minute of the day should either be logged or intentionally left unassigned. This isn't about productivity; it's about awareness.

3. **Flexible Categories**  
   Users create categories, color them, group them, and choose which ones count toward "mastery." Sleep, eating, errands—everything gets equal treatment.

4. **Notes-First Approach**  
   Every block of time can have a note. Notes roll up into daily and weekly summaries, creating a journal of how you spent your time and what you learned.

5. **10,000-Hour Path**  
   For any category flagged as a "skill," show progress toward 10,000 quality hours and calculate the pace needed to reach mastery by a target date.

### The 10,000-Hour Rule
Based on research popularized by Malcolm Gladwell, the 10,000-hour rule suggests that achieving world-class expertise in any skill requires approximately 10,000 hours of deliberate practice. Our app helps users:
- Track quality hours toward mastery goals
- Understand their current pace
- Project when they'll reach 10,000 hours at their current rate
- Adjust their schedule to meet target mastery dates

---

## Target Audience

### Primary Users
- **Self-improvement enthusiasts** who want to understand where their time actually goes
- **Skill builders** working toward mastery in specific areas (coding, design, music, sports, etc.)
- **Life optimizers** who want data-driven insights about their daily habits
- **Knowledge workers** who need holistic time awareness beyond just work hours

### User Personas

**Persona 1: The Aspiring Master**
- Age: 24-35
- Goal: Become expert-level at coding/design/music/other skill
- Wants to track deliberate practice hours and see progress
- Values: Data, accountability, long-term thinking

**Persona 2: The Life Optimizer**
- Age: 28-45
- Goal: Better understand how time is allocated across all life areas
- Concerned about work-life balance and hidden time sinks
- Values: Insights, patterns, holistic view

**Persona 3: The Habit Builder**
- Age: 20-40
- Goal: Build better daily routines through awareness
- Wants to track sleep, exercise, learning, socializing equally
- Values: Comprehensiveness, reflection, growth

---

## Product Objectives

### Business Objectives
1. Launch a free web application that stands out in the crowded time-tracking market through unique positioning (24-hour tracking + mastery focus)
2. Build an engaged user base who sees value in long-term tracking and mastery goals
3. Create a platform that users return to daily for logging and weekly for insights
4. Establish 10,000hours.com as the definitive tool for mastery tracking

### User Objectives
1. Enable users to log all 24 hours of their day effortlessly
2. Provide clear, actionable insights about time allocation patterns
3. Help users track progress toward 10,000-hour mastery goals
4. Support reflection and learning through integrated note-taking
5. Make time tracking feel rewarding rather than burdensome

### Success Metrics
- **Engagement:** Daily active users, average sessions logged per week
- **Retention:** 7-day and 30-day retention rates
- **Coverage:** Average hours logged per day per user (target: >16 hours)
- **Mastery Tracking:** Percentage of users who flag at least one skill category
- **Insights Usage:** Weekly return rate to insights page
- **Note Taking:** Percentage of sessions with notes attached
- **Complete Coverage:** Percentage of users logging >20 hours/day consistently

---

## Product Scope

### In Scope (Version 1.0)
- User authentication and account management (Clerk)
- Category creation and management with color customization
- Timer-based and manual time logging
- Daily and weekly timeline views
- Time block editing (drag to resize/move)
- Note-taking linked to time sessions
- Quality rating for sessions (1-5 scale)
- Analytics and insights dashboard
- Mastery tracking for skill categories (progress to 10,000 hours)
- AI-powered summaries of notes and time patterns
- Data export (CSV/JSON)
- Dark theme UI with colorful accents
- Keyboard shortcuts for power users
- Tags for additional categorization

### Out of Scope (Post-V1)
- Mobile native apps (V1 is responsive web only)
- Team/collaborative tracking
- Paid tiers or monetization features
- Public profile or social features
- Third-party integrations (calendar, fitness trackers)
- Advanced AI features beyond summaries
- Template library
- API for external tools

### Explicitly Free
The entire application is free with no paid tiers. All features are available to all users.

---

## Information Architecture

### Navigation Structure

#### Desktop (Left Sidebar)
1. **Now** – Quick log / active timer
2. **Timeline** – Day and week calendar views
3. **Insights** – Analytics and charts
4. **Notes** – Note browsing and search
5. **Categories** – Category management
6. **Profile / Settings** – Account and preferences

#### Mobile (Bottom Navigation)
Same structure adapted to bottom navigation bar for mobile devices.

#### Global Actions (Always Available)
- Quick add (⌘K keyboard shortcut)
- Search functionality
- Export data
- Theme toggle (dark only at V1)
- Notifications

---

## Detailed Feature Requirements

### 1. Authentication & User Management

#### Authentication (Clerk Integration)
- **Sign Up:** Email/password, social login (Google, GitHub)
- **Sign In:** Persistent sessions
- **Password Reset:** Email-based recovery
- **Account Deletion:** Simple path to delete all data

#### User Profile
- Display name
- Profile photo
- Email address
- Timezone (auto-detected, manually adjustable)
- Account creation date

#### Settings
- **Time Preferences:**
  - Time rounding options (1/5/15 minutes)
  - Week start day (Sunday/Monday)
  - Time format (12h/24h)
- **Target Hours:** Default weekly targets for categories
- **Notifications:** Daily reminders, weekly summaries
- **AI Settings:**
  - Enable/disable AI summaries
  - Optional API key for custom AI provider
  - Data usage transparency and controls
- **Data Management:**
  - Export all data (CSV/JSON)
  - Import data
  - Create backup snapshots
  - Delete account

---

### 2. Categories

#### Core Functionality
Categories are the fundamental building blocks of time tracking. Every session belongs to one category.

#### Category Properties
- **Name:** User-defined (e.g., "Deep Work - Coding", "Sleep", "Meal Prep")
- **Color:** Selected from a fixed palette of 8 accent colors
- **Type:** Skill, Life Maintenance, Admin, Social/Spiritual, Other
- **Counts Toward Mastery:** Boolean toggle for 10,000-hour tracking
- **Target Weekly Hours:** Optional numeric goal
- **Parent Category:** Optional grouping/rollup
- **Archived:** Soft delete for historical categories

#### Color Palette (Fixed, No Custom Colors)
- Pink #F11D75
- Teal #16C7A8
- Blue #3A8DFF
- Violet #8B5CF6
- Lime #45E06F
- Amber #FFB020
- Red #FF5C5C
- Cyan #22D3EE

#### Category Types
1. **Skill:** Activities working toward mastery (e.g., coding, piano, Spanish)
2. **Life Maintenance:** Essential activities (sleep, eating, hygiene, errands)
3. **Admin:** Administrative tasks (email, planning, finances)
4. **Social/Spiritual:** Relationships and personal growth
5. **Other:** Miscellaneous activities

#### Category Management UI
- **List View:** Shows color dot, name, type badge, mastery toggle, target hours
- **Create/Edit Modal:**
  - Name input
  - Color picker (grid of 8 tokens)
  - Type dropdown
  - Mastery toggle with tooltip
  - Target hours/week input
  - Parent category selector (optional)
- **Bulk Actions:** Archive multiple categories
- **Default Categories:** Suggested starter set during onboarding

#### Microcopy
- "Pick colors that read well on dark. You can change anytime."
- "Toggle 'counts toward mastery' for skills you want to chase."

---

### 3. Time Logging

#### Now Page (Quick Log / Timer)

**Purpose:** The primary interface for logging time as it happens.

**Layout:**
- **Category Selector:** Pill-shaped dropdown with color dot + name
- **Activity Input:** "what are you doing?" placeholder
- **Tags Input:** Optional comma-separated or chip-based tags
- **Time Control:** Dial or digital picker
  - Default: "Start" button with live running clock
  - Alternative: Manual start/end time entry
  - Presets: 25min, 1h, 2h, 4h
  - Plus/minus buttons: Adjust in 5-minute increments
- **Primary Controls:**
  - Start / Pause / Stop buttons
  - Add note button
  - Mute timer (silent mode)
  - Break button (pause for defined duration)
  - Overflow menu: Split session, duplicate, delete
- **Suggestions List:** Recent activities with their categories and last durations

**Rules:**
- Only one running session at a time
- Stopping a session opens mini-review:
  - Quality rating (1-5 stars)
  - Optional note
  - Tag additions
  - Save button

**Keyboard Shortcuts:**
- `S` – Start/stop timer
- `P` – Pause
- `N` – Open note field
- `[` / `]` – Adjust time by 1 minute
- `⌘K` – Quick add (global)

**Microcopy:**
- Activity placeholder: "what are you doing?"
- Note placeholder: "what happened? any highlights or blockers?"
- Stop dialog: "how'd it go?" (star rating prompt)
- Stop dialog note: "add a quick note so future-you learns faster."

#### Manual Entry
- Click on empty timeline area to create new block
- Pre-filled with start/end times based on click position
- Same editing interface as timer-created sessions

---

### 4. Timeline (Calendar Views)

#### View Options
1. **Day View:** 24-hour vertical column (midnight to midnight)
2. **Week View:** 7 columns (Mon-Sun or Sun-Sat based on settings)

#### Time Block Display
- **Appearance:**
  - Flat colored rectangles
  - Rounded corners (10px)
  - White/near-white text for readability
  - Height proportional to duration
  - Thicker appearance for long blocks like sleep
- **Information Shown:**
  - Activity name
  - Duration
  - Category color (background)
  - Quality indicator (subtle)

#### Interactions
- **Drag to Resize:** Adjust start or end time
- **Drag to Move:** Change start time (duration stays same)
- **Click:** Open side panel editor
- **Right-click:** Context menu (duplicate, split, delete)
- **Hover:** Show detailed tooltip with exact times, quality, tags

#### Side Panel Editor
Opens when clicking a time block:
- Category selector
- Activity title
- Start time (manual adjustment)
- End time (manual adjustment)
- Duration (calculated, displayed)
- Quality rating (1-5)
- Tags
- Note field
- Delete button
- Save/Cancel buttons

#### Conflict Resolution
- Overlapping blocks show subtle outline/warning
- Prompt user to split or merge
- Prevent creation of overlapping blocks (warn before save)

#### Unassigned Time
- Empty time slots show faint zebra stripes
- Prompt: "log this time"
- Click to quick-add new block

#### Empty States
**Day View Empty:**
"No logs yet. Drag anywhere to add a block or press S to start a timer."

**Week View Empty:**
"Your week is a blank canvas. Start logging to see patterns emerge."

---

### 5. Insights (Analytics)

#### Overview Cards (Top Row)
Four key metrics at a glance:
1. **This Week Total Logged:** Total hours logged this week
2. **Avg Hours/Day:** Average daily logging
3. **Most Time by Category:** Top category with hours and percentage
4. **Hours Unassigned:** Gap in coverage

#### Charts & Visualizations

**1. Stacked Bar Chart (Daily Distribution)**
- X-axis: Days of the week
- Y-axis: Hours (0-24)
- Bars: Stacked by category with flat colors
- Hover: Show exact hours per category
- Purpose: See daily patterns and balance

**2. Radial Progress (Mastery Tracking)**
- One ring per skill category flagged for mastery
- Shows: Current hours / 10,000 hours
- Center label: Hours logged + projected completion date
- Color: Category color
- Purpose: Track long-term progress

**3. Heat Map (Day-Part Patterns)**
- Rows: Categories
- Columns: Hours of day (0-23)
- Cell color intensity: Time spent in that hour
- Purpose: Discover when different activities happen

**4. Sparklines (30-Day Trends)**
- Mini line charts per category
- Shows last 30 days of activity
- Purpose: Quick visual of recent patterns

**5. Streak Tracker**
- Days with ≥ target hours for a skill
- Current streak and longest streak
- Purpose: Motivation and consistency tracking

#### AI Insight Tiles

Auto-generated insights displayed as cards:
- "You spent 12h (+30%) on coding vs. last week."
- "To hit 10k hours in ML Engineering by 2028, average 18.5h/week (you're at 14.2)."
- "Your sleep averaged 6.8h/night this week (target: 8h)."
- "Monday is your most productive day for deep work."

#### Filters
- **Time Range:** Today, this week, this month, custom range
- **Categories:** Multi-select filter
- **Skills Only:** Toggle to show only mastery categories
- **Include/Exclude:** Sleep and life-maintenance categories

#### Microcopy
- Header: "Truth over vibes. Here's where your week actually went."
- Empty state: "Log some time to see insights appear here."

#### Chart Library Selection
**Recommendation:** Apache ECharts or Recharts
- Must support: Stacked bars, radial progress, heat maps
- Must be: Highly customizable with flat colors
- Must have: Good dark theme support
- Must be: Performant with months of data

---

### 6. Notes

#### Purpose
Notes allow users to reflect on their time, capture learnings, and provide context for future review.

#### Note Composer
- **Large textarea:** Comfortable writing space
- **Attachment:** Link to one or multiple time blocks
- **Auto-linking:** If written during a session, auto-link to that session
- **Tags:** Apply tags for organization
- **Timestamp:** Automatically recorded

#### AI Features
- **Summarize Day:** Bullet-point summary of all notes from a day
- **Summarize Week:** Weekly rollup with key highlights
- **Extract Tasks:** Pull out action items from notes
- **Identify Patterns:** "You mentioned feeling tired in 3 afternoon sessions this week."

#### Note List View
- **Chronological:** Most recent first
- **Category Chips:** Show associated session categories
- **Duration Totals:** If linked to sessions, show total time
- **Preview:** First 2 lines of note
- **Click:** Expand to full note with edit option

#### Search & Filter
- **Full-text Search:** Search note content
- **Tag Filter:** Filter by tags
- **Category Filter:** Show notes from specific categories
- **Date Range:** Filter by date

#### Microcopy
- Empty state: "Write it down while it's fresh. What worked? What hurt?"
- Composer placeholder: "What happened? Any highlights or blockers?"

---

### 7. Mastery Tracking (10,000 Hours)

#### Concept
For any category marked as "counts toward mastery," the app tracks progress toward 10,000 hours.

#### Quality Weighting
- Sessions are weighted by quality rating
- Formula: `quality_weighted_minutes = duration * (quality / 5)`
- Only quality sessions (3+ stars) count toward mastery
- Example: 1 hour at 4-star quality = 0.8 mastery hours

#### Progress Display
1. **Total Hours:** Cumulative quality-weighted hours
2. **Progress Bar:** Visual representation (0-10,000)
3. **Percentage:** X% complete
4. **Current Pace:** Based on 8-week rolling average
5. **Projected Date:** When you'll reach 10,000 at current pace
6. **Required Pace:** Hours/week needed to hit 10,000 by target date

#### Pace Calculator
Users can set a target mastery date:
- App calculates required weekly hours
- Shows gap between current pace and required pace
- Projects new completion date if pace increases by X hours/week

#### Example Display
```
Coding: 1,247 / 10,000 hours (12.5%)

Current Pace: 14.2 h/week
Projected Mastery: November 2030

Target Date: July 2029
Required Pace: 18.5 h/week (+4.3 h/week)
```

#### Microcopy
"At your current pace (14.2h/week) you'll hit coding mastery Nov 2030. +4.3h/week pulls it into Jul 2029."

---

### 8. Landing Page & Onboarding

#### Landing Page

**Hero Section:**
- **Headline:** "Know where your time goes. Master what matters."
- **Subheadline:** "Log your whole day, see the truth, and pace your path to 10,000 hours."
- **CTA:** "Start Free" (emphasize no payment required)

**Feature Highlights:**
- 24-hour time tracking
- Beautiful visualizations
- Mastery progress tracking
- AI-powered insights
- Private and free forever

**Social Proof:**
- Testimonials (post-launch)
- Example use cases

#### Onboarding Flow

**Step 1: Welcome**
- Brief intro to app philosophy
- "This isn't a focus app. It's a truth app."

**Step 2: Pick Starter Categories**
- Suggest 5-8 common categories
- Examples: Sleep, Work, Exercise, Learning, Social, Meals
- Allow customization

**Step 3: Flag Skills**
- "Which categories are you working toward mastery in?"
- Explain 10,000-hour rule
- Allow multiple selections

**Step 4: Set Weekly Targets**
- Optional: Set target hours/week for each category
- Skip option available

**Step 5: Choose Colors**
- Assign colors from palette to categories
- Preview how they'll look on dark background

**Step 6: Optional Import**
- Import from CSV
- Import from calendar (future)
- Skip to start fresh

**Step 7: Start Logging**
- Land on "Now" page with timer ready
- Tooltip tour of key features

---

## Technical Architecture

### Technology Stack

#### Frontend
- **Framework:** React 18+ with Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + shadcn/ui (pruned components, neutral base)
- **State Management:**
  - Server data: TanStack Query (React Query)
  - Ephemeral state: Zustand (timer state, UI toggles)
- **Forms:** react-hook-form + Zod validation
- **Date/Time:** Day.js or Luxon (timezone-aware)
- **Charts:** Apache ECharts or Recharts
- **Authentication UI:** Clerk React SDK

#### Backend
- **Framework:** Next.js API routes (Edge for light endpoints, Node runtime for AI)
- **Database:** MongoDB Atlas
- **ORM/Driver:** Mongoose or official MongoDB Node driver
- **Validation:** Zod schemas shared between client and server
- **Authentication:** Clerk (JWT verification)
- **Background Jobs:** Vercel Cron or lightweight worker (Railway/Render)
- **AI Integration:** OpenAI API or similar for summaries

#### Infrastructure
- **Hosting:** Vercel (Next.js optimized)
- **Database:** MongoDB Atlas (shared cluster for MVP, scale as needed)
- **Authentication:** Clerk (managed service)
- **CDN:** Vercel Edge Network
- **Domain:** 10000hours.com

#### Development Tools
- **Language:** TypeScript throughout
- **Testing:** Vitest (unit/integration), Playwright (E2E)
- **Linting:** ESLint + Prettier
- **Version Control:** Git + GitHub
- **CI/CD:** GitHub Actions

---

### Data Model (MongoDB)

#### Collections

**1. users**
```javascript
{
  _id: ObjectId,
  clerkId: String (unique),
  email: String,
  name: String,
  tz: String, // IANA timezone
  createdAt: Date,
  settings: {
    rounding: Number, // 1, 5, or 15
    weekStart: Number, // 0 (Sun) or 1 (Mon)
    aiEnabled: Boolean,
    notificationsEnabled: Boolean,
    timeFormat: String // "12h" or "24h"
  }
}
```
**Indexes:** `{ clerkId: 1 }` (unique)

**2. categories**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  color: String, // hex code from palette
  type: String, // "skill", "life", "admin", "social", "other"
  countsTowardMastery: Boolean,
  targetWeeklyHours: Number,
  parentId: ObjectId, // optional, for grouping
  archived: Boolean,
  createdAt: Date
}
```
**Indexes:** `{ userId: 1, name: 1 }`, `{ userId: 1, archived: 1 }`

**3. sessions**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  categoryId: ObjectId,
  title: String, // activity description
  start: Date, // UTC
  end: Date, // UTC, null if running
  durationMin: Number, // calculated
  quality: Number, // 1-5, optional
  tags: [String],
  noteId: ObjectId, // optional reference
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes:**
- `{ userId: 1, start: 1 }`
- `{ userId: 1, categoryId: 1, start: 1 }`
- `{ userId: 1, end: 1 }` (for running sessions)

**4. notes**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  sessionIds: [ObjectId], // can link to multiple sessions
  body: String, // full note text
  tags: [String],
  createdAt: Date,
  updatedAt: Date,
  summary: String, // AI-generated, optional
  sentiment: String, // optional
  keywords: [String] // optional
}
```
**Indexes:**
- `{ userId: 1, createdAt: -1 }`
- Full-text index on `body`

**5. summaries**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  granularity: String, // "day", "week", "month", "year"
  startDate: Date,
  endDate: Date,
  totalsByCategory: {
    [categoryId]: Number // minutes
  },
  unassignedMin: Number,
  aiSummary: String, // optional
  milestones: [String], // optional achievements
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes:** `{ userId: 1, startDate: 1, granularity: 1 }` (unique compound)

**6. targets** (optional, for future use)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  categoryId: ObjectId,
  goalType: String, // "weekly" or "total"
  valueMin: Number,
  createdAt: Date
}
```

#### Aggregation Strategy
- **Write sessions raw** (no denormalization on write)
- **On session create/update/delete:** Enqueue background job to update summaries for affected day/week/month
- **Insights page:** Read from pre-computed summaries when possible
- **Real-time data:** Query sessions directly for current day

---

### API Endpoints

#### Authentication
All endpoints require authentication. Clerk middleware verifies JWT and extracts `userId`.

#### Sessions
- `POST /api/sessions` – Create new session (timer or manual)
- `GET /api/sessions?from=<date>&to=<date>&categoryId=<id>` – List sessions
- `GET /api/sessions/running` – Get currently running session
- `PATCH /api/sessions/:id` – Update session (stop, edit times, quality, note)
- `DELETE /api/sessions/:id` – Delete session
- `POST /api/sessions/:id/split` – Split session into two

#### Categories
- `POST /api/categories` – Create category
- `GET /api/categories` – List all user's categories
- `PATCH /api/categories/:id` – Update category
- `DELETE /api/categories/:id` – Delete (archive) category

#### Notes
- `POST /api/notes` – Create note
- `GET /api/notes?query=<text>&categoryId=<id>&from=<date>` – Search/filter notes
- `PATCH /api/notes/:id` – Update note
- `DELETE /api/notes/:id` – Delete note

#### Insights
- `GET /api/insights/summary?granularity=<day|week|month>&from=<date>&to=<date>` – Get aggregated data
- `GET /api/insights/mastery?categoryId=<id>` – Get mastery progress for category

#### AI
- `POST /api/ai/summarize` – Summarize text or day's notes
  - Body: `{ type: "day|week|note", date?, noteId? }`
  - Response: `{ summary: String }`
- `POST /api/ai/insights` – Generate weekly insights
  - Body: `{ startDate: Date, endDate: Date }`
  - Response: `{ insights: [String] }`

#### Export
- `GET /api/export/csv?from=<date>&to=<date>` – Export sessions as CSV
- `GET /api/export/json` – Export all user data as JSON

#### User
- `GET /api/user/profile` – Get user profile
- `PATCH /api/user/settings` – Update user settings
- `DELETE /api/user/account` – Delete account and all data

---

### Security & Privacy

#### Authentication
- Clerk handles authentication (OAuth, email/password)
- JWTs verified on every API request
- Short-lived tokens with refresh mechanism

#### Authorization
- Row-level security: Every query filtered by `userId`
- No cross-user data access possible
- Admins have no special access to user data

#### Data Privacy
- **Encryption at rest:** MongoDB Atlas default encryption
- **Encryption in transit:** TLS for all connections
- **No data selling:** User data never shared or sold
- **AI data usage:**
  - Users can disable AI features entirely
  - When AI is used, only necessary text sent to AI provider
  - AI summaries stored, not full prompts
  - Clear disclosure of what data is sent to AI

#### Data Retention
- Users can export all data anytime
- Users can delete account and all associated data
- Deletion is permanent (no soft delete at account level)

#### Compliance
- GDPR-friendly (right to access, right to deletion, data portability)
- No cookies except essential authentication
- Privacy policy clearly stated

---

### Performance Requirements

#### Performance Budget
- **First Contentful Paint (FCP):** ≤ 1.5s on mid-range phone
- **Time to Interactive (TTI):** ≤ 3.0s
- **JavaScript Bundle:** < 250kb for initial load (code-split charts)
- **Largest Contentful Paint (LCP):** ≤ 2.5s

#### Optimization Strategies
- **Code Splitting:** Lazy load charts library, timeline components
- **Chart Rendering:** Only render visible date range
- **Virtualization:** For long lists (notes, sessions)
- **Image Optimization:** Next.js Image component for user avatars
- **Caching:** Server-side caching for summaries, client-side caching with React Query

#### Scalability
- **Database Indexes:** Proper indexing for common queries
- **Aggregation Jobs:** Background processing for summaries
- **Edge Functions:** Use Vercel Edge for lightweight API routes

---

### Accessibility

#### WCAG AA Compliance
- **Color Contrast:** All text meets WCAG AA contrast ratios (4.5:1 for normal text)
- **Focus Indicators:** Visible focus rings on all interactive elements
- **Keyboard Navigation:** Full app navigable via keyboard
- **Screen Readers:** Semantic HTML, ARIA labels where needed
- **Motion:** Respect `prefers-reduced-motion` setting

#### Specific Considerations
- **Color-Only Information:** Never use color alone (add icons/labels)
- **Time Pickers:** Keyboard-accessible alternatives to visual dials
- **Charts:** Provide data tables as alternative view
- **Error Messages:** Clear, descriptive, associated with form fields

---

## Design System

### Color System

#### Backgrounds
- **Base:** #0B0D10 (primary background)
- **Surface:** #111418 (cards, panels)
- **Elevated:** #151A1F (modals, popovers)

#### Text
- **Primary:** #E9EDF1 (body text, headers)
- **Secondary:** #B2BCC9 (supporting text)
- **Muted:** #6B7684 (hints, placeholders)

#### Accent Colors (Flat, No Gradients)
- Pink #F11D75
- Teal #16C7A8
- Blue #3A8DFF
- Violet #8B5CF6
- Lime #45E06F
- Amber #FFB020
- Red #FF5C5C
- Cyan #22D3EE

#### Borders & Shadows
- **Borders:** 1px hairlines in #1D232B
- **Shadows:** Soft shadow only for modals (`0 4px 12px rgba(0, 0, 0, 0.3)`)

### Typography

#### Font Family
- **Primary:** Inter or Söhne
- **Weights:**
  - 500 (medium) for labels and body
  - 600 (semibold) for section titles
  - 700 (bold) for emphasis (rare)

#### Scale
- **Hero:** 48px / 3rem
- **H1:** 32px / 2rem
- **H2:** 24px / 1.5rem
- **H3:** 20px / 1.25rem
- **Body:** 16px / 1rem
- **Small:** 14px / 0.875rem
- **Tiny:** 12px / 0.75rem

### Iconography
- **Style:** Thin, rounded stroke (e.g., Lucide, Heroicons outline)
- **Active State:** Solid fill
- **Size:** 20px standard, 16px small, 24px large

### Motion & Animation
- **Duration:** 150-200ms for most transitions
- **Easing:**
  - Entrance: ease-out
  - Exit: ease-in
- **Principles:**
  - No parallax effects
  - No glassmorphism
  - No gradients
  - Snappy, functional animations only

### Component Styling Rules
- **Border Radius:** 8-12px for cards, 10px for time blocks
- **Padding:** 12-16px standard
- **CTA Buttons:** Pink (#F11D75) for primary actions
- **Category Buttons:** Use category's assigned color
- **Spacing:** Generous whitespace, never full-bleed color blocks

---

## User Stories

### As a New User
1. I want to sign up easily so I can start tracking immediately
2. I want to set up my initial categories so I can begin logging
3. I want to understand the app's purpose so I know how to use it effectively

### As a Daily User
4. I want to start a timer for my current activity so I can log time automatically
5. I want to manually add past activities so I can fill in gaps
6. I want to see my day at a glance so I understand how I spent my time
7. I want to edit time blocks easily so I can correct mistakes
8. I want to add notes to sessions so I can reflect on what happened
9. I want to rate session quality so I can track effectiveness

### As a Weekly User
10. I want to view weekly summaries so I can see patterns
11. I want to see insights about my time allocation so I can make better decisions
12. I want to track progress toward mastery goals so I stay motivated
13. I want AI-generated summaries so I can quickly review my week

### As a Mastery Seeker
14. I want to designate certain categories as skills so I can track toward 10,000 hours
15. I want to see my current pace so I know if I'm on track
16. I want to set a target mastery date so I can calculate required effort
17. I want quality-weighted tracking so only good practice counts

### As a Data-Driven User
18. I want to export my data so I can analyze it externally
19. I want to see heat maps and charts so I can understand patterns visually
20. I want to filter insights by category so I can focus on specific areas

### As a Privacy-Conscious User
21. I want to control AI features so my data stays private
22. I want to delete my account easily so I have full control
23. I want to know where my data goes so I can trust the app

---

## Edge Cases & Data Rules

### Overlapping Sessions
- **Prevention:** Warn user before creating overlapping session
- **Import:** If importing data with overlaps, flag and prompt to resolve
- **Display:** Show subtle outline on overlapping blocks in timeline

### Invalid Durations
- **Zero Duration:** Block with friendly error message
- **Negative Duration:** Prevent via validation (end must be after start)
- **Very Long Sessions:** Warn if session exceeds 12 hours (possible error)

### Timezone Handling
- **Storage:** All timestamps stored in UTC
- **Display:** Converted to user's local timezone
- **DST:** Properly handle daylight saving transitions
- **Travel:** Users can change timezone, historical data remains anchored to original timezone

### Running Sessions
- **One at a time:** Only one session can be running
- **Browser Close:** Session continues running (stored in DB)
- **Auto-Stop:** Optional setting to auto-stop after X hours of inactivity

### Unsaved Data
- **Notes:** Auto-save every 5 seconds while typing
- **Timer:** Immediately saved to database on start
- **Edits:** Prompt user if they try to leave with unsaved changes

### Offline Behavior
- **Future:** Log to IndexedDB, sync when online
- **V1:** Require internet connection

### Data Rounding
- **Display:** Show rounded values based on user preference (1/5/15 min)
- **Storage:** Store exact minutes for accuracy
- **Calculations:** Use exact values for all computations

---

## AI Features (Privacy-Respecting)

### Session Note Summarization
- **Input:** Single note text
- **Output:** TL;DR (2-3 sentences) + bullet points of action items
- **Privacy:** Only note text sent to AI, no personal identifiers

### Daily Brief
- **Input:** All notes from a single day
- **Output:** Bullet summary of activities + optional "tomorrow nudge"
- **Usage:** Can be delivered as notification

### Weekly Insight
- **Input:** Aggregated time data + notes for a week
- **Output:**
  - Anomalies (unusual patterns)
  - Pace toward mastery per skill
  - Time swings by category (increases/decreases)
- **Privacy:** Anonymized patterns sent, not raw notes

### Predictive Pacing
- **Input:** Target mastery date, current progress, historical pace
- **Output:** Required weekly hours, gap analysis, simple progress plan
- **Method:** Client-side calculation, no AI needed

### Auto-Suggest Category
- **Input:** Activity text (e.g., "standup meeting")
- **Output:** Suggested category based on past patterns
- **Method:** Client-side heuristic first, optional server-side ML model
- **Privacy:** Uses only user's own historical data

### User Controls
- **Enable/Disable Toggle:** Clear switch to turn off all AI features
- **Transparency:** Show exactly what text is sent to AI
- **Data Storage:** Store summaries locally, not prompts sent to AI
- **Provider Choice:** Optional field for custom AI API key

---

## Launch Plan

### Milestone 1: Core Logging (Weeks 1-2)

**Goal:** Users can track time and view basic timeline

**Features:**
- [ ] Authentication with Clerk (sign up, sign in, profile)
- [ ] User settings (timezone, preferences)
- [ ] Categories CRUD with color picker
- [ ] Start/stop timer on Now page
- [ ] Manual add session with time picker
- [ ] Edit time block in side panel
- [ ] Day timeline view with drag-to-resize
- [ ] Basic insights (totals by category, simple bar chart)
- [ ] CSV export

**Success Criteria:**
- Can create account and log in
- Can create 5+ categories with different colors
- Can log full day of activities (manual and timer)
- Can see day timeline with all sessions
- Can export data to CSV

### Milestone 2: Notes + AI (Weeks 3-4)

**Goal:** Users can reflect on their time and get insights

**Features:**
- [ ] Notes composer with session linking
- [ ] Notes list and search
- [ ] Quality rating for sessions (1-5 stars)
- [ ] Daily and weekly AI summaries
- [ ] Basic mastery tracking (progress to 10k)
- [ ] Keyboard shortcuts (S, P, N, ⌘K)
- [ ] Tags for sessions and notes

**Success Criteria:**
- Can write notes and link to sessions
- Can search notes by keyword
- Can see AI-generated daily summary
- Can view mastery progress for skill categories
- Can use keyboard shortcuts for common actions

### Milestone 3: Polish (Weeks 5-6)

**Goal:** Rich visualizations and seamless UX

**Features:**
- [ ] Week timeline view
- [ ] Heat map (hour x category)
- [ ] Radial mastery rings (ECharts/Recharts)
- [ ] Sparklines for category trends
- [ ] Unassigned time prompts
- [ ] Calendar import (Google Calendar)
- [ ] Sleep/fitness CSV import
- [ ] Empty states for all pages
- [ ] Onboarding flow with starter categories
- [ ] Microcopy polish

**Success Criteria:**
- Can view and edit week timeline
- Charts are colorful and performant
- Onboarding guides new users effectively
- All empty states provide helpful guidance
- Can import external data sources

### Milestone 4: Hardening (Ongoing)

**Goal:** Production-ready quality and reliability

**Features:**
- [ ] Comprehensive unit tests (Vitest)
- [ ] E2E tests (Playwright) for critical flows
- [ ] Accessibility audit and fixes (WCAG AA)
- [ ] Error telemetry (Sentry or similar)
- [ ] Performance monitoring
- [ ] Cron job reliability for summaries
- [ ] Security audit
- [ ] Load testing
- [ ] Documentation (user guide, API docs)

**Success Criteria:**
- 80%+ test coverage on critical paths
- All E2E tests passing
- WCAG AA compliant
- Error rate < 0.1%
- P95 load time < 3s
- No critical security vulnerabilities

---

## Key UI Components

### Global Components
1. **CategoryChip** – Color dot + name, used everywhere
2. **CategoryPickerModal** – Grid of categories with color dots
3. **ColorPicker** – Grid of 8 accent tokens
4. **QuickAddDialog** – Global ⌘K command palette

### Now Page Components
5. **TimerDial** – Canvas/SVG dial + digital fallback
6. **ActivitySuggestions** – Recent activities list
7. **SessionControls** – Start/pause/stop buttons
8. **MiniReviewDialog** – Quality rating + note after stop

### Timeline Components
9. **TimeBlock** – Individual session rectangle
10. **TimelineGrid** – 24-hour or 7-day grid
11. **SessionEditorSheet** – Side panel for editing
12. **UnassignedTimePrompt** – Zebra stripes + "log this" message

### Insights Components
13. **OverviewCard** – Metric card with value and trend
14. **StackedBarChart** – Daily/weekly distribution
15. **RadialProgress** – Mastery tracking ring
16. **HeatMap** – Hour x category grid
17. **AIInsightTile** – Auto-generated insight card
18. **FilterBar** – Time range, category filters

### Notes Components
19. **NoteComposer** – Large textarea with formatting
20. **NoteCard** – Note preview in list
21. **NoteSearchBar** – Full-text search with filters

### Categories Components
22. **CategoryRow** – List item with actions
23. **CategoryEditor** – Modal for create/edit

### Settings Components
24. **SettingsSection** – Grouped settings with labels
25. **ExportButton** – CSV/JSON download trigger

### Shared Components
26. **EmptyState** – Illustration + message + CTA
27. **LoadingState** – Skeleton loaders
28. **ErrorState** – Error message + retry button
29. **ConfirmDialog** – Delete/destructive action confirmation

---

## Microcopy Reference

### Empty States
- **Timeline (Day):** "No logs yet. Drag anywhere to add a block or press S to start a timer."
- **Timeline (Week):** "Your week is a blank canvas. Start logging to see patterns emerge."
- **Notes:** "Write it down while it's fresh. What worked? What hurt?"
- **Insights:** "Log some time to see insights appear here."
- **Categories:** "Create categories to start organizing your time."

### Prompts
- **Activity Input:** "what are you doing?"
- **Note Input:** "what happened? any highlights or blockers?"
- **Stop Timer:** "how'd it go?" (with star rating)
- **Quality Rating:** "add a quick note so future-you learns faster."

### Guidance
- **Categories Tip:** "Pick colors that read well on dark. You can change anytime."
- **Mastery Toggle:** "Toggle 'counts toward mastery' for skills you want to chase."
- **Insights Header:** "Truth over vibes. Here's where your week actually went."

### Mastery Tracking
- **Pace Display:** "At your current pace (14.2h/week) you'll hit coding mastery Nov 2030. +4.3h/week pulls it into Jul 2029."
- **Progress Ring:** "1,247 / 10,000 hours (12.5%)"

### AI Features
- **Summary Example:** "You spent 12h (+30%) on coding vs. last week."
- **Pacing Insight:** "To hit 10k hours in ML Engineering by 2028, average 18.5h/week (you're at 14.2)."

---

## Success Metrics & KPIs

### Engagement Metrics
- **Daily Active Users (DAU):** Target 70%+ of weekly users
- **Average Sessions Logged per User per Week:** Target 30+ (indicates comprehensive tracking)
- **Average Time Logged per User per Day:** Target 16+ hours (indicates 24-hour coverage)
- **Return Rate to Insights Page:** Target 2+ times per week

### Quality Metrics
- **Sessions with Notes:** Target 30%+
- **Sessions with Quality Ratings:** Target 50%+
- **Categories Flagged as Skills:** Target 1.5 avg per user
- **Complete Day Coverage (20+ hours logged):** Target 40% of active users

### Retention Metrics
- **7-Day Retention:** Target 60%
- **30-Day Retention:** Target 40%
- **90-Day Retention:** Target 25%

### Feature Adoption
- **Users Using Timer:** 80%+
- **Users Using Manual Entry:** 90%+
- **Users Viewing Insights Weekly:** 70%+
- **Users with AI Summaries Enabled:** 60%+
- **Users Exporting Data:** 20%+

### Performance Metrics
- **Page Load Time (P95):** < 3.0s
- **Time to First Session Logged:** < 2 minutes from signup
- **API Response Time (P95):** < 200ms

---

## Risks & Mitigations

### Risk 1: User Drop-Off (Too Complex)
**Mitigation:**
- Simple, guided onboarding
- Progressive disclosure of features
- Clear empty states and tooltips
- Start with timer (easiest entry point)

### Risk 2: 24-Hour Tracking Feels Overwhelming
**Mitigation:**
- Emphasize "tracking truth" not "perfect logging"
- Allow gaps (unassigned time)
- Quick-fill suggestions for common patterns
- Show value of insights early

### Risk 3: Competition from Established Apps
**Mitigation:**
- Unique positioning: 24-hour + mastery tracking
- Superior design (dark UI, colorful, modern)
- Free forever (no paywalls)
- Focus on life-tracking, not just work

### Risk 4: AI Costs
**Mitigation:**
- Summarization on-demand, not automatic for all
- Cache summaries aggressively
- Offer user-provided API keys
- Use efficient models (GPT-3.5-turbo or similar)

### Risk 5: Data Privacy Concerns
**Mitigation:**
- Clear privacy policy
- AI opt-out toggle
- Transparency about data usage
- No data selling, ever
- Easy data export and deletion

### Risk 6: Poor Chart Performance
**Mitigation:**
- Virtualize timeline (only render visible range)
- Code-split chart libraries
- Use efficient chart library (ECharts)
- Limit default date ranges shown

---

## Post-V1 Roadmap

### Near-Term (Months 2-6)
- Mobile Progressive Web App (PWA) with offline support
- Background timer notifications
- Calendar integrations (Google, Outlook, Apple)
- Fitness tracker imports (Apple Health, Fitbit)
- Template library for common activity patterns
- Public "brag card" image generator
- Streak goals and achievements

### Mid-Term (Months 6-12)
- Team/workspace features (shared categories, leaderboards)
- Friend following and progress sharing
- Advanced AI coaching ("you always crash on Thursdays—try...")
- API for power users and integrations
- Browser extension for quick logging
- Pomodoro-style session presets (optional)

### Long-Term (Year 2+)
- Mobile native apps (iOS, Android)
- Wearable integration (Apple Watch, Garmin)
- Community features (forums, shared insights)
- Marketplace for templates and categories
- AI-powered goal setting and planning
- Multi-language support

---

## Open Questions & Decisions Needed

### Immediate
1. **Chart Library:** ECharts vs Recharts—final decision based on prototype
2. **Date Library:** Day.js vs Luxon—test timezone handling
3. **AI Provider:** OpenAI (expensive, reliable) vs alternatives (cheaper, variable quality)

### Soon
4. **Onboarding Length:** 5 steps or 3 steps? Test with users
5. **Default Categories:** Which 5-8 categories to suggest?
6. **Timer Dial Design:** Canvas, SVG, or pure CSS? Prototype needed
7. **Weekly Summary Timing:** When to send? Sunday evening vs Monday morning

### Future
8. **Monetization:** Truly free forever, or premium features later?
9. **Team Features:** Priority for V2 or V3?
10. **Mobile Native:** Worth the investment vs responsive web?

---

## Conclusion

10,000hours.com represents a fresh approach to time tracking: comprehensive, judgment-free awareness of how we spend all 24 hours of our day, combined with motivating progress toward mastery in chosen skills. By removing the "productivity shame" common in focus apps and embracing a holistic view of time—including sleep, meals, leisure, and work—we create space for honest reflection and intentional improvement.

The product stands out through:
1. **Unique positioning:** 24-hour life tracking + mastery via the 10,000-hour rule
2. **Beautiful design:** Dark UI with vibrant accents, flat colors, modern aesthetic
3. **Free forever:** No paywalls, no paid tiers
4. **Privacy-first:** User data stays private, AI is optional
5. **Insights-driven:** Beautiful visualizations that reveal patterns and truth

This PRD provides the foundation for building V1 and scaling beyond. Success will be measured not just by users acquired, but by users who consistently log their time, gain insights, and make progress toward their mastery goals.

**Next Steps:**
1. Review and approve PRD with stakeholders
2. Create detailed technical specifications
3. Design mockups for key screens
4. Set up development environment
5. Begin Milestone 1 implementation

---

**Document Version:** 1.0  
**Status:** Draft for Review  
**Last Updated:** 2025-11-08  
**Next Review:** After initial feedback
