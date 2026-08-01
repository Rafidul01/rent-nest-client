// app/(public)/properties/page.tsx
import { getProperties } from "./_actions/getProperties";
import PropertyGrid from "./_components/PropertyGrid";
// import FilterSidebar from "./_components/FilterSidebar";
import { Separator } from "@/components/ui/separator";

interface PropertiesPageProps {
    searchParams: Promise<{
        city?: string;
        minPrice?: string;
        maxPrice?: string;
        categoryId?: string;
        page?: string;
    }>;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
    const filters = await searchParams;
    const { data: properties, meta } = await getProperties(filters);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Browse Properties</h1>
                <p className="text-muted-foreground mt-1">
                    {meta ? `${meta.total} properties available` : "Find your next home"}
                </p>
            </div>

            <Separator className="mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <aside className="md:col-span-1">
                    {/* <FilterSidebar /> */}
                </aside>

                <main className="md:col-span-3">
                    
                    <PropertyGrid properties={properties} />
                </main>
            </div>
        </div>
    );
}