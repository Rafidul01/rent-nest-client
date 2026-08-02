
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Property } from "@/app/lib/types";
import { MapPin, BedDouble, Bath } from "lucide-react";

export default function PropertyCard({ property }: { property: Property }) {
    return (
        <Link href={`/properties/${property.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow py-0">
                <div className="relative h-48 w-full bg-muted">
                    {property.images?.[0] ? (
                        <Image
                            src={property.images[0]}
                            alt={property.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                            No image
                        </div>
                    )}
                    {property.category && (
                        <Badge className="absolute top-2 left-2">{property.category.name}</Badge>
                    )}
                </div>

                <CardContent className="pt-4">
                    <h3 className="font-semibold text-lg truncate">{property.title}</h3>
                    <p className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {property.city}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                            <BedDouble className="h-3.5 w-3.5" /> {property.bedrooms}
                        </span>
                        <span className="flex items-center gap-1">
                            <Bath className="h-3.5 w-3.5" /> {property.bathrooms}
                        </span>
                    </div>
                </CardContent>

                <CardFooter className="pb-4">
                    <p className="font-bold text-lg">
                        ৳{property.price.toLocaleString()}
                        <span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </p>
                </CardFooter>
            </Card>
        </Link>
    );
}