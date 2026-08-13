<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Rent Nest Client

Frontend (App Router) for a rental marketplace. Backend is a separate NestJS service at `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`); this repo does NOT contain the API — server actions/fetches proxy to it.

## Commands
- Package manager: **pnpm** (pnpm-lock.yaml, pnpm-workspace.yaml). Don't use npm/yarn.
- `pnpm dev` / `pnpm build` / `pnpm start`
- Lint: `pnpm lint` (flat config `eslint.config.mjs`). No tests or typecheck script exist.
- Add shadcn components via `pnpm dlx shadcn@latest add <name>` (radix-nova style, see `components.json`).

## Next.js 16 gotchas
- **`middleware.ts` is now `proxy.ts`.** Route-guarding/auth lives in the root `proxy.ts` (named `proxy` export + `config.matcher`). Do not create `middleware.ts`; edit `proxy.ts`.
- Tailwind **v4**: no `tailwind.config.*`; theme is configured via `@theme inline` in `app/globals.css`.
- Path alias `@/*` maps to the **repo root** (`"./*"` in tsconfig) — so `@/app/...`, `@/components/...`, `@/service/...`, `@/utils/...` are all valid.

## Architecture & conventions
- Server-only data access lives in `app/**/_actions/` (server actions) and `service/` (`"use server"` files). Server components call these; client components import them.
- **Auth flow**: login/register server actions set `httpOnly` `accessToken` / `refreshToken` cookies. Server fetches forward cookies (e.g. `Cookie: cookieStore.toString()`). JWT is decoded in `proxy.ts` and `utils/jwt.ts` for role-based routing.
- Route groups: `(authGroup)` = login/register, `(publicGroup)` = public pages, `(dashboardGroup)` = role dashboards.
- Roles are `TENANT` / `LANDLORD` / `ADMIN`; each maps to its own dashboard route guarded by `proxy.ts`.
- Images: remote hosts must be added to `images.remotePatterns` in `next.config.ts`.
