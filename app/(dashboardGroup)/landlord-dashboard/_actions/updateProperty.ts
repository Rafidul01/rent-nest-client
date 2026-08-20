"use server";

import { cookies } from "next/headers";
import { Property } from "@/app/lib/types";
import { PropertyPayload } from "./createProperty";

export type UpdatePropertyState = {
    success: boolean;
    message: string;
    property?: Property;
    errorDetails?: unknown;
};

export const updateProperty = async (
    id: string,
    payload: Partial<PropertyPayload>
): Promise<UpdatePropertyState> => {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landlord/properties/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(payload),
        cache: "no-store",
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || !json.success) {
        return {
            success: false,
            message: json.message || "Failed to update property",
            errorDetails: json.errorDetails ?? null,
        };
    }

    return {
        success: true,
        message: json.message || "Property updated",
        property: json.data,
    };
};
