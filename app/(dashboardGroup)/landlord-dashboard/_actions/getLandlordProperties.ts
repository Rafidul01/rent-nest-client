import { cookies } from "next/headers";
import { Property } from "@/app/lib/types";
import { fetchList } from "@/app/lib/fetch-api";

export const getLandlordProperties = async (
    landlordId: string
): Promise<Property[]> => {
    const cookieStore = await cookies();

    const properties = await fetchList<Property>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/properties`,
        {
            headers: {
                Cookie: cookieStore.toString(),
            },
            cache: "no-store",
        }
    );

    return properties.filter(
        (p) => p.landlordId === landlordId
    );
};
