# RentNest

A full-stack rental marketplace frontend — browse listings, request to rent, pay securely with Stripe, and manage everything from role-based dashboards.

**Live:** https://rent-nest-o1.vercel.app
**Backend API:** https://rent-nest-three-blue.vercel.app (separate service — see [API_INTEGRATION.md](./API_INTEGRATION.md))

## Demo Account

| Role  | Email             | Password   |
| ----- | ----------------- | ---------- |
| ADMIN | `admin@gmail.com` | `admin123` |

Tenant and landlord accounts can be created via [`/register`](https://rent-nest-o1.vercel.app/register).

## Features

### Public
- Home page with live listing stats, a marquee of available properties, category chips, and featured listings
- Browse page with URL-driven filters: city, min/max price, category, pagination
- Property detail pages with image gallery, specs, amenities, landlord card, and tenant reviews
- Review submission for tenants with an `ACTIVE` (paid) rental on that property

### Authentication
- Register as **TENANT** or **LANDLORD**
- Login issues httpOnly `accessToken` / `refreshToken` cookies (set by the backend)
- Role-aware redirects after login; logged-in users are bounced off auth pages

### Tenant Dashboard
- Overview with stat cards and a "needs your attention" queue (pay / review prompts)
- Rental requests list with color-coded status badges
- Stripe checkout for approved requests, with a polling success page that confirms payment status
- Full payment history
- Profile page

### Landlord Dashboard
- Portfolio overview with letting stats and a pending-decision queue
- Property CRUD: create, edit, delete listings with availability toggle
- Rental request inbox with approve/reject using optimistic UI (reverts + toasts on error)
- Profile page

### Admin Dashboard
- Platform-wide overview (members, listings, leases)
- User management with ban/unban
- Property and rental moderation views
- Category management (new categories appear instantly in forms and filters)

## Tech Stack

| Concern            | Technology                                        |
| ------------------ | ------------------------------------------------- |
| Framework          | [Next.js 16](https://nextjs.org) (App Router)     |
| UI library         | [React 19](https://react.dev)                     |
| Language           | TypeScript 5                                      |
| Styling            | Tailwind CSS v4 (`@theme inline`, no config file) |
| Components         | shadcn/ui + Radix UI                              |
| Validation         | Zod v4                                            |
| Toasts             | sonner                                            |
| Theming            | next-themes (light/dark)                          |
| Icons              | lucide-react                                      |
| Auth/session       | httpOnly cookies + JWT (`jsonwebtoken`)           |
| Payments           | Stripe Checkout (via backend)                     |
| Package manager    | pnpm                                              |

## Getting Started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io)
- A running RentNest backend (local or deployed)

### Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd rent-nest-client
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the project root:

```env
NEXT_PUBLIC_API_URL= BACKEND_API_URL
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

> Point `NEXT_PUBLIC_API_URL` at your local backend or the deployed one (`https://rent-nest-three-blue.vercel.app`). The JWT secrets must match the backend's signing secrets so `proxy.ts` can decode the auth cookie.

4. Start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command        | Description                    |
| -------------- | ------------------------------ |
| `pnpm dev`     | Start the development server   |
| `pnpm build`   | Production build               |
| `pnpm start`   | Serve the production build     |
| `pnpm lint`    | Run ESLint                     |

## Architecture

- **Route groups:** `(publicGroup)` for marketing/browse pages, `(authGroup)` for login/register, `(dashboardGroup)` for all three role dashboards sharing one sidebar shell.
- **Server actions:** all data access lives in `"use server"` files under `app/**/_actions/` and `service/`. Server fetches forward the browser's auth cookies to the backend.
- **Route protection:** root `proxy.ts` (Next.js 16's replacement for `middleware.ts`) decodes the JWT cookie and gates each dashboard by role.
- **Defensive fetching:** reads go through a retry wrapper (`app/lib/fetch-api.ts`) that returns empty data instead of crashing; mutations return `{ success, message }` state objects surfaced as toasts.
- **Full endpoint ↔ component mapping:** see [API_INTEGRATION.md](./API_INTEGRATION.md).

## Route Map

| Route | Description |
| ----- | ----------- |
| `/` | Home — hero, live stats, featured listings |
| `/properties` | Browse with filters |
| `/properties/[id]` | Property detail + reviews |
| `/login` · `/register` | Auth |
| `/tenant-dashboard` | Tenant overview |
| `/tenant-dashboard/requests` | My rental requests |
| `/tenant-dashboard/requests/[id]/pay` | Stripe checkout |
| `/tenant-dashboard/payments` | Payment history |
| `/tenant-dashboard/profile` | Profile |
| `/landlord-dashboard` | Landlord overview |
| `/landlord-dashboard/properties` (+ `/new`, `/[id]/edit`) | Manage listings |
| `/landlord-dashboard/requests` | Approve/reject requests |
| `/landlord-dashboard/profile` | Profile |
| `/admin-dashboard` | Admin overview |
| `/admin-dashboard/users` | Ban/unban users |
| `/admin-dashboard/properties` | Listings moderation |
| `/admin-dashboard/rentals` | Rentals moderation |
| `/admin-dashboard/categories` | Category management |
| `/payment/success/[transactionId]` | Stripe return — polls until confirmed |
| `/payment/cancel/[transactionId]` | Stripe return — cancelled |

## Deployment

Deployed on Vercel: https://rent-nest-o1.vercel.app

When deploying:

1. Set `NEXT_PUBLIC_API_URL`, `JWT_SECRET`, and `JWT_REFRESH_SECRET` in Vercel project settings.
2. The backend's `APP_URL` must point at this frontend's deployed URL — Stripe checkout `success_url` / `cancel_url` redirect here.
