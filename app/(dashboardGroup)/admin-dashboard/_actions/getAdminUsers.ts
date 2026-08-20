import { cookies } from "next/headers";
import { User } from "@/app/lib/types";
import { fetchList } from "@/app/lib/fetch-api";

export const getAdminUsers = async (): Promise<User[]> => {
    const cookieStore = await cookies();

    // Backend throws 404 when there are no users yet — treat as empty.
    return fetchList<User>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
        {
            headers: {
                Cookie: cookieStore.toString(),
            },
            cache: "no-store",
        }
    );
};
