// app/(dashboardGroup)/tenant-dashboard/_actions/getPaymentByTransactionId.ts
"use server";

import { cookies } from "next/headers";
import type { Payment } from "@/app/lib/types";

export const getPaymentByTransactionId = async (
    transactionId: string
): Promise<Payment | null> => {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments`, {
        headers: {
            Cookie: cookieStore.toString(),
        },
        cache: "no-store",
    });

    const json = await res.json().catch(() => ({}));

    const payments = Array.isArray(json?.data) ? json.data : [];
    const payment = payments.find(
        (p: { transactionId?: string }) => p.transactionId === transactionId
    );

    return payment ?? null;
};
