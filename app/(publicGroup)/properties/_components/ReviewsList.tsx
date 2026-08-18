import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getUser } from "@/service/getUser";
import { getReviews } from "../_actions/getReviews";
import { getEligibleRental } from "../_actions/getEligibleRental";
import ReviewForm from "./ReviewForm";

export default async function ReviewsList({ propertyId }: { propertyId: string }) {
  const [reviews, user] = await Promise.all([getReviews(), getUser()]);
  const propertyReviews = reviews
    .filter((r) => r.propertyId === propertyId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  let eligibleRental = null;
  if (user.success && user.data?.role === "TENANT") {
    eligibleRental = await getEligibleRental(propertyId);
  }

  const average =
    propertyReviews.length > 0
      ? propertyReviews.reduce((sum, r) => sum + r.rating, 0) /
        propertyReviews.length
      : null;

  return (
    <div className="space-y-6">
      <Separator />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Reviews</h2>
          <Badge variant="secondary" className="tabular-nums">
            {propertyReviews.length}
          </Badge>
        </div>
        {average !== null && (
          <p className="flex items-center gap-1.5 text-sm font-medium">
            <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            <span className="tabular-nums">{average.toFixed(1)}</span>
            <span className="text-muted-foreground">average</span>
          </p>
        )}
      </div>

      {eligibleRental && (
        <ReviewForm rentalRequestId={eligibleRental.id} />
      )}

      {propertyReviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No reviews yet. Be the first to share your experience.
        </p>
      ) : (
        <ul className="space-y-4">
          {propertyReviews.map((review) => (
            <li key={review.id} className="rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1" aria-label={`${review.rating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      aria-hidden="true"
                      className={cn(
                        "size-4",
                        value <= review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30",
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {getInitials(review.tenant?.name)}
                </div>
                <p className="truncate text-sm font-medium">
                  {review.tenant?.name ?? "Tenant"}
                </p>
              </div>
              {review.comment && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {review.comment}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function getInitials(name?: string) {
  return (name ?? "T")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
