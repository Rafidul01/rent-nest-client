// app/(dashboardGroup)/landlord-dashboard/_actions/createProperty.ts
"use server";

import { cookies } from "next/headers";
import { Property } from "@/app/lib/types";

export type PropertyPayload = {
    title: string;
    description: string;
    address: string;
    city: string;
    price: number;
    bedrooms?: number;
    bathrooms?: number;
    areaSqft?: number;
    amenities?: string[];
    images?: string[];
    categoryId: string;
    isAvailable?: boolean;
};

export type CreatePropertyState = {
    success: boolean;
    message: string;
    property?: Property;
    errorDetails?: unknown;
};

export const createProperty = async (
    payload: PropertyPayload
): Promise<CreatePropertyState> => {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landlord/properties`, {
        method: "POST",
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
            message: json.message || "Failed to create property",
            errorDetails: json.errorDetails ?? null,
        };
    }

    return {
        success: true,
        message: json.message || "Property created",
        property: json.data,
    };
};
