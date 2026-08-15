# Tasklist — What to Do Next

Status legend: ⬜ not started · 🔵 in progress · ✅ done

## Phase A — Fix plumbing ✅
- [x] Dedupe `getUser`/`getMe` into single `service/getUser.ts`
- [x] Dedupe `RequestStatusBadge` (keep `(dashboardGroup)/_components/`)
- [x] Clean navbar debug code + dead `/favorites`, `/contact` links
- [x] Fix `getUser.ts` fs import/cache, PayButton `console.log`, login dead link
- [x] Fix pre-existing lint errors (`proxy.ts`, `utils/jwt.ts`, `hooks/use-mobile.ts`)

## Phase B — Finish tenant flow
- [ ] Implement `RequestToRentButton` — `POST /api/rentals` (logged-in tenant), redirect to requests
- [ ] `/tenant-dashboard/payments` — history table from `getMyPayments`
- [ ] `/payment/success/[transactionId]` — Stripe confirmation page
- [ ] `/payment/cancel/[transactionId]` — Stripe cancel page
- [ ] Add `error.tsx` for tenant segments; verify `proxy.ts` matcher allows payment routes

## Phase C — Landlord dashboard
- [ ] Overview page
- [ ] Property list (`GET /api/landlord/properties`)
- [ ] Property create/edit/delete forms (`POST/PUT/DELETE /api/landlord/properties`)
- [ ] Requests table + approve/reject with optimistic UI (`GET/PATCH /api/landlord/requests/:id`)
- [ ] Landlord profile page

## Phase D — Admin dashboard
- [ ] Overview page
- [ ] Users table + ban/unban (`GET/PATCH /api/admin/users/:id`)
- [ ] Properties moderation list (`GET /api/admin/properties`)
- [ ] Rentals moderation list (`GET /api/admin/rentals`)

## Phase E — Public + polish
- [ ] Real home page `/` (featured properties) — replace placeholder `product-card.tsx`
- [ ] Reviews — `ReviewsList` from API + submission form (blocked on backend ACTIVE→COMPLETED mechanism)
- [ ] `error.tsx` per route segment; consistent toast/error-handling helper
- [ ] Responsive/mobile pass across built pages
- [ ] `API_INTEGRATION.md` (mandatory deliverable)

## Phase F — Deploy
- [ ] Vercel; confirm `NEXT_PUBLIC_API_URL` + backend `app_url` (Stripe redirect) point at deployed frontend
- [ ] Verify list endpoints don't have empty-array-as-404 bug (payments, landlord requests, admin lists)
- [ ] `GET /api/rentals` response must `include: { review: true }`
