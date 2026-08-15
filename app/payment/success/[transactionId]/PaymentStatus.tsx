"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Loader2,
  ReceiptText,
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
import { getPaymentByTransactionId } from "@/app/(dashboardGroup)/tenant-dashboard/_actions/getPaymentByTransactionId";
import type { Payment } from "@/app/lib/types";

interface PaymentStatusProps {
  transactionId: string;
  initial: Payment | null;
}

export function PaymentStatus({ transactionId, initial }: PaymentStatusProps) {
  const [payment, setPayment] = useState<Payment | null>(initial);
  const [confirming, setConfirming] = useState(
    !initial || initial.status !== "COMPLETED",
  );

  useEffect(() => {
    if (!confirming) return;

    let attempts = 0;
    const id = setInterval(async () => {
      attempts += 1;
      try {
        const p = await getPaymentByTransactionId(transactionId);
        if (p && p.status === "COMPLETED") {
          setPayment(p);
          setConfirming(false);
          clearInterval(id);
          return;
        }
      } catch {
        // ignore transient errors and keep polling
      }
      if (attempts >= 10) {
        setConfirming(false);
        clearInterval(id);
      }
    }, 2000);

    return () => clearInterval(id);
  }, [confirming, transactionId]);

  if (confirming) {
    return (
      <main className="mx-auto flex min-h-svh w-full max-w-lg flex-col items-center justify-center gap-6 px-4 py-10 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Loader2 className="size-8 animate-spin" aria-hidden="true" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Badge className="w-fit" variant="secondary">
            Confirming payment
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Confirming your payment
          </h1>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            We&apos;re just waiting for the payment confirmation to come
            through. This usually takes a moment.
          </p>
        </div>
      </main>
    );
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
            <span className="font-semibold tabular-nums">
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
