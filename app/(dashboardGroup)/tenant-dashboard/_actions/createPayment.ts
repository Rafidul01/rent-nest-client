"use server";

import { cookies } from "next/headers";

export type CreatePaymentState = {
    success: boolean;
    message: string;
    paymentURL?: string;
    transactionId?: string;
    errorDetails?: unknown;
};

export const createPayment = async (
    requestId: string
): Promise<CreatePaymentState> => {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ requestId }),
        cache: "no-store",
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || !json.success) {
        return {
            success: false,
            message: json.message || "Failed to start payment",
            errorDetails: json.errorDetails ?? null,
        };
    }

    return {
        success: true,
        message: json.message || "Payment started",
        paymentURL: json.data?.paymentURL,
        transactionId: json.data?.newTransactionId,
    };
};
