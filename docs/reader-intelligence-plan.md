# Reader Intelligence Plan

## Purpose

Create a private internal route at `/system/reader-intelligence` that summarizes reader behavior from PostHog without requiring direct use of the PostHog UI. The page should read as a restrained internal archive instrument, not a public dashboard or marketing analytics surface.

This plan does not change current analytics tracking, archive routing, typography, public pages, or narrative hierarchy.

## Source Of Truth

The existing analytics system remains the source of truth:

- `components/AnalyticsClient.tsx`
- `lib/analytics.ts`
- `NEXT_PUBLIC_ANALYTICS_MODE=off | basic | full`

Current event model:

- Basic mode: `enter_begin`, `enter_vine_crown`, `exit`
- Full mode: pageview events, archive-entry pageviews, scroll thresholds, timed reading events, and exit events
- Route/page props: `pageName`, optional `slug`
- Depth/time props: `scrollDepth`, `timeOnPage`, `timeSpent`, `lastScrollPosition`

Do not replace this with PostHog wizard defaults.

## PostHog API Method

Use PostHog's Query API from the server only:

- Endpoint shape: `POST /api/projects/:project_id/query/`
- Query type: HogQL query payloads for aggregated event reads
- Authentication: personal API key with Query Read permission
- Intended use: embedded/ad-hoc analytics, not bulk export

Reference:

- https://posthog.com/docs/api/query
- https://posthog.com/docs/api/overview

The personal API key must never be exposed to the browser, bundled into client code, or prefixed with `NEXT_PUBLIC_`.

## Required Environment Variables

Server-only:

```env
POSTHOG_PROJECT_ID=
POSTHOG_PERSONAL_API_KEY=
POSTHOG_QUERY_HOST=https://app.posthog.com
```

Existing client-side analytics variables remain unchanged:

```env
NEXT_PUBLIC_ANALYTICS_MODE=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

Only the public PostHog project key belongs in `NEXT_PUBLIC_POSTHOG_KEY`. The personal API key must remain server-side.

## Route Structure

Recommended App Router structure:

```text
app/system/reader-intelligence/page.tsx
app/system/reader-intelligence/loading.tsx
app/system/reader-intelligence/error.tsx
app/api/reader-intelligence/route.ts
```

Preferred first implementation:

- `page.tsx` as a server component
- `app/api/reader-intelligence/route.ts` only if the page needs client-side refresh controls later

Server component first keeps secrets naturally server-side and avoids unnecessary client data fetching.

## Privacy And Access

Minimum first pass:

- Add `export const metadata = { robots: { index: false, follow: false } }`
- Exclude `/system/reader-intelligence` from sitemap
- Do not link from public navigation
- Keep the route under `/system`

Recommended before deployment:

- Protect the route with a server-side access check
- Use one of:
  - Vercel deployment protection
  - Basic auth middleware
  - A server-only `READER_INTELLIGENCE_TOKEN`
  - A signed internal cookie

The route should never reveal raw distinct IDs, emails, IP-like fields, personal API keys, or full event payload dumps.

## Data Fetching Strategy

Create a small server-only helper:

```text
lib/posthogReaderIntelligence.ts
```

Responsibilities:

- Read server-only env vars
- Build HogQL payloads
- Call the PostHog Query API
- Normalize results into a small typed summary object
- Return only aggregated data to the page

Do not import this helper into client components.

## Initial Metrics

### 1. Reader Entry Funnel

Goal:

```text
Homepage -> Begin -> Vine Crown
```

Use existing events:

- Homepage: `page_view_home` when full mode is enabled
- Begin: `enter_begin`
- Vine Crown: `enter_vine_crown`

Important caveat:

- In `basic` mode, homepage pageview is not currently tracked. The first funnel step may need to be shown as unavailable unless `full` mode is enabled or the tracking model is intentionally extended later.
- Do not change tracking during the first reader-intelligence implementation.

### 2. Pageview Counts By Route

Use full-mode events:

- `page_view_home`
- `page_view_begin`
- `page_view_archive_index`
- `page_view_archive_slug`

Group by:

- event name
- `properties.slug` for archive entries
- `properties.pageName`

If full mode is not active, show a calm empty state explaining that pageview data requires full analytics mode.

### 3. Mobile Vs Desktop Breakdown

Use PostHog event properties if available:

- `$device_type`
- `$browser`
- `$os`
- viewport-related properties if present

Recommended first display:

- Mobile
- Desktop
- Tablet/Other

Keep this aggregated only.

### 4. Latest Event / Session Path Summary

Feasible first version:

- Query the latest small set of events for tracked route events
- Group by `$session_id` if available
- Display a limited path such as:

```text
/ -> /begin -> /archive/vine-crown
```

Privacy constraints:

- Do not show distinct IDs
- Do not show IP-derived fields
- Do not show user agent strings unless aggregated
- Limit to a small count, such as last 10 sessions

If session grouping is unreliable, defer this section and show only latest event paths by timestamp.

### 5. Reading Depth Proxy

Use existing full-mode events:

- `scroll_25`
- `scroll_50`
- `scroll_75`
- `scroll_100`
- `time_on_page_30s`
- `time_on_page_60s`
- `time_on_page_120s`
- `exit`

First-pass proxy:

- Count highest scroll threshold reached per page
- Count timed reading events per page
- Use `exit.timeSpent` when available

Display as simple grouped rows, not precise behavioral claims.

## Suggested Queries

Use HogQL through the Query API. Keep queries date-bounded and small.

Default date window:

```text
Last 7 days
```

Maximum first-pass window:

```text
Last 30 days
```

Example query families:

- Event counts by event name
- Archive slug counts grouped by `properties.slug`
- Device breakdown grouped by device property
- Funnel counts for `page_view_home`, `enter_begin`, `enter_vine_crown`
- Scroll/time event counts grouped by page and threshold

Avoid:

- Bulk export patterns
- Unlimited raw event reads
- Long unbounded session queries
- Client-side ad-hoc query builders

## Caching Strategy

Use server-side caching to avoid hammering PostHog:

- `unstable_cache` or `fetch` caching where appropriate
- Recommended revalidate: 5 minutes
- Manual refresh can be deferred

Suggested cache intervals:

- Summary counts: 5 minutes
- Latest path summary: 1 minute, if implemented
- Static explanatory text: no dynamic fetch

Show a timestamp:

```text
Last refreshed: ...
```

## Minimal UI Structure

Keep the page quiet and text-forward:

```text
Reader Intelligence
Internal archive instrument

Period: Last 7 days
Last refreshed: timestamp

Reader Entry Funnel
Homepage -> Begin -> Vine Crown

Pageview Counts
Route / Page / Count

Device Class
Mobile / Desktop / Other

Recent Reading Paths
Limited, anonymized paths only

Reading Depth
Scroll and time proxies
```

Reuse existing typography classes where possible:

- `document-page`
- `system-section`
- `system-layer-label`
- `meta`

Do not add cards, charts, gradients, animations, or decorative dashboard elements in the first pass. Tables or definition-list style rows are sufficient.

## Error And Empty States

The route should handle:

- Missing `POSTHOG_PROJECT_ID`
- Missing `POSTHOG_PERSONAL_API_KEY`
- PostHog API 401/403
- Query timeout
- Empty result set
- Analytics mode set to `off` or `basic`

Empty state tone:

```text
No full reading-depth data is available for this period.
```

Avoid exposing API response bodies directly to the browser.

## Security Checklist

- Personal API key is server-only
- No `NEXT_PUBLIC_` prefix for server secrets
- No client component calls PostHog Query API
- No raw event dumps rendered
- No distinct IDs rendered
- Route is noindexed
- Route is not linked publicly
- Optional internal access control before production use
- All queries are date-bounded
- Query output is normalized before rendering

## What To Defer

Defer until after the first internal page works:

- New tracking events
- New scroll/time instrumentation
- Per-reader identity views
- Cohorts
- Retention
- Session replay
- Complex charts
- CSV export
- Dashboard editing
- Client-side refresh controls
- PostHog wizard-generated changes

## Recommended First Build

Phase 1:

- Add `/system/reader-intelligence` as a noindex server page
- Add a server-only PostHog query helper
- Add aggregated event counts and funnel counts
- Add graceful empty states
- Keep route unlinked

Phase 2:

- Add device breakdown
- Add reading depth proxy
- Add latest anonymized session path summary if `$session_id` data is reliable

Phase 3:

- Add access control
- Add optional manual refresh
- Add period selector, still server-driven

## Non-Goals

- No public UI changes
- No analytics tracking rewrite
- No PostHog wizard integration pass
- No change to `AnalyticsClient`
- No change to `lib/analytics.ts`
- No archive routing changes
- No typography changes
- No content changes
