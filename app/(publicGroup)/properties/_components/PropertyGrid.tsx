
import { Property } from "@/app/lib/types";
import PropertyCard from "./PropertyCard";

export default function PropertyGrid({ properties }: { properties: Property[] }) {
    if (properties.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-lg font-medium">No properties found</p>
                <p className="text-muted-foreground text-sm mt-1">
                    Try adjusting your filters.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
            ))}
        </div>
    );
}