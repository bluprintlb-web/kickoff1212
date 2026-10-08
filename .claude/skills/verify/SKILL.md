---
name: verify
description: How to actually run and drive the Kick Off app for runtime verification (not just typecheck/lint).
---

# Verifying Kick Off at runtime

## Gotcha: port 3000 may already be taken by an unrelated project

On this machine, something else ("Ayaz Closet", a wedding-wear storefront)
sometimes already listens on `localhost:3000`. Before trusting anything on
:3000, confirm the title: `curl -s http://localhost:3000/ | grep -o '<title>[^<]*</title>'`
should say `Kick Off`. If it doesn't, start this app on its own port instead:

```bash
npm run dev -- -p 3011
```

Then hit `http://localhost:3011`.

## Driving it without a browser

No Playwright/Puppeteer MCP tool is wired up in this environment as of this
writing. Until one is, verification is HTTP/DOM-level via curl against the
real dev server (which hits the real Postgres DB and real tRPC procedures) —
not pixel-level. That's enough to confirm data/markup/auth are correct, but
not to see hover states, animations, or client-only interactivity. If you
need actual pixels, either install Playwright for the session or ask the user
to look at the running dev server themselves.

Useful probes:
- `curl -s http://localhost:3011/api/trpc/<router>.<procedure>` — hits a
  `publicProcedure` directly; `adminProcedure`/protected ones correctly
  return `401 UNAUTHORIZED` with no session cookie — that 401 itself is
  useful evidence the gating wasn't broken.
- Storefront pages requiring a session (`/cart`, `/profile`, `/checkout`-adjacent
  flows, anything under `/admin`) redirect unauthenticated requests to
  `/login` with a `307` — check `curl -s -D - -o /dev/null <url> | grep -i location`.
- `/products?category=<X>` and `?category=JERSEY&type=<fan|player|retro>`
  are real filters worth probing (including a category with zero products,
  to check the empty-state copy renders instead of crashing).

## Known limitation: no admin test credentials

There's no seeded admin login and the schema enforces a single ADMIN user —
don't create or hijack one just to test `/admin/*` flows without asking the
user first. Authenticated admin/POS click-throughs are the one thing this
curl-based approach can't cover; say so explicitly in the verify report
rather than skipping it silently.
