import { LoadingState } from "@/app/components/shared/loading-state";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <LoadingState />
    </div>
  );
}