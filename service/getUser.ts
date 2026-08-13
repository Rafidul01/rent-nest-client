"use server";
import { cookies } from "next/headers";

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
    

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: {
            Cookie: `accessToken=${accessToken}`,
        },
        cache: "no-store",
    });

    const result = await res.json();

    return result;
};