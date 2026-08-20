
import { ApiSuccessResponse, Property } from "@/app/lib/types";
import { fetchApi } from "@/app/lib/fetch-api";

export const getPropertyById = async (
    id: string
): Promise<ApiSuccessResponse<Property>> => {
    const res = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}`, {
        cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message || "Failed to fetch property");
    }

    return json as ApiSuccessResponse<Property>;
};