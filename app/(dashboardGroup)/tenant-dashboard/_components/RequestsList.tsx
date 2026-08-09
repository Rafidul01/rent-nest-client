"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { MapPin } from "lucide-react";
import { RentalRequest, RentalStatus } from "@/app/lib/types";
import RequestStatusBadge from "../../_components/RequestStatusBadge";

const FILTERS: { label: string; value: RentalStatus | "ALL" }[] = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Active", value: "ACTIVE" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Rejected", value: "REJECTED" },
];

export default function RequestsList({ rentals }: { rentals: RentalRequest[] }) {
    const [filter, setFilter] = useState<RentalStatus | "ALL">("ALL");

    const filtered =
        filter === "ALL" ? rentals : rentals.filter((r) => r.status === filter);

    return (
        <div className="space-y-4">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as RentalStatus | "ALL")}>
                <TabsList className="flex-wrap h-auto">
                    {FILTERS.map((f) => (
                        <TabsTrigger key={f.value} value={f.value}>
                            {f.label}
                            {f.value !== "ALL" && (
                                <span className="ml-1.5 text-xs text-muted-foreground">
                                    ({rentals.filter((r) => r.status === f.value).length})
                                </span>
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg">
                    <p className="text-lg font-medium">
                        {filter === "ALL" ? "No rental requests yet" : `No ${filter.toLowerCase()} requests`}
                    </p>
                    {filter === "ALL" && (
                        <>
                            <p className="text-muted-foreground text-sm mt-1 mb-4">
                                Browse properties and submit your first request.
                            </p>
                            <Button asChild>
                                <Link href="/properties">Browse Properties</Link>
                            </Button>
                        </>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((r) => (
                        <Card key={r.id}>
                            <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Link
                                            href={`/properties/${r.propertyId}`}
                                            className="font-medium hover:underline truncate"
                                        >
                                            {r.property?.title}
                                        </Link>
                                        <RequestStatusBadge status={r.status} />
                                    </div>
                                    <p className="flex items-center text-sm text-muted-foreground gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {r.property?.city}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                        <span>
                                            Move-in: {new Date(r.moveInDate).toLocaleDateString()}
                                        </span>
                                        <span>{r.durationMonths} months</span>
                                        <span>৳{r.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="shrink-0">
                                    {r.status === "APPROVED" && (
                                        <Button asChild size="sm">
                                            <Link href={`/tenant-dashboard/requests/${r.id}/pay`}>
                                                Pay Now
                                            </Link>
                                        </Button>
                                    )}
                                    {r.status === "ACTIVE" && (
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={`/properties/${r.propertyId}`}>
                                                Leave Review
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}