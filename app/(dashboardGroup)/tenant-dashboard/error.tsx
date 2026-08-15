"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function TenantDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-7" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          Something went wrong
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          We couldn&apos;t load this page
        </h1>
        <p className="text-sm text-muted-foreground">
          This part of your dashboard hit a snag. Try again — if it keeps
          happening, head back to your overview.
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/tenant-dashboard">Back to overview</Link>
        </Button>
      </div>
    </main>
  );
}
