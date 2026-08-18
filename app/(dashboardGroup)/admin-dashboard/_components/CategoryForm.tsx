"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createCategory } from "../_actions/createCategory";
import { toastActionResult } from "@/app/lib/action-feedback";

export function CategoryForm() {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedName = name.trim();
        if (trimmedName.length < 2) {
            toastActionResult({
                success: false,
                message: "Name must be at least 2 characters",
            });
            return;
        }

        setPending(true);
        const result = await createCategory(
            trimmedName,
            description.trim(),
        );
        setPending(false);

        toastActionResult(result, {
            successMessage: "Category added",
        });

        if (result.success) {
            setName("");
            setDescription("");
            router.refresh();
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-5"
        >
            <Field>
                <FieldLabel htmlFor="categoryName">Name</FieldLabel>
                <Input
                    id="categoryName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Apartment, Sublet, PG"
                    required
                    minLength={2}
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="categoryDescription">
                    Description (optional)
                </FieldLabel>
                <Input
                    id="categoryDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A short note for the board"
                />
            </Field>

            <Button type="submit" disabled={pending}>
                {pending ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                    <Tags className="size-4" aria-hidden="true" />
                )}
                {pending ? "Adding..." : "Add category"}
            </Button>
        </form>
    );
}