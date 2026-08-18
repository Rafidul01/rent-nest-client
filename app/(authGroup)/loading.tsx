import { LoadingState } from "@/app/components/shared/loading-state";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-md px-4 py-10">
      <div aria-busy="true" aria-label="Loading">
        <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-muted" />
        <LoadingState cards={1} rows={2} />
      </div>
    </div>
  );
}