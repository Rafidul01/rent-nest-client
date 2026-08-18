"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error?: Error & { digest?: string };
  reset: () => void;
  backHref: string;
  backLabel?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  icon?: typeof AlertTriangle;
}

export function ErrorState({
  error,
  reset,
  backHref,
  backLabel = "Back to overview",
  eyebrow = "Something went wrong",
  title = "We couldn't load this page",
  description = "This page hit a snag. Try again — if it keeps happening, head back and start over.",
  icon: Icon = AlertTriangle,
}: ErrorStateProps) {
  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <Icon className="size-7" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          {eyebrow}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <Link href={backHref}>{backLabel}</Link>
        </Button>
      </div>
    </main>
  );
}