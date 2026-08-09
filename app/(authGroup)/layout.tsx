import { getUser } from "@/service/getUser";
import { Navbar } from "@/app/components/shared/navbar";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const user = await getUser();

    return (
        <>
            <Navbar user={user} />
            {children}
        </>
    );
}