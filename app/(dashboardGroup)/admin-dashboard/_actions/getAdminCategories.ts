// app/(dashboardGroup)/admin-dashboard/_actions/getAdminCategories.ts
import { cookies } from "next/headers";
import { Category } from "@/app/lib/types";

export const getAdminCategories = async (): Promise<Category[]> => {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
        headers: {
            Cookie: cookieStore.toString(),
        },
        cache: "no-store",
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || !Array.isArray(json?.data)) {
        return [];
    }

    return json.data as Category[];
};