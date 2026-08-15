// app/(dashboardGroup)/landlord-dashboard/_actions/updateRequestStatus.ts
"use server";

import { cookies } from "next/headers";
import { RentalRequest, RentalStatus } from "@/app/lib/types";

export type UpdateRequestStatusState = {
    success: boolean;
    message: string;
    rentalRequest?: RentalRequest;
    errorDetails?: unknown;
};

export const updateRequestStatus = async (
    id: string,
    status: Extract<RentalStatus, "APPROVED" | "REJECTED">
): Promise<UpdateRequestStatusState> => {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landlord/requests/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ status }),
        cache: "no-store",
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || !json.success) {
        return {
            success: false,
            message: json.message || "Failed to update request status",
            errorDetails: json.errorDetails ?? null,
        };
    }

    return {
        success: true,
        message: json.message || "Request status updated",
        rentalRequest: json.data,
    };
};
