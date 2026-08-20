import { Review } from "@/app/lib/types";
import { fetchList } from "@/app/lib/fetch-api";

export const getReviews = async (): Promise<Review[]> => {
  return fetchList<Review>(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
    cache: "no-store",
  });
};
