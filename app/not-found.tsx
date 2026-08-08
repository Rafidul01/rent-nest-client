import Link from "next/link";
import { ArrowRight, Home, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh overflow-hidden bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-6 sm:px-10 sm:py-8 lg:px-12">
        

        <section className="flex flex-1 items-center py-16 sm:py-20 lg:py-10">
          <div className="grid w-full items-center gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
            <div className="max-w-2xl">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                <Sparkles aria-hidden="true" className="size-4" />
                <span>Looks like this place is vacant</span>
              </div>

              <p className="mb-3 font-mono text-sm font-medium uppercase tracking-[0.2em] text-primary">
                Error 404
              </p>
              <h1 className="max-w-xl text-balance text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-8xl">
                This address doesn&apos;t exist.
              </h1>
              <p className="mt-6 max-w-lg text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                The page you&apos;re looking for may have moved, been removed,
                or never had a key in the first place.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="group" asChild>
                  <Link href="/">
                    Back to home
                    <ArrowRight
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5"
                      data-icon="inline-end"
                    />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/properties">
                    <Search aria-hidden="true" data-icon="inline-start" />
                    Browse properties
                  </Link>
                </Button>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="relative mx-auto w-full max-w-md lg:justify-self-end"
            >
              <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-border bg-card p-4 shadow-2xl shadow-primary/5 sm:p-6">
                <div className="flex h-full flex-col justify-between rounded-[1.5rem] border border-dashed border-primary/30 bg-primary/5 p-6 sm:p-8">
                  <div className="flex items-start justify-between">
                    <span className="rounded-lg bg-background px-3 py-1.5 font-mono text-xs font-medium text-muted-foreground shadow-sm">
                      vacant lot
                    </span>
                    <span className="text-6xl font-semibold tracking-[-0.08em] text-primary/20 sm:text-7xl">
                      404
                    </span>
                  </div>

                  <div className="relative mx-auto flex size-44 items-center justify-center rounded-full border border-primary/20 bg-background shadow-sm sm:size-52">
                    <div className="absolute inset-5 rotate-45 rounded-2xl border border-primary/15" />
                    <Home
                      className="relative size-16 text-primary sm:size-20"
                      strokeWidth={1.25}
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-primary/15 pt-4 text-xs text-muted-foreground">
                    <span>Coordinates unknown</span>
                    <span className="font-mono">— — —</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="flex items-center justify-between border-t border-border pt-5 text-xs text-muted-foreground">
          <span>RentNest</span>
          <span>Better places, easier searches.</span>
        </footer>
      </div>
    </main>
  );
}
