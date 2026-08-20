// app/(dashboard)/tenant-dashboard/requests/[id]/pay/page.tsx
import { notFound, redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Clock3, Lock } from "lucide-react";
import { getRentalRequestById } from "@/app/(dashboardGroup)/tenant-dashboard/_actions/getRentalRequestById";
import PayButton from "./_components/PayButton";
import { PageHeader } from "@/app/(dashboardGroup)/_components/PageHeader";

interface PayPageProps {
    params: Promise<{ id: string }>;
}

export default async function PayPage({ params }: PayPageProps) {
    const { id } = await params;

    let rentalRequest;
    try {
        const res = await getRentalRequestById(id);
        rentalRequest = res.data;
    } catch {
        notFound();
    }

    if (!rentalRequest) notFound();

    if (rentalRequest.status !== "APPROVED") {
        redirect("/tenant-dashboard/requests");
    }

    return (
        <div className="mx-auto w-full max-w-lg space-y-6">
            <PageHeader
                eyebrow="Checkout"
                title="Complete your payment"
                description="Review the details below before you continue to checkout."
            />

            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div>
                        <h2 className="font-display font-semibold text-lg">
                            {rentalRequest.property?.title}
                        </h2>
                        <p className="flex items-center text-sm text-muted-foreground gap-1 mt-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {rentalRequest.property?.address}, {rentalRequest.property?.city}
                        </p>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                <Calendar className="h-4 w-4" /> Move-in Date
                            </span>
                            <span>
                                {new Date(rentalRequest.moveInDate).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock3 className="h-4 w-4" /> Duration
                            </span>
                            <span>{rentalRequest.durationMonths} months</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between text-lg font-semibold">
                        <span>Total Amount</span>
                        <span className="tabular-nums">৳{rentalRequest.totalAmount.toLocaleString()}</span>
                    </div>
                </CardContent>
            </Card>

            <PayButton rentalRequestId={rentalRequest.id} />

            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="size-3.5" aria-hidden="true" />
                Payments are processed securely by Stripe.
            </p>
        </div>
    );
}