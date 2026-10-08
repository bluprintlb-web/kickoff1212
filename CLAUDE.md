# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start the Next.js dev server
- `npm run build` — `prisma generate && next build` (Prisma client must be regenerated before every build)
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`)
- `npx prisma migrate dev` — create/apply a migration after editing `prisma/schema.prisma`
- `npx tsx prisma/seed.ts` — reseed the local database
- There is no test runner configured in this repo.
- `whatsapp-notifier/` is a **separate** Node/Express project (own `package.json`, own `node_modules`) that sends WhatsApp order alerts via Baileys — it's excluded from the root ESLint run and isn't part of the Next app's build.

## Architecture

**Storefront vs admin split.** `src/app/(storefront)/` is the customer-facing route group (home, products, cart, checkout, orders, profile, login/register). `src/app/admin/` is the admin area (POS, products, orders, profile) — gated by role, not by `middleware.ts` (there is none). Authorization is done per-request via the DAL helpers in `src/lib/dal.ts`: `verifySession()` redirects to `/login` if unauthenticated, `requireAdmin()` additionally redirects non-admins. Call these at the top of server components/actions that need protection rather than relying on routing.

**Auth.** `src/auth.ts` configures Auth.js (NextAuth v5 beta) with the Prisma adapter plus custom Credentials providers: email/password (bcryptjs) and a Firebase-backed provider for phone/SMS and Google sign-in. A `User` can be linked to a Firebase identity via `firebaseUid`, letting a later Firebase phone/Google sign-in re-recognize an existing account without re-matching on email/phone. Only one `User` may hold `role = ADMIN` — enforced by a partial unique index added in a migration, not expressible in `schema.prisma` directly.

**Data layer.** Prisma schema at `prisma/schema.prisma`; generated client is checked into `src/generated/prisma` (custom `output` path — import from there, not `@prisma/client`). Postgres via `@prisma/adapter-pg`.

**API layer is tRPC, not REST.** Routers live in `src/server/routers/*` and are combined in `src/server/routers/_app.ts` (`product`, `order`, `cart`, `user`, `pushSubscription`). Mounted at `src/app/api/trpc/[trpc]`. Server Components call procedures directly via `trpcCaller()` from `src/trpc/server.ts` (no HTTP round-trip); client components use the React Query bindings from `src/trpc/react.tsx`. One-off server-only actions (not part of the typed router) live in `src/app/actions/`.

**i18n.** `src/lib/i18n/dictionaries.ts` holds translation dictionaries with a `t()` lookup helper; `get-locale.ts` reads the active locale (persisted via `locale-cookie.ts`). `product-name.ts` resolves a product's localized display name. There's no route-based locale segment — locale is cookie-driven and read per-request in server components (see the `Promise.all([trpcCaller(), getLocale()])` pattern used throughout storefront pages).

**Payments.** `src/lib/payments/` wraps the Whish payment provider (`whish.ts`) behind a provider-agnostic `types.ts`/`index.ts` so routers and actions depend on the abstraction, not the concrete provider.

**Order notifications.** `src/lib/notify-order.ts` + `src/lib/push-notify.ts` handle web push to admin devices (subscriptions stored per-device in `PushSubscription`, since Web Push endpoints aren't portable across browsers). New-order alerts to the store owner over WhatsApp are delegated to the separate `whatsapp-notifier` service (see above), not handled in-process.

**Product images.** Uploaded via Vercel Blob (`@vercel/blob`); Cloudinary (`src/lib/cloudinary.ts`) is used for transforms/delivery on existing images.

**Next.js version caveat.** This repo pins a Next.js version with breaking changes relative to most training data (e.g. `params`/`searchParams` in page props are `Promise`s and must be `await`ed — see any `page.tsx` under `(storefront)` for the pattern). Check `node_modules/next/dist/docs/` before relying on remembered Next.js APIs or conventions.
