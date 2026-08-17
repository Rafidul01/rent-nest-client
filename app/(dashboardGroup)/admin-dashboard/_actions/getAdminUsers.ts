// app/(dashboardGroup)/admin-dashboard/_actions/getAdminUsers.ts
import { cookies } from "next/headers";
import { User } from "@/app/lib/types";

export const getAdminUsers = async (): Promise<User[]> => {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
        headers: {
            Cookie: cookieStore.toString(),
        },
        cache: "no-store",
    });

    const json = await res.json().catch(() => ({}));

    // Backend throws 404 when there are no users yet — treat as empty.
    if (!res.ok || !Array.isArray(json?.data)) {
        return [];
    }

    return json.data as User[];
};
