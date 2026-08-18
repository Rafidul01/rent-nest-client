import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  Home as HomeIcon,
  KeyRound,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LettingLamp } from "./_components/LettingLamp";
import { getUser } from "@/service/getUser";
import type { ApiSuccessResponse, Category, Property } from "@/app/lib/types";
import { getProperties } from "./properties/_actions/getProperties";
import { getCategories } from "./properties/_actions/getCategories";
import PropertyCard from "./properties/_components/PropertyCard";
import Marquee from "./_components/Marquee";
import { PostListingButton } from "./_components/PostListingButton";

const safe = async <T,>(run: () => Promise<T>): Promise<T | null> => {
  try {
    return await run();
  } catch {
    return null;
  }
};

const STATS = [
  { label: "Live listings", key: "live" },
  { label: "Cities covered", key: "cities" },
  { label: "Property types", key: "types" },
] as const;

const tenantPerks = [
  "Filter by city, budget, and size in seconds",
  "Request a rental and pay your first month securely online",
  "Every listing has a real landlord behind it",
];

const landlordPerks = [
  "Reach tenants who are actively looking right now",
  "Approve or decline requests in one tap",
  "Track who has moved in at a glance",
];

export default async function Home() {
  const [user, propsRes, catsRes] = await Promise.all([
    getUser(),
    safe(() => getProperties({ limit: "50" })),
    safe(() => getCategories()),
  ]);

  const properties = (propsRes as ApiSuccessResponse<Property[]> | null)?.data ?? [];
  const categories = (catsRes as ApiSuccessResponse<Category[]> | null)?.data ?? [];

  const available = properties.filter((p) => p.isAvailable);
  const featured = available.slice(0, 6);
  const marqueeProps = available.slice(0, 12);

  const cities = new Set(properties.map((p) => p.city)).size;

  const stats = {
    live: available.length,
    cities,
    types: categories.length,
  };

  return (
    <main className="bg-paper text-foreground">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-sidebar text-sidebar-foreground"
        aria-label="RentNest — find your next home"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(60rem 30rem at 80% -10%, oklch(0.85 0.13 80 / 0.14), transparent 60%), radial-gradient(40rem 24rem at 5% 110%, oklch(0.8 0.1 178 / 0.1), transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, oklch(1 0 0 / 0.03) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.03) 1px, transparent 1px)",
            backgroundSize: "3rem 3rem",
          }}
        />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-24 pt-16 sm:px-6 sm:pt-24">
          <div className="flex w-fit items-center gap-2 rounded-full border border-lamp/25 bg-lamp/10 px-3 py-1.5 text-xs font-medium text-lamp">
            <LettingLamp lit className="size-4" />
            {stats.live} listings live now
          </div>

          <div className="flex max-w-3xl flex-col gap-6">
            <h1 className="font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Your next home,{" "}
              <span className="text-sidebar-accent">already lit.</span>
            </h1>
            <p className="max-w-xl text-pretty text-base leading-7 text-sidebar-foreground/70 sm:text-lg">
              RentNest puts verified flats, houses, and studios across Dhaka and
              Chattogram on one board. Search what fits, request the place, pay
              securely — then move in.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-xl">
                <Link href="/properties">
                  Browse listings
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
              <PostListingButton
                user={user}
                label="Post a listing"
                size="lg"
                variant="outline"
                className="rounded-xl border-sidebar-accent/30 bg-transparent text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-sidebar-foreground/10 pt-6 sm:max-w-md sm:gap-6">
            {STATS.map((stat) => (
              <div key={stat.key} className="flex min-w-0 flex-col gap-1">
                <span className="truncate text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
                  {stats[stat.key]}
                </span>
                <span className="text-xs text-sidebar-foreground/60">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marquee ───────────────────────────────────────── */}
      {marqueeProps.length > 0 && (
        <div className="relative z-10 -mt-16 bg-paper">
          <Marquee properties={marqueeProps} />
        </div>
      )}

      {/* ── Browse by type ────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                Browse by type
              </p>
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                What kind of nest?
              </h2>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/properties">
                View all
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/properties?categoryId=${category.id}`}
                className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <HomeIcon className="size-4 text-primary" aria-hidden="true" />
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Fresh on the board ────────────────────────────── */}
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              Fresh on the board
            </p>
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Just lit, still available
            </h2>
            <p className="text-sm text-muted-foreground">
              The newest listings that are open for requests right now.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link href="/properties">
              View all listings
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {featured.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <HomeIcon aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium">No listings lit yet</p>
                <p className="text-sm text-muted-foreground">
                  Be the first to list a property on RentNest.
                </p>
              </div>
              <PostListingButton user={user} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* ── For tenants / landlords ───────────────────────── */}
      <section className="mx-auto flex max-w-6xl flex-col gap-5 px-4 pb-16 sm:px-6">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            How it works
          </p>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Built for both sides of the lease
          </h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="py-6 transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <KeyRound className="size-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-semibold tracking-tight">
                    For tenants
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Find a place that fits your budget and your life.
                  </p>
                </div>
              </div>
              <ul className="flex flex-col gap-2.5">
                {tenantPerks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    {perk}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-fit rounded-xl">
                <Link href="/properties">
                  Start browsing
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="py-6 transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="size-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-semibold tracking-tight">
                    For landlords
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Fill your property with the right tenant, faster.
                  </p>
                </div>
              </div>
              <ul className="flex flex-col gap-2.5">
                {landlordPerks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    {perk}
                  </li>
                ))}
              </ul>
              <PostListingButton
                user={user}
                variant="default"
                icon={<ArrowRight className="ml-2 size-4" aria-hidden="true" />}
                className="w-fit rounded-xl"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 overflow-hidden rounded-3xl bg-sidebar px-6 py-12 text-sidebar-foreground sm:px-12 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(40rem 20rem at 90% 120%, oklch(0.85 0.13 80 / 0.16), transparent 60%)",
            }}
          />
          <div className="relative flex flex-col gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sidebar-accent">
              Ready to move?
            </p>
            <h2 className="font-display max-w-lg text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Your next address is on the board tonight.
            </h2>
            <p className="max-w-md text-sm leading-6 text-sidebar-foreground/70">
              Whether you&apos;re looking for a place or listing one, RentNest
              is the quickest way to get it sorted.
            </p>
          </div>
          <div className="relative flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-xl">
              <Link href="/properties">
                Find a home
                <MapPin className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
            <PostListingButton
              user={user}
              label="List a property"
              size="lg"
              variant="outline"
              icon={null}
              className="rounded-xl border-sidebar-accent/30 bg-transparent text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
            />
          </div>
        </div>
      </section>
    </main>
  );
}