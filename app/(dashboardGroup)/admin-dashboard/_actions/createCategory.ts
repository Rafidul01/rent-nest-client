"use server";

import { cookies } from "next/headers";
import { Category } from "@/app/lib/types";

export type CreateCategoryState = {
    success: boolean;
    message: string;
    category?: Category;
    errorDetails?: unknown;
};

export const createCategory = async (
    name: string,
    description: string,
): Promise<CreateCategoryState> => {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ name, description }),
        cache: "no-store",
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || !json.success) {
        return {
            success: false,
            message: json.message || "Failed to create category",
            errorDetails: json.errorDetails ?? null,
        };
    }

    return {
        success: true,
        message: json.message || "Category created",
        category: json.data,
    };
};