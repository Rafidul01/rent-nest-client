# RentNest API Integration & Documentation

How the RentNest frontend consumes the backend. This doc is the single source of truth: it contains the **full endpoint reference**, the **frontend component ↔ endpoint mapping**, and the **conventions** that keep the two in sync.

Base URL: `process.env.NEXT_PUBLIC_API_URL` (`.env` currently → `https://rent-nest-three-blue.vercel.app`; local dev default `http://localhost:8000`). All routes are prefixed with `/api`.

---

## Conventions

| Concern | Rule |
| ------- | ---- |
| Base URL | `process.env.NEXT_PUBLIC_API_URL` (deployed backend by default; `http://localhost:8000` for local dev) |
| Auth | httpOnly `accessToken` / `refreshToken` cookies are set by the backend at login. Protected fetches forward cookies — most use `Cookie: cookieStore.toString()`; `service/getUser.ts` and `getRentalRequestById` forward only `Cookie: accessToken=…`. |
| Caching | All fetches use `cache: "no-store"` except the public home "live count" (`revalidate: 60`). |
| Envelope | Backend returns `{ success, statusCode, message, data }`. Frontend types mirror this via `ApiSuccessResponse<T>` / `ApiErrorResponse` in `app/lib/types.ts`. |
| Fetch wrapper | All reads go through `app/lib/fetch-api.ts`: `fetchApi` (retries transient network failures 3× with linear backoff for idempotent methods; mutations never retried), `fetchList` (defensive `[]`), `fetchEnvelopeOrEmpty` (defensive `{ success:false, data:[] }`). |
| Validation | Zod schemas in `app/lib/schemas.ts`; field errors mapped by `toFieldErrors` and surfaced in forms. |
| Mutations | Server actions return a `{ success, message, errorDetails?, fieldErrors? }` state object (never throw). Client shows toasts via `app/lib/action-feedback.ts`. |
| Reads | Defensive everywhere: `getProperties`/`getCategories`/`getMyRentals`/`getMyPayments` return `data: []` on any failure (the API reports 404 "Properties not found" for no-match filters, which must render the empty state, not crash); dashboard/admin/landlord lists return `[]`; `getReviews` returns `[]`; `getUser` returns a `503` envelope on network failure so layouts render instead of white-screening. Only `getPropertyById` / `getRentalRequestById` throw after retries — their pages catch and `notFound()`. |
| Error boundary | Root `app/error.tsx` (via shared `ErrorState`) catches any remaining layout-level errors; segment `error.tsx` files exist per route group. |
| Redirects | After success, client components call `router.push` / `router.refresh`; server pages use `redirect()` / `notFound()`. |

### Standard response format

```json
{
  "success": true,
  "statusCode": 200,
  "message": "…",
  "data": { }
}
```

### Standard error format

```json
{
  "success": false,
  "message": "…",
  "errorDetails": null
}
```

Common error status codes:

| Code | Meaning |
| ---- | ------- |
| 400  | Validation failed / bad request |
| 401  | Not logged in / invalid token / wrong password |
| 403  | Forbidden (wrong role, banned user) |
| 404  | Resource not found |
| 409  | Conflict (e.g. email already exists, duplicate category name) |

---

## Endpoint reference

### Authentication

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| POST | `/api/auth/register` | Public | Create a user. Sets role `TENANT`/`LANDLORD`. |
| POST | `/api/auth/login` | Public | Returns tokens and sets httpOnly cookies. |
| GET | `/api/auth/me` | Any logged-in user | Returns the current user (password omitted). |
| — | logout (no endpoint) | — | `service/logout.ts` deletes `accessToken`/`refreshToken` cookies client-side + `revalidateTag("user-profile", "max")`. |

**Register — `POST /api/auth/register`**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "TENANT",
  "phone": "01712345678"
}
```
- `name` (min 2), `email`, `password` (min 6) required; `role` must be `TENANT` or `LANDLORD`; `phone` optional.
- Response `data`: the created user (**password omitted**).

**Login — `POST /api/auth/login`**

```json
{ "email": "john@example.com", "password": "secret123" }
```

Response `data`:
```json
{
  "accessToken": "…",
  "refreshToken": "…"
}
```
Also sets `accessToken` + `refreshToken` as httpOnly cookies (7 days).

**Get current user — `GET /api/auth/me`** → Response `data`: the logged-in user (**password omitted**).

### Categories

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| POST | `/api/categories/create` | ADMIN | Create a category. `name` required (unique), min 2 chars; `description` optional. Duplicate name → 409. |
| GET | `/api/categories` | Public | List categories. |

### Properties

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| GET | `/api/properties` | Public | List properties. Optional combinable query filters below. |
| GET | `/api/properties/:id` | Public | Single property (includes `category` + `landlord`). |

`GET /api/properties` query filters:

| Query param | Type | Description |
| ----------- | ---- | ----------- |
| `city`       | string | case-insensitive partial match |
| `minPrice`   | number | price ≥ value |
| `maxPrice`   | number | price ≤ value |
| `categoryId` | string | exact category match |
| `page` / `limit` | number | pagination (passed through; no pagination UI yet) |

Example: `GET /api/properties?city=Dhaka&minPrice=10000&maxPrice=30000&categoryId=abc`

**Property object shape**

```json
{
  "id": "uuid",
  "title": "…",
  "description": "…",
  "address": "…",
  "city": "…",
  "price": 20000,
  "bedrooms": 2,
  "bathrooms": 2,
  "areaSqft": 1200,
  "amenities": ["wifi", "parking"],
  "images": ["https://…"],
  "isAvailable": true,
  "landlordId": "uuid",
  "categoryId": "uuid",
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

### Landlord

All endpoints under `/api/landlord` require **LANDLORD** role.

| Method | Path | Description |
| ------ | ---- | ----------- |
| POST | `/api/landlord/properties` | Create a property. Required: `title`, `description`, `address`, `city`, `price`, `categoryId`. Optional: `bedrooms`, `bathrooms`, `areaSqft`, `amenities`, `images`, `isAvailable`. |
| PUT | `/api/landlord/properties/:id` | Update a property (owner only). All fields optional (partial). Same shape as create. |
| DELETE | `/api/landlord/properties/:id` | Delete a property (owner only). |
| GET | `/api/landlord/requests` | All rental requests for the logged-in landlord's properties. |
| PATCH | `/api/landlord/requests/:id` | Update a rental request status (owner only). Body `{ "status": "APPROVED" }` — must be `APPROVED` or `REJECTED`. |

**Note:** there is **no** `GET /api/landlord/properties` — the frontend lists a landlord's properties via public `GET /api/properties` and filters client-side (see mapping below).

### Rentals (Tenant)

All endpoints under `/api/rentals` require **TENANT** role.

| Method | Path | Description |
| ------ | ---- | ----------- |
| POST | `/api/rentals` | Create a rental request. |
| GET | `/api/rentals` | The logged-in tenant's requests (newest first), each including `property` and `payment`. |
| GET | `/api/rentals/:id` | A single request including `property`. Owner tenant only. |

**Create rental request — `POST /api/rentals`**

```json
{
  "propertyId": "uuid",
  "moveInDate": "2026-09-01",
  "duration": 6,
  "message": "optional note"
}
```
- `moveInDate` format `YYYY-MM-DD`; `duration` = months; `totalAmount` computed server-side as `price × duration`.

**Rental request object shape**

```json
{
  "id": "uuid",
  "moveInDate": "ISO date",
  "durationMonths": 6,
  "message": "…",
  "status": "PENDING",
  "totalAmount": 120000,
  "tenantId": "uuid",
  "propertyId": "uuid",
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

`status` values: `PENDING`, `APPROVED`, `REJECTED`, `ACTIVE`, `COMPLETED`, `CANCELLED`.

### Payments (Tenant)

All endpoints under `/api/payments` require **TENANT** role (except webhook `confirm`).

| Method | Path | Description |
| ------ | ---- | ----------- |
| POST | `/api/payments/create` | Create a Stripe checkout for an **APPROVED** rental owned by the tenant. |
| POST | `/api/payments/confirm` | **Stripe webhook — backend-only, not called by the frontend.** |
| GET | `/api/payments` | The logged-in tenant's payments, each including `rentalRequest`. |
| GET | `/api/payments/:id` | A single payment (owner tenant only). **Not currently consumed by the frontend.** |

**Create payment — `POST /api/payments/create`** — body `{ "requestId": "rentalRequestId" }`

Response `data`:
```json
{
  "paymentURL": "https://checkout.stripe.com/…",
  "newTransactionId": "RENTNEXT-…"
}
```
The client redirects the user to `paymentURL`. After payment, the frontend polls the payment status (payment becomes `COMPLETED`, rental becomes `ACTIVE`).

**Payment object shape**

```json
{
  "id": "uuid",
  "transactionId": "RENTNEXT-…",
  "amount": 120000,
  "method": "card",
  "provider": "Stripe",
  "status": "COMPLETED",
  "stripeSessionId": "…",
  "stripePaymentIntentId": "…",
  "paidAt": "ISO date",
  "rentalRequestId": "uuid",
  "userId": "uuid",
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

`status` values: `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`.

### Admin

All endpoints under `/api/admin` require **ADMIN** role.

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/api/admin/users` | All users (**password omitted**). |
| PATCH | `/api/admin/users/:id` | Update a user. Body: `{ name?, email?, phone?, role?, status }` — `role`: `TENANT`/`LANDLORD`/`ADMIN`; `status`: `ACTIVE`/`BANNED` (required). Response `data` may include `password` (backend quirk — frontend only reads `status`/`success`). |
| GET | `/api/admin/rentals` | All rental requests. |

**Note:** there is **no** `/api/admin/properties` — the admin properties list uses public `GET /api/properties` unfiltered.

### Reviews

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| POST | `/api/reviews` | TENANT | Create a review. Requires the rental request to be `ACTIVE` (paid) and owned by the tenant; one review per rental request. |
| GET | `/api/reviews` | Public | All reviews. **Each review must include the `tenant` relation (`id`, `name`)** so the UI can attribute ratings. |

**Create review — `POST /api/reviews`**

```json
{
  "rentalRequestId": "uuid",
  "rating": 5,
  "comment": "optional"
}
```
`rating` must be an integer 1–5.

**Review object shape**

```json
{
  "id": "uuid",
  "rating": 5,
  "comment": "…",
  "rentalRequestId": "uuid",
  "propertyId": "uuid",
  "tenantId": "uuid",
  "createdAt": "ISO date",
  "tenant": {
    "id": "uuid",
    "name": "John Doe"
  }
}
```

### Roles & enums reference

| Enum | Values |
| ---- | ------ |
| Role | `TENANT`, `LANDLORD`, `ADMIN` |
| UserStatus | `ACTIVE`, `BANNED` |
| RentalStatus | `PENDING`, `APPROVED`, `REJECTED`, `ACTIVE`, `COMPLETED`, `CANCELLED` |
| PaymentStatus | `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED` |

---

## Frontend component ↔ endpoint mapping

### Auth

| Endpoint | Frontend consumer | Notes |
| -------- | ----------------- | ----- |
| `POST /api/auth/register` | `app/(authGroup)/_actions/authActions.ts` → `registerForm.tsx` | Sets role `TENANT`/`LANDLORD`; success redirects to `/login`. |
| `POST /api/auth/login` | `app/(authGroup)/_actions/authActions.ts` → `loginForm.tsx` | Backend sets httpOnly `accessToken`+`refreshToken` cookies; success redirects to `/`. |
| `GET /api/auth/me` | `service/getUser.ts` | No token → local `{ success: false, statusCode: 401, data: null }` (no fetch). Used by `proxy.ts` (routing), `(authGroup)/layout.tsx`, `(publicGroup)/layout.tsx`, `(dashboardGroup)/layout.tsx`, home, property detail, `ReviewsList`, all dashboard pages, profile pages. |
| — (logout) | `service/logout.ts` | Client-side: deletes `accessToken`/`refreshToken` cookies, calls `revalidateTag("user-profile", "max")` (currently a no-op — no fetch registers that tag). |

### Public pages

| Page | Endpoint(s) | Notes |
| ---- | ----------- | ----- |
| `/` home | `GET /api/properties` (live count, `revalidate: 60`) + `GET /api/properties?limit=50` + `GET /api/categories` + `GET /api/auth/me` | All wrapped in a `safe()` helper → `null` on error. Live count counts `isAvailable` properties. |
| `/properties` browse | `GET /api/properties?city&minPrice&maxPrice&categoryId&page` (`getProperties`) + `GET /api/categories` (`getCategories`, called by client `FilterStrip`) | Filter sidebar → query params; grid from `PropertyGrid`. `page` is passed through; no pagination UI yet. |
| `/properties/[id]` | `GET /api/properties/:id` (`getPropertyById`) + `GET /api/auth/me` | `getPropertyById` throws → `notFound()`. `getUser()` drives the request-to-rent CTA state. |

### Reviews (property detail)

| Endpoint | Frontend consumer | Notes |
| -------- | ----------------- | ----- |
| `GET /api/reviews` | `app/(publicGroup)/properties/_actions/getReviews.ts` → `ReviewsList.tsx` | Public; returns an **unwrapped `Review[]`** (not the envelope). Frontend filters by `propertyId` and sorts newest-first. Defensive `[]` on error. |
| `GET /api/rentals` (eligibility) | `app/(publicGroup)/properties/_actions/getEligibleRental.ts` → `ReviewsList.tsx` | Cookie-forwarded. Finds the tenant's `ACTIVE` rental with no review (`r.status === "ACTIVE" && !r.review`) for this property. Requires the backend to include the `review` relation on rental requests (`RentalRequest.review?: Review | null` in `app/lib/types.ts`). Returns `null` on any error so the public page never breaks. |
| `POST /api/reviews` | `app/(publicGroup)/properties/_actions/createReview.ts` → `ReviewForm.tsx` | TENANT only; body `{ rentalRequestId, rating: 1–5, comment? }`. Form gated on an eligible rental; success → `router.refresh()`. |

### Tenant dashboard

| Page | Endpoint(s) | Notes |
| ---- | ----------- | ----- |
| Overview `/tenant-dashboard` | `GET /api/rentals` (`getMyRentals`) + `GET /api/payments` (`getMyPayments`) | Stat cards + "Needs your attention" (APPROVED → pay link, ACTIVE → review link) + recent requests. Both fetches **throw** on `!res.ok`. |
| Requests `/tenant-dashboard/requests` | `GET /api/rentals` (`getMyRentals`) | Status badge per request; "Leave review" links `ACTIVE` rentals to the property page. |
| Pay `/tenant-dashboard/requests/[id]/pay` | `GET /api/rentals/:id` (`getRentalRequestById`) + `POST /api/payments/create` (`createPayment`) | `getRentalRequestById` throws → `notFound()`; page redirects unless `status === "APPROVED"`. `PayButton` calls `createPayment` then `window.location.href = result.paymentURL` (Stripe). |
| Payments `/tenant-dashboard/payments` | `GET /api/payments` (`getMyPayments`) | History + stat cards. |
| `POST /api/rentals` | `app/(publicGroup)/properties/_actions/createRentalRequest.ts` → `RequestToRentButton` | Requesting happens on the public property page; success redirects to `/tenant-dashboard/requests`. |
| Profile `/tenant-dashboard/profile` | `GET /api/auth/me` (`getUser`) | — |

### Stripe return pages

| Page | Endpoint(s) | Notes |
| ---- | ----------- | ----- |
| `/payment/success/[transactionId]` | `GET /api/payments` (`getPaymentByTransactionId`) | Server page does a one-shot `getMyPayments().find(p => p.transactionId === transactionId)`; client `PaymentStatus` polls `getPaymentByTransactionId(transactionId)` every **2000 ms**, max **10 attempts**, stopping early once `status === "COMPLETED"`. Matching is **client-side** — there is no `?transactionId=` query param. |
| `/payment/cancel/[transactionId]` | — | Static "payment cancelled" page. |

Stripe `success_url` / `cancel_url` point at the **frontend** origin. The backend `.env` `APP_URL` must be set to the deployed frontend URL.

### Landlord dashboard

| Page | Endpoint(s) | Notes |
| ---- | ----------- | ----- |
| Overview `/landlord-dashboard` | `GET /api/landlord/requests` (`getLandlordRequests`) + `GET /api/properties` (`getLandlordProperties`) + `GET /api/auth/me` | "Needs your decision" queue (`DecisionCard` for PENDING) + portfolio snapshot; property titles joined client-side. |
| Properties `/landlord-dashboard/properties` | `GET /api/auth/me` + `GET /api/properties` (`getLandlordProperties`) | **`getLandlordProperties` calls `GET /api/properties` with no query params and filters client-side by `landlordId`.** There is no `GET /api/landlord/properties`. |
| New property `/landlord-dashboard/properties/new` | `GET /api/categories` (`getCategories`) | Shared `PropertyForm`. |
| Edit property `/landlord-dashboard/properties/[id]/edit` | `GET /api/auth/me` + `GET /api/properties` (`getLandlordProperties`) + `GET /api/categories` | Finds the property by id **client-side** (`properties.find(p => p.id === id)`) → `notFound()` if missing. No `GET /api/landlord/properties/:id` call. |
| Create / update property | `POST /api/landlord/properties` (`createProperty`) / `PUT /api/landlord/properties/:id` (`updateProperty`) | Shared `PropertyForm`; success → `router.push("/landlord-dashboard/properties")`. |
| Delete property | `DELETE /api/landlord/properties/:id` (`deleteProperty`) | Two-step confirm in `DeletePropertyButton`; success → `router.refresh()`. |
| Requests `/landlord-dashboard/requests` | `GET /api/auth/me` + `GET /api/properties` (`getLandlordProperties`) + `GET /api/landlord/requests` (`getLandlordRequests`) | Joined client-side; `DecisionCard` per request. |
| Update request status | `PATCH /api/landlord/requests/:id` (`updateRequestStatus`) | `DecisionCard` optimistic approve/reject; reverts + toasts on error. |
| Profile `/landlord-dashboard/profile` | `GET /api/auth/me` (`getUser`) | — |

### Admin dashboard

| Page | Endpoint(s) | Notes |
| ---- | ----------- | ----- |
| Overview `/admin-dashboard` | `GET /api/admin/users` + `GET /api/admin/rentals` + `GET /api/properties` | Stat cards; rentals→properties joined client-side. |
| Users `/admin-dashboard/users` | `GET /api/admin/users` (`getAdminUsers`) + `PATCH /api/admin/users/:id` (`updateUserStatus`) | `MembersTabs` filters client-side; ban/unban in `BanButton` → `router.refresh()`. |
| Properties `/admin-dashboard/properties` | `GET /api/properties` (`getAdminProperties`) | **Unfiltered** — backend has no `/api/admin/properties`. |
| Rentals `/admin-dashboard/rentals` | `GET /api/admin/rentals` (`getAdminRentals`) + `GET /api/admin/users` + `GET /api/properties` | Users + properties joined client-side to render names/images. |
| Categories `/admin-dashboard/categories` | `GET /api/categories` (`getAdminCategories`) + `POST /api/categories/create` (`createCategory`) | ADMIN-only create (name ≥ 2 chars, optional description; duplicate name → 409, surfaced via `json.message`). New categories appear automatically in the landlord `PropertyForm` and browse `FilterStrip`. |

---

## Response-shape notes / gotchas

- **Retry wrapper (`app/lib/fetch-api.ts`):** all read actions go through it. `fetchApi` retries transient network failures (flaky Vercel edge nodes) 3× with linear backoff — a retry usually lands on a reachable node. Mutations (POST/PATCH) are never retried to avoid duplicate side effects. `getUser` additionally returns a `503` envelope on network failure so the public/dashboard layouts render (dashboard shows a "service temporarily unavailable" screen instead of bouncing to `/login`).
- **`getLandlordProperties` (landlord dashboard):** calls `GET /api/properties` with **no query params** and filters client-side by `landlordId`. Do NOT add `landlordId` as a query param to the backend call — the public endpoint doesn't support it.
- **`getPaymentByTransactionId` (payment success):** fetches the full `GET /api/payments` list and `.find()`s by `transactionId` client-side. Polling in `PaymentStatus`: interval **2000 ms**, max **10 attempts**.
- **Throwing reads:** only `getPropertyById` and `getRentalRequestById` throw on `!res.ok` after retries — their pages wrap them in try/catch → `notFound()`. `getMyRentals`, `getMyPayments`, `getCategories` (public), and all dashboard/admin/landlord lists are defensive (`data: []` / `[]`).
- **`getReviews` returns an unwrapped `Review[]`**, not the `{ success, ..., data }` envelope — the only read that does this.
- **`getEligibleRental`** relies on the backend including the `review` relation on `GET /api/rentals` so the `!r.review` "already reviewed" check works. `RentalRequest.review?: Review | null` is typed in `app/lib/types.ts`.
- **Cookie forwarding:** most protected actions forward `Cookie: cookieStore.toString()`; `service/getUser.ts` and `getRentalRequestById` forward only `Cookie: accessToken=…`.
- **`PATCH /api/admin/users/:id`** response includes `password` (backend quirk) — the frontend only reads `status`/`success`.
- **Duplicate category name → 409** is backend behavior; the frontend surfaces `json.message` but does not special-case the status.
- **`logout` revalidate tag** (`"user-profile"`) is currently a no-op — no fetch registers that tag (all use `cache: "no-store"`).
- **Route guarding** lives in root `proxy.ts` (Next 16, not `middleware.ts`). It decodes the `accessToken` cookie via `utils/jwt.ts` and redirects by role. `/payment/success/*` and `/payment/cancel/*` are **not** public routes, so they require a token (pages fetch user-scoped payments).
- **Images:** `next.config.ts` sets `images.unoptimized: true` and wildcard `remotePatterns` for `http`/`https`, so property image URLs work from **any** host without whitelisting.

---

## Frontend flow summary

1. **Landlord** registers/logs in → creates properties (`POST /api/landlord/properties`) → receives rental requests (`GET /api/landlord/requests`) → approves/rejects them (`PATCH /api/landlord/requests/:id`).
2. **Tenant** registers/logs in → browses properties (`GET /api/properties` with filters) → creates a rental request (`POST /api/rentals`) → once the landlord approves, creates a payment (`POST /api/payments/create`) → is redirected to Stripe → polls the payment status on `/payment/success/[transactionId]` → after success the rental becomes `ACTIVE`.
3. **Tenant** can then leave a review (`POST /api/reviews`) for an `ACTIVE` rental.
4. **Admin** manages users (ban/unban via `PATCH /api/admin/users/:id`, role changes), monitors all rental requests (`GET /api/admin/rentals`), and creates categories (`POST /api/categories/create`).

## Adding a new feature

1. Add a `"use server"` action under the relevant `app/**/_actions/` (or `service/` for cross-cutting helpers).
2. Forward cookies with `Cookie: cookieStore.toString()`, use `cache: "no-store"`, and route the call through `fetchApi`/`fetchList`/`fetchEnvelopeOrEmpty` (`app/lib/fetch-api.ts`) so reads get retry + defensive behavior.
3. Mutations: Zod-validate, return `{ success, message }`, never throw; toast via `toastActionResult` / `useActionResultToast` (`app/lib/action-feedback.ts`).
4. Reads: use `fetchList`/`fetchEnvelopeOrEmpty` for lists (defensive `[]`); let single-item fetches throw (→ `error.tsx`/`notFound()`).
