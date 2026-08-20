import { cookies } from "next/headers";
import { RentalRequest } from "@/app/lib/types";
import { fetchList } from "@/app/lib/fetch-api";

export const getAdminRentals = async (): Promise<RentalRequest[]> => {
    const cookieStore = await cookies();

    // Backend throws 404 when there are no rental requests yet — treat as empty.
    return fetchList<RentalRequest>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/rentals`,
        {
            headers: {
                Cookie: cookieStore.toString(),
            },
            cache: "no-store",
        }
    );
};
