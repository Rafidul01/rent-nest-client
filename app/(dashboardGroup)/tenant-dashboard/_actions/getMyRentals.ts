import { cookies } from "next/headers";
import { ApiSuccessResponse, RentalRequest } from "@/app/lib/types";
import { fetchEnvelopeOrEmpty } from "@/app/lib/fetch-api";

type GetMyRentalsResult =
    | ApiSuccessResponse<RentalRequest[]>
    | { success: false; message: string; data: [] };

export const getMyRentals = async (): Promise<GetMyRentalsResult> => {
    const cookieStore = await cookies();

    return fetchEnvelopeOrEmpty<RentalRequest>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/rentals`,
        {
            headers: {
                Cookie: cookieStore.toString(),
            },
            cache: "no-store",
        }
    );
};