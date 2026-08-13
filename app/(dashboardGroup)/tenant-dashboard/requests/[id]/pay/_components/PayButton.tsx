// app/(dashboard)/tenant-dashboard/requests/[id]/pay/_components/PayButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PayButton({ rentalRequestId }: { rentalRequestId: string }) {
    const [loading, setLoading] = useState(false);
    console.log(rentalRequestId)

    const handlePay = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/payments/create`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ requestId: rentalRequestId }),
                }
            );

            const json = await res.json();

            if (!res.ok) {
                toast.error(json.message || "Failed to start payment");
                setLoading(false);
                return;
            }

            // redirect to Stripe's hosted checkout page
            window.location.href = json.data.paymentURL;
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
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