// app/(dashboardGroup)/admin-dashboard/_actions/updateUserStatus.ts
"use server";

import { cookies } from "next/headers";
import { User, UserStatus } from "@/app/lib/types";

export type UpdateUserStatusState = {
    success: boolean;
    message: string;
    user?: User;
    errorDetails?: unknown;
};

export const updateUserStatus = async (
    id: string,
    status: UserStatus,
): Promise<UpdateUserStatusState> => {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}`, {
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
            message: json.message || "Failed to update user status",
            errorDetails: json.errorDetails ?? null,
        };
    }

    return {
        success: true,
        message: json.message || "User status updated",
        user: json.data,
    };
};
