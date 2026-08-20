import { cookies } from "next/headers";
import { fetchApi } from "@/app/lib/fetch-api";

export const getRentalRequestById = async (
    id: string
) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/api/rentals/${id}`, {
        headers: {
            Cookie: accessToken ? `accessToken=${accessToken}` : "",
        },
        cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message || "Failed to fetch rental request");
    }

    return result;
};