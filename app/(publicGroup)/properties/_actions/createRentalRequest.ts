"use server";

import { cookies } from "next/headers";

export type CreateRentalState = {
    success: boolean;
    message: string;
    errorDetails?: unknown;
};

export const createRentalRequest = async (
    previousState: CreateRentalState,
    formData: FormData
): Promise<CreateRentalState> => {
    const propertyId = formData.get("propertyId");
    const moveInDate = formData.get("moveInDate");
    const duration = formData.get("duration");
    const message = formData.get("message");

    if (!propertyId || !moveInDate || !duration) {
        return {
            success: false,
            message: "Please provide a move-in date and duration.",
        };
    }

    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rentals`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({
            propertyId,
            moveInDate,
            duration: Number(duration),
            message: message || undefined,
        }),
    });

    const json = await res.json();

    if (!res.ok) {
        return {
            success: false,
            message: json.message || "Failed to submit rental request",
            errorDetails: json.errorDetails ?? null,
        };
    }

    return {
        success: true,
        message: "Rental request submitted successfully",
    };
};
