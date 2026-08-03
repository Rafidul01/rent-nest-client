"use server";

import { cookies } from "next/headers";

export type LoginState = {
    success: boolean;
    message: string;
    errorDetails?: unknown;
};

export const loginAction = async (
    previousState: LoginState,
    formData: FormData
): Promise<LoginState> => {
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const result = await res.json();

    if (!res.ok) {
        return {
            success: false,
            message: result.message || "Login failed",
            errorDetails: result.errorDetails ?? null,
        };
    }

    
    if(result.success){
        const cookieStore = await cookies();
        cookieStore.set("accessToken", result.data.accessToken,{
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24,

        });
        cookieStore.set("refreshToken", result.data.refreshToken,{
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
        });
    }

    return {
        success: true,
        message: "Logged in successfully",
    };
};