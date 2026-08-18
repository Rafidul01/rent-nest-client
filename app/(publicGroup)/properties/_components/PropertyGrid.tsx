
import { Property } from "@/app/lib/types";
import PropertyCard from "./PropertyCard";
import { LettingLamp } from "../../_components/LettingLamp";

export default function PropertyGrid({ properties }: { properties: Property[] }) {
    if (properties.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed py-20 text-center">
                <LettingLamp lit={false} className="size-8" />
                <div className="flex flex-col gap-1">
                    <p className="font-display text-lg font-medium">No lamps lit here yet</p>
                    <p className="text-sm text-muted-foreground">
                        Try widening your budget or clearing a filter.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
            ))}
        </div>
    );
}
