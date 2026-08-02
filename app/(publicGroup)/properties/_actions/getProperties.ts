
import { ApiSuccessResponse, Property } from "@/app/lib/types";

interface GetPropertiesParams {
    city?: string;
    minPrice?: string;
    maxPrice?: string;
    categoryId?: string;
    page?: string;
    limit?: string;
}

export const getProperties = async (
    filters: GetPropertiesParams = {}
): Promise<ApiSuccessResponse<Property[]>> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
    });

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/properties?${params.toString()}`,
        {
            cache: "no-store",
        }
    );

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message || "Failed to fetch properties");
    }

    return json as ApiSuccessResponse<Property[]>;
};