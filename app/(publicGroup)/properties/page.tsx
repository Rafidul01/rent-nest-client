
import { getProperties } from "./_actions/getProperties";
import PropertyGrid from "./_components/PropertyGrid";
import FilterStrip from "./_components/FilterStrip";
import { LettingLamp } from "../_components/LettingLamp";

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
    const result = await getProperties(filters);
    const properties = result.data;
    const total = result.success && result.meta ? result.meta.total : properties.length;

    return (
        <main className="bg-paper text-foreground">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
                <header className="flex flex-col gap-3">
                    <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                        <LettingLamp lit className="size-4" />
                        The letting board
                    </p>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <h1 className="font-display text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                            Find your nest
                        </h1>
                        <p className="text-sm tabular-nums text-muted-foreground">
                            {total} listing{total === 1 ? "" : "s"} on the board
                        </p>
                    </div>
                </header>

                <FilterStrip />

                <PropertyGrid properties={properties} />
            </div>
        </main>
    );
}
