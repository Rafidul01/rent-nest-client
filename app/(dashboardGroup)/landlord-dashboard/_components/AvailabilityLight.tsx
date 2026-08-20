// app/(dashboardGroup)/landlord-dashboard/_components/AvailabilityLight.tsx
import { cn } from "@/lib/utils";
import { LettingLamp } from "@/app/(publicGroup)/_components/LettingLamp";

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
      <LettingLamp lit={available} className="size-4" />
      {available ? "Letting" : "Let out"}
    </span>
  );
}