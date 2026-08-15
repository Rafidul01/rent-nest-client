"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createRentalRequest } from "../_actions/createRentalRequest";

interface RequestToRentButtonProps {
    propertyId: string;
    isAvailable: boolean;
    isTenant: boolean;
    isLoggedIn: boolean;
}

export default function RequestToRentButton({
    propertyId,
    isAvailable,
    isTenant,
    isLoggedIn,
}: RequestToRentButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [state, action, pending] = useActionState(createRentalRequest, {
        success: false,
        message: "",
    });

    useEffect(() => {
        if (state.message && state.success) {
            toast.success(state.message);
            router.push("/tenant-dashboard/requests");
        } else if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state, router]);

    if (!isAvailable) {
        return (
            <Button className="w-full" disabled>
                Not Available
            </Button>
        );
    }

    if (!isLoggedIn) {
        return (
            <Button asChild className="w-full">
                <Link href="/login">Log in to request</Link>
            </Button>
        );
    }

    if (!isTenant) {
        return (
            <Button asChild className="w-full" variant="secondary">
                <Link href="/landlord-dashboard">Landlord? Go to dashboard</Link>
            </Button>
        );
    }

    return (
        <div className="space-y-3">
            <Button
                className="w-full"
                onClick={() => setOpen((v) => !v)}
                disabled={pending}
            >
                {pending ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                    </>
                ) : open ? (
                    "Cancel"
                ) : (
                    "Request to Rent"
                )}
            </Button>

            {open && (
                <form action={action} className="space-y-4 rounded-lg border p-4">
                    <input type="hidden" name="propertyId" value={propertyId} />
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="moveInDate">Move-in date</FieldLabel>
                            <Input
                                id="moveInDate"
                                name="moveInDate"
                                type="date"
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="duration">Duration (months)</FieldLabel>
                            <Input
                                id="duration"
                                name="duration"
                                type="number"
                                min={1}
                                placeholder="e.g. 6"
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="message">Message (optional)</FieldLabel>
                            <textarea
                                id="message"
                                name="message"
                                rows={3}
                                placeholder="A short note for the landlord"
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <FieldDescription>
                                The total rent is computed as price × duration.
                            </FieldDescription>
                        </Field>

                        <Button type="submit" className="w-full" disabled={pending}>
                            {pending ? "Submitting..." : "Submit request"}
                        </Button>
                    </FieldGroup>
                </form>
            )}
        </div>
    );
}
