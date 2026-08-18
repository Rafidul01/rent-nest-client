import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8" aria-busy="true" aria-label="Loading listings">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-8 w-72 max-w-full" />
      <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}