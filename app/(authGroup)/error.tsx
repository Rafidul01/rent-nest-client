"use client";

import { ErrorState } from "@/app/components/shared/error-state";

export default function AuthGroupError({
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
      backHref="/login"
      backLabel="Back to login"
      title="We couldn't load this page"
      description="This page hit a snag. Try again — if it keeps happening, head back to login."
    />
  );
}