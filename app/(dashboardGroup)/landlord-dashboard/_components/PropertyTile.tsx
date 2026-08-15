import Image from "next/image";
import Link from "next/link";
import {
  Bath,
  BedDouble,
  Building2,
  MapPin,
  Pencil,
  Ruler,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/app/lib/types";
import { AvailabilityLight } from "./AvailabilityLight";
import { DeletePropertyButton } from "./DeletePropertyButton";

export function PropertyTile({ property }: { property: Property }) {
  return (
    <Card className="overflow-hidden py-0 transition-shadow hover:shadow-md">
      <div className="relative h-44 w-full bg-muted">
        {property.images?.[0] ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary text-muted-foreground">
            <Building2 className="size-8" aria-hidden="true" />
          </div>
        )}
        {property.category && (
          <Badge className="absolute left-2 top-2 bg-card/90 text-card-foreground backdrop-blur">
            {property.category.name}
          </Badge>
        )}
      </div>

      <CardContent className="space-y-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="truncate font-semibold tracking-tight">
            {property.title}
          </h3>
          <AvailabilityLight available={property.isAvailable} className="shrink-0" />
        </div>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{property.address}</span>
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

      <CardFooter className="flex items-center justify-between gap-3 border-t bg-muted/40 pt-4">
        <p className="font-semibold tabular-nums tracking-tight">
          ৳{property.price.toLocaleString()}
          <span className="text-sm font-normal text-muted-foreground">/mo</span>
        </p>
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/landlord-dashboard/properties/${property.id}/edit`}>
              <Pencil className="size-3.5" />
              Edit
            </Link>
          </Button>
          <DeletePropertyButton propertyId={property.id} />
        </div>
      </CardFooter>
    </Card>
  );
}
