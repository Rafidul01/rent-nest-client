// app/(dashboardGroup)/landlord-dashboard/_actions/getLandlordRequests.ts
import { cookies } from "next/headers";
import { RentalRequest } from "@/app/lib/types";

export const getLandlordRequests = async (): Promise<RentalRequest[]> => {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landlord/requests`, {
        headers: {
            Cookie: cookieStore.toString(),
        },
        cache: "no-store",
    });

    const json = await res.json().catch(() => ({}));

    // Backend throws 404 when the landlord has no requests yet — treat as empty.
    if (!res.ok || !Array.isArray(json?.data)) {
        return [];
    }

    return json.data as RentalRequest[];
};
