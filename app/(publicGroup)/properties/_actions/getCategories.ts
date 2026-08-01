// app/(public)/properties/_actions/getCategories.ts
import { ApiSuccessResponse, Category } from "@/app/lib/types";

export const getCategories = async (): Promise<ApiSuccessResponse<Category[]>> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
        cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message || "Failed to fetch categories");
    }

    return json as ApiSuccessResponse<Category[]>;
};