import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8" aria-busy="true" aria-label="Loading property">
      <Skeleton className="h-80 rounded-lg md:h-96" />
      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-72 max-w-full" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}