import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCheck,
  Clock3,
  Lamp,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUser } from "@/service/getUser";
import type { Property, RentalRequest } from "@/app/lib/types";
import { getLandlordProperties } from "./_actions/getLandlordProperties";
import { getLandlordRequests } from "./_actions/getLandlordRequests";
import { DecisionCard } from "./_components/DecisionCard";
import { AvailabilityLight } from "./_components/AvailabilityLight";

type JoinedRequest = Omit<RentalRequest, "property"> & {
  property?: { id: string; title: string; city: string } | null;
};

const joinRequests = (
  requests: RentalRequest[],
  properties: Property[],
): JoinedRequest[] => {
  const map = new Map(properties.map((p) => [p.id, p]));
  return requests.map((r) => ({
    ...r,
    property: map.has(r.propertyId)
      ? {
          id: r.propertyId,
          title: map.get(r.propertyId)!.title,
          city: map.get(r.propertyId)!.city,
        }
      : null,
  }));
};

const statCards = [
  { label: "Listings", icon: Building2, key: "listings", description: "Properties on your board" },
  { label: "Letting now", icon: Lamp, key: "letting", description: "Available to new tenants" },
  { label: "Pending requests", icon: Clock3, key: "pending", description: "Awaiting your decision" },
  { label: "Active lets", icon: CheckCheck, key: "active", description: "Currently rented out" },
] as const;

export default async function LandlordDashboardPage() {
  const user = await getUser();
  const landlordId = user.data?.id as string;

  const [properties, requests] = await Promise.all([
    getLandlordProperties(landlordId),
    getLandlordRequests(),
  ]);

  const joined = joinRequests(requests, properties);
  const pendingRequests = joined
    .filter((r) => r.status === "PENDING")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const values = {
    listings: properties.length,
    letting: properties.filter((p) => p.isAvailable).length,
    pending: joined.filter((r) => r.status === "PENDING").length,
    active: joined.filter((r) => r.status === "ACTIVE").length,
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="relative overflow-hidden rounded-2xl border bg-primary px-5 py-6 text-primary-foreground shadow-sm sm:px-8 sm:py-8">
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-xl flex-col gap-3">
            <Badge className="w-fit border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/15">
              Landlord dashboard
            </Badge>
            <div className="flex flex-col gap-2">
              <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Your letting desk, at a glance.
              </h1>
              <p className="max-w-lg text-pretty text-sm leading-6 text-primary-foreground/75">
                Keep listings lit, field rental requests, and watch your
                portfolio fill up.
              </p>
            </div>
          </div>

          <Button asChild variant="secondary" className="w-fit">
            <Link href="/landlord-dashboard/properties/new">
              Add property
              <Plus className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Portfolio summary"
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

      {pendingRequests.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold tracking-tight">
              Needs your decision
            </h2>
            <p className="text-sm text-muted-foreground">
              Tenants are waiting on these — a quick call keeps things moving.
            </p>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {pendingRequests.slice(0, 4).map((r) => (
              <DecisionCard key={r.id} request={r} />
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold tracking-tight">
              Portfolio snapshot
            </h2>
            <p className="text-sm text-muted-foreground">
              Which of your properties are lit right now.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/landlord-dashboard/properties">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {properties.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Building2 aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium">No properties listed yet</p>
                <p className="text-sm text-muted-foreground">
                  List your first property to start fielding requests.
                </p>
              </div>
              <Button asChild>
                <Link href="/landlord-dashboard/properties/new">
                  Add your first property
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-0">
              <div className="flex flex-col">
                {properties.map((p, index) => (
                  <div key={p.id}>
                    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={
                            p.isAvailable
                              ? "flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                              : "flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground"
                          }
                        >
                          <Lamp aria-hidden="true" />
                        </div>
                        <div className="flex min-w-0 flex-col gap-1">
                          <p className="truncate font-medium">{p.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.address} · {p.category?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-4">
                        <span className="text-sm font-semibold tabular-nums">
                          ৳{p.price.toLocaleString()}
                        </span>
                        <AvailabilityLight available={p.isAvailable} />
                      </div>
                    </div>
                    {index < properties.length - 1 && <Separator />}
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
