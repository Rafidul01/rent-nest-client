import Link from "next/link";
import { XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PaymentCancelProps {
  params: Promise<{ transactionId: string }>;
}

export default async function PaymentCancelPage({
  params,
}: PaymentCancelProps) {
  const { transactionId } = await params;

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-lg flex-col items-center justify-center gap-6 px-4 py-10">
      <div className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600">
        <XCircle className="size-9" aria-hidden="true" />
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <Badge variant="secondary" className="w-fit">
          Payment cancelled
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Payment not completed
        </h1>
        <p className="max-w-sm text-muted-foreground leading-6">
          Your payment was cancelled and no amount was charged. You can retry
          whenever you&apos;re ready.
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">What happens next?</CardTitle>
          <CardDescription>
            The rental request stays {`"APPROVED"`} until payment is completed.
            You can pay again from your requests page.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p className="pb-1 text-xs text-muted-foreground">
            Reference: {transactionId}
          </p>
          <Button asChild>
            <Link href="/tenant-dashboard/requests">
              Retry payment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/tenant-dashboard">Back to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
