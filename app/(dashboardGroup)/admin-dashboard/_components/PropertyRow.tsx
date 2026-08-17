// app/(dashboardGroup)/admin-dashboard/_components/PropertyRow.tsx
import Image from "next/image";
import { Building2, MapPin, UserRound } from "lucide-react";
import type { Property } from "@/app/lib/types";
import { AvailabilityLight } from "../../landlord-dashboard/_components/AvailabilityLight";

export function PropertyRow({ property }: { property: Property }) {
  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-muted">
          {property.images?.[0] ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Building2 className="size-5" aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-medium">{property.title}</span>
            {property.category?.name && (
              <span className="inline-flex items-center rounded-full border border-sidebar-accent bg-sidebar px-2.5 py-0.5 text-xs font-medium text-sidebar-foreground">
                {property.category.name}
              </span>
            )}
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-0.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">
                {property.city}, {property.address}
              </span>
            </span>
            {property.landlord?.name && (
              <span className="flex items-center gap-1.5">
                <UserRound className="size-3.5 shrink-0" aria-hidden="true" />
                {property.landlord.name}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <span className="text-sm font-semibold tabular-nums">
          ৳{property.price.toLocaleString()}
          <span className="text-xs font-normal text-muted-foreground">/mo</span>
        </span>
        <AvailabilityLight available={property.isAvailable} />
      </div>
    </div>
  );
}