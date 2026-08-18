"use client";

import { ErrorState } from "@/app/components/shared/error-state";

export default function PublicGroupError({
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
      backHref="/"
      backLabel="Back to home"
      title="We couldn't load this page"
      description="This page hit a snag. Try again — if it keeps happening, head back to the home page."
    />
  );
}