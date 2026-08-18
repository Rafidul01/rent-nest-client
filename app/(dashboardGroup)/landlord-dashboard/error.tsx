"use client";

import { ErrorState } from "@/app/components/shared/error-state";

export default function LandlordDashboardError({
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
      backHref="/landlord-dashboard"
      title="We couldn't load your dashboard"
      description="This part of your dashboard hit a snag. Try again — if it keeps happening, head back to your overview."
    />
  );
}