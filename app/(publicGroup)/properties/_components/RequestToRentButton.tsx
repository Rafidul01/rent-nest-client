import { Property } from "@/app/lib/types";
import { Button } from "@/components/ui/button";

export default function RequestToRentButton({ property }: { property: Property }) {
    return (
        <Button className="w-full" disabled={!property.isAvailable}>
            {property.isAvailable ? "Request to Rent" : "Not Available"}
        </Button>
    );
}