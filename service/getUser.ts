"use server";
import { cookies } from "next/headers";
import { fetchApi } from "@/app/lib/fetch-api";

export const getUser = async () => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return {
            success: false,
            statusCode: 401,
            message: "User not authenticated",
            data: null,
        };
    }

    try {
        const res = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
            headers: {
                Cookie: `accessToken=${accessToken}`,
            },
            cache: "no-store",
        });

        const result = await res.json();

        return result;
    } catch {
        // Network failure (e.g. the backend edge is unreachable). Return a
        // calm 503 envelope instead of crashing the layout render.
        return {
            success: false,
            statusCode: 503,
            message: "Could not reach the server. Please try again.",
            data: null,
        };
    }
};