# 10,000hours.com

A comprehensive 24-hour time tracking web application focused on helping users understand how they spend every hour of their day and track progress toward mastery goals using the 10,000-hour rule.

## Philosophy

- **Time truth over focus hacks** – This is a ledger for hours, not a pomodoro babysitter
- **24-hour coverage** – Log everything: sleep, work, meals, leisure
- **Notes-first approach** – Every time block can have a note
- **Mastery tracking** – Progress toward 10,000 quality-weighted hours

## Getting Started

### Prerequisites

- Node.js 18+ or npm/pnpm
- MongoDB Atlas account (or local MongoDB)
- Clerk account for authentication (optional for initial development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tenthousandhours.git
cd tenthousandhours
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Create a `.env.local` file (see `.env.example`):
```bash
cp .env.example .env.local
```

4. Add your environment variables to `.env.local`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test

# Run E2E tests
npm run test:e2e
```

## Project Structure

```
tenthousandhours/
├── app/                    # Next.js App Router pages
│   ├── app/               # Authenticated app shell
│   │   ├── now/          # Timer / Quick Log
│   │   ├── timeline/     # Day and Week views
│   │   ├── insights/     # Analytics dashboard
│   │   ├── notes/        # Notes list + editor
│   │   ├── categories/   # Manage categories
│   │   └── settings/     # Profile, preferences
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── components/            # React components
│   └── ui/               # Design system components
├── lib/                   # Utilities and helpers
│   ├── types.ts          # TypeScript types
│   ├── schemas.ts        # Zod validation schemas
│   └── utils.ts          # Utility functions
├── docs/                  # Documentation
└── public/               # Static assets
```

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS with custom design tokens
- **UI Components:** Radix UI primitives
- **State Management:** TanStack Query + Zustand
- **Database:** MongoDB Atlas
- **Authentication:** Clerk
- **Validation:** Zod
- **Date/Time:** Day.js

## Design System

The app uses a dark-only theme with:
- Flat colors (no gradients, glassmorphism, or neumorphism)
- 8 category accent colors
- Inter font family
- 150-200ms transitions
- WCAG AA contrast ratios

See `/docs/ui-guidelines.md` for complete design specifications.

## Key Features (V1)

- ✅ Timer-based and manual time logging
- ✅ Category management with color customization
- ✅ Day and week timeline views
- ⏳ Notes linked to sessions
- ⏳ Quality ratings (1-5 stars)
- ⏳ Mastery tracking (progress to 10,000 hours)
- ⏳ AI-powered summaries
- ⏳ Analytics and insights
- ⏳ Data export (CSV/JSON)

## Documentation

- [Product Requirements Document](/docs/PRD.md)
- [Technical Architecture](/docs/tech-stack-overview.md)
- [UI Guidelines](/docs/ui-guidelines.md)
- [App Flow](/docs/app-flow.md)
- [Development Plan](/docs/plan.md)

## Contributing

This is currently a personal project. If you'd like to contribute, please open an issue first to discuss proposed changes.

## License

MIT
