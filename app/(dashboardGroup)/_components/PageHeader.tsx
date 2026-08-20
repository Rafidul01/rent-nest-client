import { cn } from "@/lib/utils";
import { LettingLamp } from "@/app/(publicGroup)/_components/LettingLamp";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {eyebrow && (
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          <LettingLamp lit={false} className="size-3.5" />
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}