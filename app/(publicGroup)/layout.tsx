import { getUser } from "@/service/getUser";
import { Navbar } from "@/app/components/shared/navbar";
import type { Property } from "@/app/lib/types";

const getLiveCount = async (): Promise<number> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/properties`,
      { next: { revalidate: 60 } },
    );
    const json = await res.json().catch(() => ({}));
    if (!Array.isArray(json?.data)) return 0;
    return (json.data as Property[]).filter((p) => p.isAvailable).length;
  } catch {
    return 0;
  }
};

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const [user, liveCount] = await Promise.all([getUser(), getLiveCount()]);

    return (
        <>
            <Navbar user={user} liveCount={liveCount} />
            {children}
        </>
    );
}