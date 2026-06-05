<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## W.D. Blackwoods Site Rules

- Preserve the public W.D. Blackwoods archive unless explicitly instructed otherwise.
- Never commit unpublished manuscript content.
- Never commit beta-reader PII.
- Never expose private Blob URLs.
- Never place manuscript content under `public/`.
- Never prefix secrets with `NEXT_PUBLIC_`.
- Keep reader-room authorization server-side.
- Run `npm run lint`.
- Run `npm run build`.
- Run existing route validation.
- Run reader-room tests.
- Review the diff before proposing a merge.
