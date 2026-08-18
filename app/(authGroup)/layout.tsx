import { getUser } from "@/service/getUser";
import { Navbar } from "@/app/components/shared/navbar";
import { Footer } from "@/app/components/shared/footer";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const user = await getUser();

    return (
        <div className="flex min-h-svh flex-col bg-paper">
            <Navbar user={user} />
            <div className="flex-1">{children}</div>
            <Footer user={user} />
        </div>
    );
}