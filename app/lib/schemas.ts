// app/lib/schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["TENANT", "LANDLORD"], { message: "Choose a role" }),
});

export const reviewSchema = z.object({
  rentalRequestId: z.string().min(1, "Rental request is required"),
  rating: z.coerce
    .number()
    .int("Rating must be a whole number")
    .min(1, "Pick a rating")
    .max(5, "Rating must be between 1 and 5"),
  comment: z.string().optional(),
});

export const rentalRequestSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  moveInDate: z.string().min(1, "Choose a move-in date"),
  duration: z.coerce
    .number()
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 month"),
  message: z.string().optional(),
});

export const propertyFormSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters"),
  description: z.string().trim().min(2, "Description must be at least 2 characters"),
  address: z.string().trim().min(2, "Address must be at least 2 characters"),
  city: z.string().trim().min(2, "City must be at least 2 characters"),
  price: z.coerce.number().positive("Enter a valid monthly rent"),
  bedrooms: z.coerce.number().int().nonnegative().optional(),
  bathrooms: z.coerce.number().int().nonnegative().optional(),
  areaSqft: z.coerce.number().nonnegative().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  categoryId: z.string().min(1, "Choose a category"),
  isAvailable: z.boolean().optional(),
});

export type FieldErrors = Record<string, string>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const map: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_root");
    if (!map[key]) map[key] = issue.message;
  }
  return map;
}
