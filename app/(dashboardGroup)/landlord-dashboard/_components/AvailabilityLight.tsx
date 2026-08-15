// app/(dashboardGroup)/landlord-dashboard/_components/AvailabilityLight.tsx
import { cn } from "@/lib/utils";

export function AvailabilityLight({
  available,
  className,
}: {
  available: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        className,
      )}
    >
      <span className="relative flex size-2">
        {available && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sidebar-accent/60" />
        )}
        <span
          className={cn(
            "relative inline-flex size-2 rounded-full",
            available
              ? "bg-sidebar-accent"
              : "bg-muted-foreground/40",
          )}
        />
      </span>
      {available ? "Letting" : "Let out"}
    </span>
  );
}
