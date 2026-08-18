"use client";

import { ShieldAlert } from "lucide-react";
import { ErrorState } from "@/app/components/shared/error-state";

export default function AdminDashboardError({
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
      backHref="/admin-dashboard"
      icon={ShieldAlert}
      title="We couldn't load the control room"
      description="This part of the control room hit a snag. Try again — if it keeps happening, head back to your overview."
    />
  );
}