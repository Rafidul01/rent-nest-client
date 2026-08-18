"use client";

import { ErrorState } from "@/app/components/shared/error-state";

export default function PaymentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      error={error}
      reset={reset}
      backHref="/tenant-dashboard"
      backLabel="Back to dashboard"
      title="We couldn't confirm this payment"
      description="This payment page hit a snag. Try again — if it keeps happening, head back to your dashboard."
    />
  );
}