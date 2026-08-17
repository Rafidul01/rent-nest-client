// app/(dashboardGroup)/admin-dashboard/_components/RentalRow.tsx
import Image from "next/image";
import { Building2, CalendarDays, MapPin } from "lucide-react";
import type { RentalRequest, User } from "@/app/lib/types";
import RequestStatusBadge from "../../_components/RequestStatusBadge";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface RentalRowProps {
  rental: Omit<RentalRequest, "property" | "tenant"> & {
    property?: {
      id: string;
      title: string;
      city: string;
      images?: string[];
    } | null;
    tenant?: Pick<User, "id" | "name" | "email" | "phone"> | null;
  };
}

export type { RentalRowProps };

export function RentalRow({ rental }: RentalRowProps) {
  const property = rental.property;

  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-muted">
          {property?.images?.[0] ? (
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
            <span className="truncate font-medium">
              {rental.tenant?.name ?? "Tenant"}
            </span>
            <RequestStatusBadge status={rental.status} />
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-0.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">
                {property?.title ?? "Property"}
                {property?.city ? ` · ${property.city}` : ""}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
              Move-in {formatDate(rental.moveInDate)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <span className="text-sm font-semibold tabular-nums">
          ৳{rental.totalAmount.toLocaleString()}
          <span className="text-xs font-normal text-muted-foreground">
            / {rental.durationMonths} mo
          </span>
        </span>
      </div>
    </div>
  );
}