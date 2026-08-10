import { cookies } from "next/headers";

export const getMe = async () => {
    const cookieStore = await cookies();

    const accessToke = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: {
            Cookie: `accessToken=${accessToke}`,
        },
        cache: "force-cache",
        next: { 
            revalidate: 0 ,
            tags: ["user-profile"]

        },    
    });

    const result = await res.json();

    return result;
} 