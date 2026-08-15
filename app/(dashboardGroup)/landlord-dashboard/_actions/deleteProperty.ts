// app/(dashboardGroup)/landlord-dashboard/_actions/deleteProperty.ts
"use server";

import { cookies } from "next/headers";

export type DeletePropertyState = {
    success: boolean;
    message: string;
    errorDetails?: unknown;
};

export const deleteProperty = async (
    id: string
): Promise<DeletePropertyState> => {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landlord/properties/${id}`, {
        method: "DELETE",
        headers: {
            Cookie: cookieStore.toString(),
        },
        cache: "no-store",
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || !json.success) {
        return {
            success: false,
            message: json.message || "Failed to delete property",
            errorDetails: json.errorDetails ?? null,
        };
    }

    return {
        success: true,
        message: json.message || "Property deleted",
    };
};
