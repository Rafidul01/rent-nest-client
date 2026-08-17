// app/(dashboardGroup)/admin-dashboard/_actions/getAdminProperties.ts
import { cookies } from "next/headers";
import { Property } from "@/app/lib/types";

// Backend has no `/api/admin/properties` route (returns 404) — use the public
// `GET /api/properties` list, which returns every property with category and
// landlord relations. Cookie is forwarded anyway so the data set is identical.
export const getAdminProperties = async (): Promise<Property[]> => {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`, {
        headers: {
            Cookie: cookieStore.toString(),
        },
        cache: "no-store",
    });

    const json = await res.json().catch(() => ({}));

    // Backend throws 404 when there are no properties yet — treat as empty.
    if (!res.ok || !Array.isArray(json?.data)) {
        return [];
    }

    return json.data as Property[];
};
