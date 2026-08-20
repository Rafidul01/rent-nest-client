import { cookies } from "next/headers";
import { Property } from "@/app/lib/types";
import { fetchList } from "@/app/lib/fetch-api";

// Backend has no `/api/admin/properties` route (returns 404) — use the public
// `GET /api/properties` list, which returns every property with category and
// landlord relations. Cookie is forwarded anyway so the data set is identical.
export const getAdminProperties = async (): Promise<Property[]> => {
    const cookieStore = await cookies();

    // Backend throws 404 when there are no properties yet — treat as empty.
    return fetchList<Property>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/properties`,
        {
            headers: {
                Cookie: cookieStore.toString(),
            },
            cache: "no-store",
        }
    );
};
