// app/(dashboard)/tenant-dashboard/_actions/getMyPayments.ts
import { cookies } from "next/headers";
import { ApiSuccessResponse, Payment } from "@/app/lib/types";

export const getMyPayments = async (): Promise<ApiSuccessResponse<Payment[]>> => {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments`, {
        headers: {
            Cookie: cookieStore.toString(),
        },
        cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message || "Failed to fetch payments");
    }

    return json as ApiSuccessResponse<Payment[]>;
};