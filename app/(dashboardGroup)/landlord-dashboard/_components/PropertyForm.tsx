"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, Property } from "@/app/lib/types";
import { propertyFormSchema } from "@/app/lib/schemas";
import { createProperty } from "../_actions/createProperty";
import { updateProperty } from "../_actions/updateProperty";
import { toastActionResult } from "@/app/lib/action-feedback";

interface PropertyFormProps {
  categories: Category[];
  property?: Property;
}

const toList = (value: string) =>
  value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const emptyToUndefined = (value: string) =>
  value.trim() === "" ? undefined : value;

export function PropertyForm({ categories, property }: PropertyFormProps) {
  const router = useRouter();
  const editing = Boolean(property);
  const [pending, setPending] = useState(false);

  const [form, setForm] = useState({
    title: property?.title ?? "",
    description: property?.description ?? "",
    address: property?.address ?? "",
    city: property?.city ?? "",
    price: property ? String(property.price) : "",
    bedrooms: property ? String(property.bedrooms ?? "") : "",
    bathrooms: property ? String(property.bathrooms ?? "") : "",
    areaSqft: property ? String(property.areaSqft ?? "") : "",
    amenities: property?.amenities?.join(", ") ?? "",
    images: property?.images?.join(", ") ?? "",
    categoryId: property?.categoryId ?? "",
    isAvailable: property ? String(property.isAvailable) : "true",
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = propertyFormSchema.safeParse({
      title: form.title,
      description: form.description,
      address: form.address,
      city: form.city,
      price: form.price,
      bedrooms: emptyToUndefined(form.bedrooms),
      bathrooms: emptyToUndefined(form.bathrooms),
      areaSqft: emptyToUndefined(form.areaSqft),
      amenities: toList(form.amenities),
      images: toList(form.images),
      categoryId: form.categoryId,
      isAvailable: form.isAvailable === "true",
    });

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      toast.error(firstIssue?.message ?? "Please check the form.");
      return;
    }

    const payload = parsed.data;
    setPending(true);

    let result;
    try {
      result = property
        ? await updateProperty(property.id, payload)
        : await createProperty(payload);
    } catch {
      setPending(false);
      toast.error("Something went wrong. Please try again.");
      return;
    }

    setPending(false);

    toastActionResult(result, {
      successMessage: editing
        ? "Property updated successfully"
        : "Listing created successfully!",
    });

    if (result.success) {
      router.push("/landlord-dashboard/properties");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {editing ? "Edit property" : "New property"}
          </CardTitle>
          <CardDescription>
            Details appear on the public listing exactly as you write them.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => set("title")(e.target.value)}
                placeholder="Sunny 2-bed apartment"
                required
              />
            </Field>

            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => set("description")(e.target.value)}
                placeholder="What makes this place worth renting?"
                className="flex w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="address">Address</FieldLabel>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => set("address")(e.target.value)}
                placeholder="House 12, Road 5, Dhanmondi"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="city">City</FieldLabel>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => set("city")(e.target.value)}
                placeholder="Dhaka"
                required
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="price">Monthly rent (৳)</FieldLabel>
              <Input
                id="price"
                type="number"
                min={1}
                value={form.price}
                onChange={(e) => set("price")(e.target.value)}
                placeholder="18000"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="bedrooms">Bedrooms</FieldLabel>
              <Input
                id="bedrooms"
                type="number"
                min={0}
                value={form.bedrooms}
                onChange={(e) => set("bedrooms")(e.target.value)}
                placeholder="2"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="bathrooms">Bathrooms</FieldLabel>
              <Input
                id="bathrooms"
                type="number"
                min={0}
                value={form.bathrooms}
                onChange={(e) => set("bathrooms")(e.target.value)}
                placeholder="2"
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="areaSqft">Area (sqft)</FieldLabel>
              <Input
                id="areaSqft"
                type="number"
                min={0}
                value={form.areaSqft}
                onChange={(e) => set("areaSqft")(e.target.value)}
                placeholder="1100"
              />
            </Field>

            <Field>
              <FieldLabel>Category</FieldLabel>
              <Select
                value={form.categoryId}
                onValueChange={set("categoryId")}
              >
                <SelectTrigger className="w-full" aria-label="Category">
                  <SelectValue
                    placeholder={
                      categories.find((c) => c.id === form.categoryId)?.name ??
                      "Choose a category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="amenities">Amenities</FieldLabel>
              <Input
                id="amenities"
                value={form.amenities}
                onChange={(e) => set("amenities")(e.target.value)}
                placeholder="wifi, parking, lift"
              />
              <FieldDescription>
                Comma-separated list.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="images">Image URLs</FieldLabel>
              <Input
                id="images"
                value={form.images}
                onChange={(e) => set("images")(e.target.value)}
                placeholder="https://…, https://…"
              />
              <FieldDescription>
                Comma-separated links; the first is shown on the listing.
              </FieldDescription>
            </Field>
          </div>

          <Field>
            <FieldLabel>Availability</FieldLabel>
            <Select
              value={form.isAvailable}
              onValueChange={set("isAvailable")}
            >
              <SelectTrigger className="w-full" aria-label="Availability">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Available to rent</SelectItem>
                <SelectItem value="false">Let out — hide from search</SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>
              Unavailable properties stay in your dashboard but drop off the
              public listing.
            </FieldDescription>
          </Field>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={pending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          {editing ? "Save changes" : "List property"}
        </Button>
      </div>
    </form>
  );
}
