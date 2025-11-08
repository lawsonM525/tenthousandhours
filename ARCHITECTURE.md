# Architecture Overview - 10,000hours.com

## System Architecture

This document provides a high-level overview of the application architecture, data flow, and key technical decisions.

## Technology Stack

### Frontend
- **Framework**: Next.js 16.0.1 with App Router
- **UI Library**: React 19.2.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand (planned), TanStack Query (planned)
- **Authentication**: Clerk
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **API**: Next.js API Routes (serverless)
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Authentication**: Clerk JWT verification
- **AI Integration**: OpenAI API (planned)

### Infrastructure
- **Hosting**: Vercel (recommended)
- **Database**: MongoDB Atlas
- **CDN**: Vercel Edge Network
- **Authentication**: Clerk (managed service)

## Application Structure

### Route Groups

```
app/
├── (auth)/          # Public authentication routes
│   ├── sign-in/     # Clerk sign-in page
│   └── sign-up/     # Clerk sign-up page
│
├── (app)/           # Protected application routes
│   ├── now/         # Timer and quick logging
│   ├── timeline/    # Day and week calendar views
│   ├── insights/    # Analytics dashboard
│   ├── notes/       # Notes management
│   ├── categories/  # Category CRUD
│   └── settings/    # User preferences
│
├── api/             # API routes
│   ├── categories/  # Category endpoints
│   ├── sessions/    # Session (time block) endpoints
│   ├── notes/       # Note endpoints (planned)
│   └── user/        # User profile endpoints
│
├── layout.tsx       # Root layout with ClerkProvider
└── page.tsx         # Public landing page
```

## Data Models

### User
- Stores Clerk user ID and profile info
- Settings: time rounding, week start, timezone, AI preferences
- Created automatically on first sign-in
- Default categories are created for new users

### Category
- User-defined time categories
- Properties: name, color (8 fixed colors), type, mastery flag
- Types: skill, life-maintenance, admin, social, other
- Color palette: Pink, Teal, Blue, Violet, Lime, Amber, Red, Cyan

### Session
- Time blocks logged by users
- Properties: category, title, start, end, duration, quality rating
- Quality: 1-5 scale (optional)
- Can be linked to notes
- Supports tags for additional categorization

### Note
- Rich text notes linked to sessions
- Can be attached to multiple sessions
- Full-text search enabled
- AI summaries (planned)

## Authentication Flow

1. User visits protected route
2. Middleware intercepts request
3. Clerk verifies JWT token
4. If valid, request proceeds; otherwise redirects to sign-in
5. On first sign-in, user record is created with defaults

## Data Flow

### Timer Flow (Now Page)
1. User selects category and enters activity
2. Clicks "Start Logging"
3. Session created with start time, no end time
4. Timer runs in UI (client-side)
5. User clicks "Finish Log"
6. Session updated with end time and duration
7. Optional quality rating dialog
8. Session saved to database

### Timeline Flow
1. Page requests sessions for date range
2. API fetches from MongoDB with filters
3. Sessions rendered as colored blocks
4. User can drag to resize or move
5. Changes saved via API

### Insights Flow
1. Page requests aggregated data
2. API runs MongoDB aggregation pipelines
3. Data transformed for charts
4. Recharts renders visualizations
5. Filters update query parameters

## Security

### Authentication
- All `/app/*` routes protected by Clerk middleware
- JWTs verified on every API request
- No sensitive data in client-side storage

### Authorization
- Every database query filtered by userId
- No cross-user data access possible
- Row-level security enforced

### Data Privacy
- Encryption at rest (MongoDB Atlas)
- Encryption in transit (TLS)
- AI features opt-in only
- Clear data export and deletion paths

## Performance Optimizations

### Frontend
- Code splitting by route
- Dynamic imports for heavy components
- Tailwind CSS purging unused styles
- Image optimization (Next.js Image)

### Backend
- Database indexes on common queries
- Connection pooling for MongoDB
- Cached authentication checks
- API route caching where appropriate

### Database
- Compound indexes on userId + timestamp
- Full-text index on notes
- Aggregation pipelines for analytics
- Time-series collections (planned)

## Design System

### Color Tokens
```css
--bg-base: #0B0D10        (primary background)
--bg-surface: #111418     (cards, panels)
--bg-elevated: #151A1F    (modals, popovers)
--text-primary: #E9EDF1   (body text)
--text-secondary: #B2BCC9 (supporting text)
--text-muted: #6B7684     (hints, placeholders)
--cta-pink: #F11D75       (primary actions)
```

### Typography
- Font: Inter (system sans-serif fallback)
- Weights: 400, 500, 600
- Scale: 12px to 48px
- Line heights: 1.2 to 1.5

### Components
- Button: Primary, Secondary, Ghost, Danger variants
- Cards: Rounded 10px, surface background
- Navigation: Sidebar (desktop), Bottom tabs (mobile)
- Forms: Dark inputs with subtle borders

## API Design

### RESTful Endpoints

**Categories**
- `GET /api/categories` - List user's categories
- `POST /api/categories` - Create new category
- `PATCH /api/categories/:id` - Update category (planned)
- `DELETE /api/categories/:id` - Archive category (planned)

**Sessions**
- `GET /api/sessions?from=&to=&categoryId=` - List sessions
- `POST /api/sessions` - Create session (timer or manual)
- `PATCH /api/sessions/:id` - Update session (planned)
- `DELETE /api/sessions/:id` - Delete session (planned)

**User**
- `GET /api/user` - Get/create user profile
- `PATCH /api/user` - Update user settings

### Response Format
```json
{
  "data": { ... },
  "error": null
}
```

### Error Handling
- 401: Unauthorized (no auth token)
- 404: Resource not found
- 500: Server error
- Errors logged to console (Sentry planned)

## Deployment

### Vercel Deployment
1. Connect GitHub repository
2. Configure environment variables
3. Automatic deployments on push
4. Preview deployments for PRs
5. Production deployment on main branch

### Environment Variables Required
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `MONGODB_URI`
- `OPENAI_API_KEY` (optional)

## Future Enhancements

### Phase 2
- State management with Zustand
- Data fetching with TanStack Query
- Full timer implementation with persistence
- Drag-and-drop timeline editing
- Charts and visualizations

### Phase 3
- AI-powered note summaries
- Mastery progress tracking (10,000 hours)
- Advanced analytics and insights
- Data export (CSV/JSON)
- Onboarding flow

### Phase 4
- Real-time collaboration (planned)
- Mobile PWA
- Calendar integrations
- Advanced AI features
- Public profile pages

## Development Guidelines

### Code Style
- TypeScript strict mode
- ESLint for code quality
- Prettier for formatting (planned)
- Functional components with hooks
- Descriptive variable names

### Component Structure
```tsx
// 1. Imports
import React from 'react';

// 2. Types/Interfaces
interface Props {
  ...
}

// 3. Component
export function Component({ ...props }: Props) {
  // 4. Hooks
  // 5. Handlers
  // 6. Render
  return (...)
}
```

### File Organization
- One component per file
- Co-located styles (Tailwind)
- Separate API logic from UI
- Shared utilities in `/lib`

## Testing Strategy (Planned)

### Unit Tests
- Vitest for logic testing
- Test utilities and helpers
- Test data transformations

### Integration Tests
- API route testing
- Database operations
- Authentication flows

### E2E Tests
- Playwright for user flows
- Critical paths: sign-up, logging time, viewing insights
- Run on CI/CD pipeline

## Monitoring (Planned)

### Error Tracking
- Sentry for error reporting
- Source maps for debugging
- User context in errors

### Analytics
- User engagement metrics
- Feature usage tracking
- Performance monitoring

### Logging
- Structured logging
- Different levels (info, warn, error)
- Request/response logging

## Contributing

See individual documentation files:
- `/docs/PRD.md` - Product requirements
- `/docs/ui-guidelines.md` - Design system
- `/docs/app-flow.md` - User flows
- `/docs/tech-stack-overview.md` - Technical details

---

For questions or issues, refer to the documentation in `/docs/` or open an issue on GitHub.
