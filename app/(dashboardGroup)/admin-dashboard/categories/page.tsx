import { Tags } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "../../_components/PageHeader";
import { CategoryForm } from "../_components/CategoryForm";
import { getAdminCategories } from "../_actions/getAdminCategories";

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

export default async function AdminCategoriesPage() {
    const categories = await getAdminCategories();

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                eyebrow="Board settings"
                title="Categories"
                description="Labels landlords pick when listing, and tenants use to filter. New ones appear in both the property form and the browse filters right away."
            />

            <CategoryForm />

            {categories.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                            <Tags aria-hidden="true" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="font-medium">No categories yet</p>
                            <p className="text-sm text-muted-foreground">
                                Add the first one above — it shows up across the
                                marketplace.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="p-0">
                        <div className="flex flex-col">
                            {categories.map((category, index) => (
                                <div key={category.id}>
                                    <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                        <div className="flex min-w-0 flex-col gap-0.5">
                                            <p className="font-medium">
                                                {category.name}
                                            </p>
                                            {category.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {category.description}
                                                </p>
                                            )}
                                        </div>
                                        <p className="shrink-0 text-xs tabular-nums text-muted-foreground">
                                            Added {formatDate(category.createdAt)}
                                        </p>
                                    </div>
                                    {index < categories.length - 1 && (
                                        <Separator />
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}