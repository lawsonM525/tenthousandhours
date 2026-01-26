# PostHog post-wizard report

The wizard has completed a deep integration of your 10,000 Hours time tracking application with PostHog. This integration provides comprehensive analytics across the entire user journey, from landing page engagement through focus session tracking and user lifecycle management.

## Integration Summary

### Client-Side Setup
- **instrumentation-client.ts**: Created PostHog initialization file using the recommended Next.js 15.3+ approach with automatic pageview tracking, exception capture, and reverse proxy configuration.
- **next.config.js**: Added reverse proxy rewrites to route PostHog traffic through `/ingest` for improved reliability against ad blockers.

### Server-Side Setup
- **lib/posthog-server.ts**: Created server-side PostHog client for API route event tracking with optimized flush settings for serverless environments.

### Event Tracking Implementation

| Event Name | Description | File(s) |
|------------|-------------|---------|
| `session_started` | User starts a new focus session | `components/ui/countdown-timer.tsx` |
| `session_completed` | User completes a focus session | `components/ui/countdown-timer.tsx` |
| `session_rated` | User rates their focus quality | `components/ui/session-complete-dialog.tsx` |
| `note_added` | User adds a reflection note | `components/ui/session-complete-dialog.tsx` |
| `category_created` | User creates a tracking category | `app/app/categories/page.tsx` |
| `category_updated` | User edits a category | `app/app/categories/page.tsx` |
| `category_deleted` | User deletes/archives a category | `app/app/categories/page.tsx` |
| `timer_preset_selected` | User selects a quick preset duration | `app/app/now/page.tsx` |
| `insights_viewed` | User views the insights page | `app/app/insights/page.tsx` |
| `timeline_viewed` | User views the timeline page | `app/app/timeline/page.tsx` |
| `cta_clicked` | User clicks landing page CTAs | `components/landing-cta.tsx`, `app/page.tsx` |
| `api_session_created` | Server-side session creation | `app/api/sessions/route.ts` |
| `api_category_created` | Server-side category creation | `app/api/categories/route.ts` |
| `user_signed_up` | New user registration via Clerk | `app/api/webhooks/route.ts` |

### Environment Variables

The following environment variables are configured in `.env.local`:
```
NEXT_PUBLIC_POSTHOG_KEY=phc_SW5JOrqu0JipXWW5hbEZqrjtLoQkLojA9dL4KsTg5ST
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- **Analytics basics**: [https://us.posthog.com/project/298559/dashboard/1128699](https://us.posthog.com/project/298559/dashboard/1128699)

### Insights
- **Sessions Started by Day**: [https://us.posthog.com/project/298559/insights/u2zWtJT4](https://us.posthog.com/project/298559/insights/u2zWtJT4) - Tracks daily focus session activity
- **Session Completion Funnel**: [https://us.posthog.com/project/298559/insights/IXDfqrka](https://us.posthog.com/project/298559/insights/IXDfqrka) - Conversion from session start to completion to rating
- **User Signup to First Session**: [https://us.posthog.com/project/298559/insights/1sz8uSpe](https://us.posthog.com/project/298559/insights/1sz8uSpe) - Onboarding funnel tracking activation
- **Landing Page CTA Performance**: [https://us.posthog.com/project/298559/insights/065oIe7g](https://us.posthog.com/project/298559/insights/065oIe7g) - CTA click tracking by location
- **Focus Rating Distribution**: [https://us.posthog.com/project/298559/insights/Ct9l70OM](https://us.posthog.com/project/298559/insights/Ct9l70OM) - User focus quality ratings breakdown

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
