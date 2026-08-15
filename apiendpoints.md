# RentNest API Endpoints

Base URL (local dev): `http://localhost:8000`
All routes are prefixed with `/api`.

---

## Authentication

Tokens are issued at login as **HTTP-only cookies** (`accessToken`, `refreshToken`) AND returned in the response body.

To send an authenticated request, either:

1. **Allow cookies** — fetch with `credentials: "include"` (cors is configured with `credentials: true`), or
2. Send header: `Authorization: Bearer <accessToken>`

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
| 409  | Conflict (e.g. email already exists) |

---

## Auth

### Register — `POST /api/auth/register`
Public.

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "TENANT",
  "phone": "01712345678"
}
```
- `name` (min 2), `email`, `password` (min 6) required
- `role` must be `TENANT` or `LANDLORD`
- `phone` optional

Response `data`: the created user (**password omitted**).

### Login — `POST /api/auth/login`
Public.

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

### Get current user — `GET /api/auth/me`
Auth required (any logged-in user).

Response `data`: the logged-in user (**password omitted**).

---

## Categories

### Create category — `POST /api/categories/create`
Auth: **ADMIN**.

```json
{ "name": "Apartment", "description": "optional text" }
```
- `name` required (unique), min 2 chars

### Get all categories — `GET /api/categories`
Public.

Response `data`: array of categories.

---

## Properties

### Get all properties — `GET /api/properties`
Public. Supports optional query filters (combinable):

| Query param | Type | Description |
| ----------- | ---- | ----------- |
| `city`      | string | case-insensitive partial match |
| `minPrice`  | number | price ≥ value |
| `maxPrice`  | number | price ≤ value |
| `categoryId`| string | exact category match |

Example: `GET /api/properties?city=Dhaka&minPrice=10000&maxPrice=30000&categoryId=abc`

Response `data`: array of properties, each including `category` and `landlord` (`{ name, email }`).

### Get single property — `GET /api/properties/:id`
Public.

Response `data`: the property, including `category` and `landlord`.

### Property object shape

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

---

## Landlord

All endpoints under `/api/landlord` require **LANDLORD** role.

### Create property — `POST /api/landlord/properties`

```json
{
  "title": "Sunny Apartment",
  "description": "…",
  "address": "House 12, Road 5",
  "city": "Dhaka",
  "price": 20000,
  "bedrooms": 2,
  "bathrooms": 2,
  "areaSqft": 1200,
  "amenities": ["wifi", "parking"],
  "images": ["https://…"],
  "categoryId": "uuid",
  "isAvailable": true
}
```
- Required: `title`, `description`, `address`, `city`, `price`, `categoryId`
- Optional: `bedrooms`, `bathrooms`, `areaSqft`, `amenities`, `images`, `isAvailable`

Response `data`: the created property.

### Update property — `PUT /api/landlord/properties/:id`
Only the property owner can update. All fields optional (partial update). Same shape as create.

Response `data`: the updated property.

### Delete property — `DELETE /api/landlord/properties/:id`
Only the property owner can delete.

Response `data`: the deleted property.

### Get rental requests — `GET /api/landlord/requests`
Returns all rental requests for the logged-in landlord's properties.

### Update rental request status — `PATCH /api/landlord/requests/:id`
Only the property owner can update.

```json
{ "status": "APPROVED" }
```
`status` must be `APPROVED` or `REJECTED`.

Response `data`: the updated rental request.

---

## Rentals (Tenant)

All endpoints under `/api/rentals` require **TENANT** role.

### Create rental request — `POST /api/rentals`

```json
{
  "propertyId": "uuid",
  "moveInDate": "2026-09-01",
  "duration": 6,
  "message": "optional note"
}
```
- `moveInDate` format `YYYY-MM-DD`
- `duration` = number of months; `totalAmount` is computed server-side as `price × duration`

Response `data`: the created rental request.

### Get my rental requests — `GET /api/rentals`
Returns the logged-in tenant's requests (newest first), each including `property` and `payment`.

### Get single rental request — `GET /api/rentals/:id`
Returns the request including `property`. Only the owner tenant can view.

### Rental request object shape

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

---

## Payments (Tenant)

All endpoints under `/api/payments` require **TENANT** role (except webhook `confirm`).

### Create payment — `POST /api/payments/create`
Requires an **APPROVED** rental request owned by the tenant.

```json
{ "requestId": "rentalRequestId" }
```

Response `data`:

```json
{
  "paymentURL": "https://checkout.stripe.com/…",
  "newTransactionId": "RENTNEXT-…"
}
```
Redirect the user to `paymentURL` to complete checkout. After payment, the frontend can poll the payment / rental status (payment becomes `COMPLETED`, rental becomes `ACTIVE`).

### Stripe webhook — `POST /api/payments/confirm`
Called by **Stripe** — not for the frontend. Sends raw JSON body with the `Stripe-Signature` header.

### Get my payment history — `GET /api/payments`
Returns the logged-in tenant's payments, each including `rentalRequest`.

### Get single payment — `GET /api/payments/:id`
Only the owner tenant can view.

### Payment object shape

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

---

## Admin

All endpoints under `/api/admin` require **ADMIN** role.

### Get all users — `GET /api/admin/users`
Response `data`: array of users (**password omitted**).

### Update user — `PATCH /api/admin/users/:id`

```json
{
  "name": "…",
  "email": "…",
  "phone": "…",
  "role": "TENANT",
  "status": "ACTIVE"
}
```
All fields optional. `role`: `TENANT` | `LANDLORD` | `ADMIN`. `status`: `ACTIVE` | `BANNED` (required).

Response `data`: the updated user (⚠ includes `password`).

### Get all rental requests — `GET /api/admin/rentals`
Response `data`: array of all rental requests.

---

## Reviews

### Create review — `POST /api/reviews`
Auth: **TENANT**. Requires the rental request to have status `ACTIVE` (i.e. paid) and belong to the tenant. One review per rental request.

```json
{
  "rentalRequestId": "uuid",
  "rating": 5,
  "comment": "optional"
}
```
`rating` must be an integer 1–5.

Response `data`: the created review.

### Get all reviews — `GET /api/reviews`
Public.

Response `data`: array of reviews.

---

## Roles & enums reference

| Enum | Values |
| ---- | ------ |
| Role | `TENANT`, `LANDLORD`, `ADMIN` |
| UserStatus | `ACTIVE`, `BANNED` |
| RentalStatus | `PENDING`, `APPROVED`, `REJECTED`, `ACTIVE`, `COMPLETED`, `CANCELLED` |
| PaymentStatus | `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED` |

## Frontend flow summary

1. **Landlord** registers/logs in → creates categories (admin) + properties → receives rental requests → approves/rejects them.
2. **Tenant** registers/logs in → browses properties → creates a rental request → once the landlord approves, creates a payment → is redirected to Stripe → after success the rental becomes `ACTIVE`.
3. **Tenant** can then leave a review for an `ACTIVE` rental.
4. **Admin** manages users (ban/unban, role changes) and monitors all rental requests.
