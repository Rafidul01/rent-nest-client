import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Home,
  MoveUpRight,
  Wallet,
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
import { getMyPayments } from "./_actions/getMyPayments";
import { getMyRentals } from "./_actions/getMyRentals";
import { RentalRequest } from "@/app/lib/types";
import RequestStatusBadge from "../_components/RequestStatusBadge";
import { DashboardHero } from "../_components/DashboardHero";

const statCards = [
  {
    label: "Total requests",
    icon: FileText,
    key: "requests",
    description: "All applications submitted",
  },
  {
    label: "Active rentals",
    icon: Home,
    key: "active",
    description: "Homes currently rented",
  },
  {
    label: "Pending review",
    icon: Clock3,
    key: "pending",
    description: "Awaiting a decision",
  },
  {
    label: "Total spent",
    icon: Wallet,
    key: "spent",
    description: "Completed payments",
  },
] as const;

export default async function TenantDashboardPage() {
  const [rentalsRes, paymentsRes] = await Promise.all([
    getMyRentals(),
    getMyPayments(),
  ]);

  const rentals = rentalsRes.data;
  const payments = paymentsRes.data;
  const totalRequests = rentals.length;
  const activeCount = rentals.filter((r) => r.status === "ACTIVE").length;
  const pendingCount = rentals.filter((r) => r.status === "PENDING").length;
  const totalSpent = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);
  const needsPayment = rentals.filter((r) => r.status === "APPROVED");
  const needsReview = rentals.filter((r) => r.status === "ACTIVE");
  const recentRentals = [...rentals]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const values = {
    requests: totalRequests,
    active: activeCount,
    pending: pendingCount,
    spent: `৳${totalSpent.toLocaleString()}`,
  };

  return (
    <div className="flex flex-col gap-8">
      <DashboardHero
        eyebrow="Tenant desk"
        title="Your rental journey, at a glance."
        description="Track applications, manage active homes, and stay on top of every payment in one calm place."
        action={{
          label: "Explore homes",
          href: "/properties",
          icon: MoveUpRight,
        }}
      />

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Rental summary"
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

      {(needsPayment.length > 0 || needsReview.length > 0) && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Needs your attention
            </h2>
            <p className="text-sm text-muted-foreground">
              A few quick actions will keep your rental journey moving.
            </p>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {needsPayment.map((r) => (
              <Card key={r.id} className="border-primary/20 bg-primary/4">
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Wallet aria-hidden="true" />
                    </div>
                    <div className="flex min-w-0 flex-col gap-1">
                      <p className="truncate font-medium">
                        {r.property?.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Payment required to activate
                      </p>
                    </div>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/tenant-dashboard/requests/${r.id}/pay`}>
                      Pay now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
            {needsReview.map((r) => (
              <Card key={r.id}>
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                      <CheckCircle2 aria-hidden="true" />
                    </div>
                    <div className="flex min-w-0 flex-col gap-1">
                      <p className="truncate font-medium">
                        {r.property?.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Share your experience
                      </p>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/properties/${r.propertyId}`}>Review</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Recent requests
            </h2>
            <p className="text-sm text-muted-foreground">
              Your latest rental applications.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/tenant-dashboard/requests">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {recentRentals.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Home aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium">No requests yet</p>
                <p className="text-sm text-muted-foreground">
                  Find a place that feels like home to get started.
                </p>
              </div>
              <Button asChild>
                <Link href="/properties">Browse properties</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="flex flex-col">
                {recentRentals.map((r: RentalRequest, index) => (
                  <div key={r.id}>
                    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                          <Home aria-hidden="true" />
                        </div>
                        <div className="flex min-w-0 flex-col gap-1">
                          <p className="truncate font-medium">
                            {r.property?.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Submitted{" "}
                            {new Date(r.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <RequestStatusBadge status={r.status} />
                    </div>
                    {index < recentRentals.length - 1 && <Separator />}
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
