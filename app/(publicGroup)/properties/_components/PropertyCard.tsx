import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BedDouble, Bath, MapPin, Ruler } from "lucide-react";
import type { Property } from "@/app/lib/types";

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
    >
      <Card className="overflow-hidden py-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
        <div className="relative h-52 w-full overflow-hidden bg-muted">
          {property.images?.[0] ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image yet
            </div>
          )}
          {property.category && (
            <span className="absolute left-2 top-2 rounded-full border border-sidebar-accent bg-card/90 px-2.5 py-0.5 text-xs font-medium text-card-foreground backdrop-blur">
              {property.category.name}
            </span>
          )}
          {property.isAvailable && (
            <span className="absolute right-2 top-2 flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
            </span>
          )}
        </div>

        <CardContent className="space-y-3 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="min-w-0 truncate font-semibold tracking-tight">
              {property.title}
            </h3>
            <p className="shrink-0 font-bold tabular-nums tracking-tight">
              ৳{property.price.toLocaleString()}
              <span className="text-xs font-normal text-muted-foreground">/mo</span>
            </p>
          </div>

          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{property.address}, {property.city}</span>
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BedDouble className="size-3.5" aria-hidden="true" />
              {property.bedrooms} bd
            </span>
            <span className="flex items-center gap-1.5">
              <Bath className="size-3.5" aria-hidden="true" />
              {property.bathrooms} ba
            </span>
            {property.areaSqft && (
              <span className="flex items-center gap-1.5">
                <Ruler className="size-3.5" aria-hidden="true" />
                {property.areaSqft.toLocaleString()} sqft
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}