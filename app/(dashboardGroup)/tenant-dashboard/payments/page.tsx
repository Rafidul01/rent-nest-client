import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Home, ReceiptText } from "lucide-react";
import { getMyPayments } from "../_actions/getMyPayments";
import { PageHeader } from "../../_components/PageHeader";

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  COMPLETED: "default",
  PENDING: "outline",
  FAILED: "destructive",
  REFUNDED: "secondary",
};

export default async function TenantPaymentsPage() {
  const { data: payments } = await getMyPayments();

  const completedCount = payments.filter(
    (p) => p.status === "COMPLETED",
  ).length;
  const totalSpent = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        eyebrow="Transactions"
        title="Payment history"
        description="Every payment you&apos;ve made toward your rentals, all in one place."
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 px-5 pb-0">
            <div className="flex flex-col gap-1">
              <CardDescription className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Completed payments
              </CardDescription>
              <CardTitle className="text-3xl tabular-nums tracking-tight">
                {completedCount}
              </CardTitle>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ReceiptText aria-hidden="true" />
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 px-5 pb-0">
            <div className="flex flex-col gap-1">
              <CardDescription className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Total spent
              </CardDescription>
              <CardTitle className="text-3xl tabular-nums tracking-tight">
                ৳{totalSpent.toLocaleString()}
              </CardTitle>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CreditCard aria-hidden="true" />
            </div>
          </CardHeader>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight">
            All transactions
          </h2>
          <p className="text-sm text-muted-foreground">
            A chronological list of your rental payments.
          </p>
        </div>

        {payments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <CreditCard aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium">No payments yet</p>
                <p className="text-sm text-muted-foreground">
                  Payments appear here once you&apos;ve paid for an approved
                  request.
                </p>
              </div>
              <Badge
                variant="secondary"
                className="mt-1 flex items-center gap-1.5"
              >
                <Home className="size-3.5" aria-hidden="true" />
                Browse properties to get started
              </Badge>
            </CardContent>
          </Card>
        ) : (
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-0">
              <div className="flex flex-col">
                {payments.map((p, index) => (
                  <div key={p.id}>
                    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                          <ReceiptText aria-hidden="true" />
                        </div>
                        <div className="flex min-w-0 flex-col gap-1">
                          <Link
                            href={
                              p.rentalRequest?.propertyId
                                ? `/properties/${p.rentalRequest.propertyId}`
                                : "#"
                            }
                            className="truncate font-medium hover:underline"
                          >
                            {p.rentalRequest?.property?.title ||
                              `Payment ${p.transactionId}`}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {p.transactionId} · {p.method} ·{" "}
                            {new Date(p.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <Badge variant={statusVariant[p.status]}>
                          {p.status}
                        </Badge>
                        <span className="text-sm font-semibold tabular-nums">
                          ৳{p.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {index < payments.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
