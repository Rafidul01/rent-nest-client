"use server";

import { cookies } from "next/headers";
import { RentalRequest } from "@/app/lib/types";

export const getEligibleRental = async (
  propertyId: string
): Promise<RentalRequest | null> => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rentals`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok || !Array.isArray(json?.data)) {
      return null;
    }

    return (
      (json.data as RentalRequest[]).find(
        (r) =>
          r.propertyId === propertyId &&
          r.status === "ACTIVE" &&
          !r.review
      ) ?? null
    );
  } catch {
    return null;
  }
};
