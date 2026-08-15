import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  ReceiptText,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getMyPayments } from "@/app/(dashboardGroup)/tenant-dashboard/_actions/getMyPayments";

interface PaymentSuccessProps {
  params: Promise<{ transactionId: string }>;
}

export default async function PaymentSuccessPage({
  params,
}: PaymentSuccessProps) {
  const { transactionId } = await params;

  let payment = null;
  try {
    const { data: payments } = await getMyPayments();
    payment =
      payments.find((p) => p.transactionId === transactionId) ?? null;
  } catch {
    payment = null;
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-lg flex-col items-center justify-center gap-6 px-4 py-10">
      <div className="flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600">
        <CheckCircle2 className="size-9" aria-hidden="true" />
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <Badge className="w-fit">Payment successful</Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          You&apos;re all set!
        </h1>
        <p className="max-w-sm text-muted-foreground leading-6">
          Your payment was processed. Your rental is now active — the landlord
          has been notified.
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ReceiptText className="size-5 text-primary" aria-hidden="true" />
            Payment details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="font-medium">{transactionId}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Property</span>
            <span className="max-w-[16rem] truncate font-medium">
              {payment?.rentalRequest?.property?.title || "—"}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Amount paid</span>
            <span className="font-semibold">
              ৳{(payment?.amount ?? 0).toLocaleString()}
            </span>
          </div>
          {payment?.paidAt && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <CalendarDays className="size-4" aria-hidden="true" /> Paid on
                </span>
                <span className="font-medium">
                  {new Date(payment.paidAt).toLocaleDateString()}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Button asChild className="w-full">
        <Link href="/tenant-dashboard">
          Go to dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </main>
  );
}
