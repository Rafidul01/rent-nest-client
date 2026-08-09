
import { cn } from "@/lib/utils";
import { RentalStatus } from "@/app/lib/types";

const statusStyles: Record<RentalStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    APPROVED: "bg-blue-100 text-blue-800 border-blue-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
    ACTIVE: "bg-green-100 text-green-800 border-green-200",
    COMPLETED: "bg-gray-100 text-gray-700 border-gray-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

export default function RequestStatusBadge({ status }: { status: RentalStatus }) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                statusStyles[status]
            )}
        >
            {status}
        </span>
    );
}