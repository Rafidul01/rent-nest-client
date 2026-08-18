import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Property } from "@/app/lib/types";
import { LettingLamp } from "./LettingLamp";

function MarqueeCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="group relative h-40 w-64 shrink-0 overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border"
    >
      {property.images?.[0] ? (
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          sizes="256px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
          No image yet
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
      <span className="absolute left-2.5 top-2.5 drop-shadow">
        <LettingLamp lit className="size-4 text-lamp" />
      </span>
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3 text-white">
        <p className="truncate text-sm font-semibold leading-tight">
          {property.title}
        </p>
        <p className="flex items-center justify-between gap-2 text-xs text-white/75">
          <span className="flex min-w-0 items-center gap-1">
            <MapPin className="size-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{property.city}</span>
          </span>
          <span className="shrink-0 font-semibold tabular-nums text-white">
            ৳{property.price.toLocaleString()}
          </span>
        </p>
      </div>
    </Link>
  );
}

export default function Marquee({ properties }: { properties: Property[] }) {
  if (properties.length === 0) return null;

  const strip = [...properties, ...properties];

  return (
    <div className="marquee-paused relative overflow-hidden py-2">
      <div className="animate-marquee flex w-max gap-5 pr-5" style={{ "--marquee-duration": `${Math.max(strip.length, 6) * 4}s` } as React.CSSProperties}>
        {strip.map((property, index) => (
          <MarqueeCard key={`${property.id}-${index}`} property={property} />
        ))}
      </div>
    </div>
  );
}