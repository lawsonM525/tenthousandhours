# 10,000hours.com

A comprehensive time tracking web application designed to help users gain insight into how they spend every hour of their day. Track your path to mastery using the 10,000-hour rule.

## Overview

10,000hours.com embraces the philosophy that awareness drives behavior change. By tracking all 24 hours daily—including sleep, eating, work, and leisure—users can see the truth about their time allocation and consciously work toward mastery in their chosen skills.

### Key Features

- **24-Hour Time Tracking** - Log every minute of your day with timer or manual entry
- **Beautiful Visualizations** - See patterns emerge with colorful charts and insights
- **Mastery Progress Tracking** - Track your path to 10,000 hours in any skill
- **AI-Powered Insights** - Get smart summaries and discover time patterns
- **Notes & Reflection** - Add context to your time with rich notes
- **Dark Theme UI** - Beautiful flat design with vibrant accents

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18+, TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Authentication**: Clerk
- **Database**: MongoDB Atlas with Mongoose
- **State Management**: Zustand, TanStack Query
- **Charts**: Recharts
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or Atlas)
- Clerk account for authentication

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Get from Clerk Dashboard
- `CLERK_SECRET_KEY` - Get from Clerk Dashboard
- `MONGODB_URI` - Your MongoDB connection string
- `OPENAI_API_KEY` - (Optional) For AI features

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (app)/           # Main application pages
│   │   ├── now/         # Timer/quick log page
│   │   ├── timeline/    # Day/week calendar views
│   │   ├── insights/    # Analytics dashboard
│   │   ├── notes/       # Notes management
│   │   ├── categories/  # Category management
│   │   └── settings/    # User settings
│   ├── api/             # API routes
│   └── layout.tsx       # Root layout
├── components/          # Reusable components
├── lib/
│   ├── models/          # Mongoose models
│   ├── mongodb.ts       # Database connection
│   └── utils/           # Utility functions
├── docs/                # Project documentation
│   ├── PRD.md
│   ├── plan.md
│   ├── tech-stack-overview.md
│   ├── app-flow.md
│   └── ui-guidelines.md
└── public/              # Static assets
```

## Documentation

Comprehensive planning documents are available in the `/docs` directory:

- **PRD.md** - Full Product Requirements Document
- **plan.md** - Product principles and planning
- **tech-stack-overview.md** - Technical architecture details
- **app-flow.md** - User flows and data contracts
- **ui-guidelines.md** - Design system and component guidelines

## Design System

The app uses a dark-first design system with:

- **Backgrounds**: #0B0D10 (base), #111418 (surface), #151A1F (elevated)
- **Text**: #E9EDF1 (primary), #B2BCC9 (secondary), #6B7684 (muted)
- **Primary CTA**: #F11D75 (pink)
- **Category Colors**: 8 vibrant flat colors (Pink, Teal, Blue, Violet, Lime, Amber, Red, Cyan)

## Development

### Running Tests

```bash
npm run test        # Run unit tests
npm run test:e2e    # Run E2E tests
```

### Linting

```bash
npm run lint
```

## Deployment

The app is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy!

## Contributing

This project follows the PRD and design specifications in the `/docs` directory. Please review these before contributing.

## License

Private project - All rights reserved

## Support

For issues or questions, please refer to the documentation in the `/docs` directory.
