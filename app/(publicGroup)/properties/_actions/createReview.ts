"use server";

import { cookies } from "next/headers";
import { reviewSchema, toFieldErrors } from "@/app/lib/schemas";

export type CreateReviewState = {
  success: boolean;
  message: string;
  errorDetails?: unknown;
  fieldErrors?: Record<string, string>;
};

export const createReview = async (
  previousState: CreateReviewState,
  formData: FormData
): Promise<CreateReviewState> => {
  const parsed = reviewSchema.safeParse({
    rentalRequestId: formData.get("rentalRequestId"),
    rating: formData.get("rating"),
    comment: formData.get("comment") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const { rentalRequestId, rating, comment } = parsed.data;

  const cookieStore = await cookies();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify({
      rentalRequestId,
      rating,
      comment: comment || undefined,
    }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      success: false,
      message: json.message || "Failed to submit review",
      errorDetails: json.errorDetails ?? null,
    };
  }

  return {
    success: true,
    message: "Review submitted successfully",
  };
};
