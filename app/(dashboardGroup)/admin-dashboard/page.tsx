import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Clock3,
  KeyRound,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Property, RentalRequest, User } from "@/app/lib/types";
import { getAdminUsers } from "./_actions/getAdminUsers";
import { getAdminProperties } from "./_actions/getAdminProperties";
import { getAdminRentals } from "./_actions/getAdminRentals";
import { UserRow } from "./_components/UserRow";
import { RentalRow } from "./_components/RentalRow";
import { DashboardHero } from "../_components/DashboardHero";

type JoinedRental = Omit<RentalRequest, "property"> & {
  property?: { id: string; title: string; city: string; images?: string[] } | null;
};

const joinRentals = (
  rentals: RentalRequest[],
  properties: Property[],
): JoinedRental[] => {
  const map = new Map(properties.map((p) => [p.id, p]));
  return rentals.map((r) => ({
    ...r,
    property: map.has(r.propertyId)
      ? {
          id: r.propertyId,
          title: map.get(r.propertyId)!.title,
          city: map.get(r.propertyId)!.city,
          images: map.get(r.propertyId)!.images,
        }
      : r.property ?? null,
  }));
};

const statCards = [
  {
    label: "Members",
    icon: Users,
    key: "users",
    description: "Accounts across all roles",
  },
  {
    label: "Listings",
    icon: Building2,
    key: "properties",
    description: "Properties on the board",
  },
  {
    label: "Rental requests",
    icon: KeyRound,
    key: "rentals",
    description: "Requests logged in total",
  },
  {
    label: "Awaiting decision",
    icon: Clock3,
    key: "pending",
    description: "Rentals stuck on PENDING",
  },
] as const;

const byNewest = (a: { createdAt: string }, b: { createdAt: string }) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

export default async function AdminDashboardPage() {
  const [users, properties, rentals] = await Promise.all([
    getAdminUsers(),
    getAdminProperties(),
    getAdminRentals(),
  ]);

  const joined = joinRentals(rentals, properties);
  const pendingRentals = joined
    .filter((r) => r.status === "PENDING")
    .sort(byNewest);
  const recentUsers = [...users].sort(byNewest);

  const values = {
    users: users.length,
    properties: properties.length,
    rentals: rentals.length,
    pending: pendingRentals.length,
  };

  return (
    <div className="flex flex-col gap-8">
      <DashboardHero
        eyebrow="Admin desk"
        title="The whole market, on one board."
        description="Keep every member, listing, and lease in check — spot what needs a decision at a glance."
        action={{
          label: "Review members",
          href: "/admin-dashboard/users",
        }}
      />

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Marketplace summary"
      >
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.key}
              className="gap-4 py-5 transition-shadow hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-start justify-between gap-4 px-5 pb-0">
                <div className="flex flex-col gap-1">
                  <CardDescription className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    {stat.label}
                  </CardDescription>
                  <CardTitle className="text-3xl tabular-nums tracking-tight">
                    {values[stat.key]}
                  </CardTitle>
                </div>
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-0 text-xs text-muted-foreground">
                {stat.description}
              </CardContent>
            </Card>
          );
        })}
      </section>

      {pendingRentals.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-xl font-semibold tracking-tight">
                Needs a decision
              </h2>
              <p className="text-sm text-muted-foreground">
                Tenants and landlords are waiting on these.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin-dashboard/rentals">
                All rentals
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-0">
              <div className="flex flex-col">
                {pendingRentals.slice(0, 4).map((r, index) => (
                  <div key={r.id}>
                    <RentalRow rental={r} />
                    {index < Math.min(pendingRentals.length, 4) - 1 && (
                      <Separator />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Recent signups
            </h2>
            <p className="text-sm text-muted-foreground">
              Newest members of the marketplace.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin-dashboard/users">
              All members
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {recentUsers.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <BadgeCheck aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium">No members yet</p>
                <p className="text-sm text-muted-foreground">
                  Signups will appear here as people join.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-0">
              <div className="flex flex-col">
                {recentUsers.slice(0, 5).map((user: User, index) => (
                  <div key={user.id}>
                    <UserRow user={user} />
                    {index < Math.min(recentUsers.length, 5) - 1 && (
                      <Separator />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}