
"use server";
import { stat } from "fs";
import { cookies } from "next/headers";


export const getUser = async () => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;

   

    if (!accessToken) {
        return{
            status: "USER NOT LOGGED IN",
            user: null
        }
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: {
            Cookie: `accessToken=${accessToken}`,
        },
        cache: "force-cache",
        next: { 
            revalidate: 0 ,
            tags: ["user-profile"]

        },
    });

    const result = await res.json();

    return result;


};