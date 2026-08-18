import { Review } from "@/app/lib/types";

export const getReviews = async (): Promise<Review[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json || !Array.isArray(json.data)) {
    return [];
  }

  return json.data as Review[];
};
