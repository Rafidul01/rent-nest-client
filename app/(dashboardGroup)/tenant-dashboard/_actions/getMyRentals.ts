// app/(dashboard)/tenant-dashboard/_actions/getMyRentals.ts
import { cookies } from "next/headers";
import { ApiSuccessResponse, RentalRequest } from "@/app/lib/types";

export const getMyRentals = async (): Promise<ApiSuccessResponse<RentalRequest[]>> => {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rentals`, {
        headers: {
            Cookie: cookieStore.toString(),
        },
        cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message || "Failed to fetch rental requests");
    }

    return json as ApiSuccessResponse<RentalRequest[]>;
};