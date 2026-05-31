# Security Hardening

This document records the focused protections added before real manuscript
chapters are placed in the private reader room.

## Implemented Protections

- `/system/reader-intelligence` requires a server-side access secret and a signed
  HTTP-only cookie before aggregate analytics are shown.
- Reader intelligence access cookies are scoped to `/system/reader-intelligence`,
  use `SameSite=Lax`, are `Secure` in production, and expire after 8 hours.
- Private and internal paths are excluded from browser analytics capture:
  `/reader-room` and `/system`.
- Session Replay is stopped on private reader-room and internal system paths.
- Invitation-route responses use no-store headers, no-referrer policy, and
  noindex/noarchive robots headers.
- Production-valid invitation expiration is shorter by mode:
  local tests last 30 days, live tests last 1 day, and live batches last 14 days.
- `robots.txt` disallows `/reader-room/` and `/system/`.
- Baseline response headers are sent for all routes.
- Content Security Policy is report-only during this pass, not enforced.

Robots rules are advisory only. They are not a substitute for access control.

## Owner Actions

Create a strong access secret and set it locally:

```env
READER_INTELLIGENCE_ACCESS_SECRET=
```

Set the same variable in Vercel Production, then redeploy after changing Vercel
environment variables.

Enable two-factor authentication on:

- Vercel
- GitHub
- Google/Gmail
- Substack

Store recovery codes outside the repository.

## Manual Vercel Steps

1. Open the Vercel project.
2. Go to `Settings -> Deployment Protection`.
3. Enable Vercel Authentication for preview and generated deployment URLs.
4. Leave the public production custom domain accessible.

## Future Firewall Rollout

For `/reader-room/invite/*`:

1. Add a logging rule first.
2. Observe legitimate invite traffic.
3. Add a modest rate limit only after review.
4. Avoid aggressive deny or challenge behavior during the first reader round.

Token-bearing invite paths may still appear in platform-level request logs. This
is an accepted temporary risk for a small trusted early-reader group. A
database-backed one-time exchange-token design can be considered later if the
beta group expands.

## CSP Notes

The current Content Security Policy is report-only. It is intentionally cautious
and should be observed in browser consoles and Vercel logs before enforcement.
PostHog browser analytics may require host adjustments depending on the exact
configured `NEXT_PUBLIC_POSTHOG_HOST`.

Do not move CSP to enforcement until public pages, PostHog analytics, Session
Replay on public pages, and all reader-room flows have been checked.
