"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActionResultToast } from "@/app/lib/action-feedback";
import { createReview } from "../_actions/createReview";

interface ReviewFormProps {
  rentalRequestId: string;
}

export default function ReviewForm({ rentalRequestId }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [state, action, pending] = useActionState(createReview, {
    success: false,
    message: "",
  });

  useActionResultToast(state, () => router.refresh());

  const activeRating = hover || rating;

  return (
    <form action={action} className="space-y-4 rounded-lg border p-4">
      <input type="hidden" name="rentalRequestId" value={rentalRequestId} />
      <input type="hidden" name="rating" value={rating} />

      <Field>
        <FieldLabel>Your rating</FieldLabel>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              className="rounded-sm p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(value)}
            >
              <Star
                aria-hidden="true"
                className={cn(
                  "size-6 transition-colors",
                  value <= activeRating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/40",
                )}
              />
            </button>
          ))}
        </div>
        <FieldError>{state.fieldErrors?.rating}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="comment">Comment (optional)</FieldLabel>
        <textarea
          id="comment"
          name="comment"
          rows={3}
          placeholder="What did you like or dislike?"
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <FieldError>{state.fieldErrors?.comment}</FieldError>
      </Field>

      <Button type="submit" className="w-full sm:w-fit" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit review"
        )}
      </Button>
    </form>
  );
}
