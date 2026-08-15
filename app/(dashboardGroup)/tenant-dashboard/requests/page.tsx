// app/(dashboard)/tenant-dashboard/requests/page.tsx
import { getMyRentals } from "../_actions/getMyRentals";
import RequestsList from "../_components/RequestsList";
import { PageHeader } from "../../_components/PageHeader";

export default async function TenantRequestsPage() {
    const { data: rentals } = await getMyRentals();

    const sorted = [...rentals].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Applications"
                title="My requests"
                description="Every rental request you&apos;ve submitted, and its current status."
            />

            <RequestsList rentals={sorted} />
        </div>
    );
}