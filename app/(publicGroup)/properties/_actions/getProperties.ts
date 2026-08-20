
import { ApiSuccessResponse, Property } from "@/app/lib/types";
import { fetchEnvelopeOrEmpty } from "@/app/lib/fetch-api";

interface GetPropertiesParams {
    city?: string;
    minPrice?: string;
    maxPrice?: string;
    categoryId?: string;
    page?: string;
    limit?: string;
}

type GetPropertiesResult =
    | ApiSuccessResponse<Property[]>
    | { success: false; message: string; data: [] };

export const getProperties = async (
    filters: GetPropertiesParams = {}
): Promise<GetPropertiesResult> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
    });

    return fetchEnvelopeOrEmpty<Property>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/properties?${params.toString()}`,
        {
            cache: "no-store",
        }
    );
};