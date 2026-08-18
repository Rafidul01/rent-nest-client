import { LoadingState } from "@/app/components/shared/loading-state";

export default function Loading() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-lg" aria-busy="true" aria-label="Loading">
        <LoadingState cards={1} rows={2} />
      </div>
    </div>
  );
}