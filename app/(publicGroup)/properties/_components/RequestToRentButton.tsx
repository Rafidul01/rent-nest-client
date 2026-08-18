"use client";

import { useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldError,
    FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActionResultToast } from "@/app/lib/action-feedback";
import { createRentalRequest } from "../_actions/createRentalRequest";

interface RequestToRentButtonProps {
    propertyId: string;
    isAvailable: boolean;
    isTenant: boolean;
    isLoggedIn: boolean;
    onDark?: boolean;
}

export default function RequestToRentButton({
    propertyId,
    isAvailable,
    isTenant,
    isLoggedIn,
    onDark,
}: RequestToRentButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [state, action, pending] = useActionState(createRentalRequest, {
        success: false,
        message: "",
    });

    useActionResultToast(state, () => {
        router.push("/tenant-dashboard/requests");
    });

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
                <form
                    action={action}
                    className={cn(
                        "space-y-4 rounded-lg border p-4",
                        onDark &&
                            "border-sidebar-foreground/15 bg-sidebar-foreground/5",
                    )}
                >
                    <input type="hidden" name="propertyId" value={propertyId} />
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="moveInDate">Move-in date</FieldLabel>
                            <Input
                                id="moveInDate"
                                name="moveInDate"
                                type="date"
                                required
                                className={onDark ? "placeholder:text-sidebar-foreground/50" : undefined}
                                aria-invalid={!!state.fieldErrors?.moveInDate}
                            />
                            <FieldError>{state.fieldErrors?.moveInDate}</FieldError>
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
                                className={onDark ? "placeholder:text-sidebar-foreground/50" : undefined}
                                aria-invalid={!!state.fieldErrors?.duration}
                            />
                            <FieldError>{state.fieldErrors?.duration}</FieldError>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="message">Message (optional)</FieldLabel>
                            <textarea
                                id="message"
                                name="message"
                                rows={3}
                                placeholder="A short note for the landlord"
                                className={cn(
                                    "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    onDark && "placeholder:text-sidebar-foreground/50",
                                )}
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
