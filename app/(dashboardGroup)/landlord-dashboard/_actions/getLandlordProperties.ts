// app/(dashboardGroup)/landlord-dashboard/_actions/getLandlordProperties.ts
import { cookies } from "next/headers";
import { Property } from "@/app/lib/types";

export const getLandlordProperties = async (
    landlordId: string
): Promise<Property[]> => {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`, {
        headers: {
            Cookie: cookieStore.toString(),
        },
        cache: "no-store",
    });

    const json = await res.json().catch(() => ({}));

    const properties = Array.isArray(json?.data) ? json.data : [];

    return properties.filter(
        (p: Property) => p.landlordId === landlordId
    );
};
