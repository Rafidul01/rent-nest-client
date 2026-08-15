# RentNest Frontend — Planning

**Stack:** Next.js (App Router) · TypeScript · Tailwind · shadcn/ui · fetch (TanStack Query where needed) · Cookie-based auth (httpOnly, backend-issued)

**Backend:** Existing RentNest Express/Prisma API (Assignment 4), consumed via `NEXT_PUBLIC_API_URL`.

---

## 1. Architecture Decisions

| Decision | Choice | Why |
|---|---|---|
| Data fetching | Server Components + plain `fetch`, TanStack Query only where interactivity needs it | Simpler, faster first paint; most pages don't need client-side caching |
| Auth | httpOnly cookies set by backend on login | Backend already issues `accessToken`/`refreshToken` cookies; frontend never touches raw tokens |
| Route protection | Root `proxy.ts` (Next.js 16 replaces `middleware.ts`; `proxy` export + `config.matcher`) | Single gatekeeper for `/tenant-dashboard`, `/landlord-dashboard`, `/admin-dashboard` |
| Dashboard layout | One shared `(dashboardGroup)/layout.tsx`, nav driven by role config | All 3 dashboards share the same shell (sidebar + content); only nav items differ per role |
| Route grouping | `(publicGroup)` for marketing/browse pages, `(authGroup)` for login/register, `(dashboardGroup)` for all 3 role dashboards | Keeps URL clean, layouts scoped correctly (no duplicate `<html>`/`<body>`) |
| Component source | shadcn/ui throughout | Matches assignment's suggested stack |
| Package manager | pnpm | — |

### Known Next.js/React gotchas hit and resolved
- Only the true root `app/layout.tsx` may render `<html>`/`<body>` — nested layouts must not.
- Server → Client Component props must be plain serializable data (no icon components — pass string keys, resolve inside the Client Component).
- Server Component `fetch` calls do **not** automatically forward the browser's cookies — must manually forward `accessToken` from `cookies()`.
- shadcn `Sidebar`/`Tooltip` primitives need their respective providers (`SidebarProvider`, `TooltipProvider`) wrapping the app.
- Form inputs need `name` attributes (not just `id`) for `FormData` to read them.
- Zod v4 uses `{ error: "..." }` instead of v3's `{ required_error: "..." }`.

---

## 2. Route Map

### Public — `(publicGroup)`
| Route | Status | Notes |
|---|---|---|
| `/` | ⬜ Not built | Home, featured properties |
| `/properties` | ✅ Built | Grid + `FilterSidebar` (city, price, category), URL-param driven |
| `/properties/[id]` | ✅ Built | Details page; `RequestToRentButton` and `ReviewsList` are **stubbed** |

### Auth — `(authGroup)`
| Route | Status | Notes |
|---|---|---|
| `/login` | ✅ Built | Server Action (`authActions.ts`) that sets httpOnly `accessToken`/`refreshToken` cookies manually, then `router.push("/")` |
| `/register` | ✅ Built | Role selector (TENANT/LANDLORD); does **not** auto-login after register (backend doesn't set cookie on register) |

### Tenant Dashboard — `(dashboardGroup)/tenant-dashboard`
| Route | Status | Notes |
|---|---|---|
| `/tenant-dashboard` (overview) | ✅ Built | Stat cards, "needs attention" (pay/review prompts), recent 5 requests |
| `/tenant-dashboard/requests` | ✅ Built | Full list, status filter tabs, `RequestStatusBadge` |
| `/tenant-dashboard/requests/[id]/pay` | ✅ Built | Summary + `PayButton` → Stripe Checkout redirect |
| `/tenant-dashboard/profile` | ✅ Built | Read-only view of `/api/auth/me`. **No editing** (by design, out of scope for now) |
| `/tenant-dashboard/payments` | ⬜ Not built | Payment history table |
| `/payment/success/[transactionId]` | ⬜ Not built | Stripe redirect target |
| `/payment/cancel/[transactionId]` | ⬜ Not built | Stripe redirect target |

### Landlord Dashboard — `(dashboardGroup)/landlord-dashboard`
| Route | Status |
|---|---|
| `/landlord-dashboard` (overview) | ⬜ Not built |
| `/landlord-dashboard/properties` | ⬜ Not built |
| `/landlord-dashboard/properties/new` | ⬜ Not built |
| `/landlord-dashboard/requests` | ⬜ Not built (approve/reject, optimistic UI per spec) |
| `/landlord-dashboard/profile` | ⬜ Not built |

### Admin Dashboard — `(dashboardGroup)/admin-dashboard`
| Route | Status |
|---|---|
| `/admin-dashboard` (overview) | ⬜ Not built |
| `/admin-dashboard/users` | ⬜ Not built (ban/unban) |
| `/admin-dashboard/properties` | ⬜ Not built (moderation) |
| `/admin-dashboard/rentals` | ⬜ Not built (moderation) |

---

## 3. Shared Infrastructure

| Piece | Status | Location |
|---|---|---|
| `types.ts` (User, Property, Category, RentalRequest, Payment, Review, API wrappers) | ✅ Built | `app/lib/types.ts` |
| `dashboard-nav.ts` (role → nav items config) | ✅ Built | `app/lib/dashboard-nav.ts` |
| `middleware.ts` (route protection, role gating) | ✅ Built | project root (note: Next.js 16 file is actually `proxy.ts`) |
| `Navbar` (role-aware, dynamic profile menu) | ✅ Built | `app/components/shared/navbar.tsx` |
| `DashboardSidebar` (shadcn Sidebar primitives) | ✅ Built | `app/(dashboardGroup)/_components/` |
| `RequestStatusBadge` (color-coded per spec) | ✅ Built | `app/(dashboardGroup)/_components/` |
| `getUser` / `getMe` (current user fetch) | ✅ Built (confirm single shared source, avoid duplication) | — |
| API error → toast handling pattern | ⚠️ Partial | Established in forms (`sonner`); not yet a single reusable helper |
| `API_INTEGRATION.md` (mandatory deliverable) | ⬜ Not built | Maps components → backend endpoints |

---

## 4. Backend Dependencies (Assignment 4 project)

| Endpoint | Frontend usage | Status |
|---|---|---|
| `POST /api/auth/register` | Register form | ✅ |
| `POST /api/auth/login` | Login form | ✅ |
| `GET /api/auth/me` | Navbar, profile page, middleware-adjacent checks | ✅ |
| `GET /api/properties` | Browse page | ✅ |
| `GET /api/properties/:id` | Details page | ✅ |
| `GET /api/categories` | Filter sidebar, property forms | ✅ |
| `GET /api/rentals` | Tenant overview, requests list | ✅ (fixed empty-array-treated-as-404 bug) |
| `GET /api/rentals/:id` | Pay page | ✅ |
| `POST /api/rentals` | Rental request submission | ⬜ Frontend form not built (`RequestToRentButton` stubbed) |
| `POST /api/payments/create` | Pay button | ✅ |
| `POST /api/payments/confirm` | Stripe webhook (backend-only, not called from frontend) | ✅ |
| `GET /api/payments` | Tenant payments page | ✅ endpoint exists; ⬜ frontend page not built |
| `GET /api/payments/:id` | Payment detail (if built) | ✅ endpoint exists; ⬜ not consumed yet |
| `POST /api/reviews` | Review form | ⬜ Backend endpoint design started, not finished; frontend not built |
| `GET /api/landlord/properties` | Landlord dashboard | ✅ endpoint exists; ⬜ frontend not built |
| `POST/PUT/DELETE /api/landlord/properties` | Landlord property CRUD | ✅ endpoint exists; ⬜ frontend not built |
| `GET /api/landlord/requests` | Landlord requests table | ✅ endpoint exists; ⬜ frontend not built |
| `PATCH /api/landlord/requests/:id` | Approve/reject | ✅ endpoint exists; ⬜ frontend not built |
| `GET /api/admin/users` | Admin users table | ✅ endpoint exists; ⬜ frontend not built |
| `PATCH /api/admin/users/:id` | Ban/unban | ✅ endpoint exists; ⬜ frontend not built |
| `GET /api/admin/properties` | Admin moderation | ✅ endpoint exists; ⬜ frontend not built |
| `GET /api/admin/rentals` | Admin moderation | ✅ endpoint exists; ⬜ frontend not built |

**Open backend item:** no mechanism yet moves a `RentalRequest` from `ACTIVE → COMPLETED`. Needed before "leave a review" can be tested end-to-end. Decide: admin manual action, landlord action, or scheduled/automatic based on `moveInDate + durationMonths`.

---

## 5. Remaining Work (rough order)

1. **Finish tenant flow**
   - Payment history page (`/tenant-dashboard/payments`)
   - Payment success/cancel pages
   - Rental request submission form (`RequestToRentButton` real implementation)
   - Review submission flow (blocked on backend completion-status decision + `POST /api/reviews`)
2. **Landlord dashboard** — overview, property CRUD forms, requests table with approve/reject (optimistic updates)
3. **Admin dashboard** — overview, users table (ban/unban), properties/rentals moderation views
4. **Home page (`/`)** — featured properties
5. **Polish/mandatory requirements**
   - `loading.tsx` + `error.tsx` per route segment
   - Consistent toast/error-boundary handling across all API calls
   - `API_INTEGRATION.md`
   - Responsive pass (mobile-first check across all built pages)
   - 20 meaningful commits (ongoing — commit as each piece lands, not in bulk at the end)
6. **Deployment** — Vercel, confirm `NEXT_PUBLIC_API_URL` and backend `app_url` (Stripe redirect target) point at the deployed frontend, not localhost.

---

## 6. Risks / Things to Double-Check Before Demo

- Backend `config.app_url` used in Stripe `success_url`/`cancel_url` must point at the **frontend's** deployed URL, not the backend's own URL.
- `/payment/success|cancel` are **not** in `proxy.ts` `PUBLIC_ROUTES`, so they require a valid auth cookie. That's fine for the Stripe redirect round-trip (cookies are still set), but unauthenticated direct visits bounce to `/login` — acceptable; no code change needed since `config.matcher` already permits these paths.
- `GET /api/rentals` response must `include: { review: true }` so the frontend's "already reviewed" check (`!r.review`) works correctly.
- Audit other backend list endpoints (payments, landlord requests, admin lists) for the same "empty array treated as 404" bug already found and fixed in `getRentalRequestsFromDB`.
- Confirm `getUser()`/`getMe()` used in root layout, dashboard layout, and profile page are either the same shared function or kept in sync — currently at risk of drift/duplication.