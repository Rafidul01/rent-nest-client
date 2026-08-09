// app/(dashboard)/tenant-dashboard/requests/page.tsx
import { getMyRentals } from "../_actions/getMyRentals";
import RequestsList from "../_components/RequestsList";


export default async function TenantRequestsPage() {
    const { data: rentals } = await getMyRentals();

    const sorted = [...rentals].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">My Requests</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Every rental request you&apos;ve submitted, and its current status.
                </p>
            </div>

            <RequestsList rentals={sorted} />
        </div>
    );
}