
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Home, Clock, Wallet, ArrowRight } from "lucide-react";
import { getMyRentals } from "./_actions/getMyRentals";
import { getMyPayments } from "./_actions/getMyPayments";
import { RentalRequest } from "@/app/lib/types";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    PENDING: "outline",
    APPROVED: "secondary",
    REJECTED: "destructive",
    ACTIVE: "default",
    COMPLETED: "secondary",
    CANCELLED: "destructive",
};

export default async function TenantDashboardPage() {
    const [rentalsRes, paymentsRes] = await Promise.all([
        getMyRentals(),
        getMyPayments(),
    ]);

    const rentals = rentalsRes.data;
    const payments = paymentsRes.data;

    console.log(rentals);

    const totalRequests = rentals.length;
    const activeCount = rentals.filter((r) => r.status === "ACTIVE").length;
    const pendingCount = rentals.filter((r) => r.status === "PENDING").length;
    const totalSpent = payments
        .filter((p) => p.status === "COMPLETED")
        .reduce((sum, p) => sum + p.amount, 0);

    const needsPayment = rentals.filter((r) => r.status === "APPROVED");
    const needsReview = rentals.filter((r) => r.status === "ACTIVE");

    const recentRentals = [...rentals]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold">Overview</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Here&apos;s a snapshot of your rental activity.
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Requests
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{totalRequests}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Active Rentals
                        </CardTitle>
                        <Home className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{activeCount}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pending
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{pendingCount}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Spent
                        </CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">৳{totalSpent.toLocaleString()}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Needs attention */}
            {(needsPayment.length > 0 || needsReview.length > 0) && (
                <div>
                    <h2 className="text-lg font-semibold mb-3">Needs Your Attention</h2>
                    <div className="space-y-3">
                        {needsPayment.map((r) => (
                            <Card key={r.id}>
                                <CardContent className="flex items-center justify-between py-4">
                                    <div>
                                        <p className="font-medium">{r.property?.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Approved — payment required to activate
                                        </p>
                                    </div>
                                    <Button asChild size="sm">
                                        <Link href={`/tenant-dashboard/requests/${r.id}/pay`}>
                                            Pay Now
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}

                        {needsReview.map((r) => (
                            <Card key={r.id}>
                                <CardContent className="flex items-center justify-between py-4">
                                    <div>
                                        <p className="font-medium">{r.property?.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Active — share your experience
                                        </p>
                                    </div>
                                    <Button asChild size="sm" variant="outline">
                                        <Link href={`/properties/${r.propertyId}`}>
                                            Leave a Review
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent requests */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Recent Requests</h2>
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/tenant-dashboard/requests">
                            View all <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                    </Button>
                </div>

                {recentRentals.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        You haven&apos;t submitted any rental requests yet.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {recentRentals.map((r: RentalRequest) => (
                            <Card key={r.id}>
                                <CardContent className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-medium">{r.property?.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(r.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Badge variant={statusVariant[r.status]}>{r.status}</Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}