import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import type { Property } from "@/app/lib/types";
import { LettingLamp } from "../../_components/LettingLamp";

export default function PropertyCard({ property }: { property: Property }) {
  const available = property.isAvailable;

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-xl">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {property.category && (
            <span className="absolute left-2.5 top-2.5 rounded-full border border-white/15 bg-black/35 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur">
              {property.category.name}
            </span>
          )}

          <span className="absolute right-2.5 top-2.5 rounded-full border border-black/10 bg-black/25 p-1 backdrop-blur">
            <LettingLamp lit={available} className="size-4" />
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex flex-col gap-1">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">
                {property.address}, {property.city}
              </span>
            </p>
            <h3 className="font-display min-w-0 truncate text-lg font-medium tracking-tight">
              {property.title}
            </h3>
          </div>

          <div className="flex items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BedDouble className="size-3.5" aria-hidden="true" />
              <span className="tabular-nums">{property.bedrooms}</span> bd
            </span>
            <span className="flex items-center gap-1.5">
              <Bath className="size-3.5" aria-hidden="true" />
              <span className="tabular-nums">{property.bathrooms}</span> ba
            </span>
            {property.areaSqft && (
              <span className="flex items-center gap-1.5">
                <Ruler className="size-3.5" aria-hidden="true" />
                <span className="tabular-nums">
                  {property.areaSqft.toLocaleString()}
                </span>{" "}
                sqft
              </span>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between border-t pt-3">
            <p className="font-display text-lg font-semibold tabular-nums tracking-tight">
              ৳{property.price.toLocaleString()}
              <span className="text-xs font-normal text-muted-foreground">
                /mo
              </span>
            </p>
            <span
              className={
                available
                  ? "text-xs font-medium text-primary"
                  : "text-xs text-muted-foreground"
              }
            >
              {available ? "Open for requests" : "Let out"}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}