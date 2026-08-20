// app/(public)/properties/_actions/getCategories.ts
import { ApiSuccessResponse, Category } from "@/app/lib/types";
import { fetchEnvelopeOrEmpty } from "@/app/lib/fetch-api";

type GetCategoriesResult =
    | ApiSuccessResponse<Category[]>
    | { success: false; message: string; data: [] };

export const getCategories = async (): Promise<GetCategoriesResult> => {
    return fetchEnvelopeOrEmpty<Category>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
        {
            cache: "no-store",
        }
    );
};