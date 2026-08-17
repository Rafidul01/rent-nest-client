# Tasklist — What to Do Next

Status legend: ⬜ not started · 🔵 in progress · ✅ done

## Phase A — Fix plumbing ✅
- [x] Dedupe `getUser`/`getMe` into single `service/getUser.ts`
- [x] Dedupe `RequestStatusBadge` (keep `(dashboardGroup)/_components/`)
- [x] Clean navbar debug code + dead `/favorites`, `/contact` links
- [x] Fix `getUser.ts` fs import/cache, PayButton `console.log`, login dead link
- [x] Fix pre-existing lint errors (`proxy.ts`, `utils/jwt.ts`, `hooks/use-mobile.ts`)

## Phase B — Tenant flow ✅
- [x] Implement `RequestToRentButton` — server action `createRentalRequest` (`POST /api/rentals`, cookie-forwarded), logged-in tenant form, redirect to requests
- [x] `/tenant-dashboard/payments` — history + stat cards from `getMyPayments`
- [x] `/payment/success/[transactionId]` — Stripe confirmation page with webhook polling (`PaymentStatus` polls `getPaymentByTransactionId` until `COMPLETED`)
- [x] `/payment/cancel/[transactionId]` — Stripe cancel page
- [x] Add `error.tsx` for tenant segments; verified `proxy.ts` matcher allows payment routes (auth-cookie required, fine post-Stripe)

### Phase B fixes (found while building)
- [x] **PayButton payment bug** — was a client-side cross-origin `fetch` (token never forwarded → 401 → "Something went wrong"). Fixed with server action `createPayment.ts` (`POST /api/payments/create`, cookie-forwarded) → redirects to Stripe `paymentURL`. Verified end-to-end via API flow.
- [x] **Stripe redirect target** — backend `.env` `APP_URL` pointed at backend (`:8000`). Changed to `http://localhost:3000` so Stripe `success_url`/`cancel_url` hit the frontend pages. ⚠️ Restart backend; must point at deployed frontend in prod.

## Phase C — Dashboard shell & design ✅ (done as an extra pass)
- [x] Redesign `(dashboardGroup)` layout: dark ink-teal rail + paper canvas + sticky "doorplate" app bar (`DashboardAppBar`, `DashboardSidebar`)
- [x] Fix mobile responsiveness — nav trigger in app bar (was commented out), mobile sheet close button, collapsible icon rail on desktop
- [x] Add `--paper` token + ink-teal `--sidebar-*` tokens in `globals.css`
- [x] Polish every tenant page with shared `PageHeader` (eyebrow + title + description), `tabular-nums`, consistent icon chips/empty states (`overview`, `requests`, `payments`, `profile`, `pay`, `error`)
- [x] Clean remaining tenant-segment lint warnings (unused imports, `err`)

## Phase D — Landlord dashboard ✅
- [x] Overview page — hero, portfolio stat cards, "Needs your decision" queue, portfolio snapshot with letting lamps
- [x] Property list — letting-board grid of tiles (lamp = Letting/Let out), edit/delete per tile (`GET /api/properties` filtered by `landlordId` — backend has no `/api/landlord/properties` endpoint)
- [x] Property create/edit/delete forms (`POST/PUT/DELETE /api/landlord/properties`) — shared `PropertyForm` (new + `[id]/edit`), two-step confirm delete
- [x] Requests table + approve/reject with optimistic UI (`GET/PATCH /api/landlord/requests/:id`) — `DecisionCard` flips status in place, reverts + toasts on error
- [x] Landlord profile page + landlord `error.tsx`
- [x] Verified end-to-end: register landlord → create property → tenant requests → approve → delete; all 6 routes render 200; tsc/lint/build clean

## Phase E — Admin dashboard ✅
- [x] Overview page
- [x] Users table + ban/unban (`GET/PATCH /api/admin/users/:id`)
- [x] Properties moderation list (`GET /api/properties` — backend has no `/api/admin/properties` route, same situation as landlord)
- [x] Rentals moderation list (`GET /api/admin/rentals`)

## Phase F — Public + polish
- [x] Real home page `/` — dark ink-teal hero ("already lit"), CSS marquee of live listings, category chips, featured grid, tenants/landlords value props, CTA band. Replaced + removed placeholder `product-card.tsx`; modernized `PropertyCard` (image zoom, glass category badge, letting lamp)
- [ ] Reviews — `ReviewsList` from API + submission form (blocked on backend ACTIVE→COMPLETED mechanism)
- [ ] `error.tsx`/`loading.tsx` per route segment; consistent toast/error-handling helper
- [ ] Responsive/mobile pass across remaining (landlord/admin/public) pages
- [ ] `API_INTEGRATION.md` (mandatory deliverable)

## Phase G — Deploy
- [ ] Vercel; confirm `NEXT_PUBLIC_API_URL` + backend `APP_URL` (Stripe redirect) point at deployed frontend
- [ ] Verify list endpoints don't have empty-array-as-404 bug (payments, landlord requests, admin lists)
- [ ] `GET /api/rentals` response must `include: { review: true }`
