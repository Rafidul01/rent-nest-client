"use server";

import { cookies } from "next/headers";
import type { Payment } from "@/app/lib/types";
import { fetchList } from "@/app/lib/fetch-api";

export const getPaymentByTransactionId = async (
    transactionId: string
): Promise<Payment | null> => {
    const cookieStore = await cookies();

    const payments = await fetchList<Payment>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments`,
        {
            headers: {
                Cookie: cookieStore.toString(),
            },
            cache: "no-store",
        }
    );

    return payments.find((p) => p.transactionId === transactionId) ?? null;
};
