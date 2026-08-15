"use server";

import { cookies } from "next/headers";
import { rentalRequestSchema, toFieldErrors } from "@/app/lib/schemas";

export type CreateRentalState = {
    success: boolean;
    message: string;
    errorDetails?: unknown;
    fieldErrors?: Record<string, string>;
};

export const createRentalRequest = async (
    previousState: CreateRentalState,
    formData: FormData
): Promise<CreateRentalState> => {
    const parsed = rentalRequestSchema.safeParse({
        propertyId: formData.get("propertyId"),
        moveInDate: formData.get("moveInDate"),
        duration: formData.get("duration"),
        message: formData.get("message") || undefined,
    });

    if (!parsed.success) {
        return {
            success: false,
            message: "Please check the highlighted fields.",
            fieldErrors: toFieldErrors(parsed.error),
        };
    }

    const { propertyId, moveInDate, duration, message } = parsed.data;

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
            duration,
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
