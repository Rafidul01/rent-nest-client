"use client";

import { ErrorState } from "@/app/components/shared/error-state";

export default function PropertiesError({
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
      backHref="/properties"
      backLabel="Browse properties"
      title="We couldn't load these listings"
      description="This listing page hit a snag. Try again — if it keeps happening, head back to browse."
    />
  );
}