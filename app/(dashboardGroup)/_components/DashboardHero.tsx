import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LettingLamp } from "@/app/(publicGroup)/_components/LettingLamp";

interface DashboardHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: { label: string; href: string; icon?: LucideIcon };
}

export function DashboardHero({
  eyebrow,
  title,
  description,
  action,
}: DashboardHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-sidebar px-5 py-6 text-sidebar-foreground shadow-sm sm:px-8 sm:py-8">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(40rem 20rem at 88% -20%, oklch(0.85 0.13 80 / 0.16), transparent 60%)",
        }}
      />
      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-xl flex-col gap-3">
          <p className="flex w-fit items-center gap-2 rounded-full border border-lamp/25 bg-lamp/10 px-3 py-1 text-xs font-medium text-lamp">
            <LettingLamp lit className="size-4" />
            {eyebrow}
          </p>
          <h1 className="font-display text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
          <p className="max-w-lg text-pretty text-sm leading-6 text-sidebar-foreground/70">
            {description}
          </p>
        </div>

        {action && (
          <Button asChild variant="secondary" className="w-fit">
            <Link href={action.href}>
              {action.label}
              {action.icon ? (
                <action.icon className="ml-2 h-4 w-4" aria-hidden="true" />
              ) : (
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              )}
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
}