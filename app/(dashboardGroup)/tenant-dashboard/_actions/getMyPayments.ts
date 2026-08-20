import { cookies } from "next/headers";
import { ApiSuccessResponse, Payment } from "@/app/lib/types";
import { fetchEnvelopeOrEmpty } from "@/app/lib/fetch-api";

type GetMyPaymentsResult =
    | ApiSuccessResponse<Payment[]>
    | { success: false; message: string; data: [] };

export const getMyPayments = async (): Promise<GetMyPaymentsResult> => {
    const cookieStore = await cookies();

    return fetchEnvelopeOrEmpty<Payment>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments`,
        {
            headers: {
                Cookie: cookieStore.toString(),
            },
            cache: "no-store",
        }
    );
};