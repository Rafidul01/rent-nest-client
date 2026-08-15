// app/(dashboardGroup)/tenant-dashboard/requests/[id]/pay/_components/PayButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createPayment } from "@/app/(dashboardGroup)/tenant-dashboard/_actions/createPayment";

export default function PayButton({ rentalRequestId }: { rentalRequestId: string }) {
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        setLoading(true);

        const result = await createPayment(rentalRequestId);

        if (!result.success) {
            toast.error(result.message);
            setLoading(false);
            return;
        }

        if (result.paymentURL) {
            window.location.href = result.paymentURL;
        } else {
            toast.error("No checkout link returned. Please try again.");
            setLoading(false);
        }
    };

    return (
        <Button onClick={handlePay} disabled={loading} className="w-full" size="lg">
            {loading ? (
                <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Redirecting to payment...
                </>
            ) : (
                "Proceed to Payment"
            )}
        </Button>
    );
}
