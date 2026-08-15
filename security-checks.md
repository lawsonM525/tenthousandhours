# Security Checklist for 10,000hours

This checklist captures the current security expectations for the 10,000hours stack (Next.js, Clerk, MongoDB Atlas, ECharts, optional PWA features, CSV/ICS imports, AI summaries). Treat it as the living "don't get owned" reference before every launch.

## Threat Model & Data Classification
- **Data types**
  - Account identifiers (email, name, photo) → personal
  - Time logs (sleep, spirituality, relationships, etc.) and notes → sensitive personal
  - OAuth tokens (calendar) → high sensitivity
- **Attack surfaces**
  - Web app (XSS/CSRF/IDOR)
  - API routes & webhooks
  - File import/export (CSV/ICS)
  - Offline cache (IndexedDB)
  - AI summary endpoint
  - Supply chain (npm dependencies, CI/CD)
  - Cloud infrastructure (Atlas, Vercel, worker)
- **Principles**: least privilege, data minimization, safe by default.

## Authentication & Authorization (Clerk + API)
- Verify every request server-side via Clerk; never trust a client-provided userId.
- Implement helpers such as `requireUser()` returning `{ userId }` and `ownedQuery(collection)` to auto-inject `{ userId }` predicates.
- Enforce row-level isolation: never fetch solely by `_id` without the matching `userId`.
- Sessions & cookies must be HTTPS-only, `Secure`, `HttpOnly`, and `SameSite=Lax` (or `Strict` if cross-site not required).
- Add CSRF tokens for cookie-based mutations (double-submit or header-based strategies).
- Encourage 2FA in Clerk; enforce it for any admin surface.

## Input Validation & Output Encoding
- Use Zod on every API input; reject unknown fields (strip) and clamp ranges (e.g., duration 1–1440 minutes).
- Store notes as plain text; escape on output. If markdown is enabled, sanitize with DOMPurify server-side with a minimal whitelist.
- Impose limits on tags/titles (e.g., title ≤ 80 chars, ≤ 10 tags, restricted character set).
- File uploads: whitelist MIME (`text/csv`, `text/calendar`), set max size (2–5 MB), and parse server-side only.

## Data Store (MongoDB Atlas)
- Restrict network access via PrivateLink or specific IP allow-lists; never `0.0.0.0/0`.
- Database users: app user has read/write on app DB only (no `dbOwner`); separate admin credentials outside runtime.
- Encryption: rely on Atlas at rest + TLS in transit. Rotate DB credentials every 90 days.
- Ensure every query is scoped by `userId`; consider ESLint rules or wrappers to prevent unscoped access.
- Enable continuous backups (PITR), document recovery steps, and test restores quarterly.

## Multi-tenancy Protections
- Perform joins/enrichment server-side with consistent `userId` filtering.
- Summary collections must include keys `{ userId, periodStart }`; never aggregate across users.

## API & Rate Limiting
- Rate-limit per IP and per user (e.g., Upstash Redis):
  - Writes: 60/min
  - AI summaries: 10/day
  - Exports: 2/hour
- Configure Next.js body parser limits (e.g., 512 KB default; increase only for imports).
- Set server timeouts to 15s and return graceful 504 responses.
- Keep error responses generic; avoid leaking stack traces or query strings to clients.

## File Import / Export Safety (CSV, ICS)
- Validate content: sniff MIME, check magic bytes; reject mismatches.
- Impose size/row caps (≤ 5 MB, ≤ 50k rows).
- Harden parsing: stream parse, limit columns, neutralize formula injection (`=cmd()` etc.).
- Prevent SSRF: accept only direct uploads; never fetch remote URLs.
- Handle storage in memory or temp disk; never persist raw files.
- Generate exports server-side with short-lived signed URLs (≤ 5 minutes) and `Cache-Control: no-store`.

## Front-end & Browser Security
- Apply a strict Content Security Policy:
  ```
  Content-Security-Policy:
    default-src 'self';
    script-src 'self';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob:;
    font-src 'self';
    connect-src 'self' https://api.clerk.com https://*.clerk.accounts.dev;
    frame-ancestors 'none';
    base-uri 'none';
    form-action 'self';
  ```
  - Adjust `connect-src` for Atlas Data API or workers as needed.
- Security headers:
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), fullscreen=(self)`
- CORS: allow only app origins; never use `*` with credentials.
- PWA/service worker: cache static assets only; never cache user data. Add `Cache-Control: no-store` to personalized endpoints.

## XSS, CSRF, Clickjacking
- Escape all note content and user strings before rendering (including chart tooltips).
- Use CSRF tokens when using cookies for mutations; bearer tokens from Clerk mitigate most CSRF risk.
- Block clickjacking with `X-Frame-Options: DENY` and `frame-ancestors 'none'`.

## Offline & Device Security
- IndexedDB: store minimal session buffers and pending writes only.
- Offer optional local encryption for notes via user passphrase (derive with Argon2id, PBKDF2-SHA256, or scrypt; keep key in memory).
- Provide a "don’t keep data offline" setting for shared devices.
- Optional screen lock (biometric/passcode) for mobile app access.

## AI Features Security
- Make AI summaries opt-in and disclose exactly what text is sent.
- Treat notes as untrusted; constrain the model to summarization with no tool use or external calls.
- Allow users to mark categories as "do not send to AI" and exclude them from payloads.

## Logging, Metrics & Privacy
- Avoid logging note bodies or session titles.
- Use structured logs with request IDs; redact emails by default.
- Compliance basics (GDPR/CCPA):
  - Enable data export.
  - Support account deletion cascading to sessions, notes, summaries, tokens.
  - Disclose data residency (e.g., us-east).
  - Define retention for raw server logs (14–30 days) and enforce it.

## Integrations (OAuth, Webhooks)
- Request minimum scopes (calendar read-only).
- Store tokens encrypted at rest (KMS/AES) and rotate refresh tokens when possible.
- Verify Clerk webhooks (signature + timestamp) with ≤ 5 minute replay window.
- Provide one-click revoke & purge for token disconnect.

## Supply Chain & CI/CD
- Pin dependencies; use npm audit/Dependabot. Avoid abandoned libraries or CDN copy-paste.
- Verify checksums for downloaded binaries; commit lockfiles.
- Keep secrets in Vercel/env or worker env only; never ship them to clients. Rotate on staffing changes.
- Run lightweight SAST/DAST (ESLint security rules, `@typescript-eslint`, ZAP/Burp on staging).
- Prevent secret leaks with commit discipline (e.g., gitleaks pre-commit hook).

## DDoS & Abuse Controls
- Implement global rate caps plus per-route quotas.
- Guard against slow attacks: request body read timeout (~10s), header size limits, reject chunked trickling.
- Enforce hard concurrency caps per user on AI and export endpoints.

## Caching & CDN Hygiene
- Do not publicly cache authenticated pages. Use `Cache-Control: no-store, no-cache, must-revalidate`.
- Serve static assets with immutable caching and hashed filenames.
- Ensure edge caches do not store responses with auth cookies or sensitive headers.

## Observability & Incident Response
- Track metrics: auth failures, 500 rates, DB timeouts, rate-limit hits.
- Configure alerts (pager) for spikes (error rates, AI cost, export failures).
- Maintain audit trails: session CRUD, exports/imports, AI summarizations per user.
- Document runbooks: credential rotation, OAuth revocation, Atlas snapshot restore.

## UX Failsafes (Security × Product)
- Provide a "sensitive categories" toggle with guidance (sleep, spirituality, relationships) to control AI/export exposure.
- For account deletion, show a summary of data removed and backup retention timelines.
- Clearly communicate export contents in the UI.

## Red-team Checklist (Build-time)
- Attempt to fetch another user’s session by `_id` (expect 404).
- Insert `<img src=x onerror=alert(1)>` in notes (should render as text).
- Upload a 6 MB CSV (just above the 5 MB limit) and a formula-injection CSV (`=IMPORTXML("http://...")`) (should reject or neutralize).
- Run app offline, kill tab, reopen (session restores safely).
- Use an export link older than 5 minutes (should be invalid).
- Send webhook with incorrect signature (should return 401).
- Hammer API writes (> 60/min) (should return 429).

## Handy Next.js Snippets

### Security Headers (`middleware.ts` or `next.config.js`)
```ts
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value:
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://api.clerk.com; frame-ancestors 'none'; base-uri 'none'; form-action 'self';" }
];
export default {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};
```

### Scoped Query Helper
```ts
export const withUserScope = (userId: string) => ({
  find: <T extends { userId: string }>(collection: Collection<T>, query: Filter<T>) =>
    collection.find({ ...query, userId }),
  findOne: <T extends { userId: string }>(collection: Collection<T>, query: Filter<T>) =>
    collection.findOne({ ...query, userId }),
  updateOne: <T extends { userId: string }>(collection: Collection<T>, query: Filter<T>, update: UpdateFilter<T>) =>
    collection.updateOne({ ...query, userId }, update),
});
```

Keep this document current. When introducing new surfaces (e.g., public share pages, friend views, mobile PWA background timers), re-run the checklist and tighten headers/scopes for that feature.
