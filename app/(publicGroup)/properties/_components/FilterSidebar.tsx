"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

export default function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [categories, setCategories] = useState<Category[]>([]);
    const [city, setCity] = useState(searchParams.get("city") ?? "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
    const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") ?? "");

    useEffect(() => {
        getCategories()
            .then((res) => setCategories(res.data))
            .catch(() => setCategories([]));
    }, []);

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
        <div className="space-y-6 rounded-lg border p-4">
            <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                    id="city"
                    placeholder="e.g. Dhaka"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="flex gap-2">
                    <Input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <Input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Property Type</Label>
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

            <div className="flex flex-col gap-2 pt-2">
                <Button onClick={applyFilters} disabled={isPending}>
                    {isPending ? "Applying..." : "Apply Filters"}
                </Button>
                <Button variant="outline" onClick={clearFilters} disabled={isPending}>
                    Clear
                </Button>
            </div>
        </div>
    );
}