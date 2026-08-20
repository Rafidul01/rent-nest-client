import { cookies } from "next/headers";
import { Category } from "@/app/lib/types";
import { fetchList } from "@/app/lib/fetch-api";

export const getAdminCategories = async (): Promise<Category[]> => {
    const cookieStore = await cookies();

    return fetchList<Category>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
        {
            headers: {
                Cookie: cookieStore.toString(),
            },
            cache: "no-store",
        }
    );
};