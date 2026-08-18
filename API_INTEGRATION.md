# API Integration

How the RentNest frontend talks to the backend. Raw endpoint reference lives in [`apiendpoints.md`](./apiendpoints.md) — this doc maps **pages/components → endpoints** and records the conventions that keep it all working.

## Conventions

| Concern | Rule |
| ------- | ---- |
| Base URL | `process.env.NEXT_PUBLIC_API_URL` (`.env` → `http://localhost:8000`) |
| Auth | httpOnly `accessToken` / `refreshToken` cookies set by the login/register server actions. Every protected fetch forwards `Cookie: cookieStore.toString()` (or `Cookie: accessToken=…`). |
| Caching | All fetches use `cache: "no-store"` except the public home "live count" (`revalidate: 60`). |
| Envelope | Backend returns `{ success, statusCode, message, data }`. Frontend types mirror this via `ApiSuccessResponse<T>` / `ApiErrorResponse` in `app/lib/types.ts`. |
| Validation | Zod schemas in `app/lib/schemas.ts`; field errors mapped by `toFieldErrors` and surfaced in forms. |
| Mutations | Server actions return a `{ success, message, errorDetails?, fieldErrors? }` state object (never throw). Client shows toasts via `app/lib/action-feedback.ts`. |
| Reads | Public GETs are defensive: `getProperties` returns `[]` on a bad response (the API reports 404 "Properties not found" for no-match filters, which must render the empty state, not crash); `getPropertyById`/`getReviews` catch errors and `notFound()`/`[]`. Dashboard GETs return `[]` on a bad response (defensive). |
| Redirects | After success, client components call `router.push` / `router.refresh`; server pages use `redirect()` / `notFound()`. |

## Auth

| Endpoint | Frontend consumer | Notes |
| -------- | ----------------- | ----- |
| `POST /api/auth/register` | `app/(authGroup)/_actions/authActions.ts` → `registerForm.tsx` | Sets role `TENANT`/`LANDLORD`; success redirects to `/login`. |
| `POST /api/auth/login` | `app/(authGroup)/_actions/authActions.ts` → `loginForm.tsx` | Backend sets `accessToken`+`refreshToken` httpOnly cookies; success redirects to `/`. |
| `GET /api/auth/me` | `service/getUser.ts` | No token → `{ success: false, statusCode: 401 }`. Used by `proxy.ts` (routing), `(publicGroup)/layout.tsx` (navbar), dashboard layouts, property detail page. |
| — (logout) | `service/logout.ts` | Client-side: deletes `accessToken`/`refreshToken` cookies, `revalidateTag("user-profile")`. |

## Public pages

| Page | Endpoint(s) | Notes |
| ---- | ----------- | ----- |
| `/` home | `GET /api/properties` (live count, `revalidate: 60`) | Counts `isAvailable` properties for the hero stat. |
| `/properties` browse | `GET /api/properties?city&minPrice&maxPrice&categoryId` (`getProperties`) + `GET /api/categories` (`getCategories`) | Filter sidebar → query params; grid from `PropertyGrid`. |
| `/properties/[id]` | `GET /api/properties/:id` (`getPropertyById`) | 404 via `notFound()` when the API errors or returns nothing. Also fetches `getUser()` for the request-to-rent CTA state. |

### Reviews (property detail)

| Endpoint | Frontend consumer | Notes |
| -------- | ----------------- | ----- |
| `GET /api/reviews` | `app/(publicGroup)/properties/_actions/getReviews.ts` → `ReviewsList.tsx` | Public; frontend filters reviews by `propertyId` and sorts newest-first. Defensive: returns `[]` on error. |
| `POST /api/reviews` | `app/(publicGroup)/properties/_actions/createReview.ts` → `ReviewForm.tsx` | TENANT only; body `{ rentalRequestId, rating: 1–5, comment? }`. Form gated on an `ACTIVE` rental with no existing review. |
| `GET /api/rentals` (eligibility) | `app/(publicGroup)/properties/_actions/getEligibleRental.ts` → `ReviewsList.tsx` | Cookie-forwarded; finds the tenant's `ACTIVE` + not-yet-reviewed rental for this property. Returns `null` on any error so the public page never breaks. |

## Tenant dashboard

| Page | Endpoint(s) | Notes |
| ---- | ----------- | ----- |
| Overview `/tenant-dashboard` | `GET /api/rentals` (`getMyRentals`) + `GET /api/payments` (`getMyPayments`) | Stat cards + "Needs your attention" (payment / review CTAs) + recent requests. |
| Requests `/tenant-dashboard/requests` | `GET /api/rentals` (`getMyRentals`) | Status badge per request; "Leave review" links `ACTIVE` rentals to the property page. |
| Pay `/tenant-dashboard/requests/[id]/pay` | `GET /api/rentals/:id` (`getRentalRequestById`) + `POST /api/payments/create` (`createPayment`) | `PayButton` redirects to `paymentURL` (Stripe). |
| Payments `/tenant-dashboard/payments` | `GET /api/payments` (`getMyPayments`) | History + stat cards. |
| `POST /api/rentals` | `app/(publicGroup)/properties/_actions/createRentalRequest.ts` → `RequestToRentButton` | Requesting a place happens on the public property page; success redirects to `/tenant-dashboard/requests`. |

### Stripe return pages

| Page | Endpoint(s) | Notes |
| ---- | ----------- | ----- |
| `/payment/success/[transactionId]` | `GET /api/payments` (`getPaymentByTransactionId`) | `PaymentStatus` polls until the payment is `COMPLETED`. |
| `/payment/cancel/[transactionId]` | — | Static "payment cancelled" page. |

Stripe `success_url` / `cancel_url` point at the **frontend** origin. The backend `.env` `APP_URL` must be set to the deployed frontend URL.

## Landlord dashboard

| Page | Endpoint(s) | Notes |
| ---- | ----------- | ----- |
| Overview | `GET /api/landlord/requests` (`getLandlordRequests`) + `GET /api/landlord/properties`-equivalent | "Needs your decision" queue + portfolio snapshot. |
| Properties | `GET /api/properties?landlordId=…` (`getLandlordProperties`) | Backend has no `/api/landlord/properties` GET; list is filtered by `landlordId`. |
| New / edit property | `POST /api/landlord/properties` (`createProperty`) / `PUT /api/landlord/properties/:id` (`updateProperty`) | Shared `PropertyForm`. |
| Delete property | `DELETE /api/landlord/properties/:id` (`deleteProperty`) | Two-step confirm in `DeletePropertyButton`. |
| Requests | `GET /api/landlord/requests` (`getLandlordRequests`) + `PATCH /api/landlord/requests/:id` (`updateRequestStatus`) | `DecisionCard` optimistic approve/reject, reverts + toasts on error. |

## Admin dashboard

| Page | Endpoint(s) | Notes |
| ---- | ----------- | ----- |
| Overview | `GET /api/admin/users` + `GET /api/admin/rentals` | Stat cards. |
| Users | `GET /api/admin/users` (`getAdminUsers`) + `PATCH /api/admin/users/:id` (`updateUserStatus`) | Ban/unban in `BanButton`. |
| Properties | `GET /api/properties` (`getAdminProperties`) | Backend has no `/api/admin/properties`; list is unfiltered. |
| Rentals | `GET /api/admin/rentals` (`getAdminRentals`) | Also fetches users + properties and joins client-side to render names/images. |
| Categories | `GET /api/categories` (`getAdminCategories`) + `POST /api/categories/create` (`createCategory`) | ADMIN-only create (name ≥ 2 chars, optional description; duplicate name → 409). New categories appear automatically in the landlord `PropertyForm` and browse `FilterStrip`. |

## Response-shape notes / gotchas

- `GET /api/rentals` should `include: { review: true }` (tasklist item) so the "already reviewed" check `!r.review` in `getEligibleRental` works. `RentalRequest.review?: Review | null` is typed in `app/lib/types.ts`.
- List endpoints: `getMyRentals` and `getMyPayments` currently throw on `!res.ok` — verify the backend returns `200` with `data: []` (not `404`) for empty lists, or patch them to the defensive `[]` pattern used by the admin/landlord GETs.
- `GET /api/admin/users/:id` PATCH response includes `password` (backend) — the frontend only reads `status`/`success`.
- Images: `next.config.ts` sets `images.unoptimized: true` and wildcard `remotePatterns` for `http`/`https`, so property image URLs work from **any** host without whitelisting.

## Adding a new feature

1. Add a `"use server"` action under the relevant `app/**/_actions/` (or `service/` for cross-cutting helpers).
2. Forward cookies with `Cookie: cookieStore.toString()`, use `cache: "no-store"`.
3. Mutations: Zod-validate, return `{ success, message }`, never throw; toast via `toastActionResult` / `useActionResultToast` (`app/lib/action-feedback.ts`).
4. Reads: return `[]` defensively for dashboard lists; throw (→ `error.tsx`/`notFound()`) for public single-item fetches.