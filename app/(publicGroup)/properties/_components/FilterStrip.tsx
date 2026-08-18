"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/app/lib/types";
import { getCategories } from "../_actions/getCategories";

export default function FilterStrip() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [categories, setCategories] = useState<Category[]>([]);
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [categoryId, setCategoryId] = useState(
    searchParams.get("categoryId") ?? "",
  );

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const activeCount = [city, minPrice, maxPrice, categoryId].filter(
    Boolean,
  ).length;

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (city) params.set("city", city);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (categoryId) params.set("categoryId", categoryId);

    startTransition(() => {
      router.push(`/properties?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    setCategoryId("");
    startTransition(() => {
      router.push("/properties");
    });
  };

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="city" className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            City
          </Label>
          <Input
            id="city"
            placeholder="e.g. Dhaka"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Budget (৳/mo)
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              min={0}
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="tabular-nums"
            />
            <Input
              type="number"
              min={0}
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="tabular-nums"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Type
          </Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end gap-2 lg:col-span-1">
          <Button
            onClick={applyFilters}
            disabled={isPending}
            className="flex-1 lg:flex-none"
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            {isPending ? "Filtering..." : "Apply"}
          </Button>
          {activeCount > 0 && (
            <Button variant="outline" onClick={clearFilters} disabled={isPending} size="icon">
              <X className="size-4" aria-hidden="true" />
              <span className="sr-only">Clear filters ({activeCount})</span>
            </Button>
          )}
        </div>
      </div>

      {activeCount > 0 && (
        <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">
          {activeCount} filter{activeCount > 1 ? "s" : ""} active —{" "}
          <button
            type="button"
            onClick={clearFilters}
            className="font-medium text-primary hover:underline"
          >
            clear all
          </button>
        </p>
      )}
    </div>
  );
}