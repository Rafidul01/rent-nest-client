// app/(dashboard)/tenant-dashboard/_actions/getRentalRequestById.ts
import { cookies } from "next/headers";

export const getRentalRequestById = async (
    id: string
) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rentals/${id}`, {
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