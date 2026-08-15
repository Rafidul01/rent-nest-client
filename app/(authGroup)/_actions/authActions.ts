"use server";

import { cookies } from "next/headers";
import { loginSchema, registerSchema, toFieldErrors } from "@/app/lib/schemas";

export type LoginState = {
    success: boolean;
    message: string;
    errorDetails?: unknown;
    fieldErrors?: Record<string, string>;
};

export const loginAction = async (
    previousState: LoginState,
    formData: FormData
): Promise<LoginState> => {
    const parsed = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!parsed.success) {
        return {
            success: false,
            message: "Please check the highlighted fields.",
            fieldErrors: toFieldErrors(parsed.error),
        };
    }

    const { email, password } = parsed.data;

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


export type RegisterState = {
    success: boolean;
    message: string;
    errorDetails?: unknown;
    fieldErrors?: Record<string, string>;
};

export const registerAction = async (
    previousState: RegisterState,
    formData: FormData
): Promise<RegisterState> => {
    const phone = formData.get("phone");
    const parsed = registerSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: phone ? String(phone) : undefined,
        password: formData.get("password"),
        role: formData.get("role"),
    });

    if (!parsed.success) {
        return {
            success: false,
            message: "Please check the highlighted fields.",
            fieldErrors: toFieldErrors(parsed.error),
        };
    }

    const { name, email, password, role } = parsed.data;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone: phone || undefined, role }),
    });

    const json = await res.json();

    if (!res.ok) {
        return {
            success: false,
            message: json.message || "Registration failed",
            errorDetails: json.errorDetails ?? null,
        };
    }

    return {
        success: true,
        message: "Account created successfully",
    };
};