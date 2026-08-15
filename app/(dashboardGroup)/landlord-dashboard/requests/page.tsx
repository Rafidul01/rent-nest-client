import { Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getUser } from "@/service/getUser";
import type { Property, RentalRequest } from "@/app/lib/types";
import { getLandlordProperties } from "../_actions/getLandlordProperties";
import { getLandlordRequests } from "../_actions/getLandlordRequests";
import { PageHeader } from "../../_components/PageHeader";
import { DecisionCard } from "../_components/DecisionCard";

type JoinedRequest = Omit<RentalRequest, "property"> & {
  property?: { id: string; title: string; city: string } | null;
};

const joinRequests = (
  requests: RentalRequest[],
  properties: Property[],
): JoinedRequest[] => {
  const map = new Map(properties.map((p) => [p.id, p]));
  return requests.map((r) => ({
    ...r,
    property: map.has(r.propertyId)
      ? {
          id: r.propertyId,
          title: map.get(r.propertyId)!.title,
          city: map.get(r.propertyId)!.city,
        }
      : null,
  }));
};

export default async function LandlordRequestsPage() {
  const user = await getUser();
  const landlordId = user.data?.id as string;

  const [properties, requests] = await Promise.all([
    getLandlordProperties(landlordId),
    getLandlordRequests(),
  ]);

  const joined = joinRequests(requests, properties);
  const sorted = [...joined].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const pendingCount = sorted.filter((r) => r.status === "PENDING").length;

  return (
    <main className="flex w-full flex-col gap-6">
      <PageHeader
        eyebrow="Decision desk"
        title="Rental requests"
        description="Review each application and decide — approve to move a tenant toward payment."
      />

      {pendingCount > 0 && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex size-2">
            <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          {pendingCount} request{pendingCount === 1 ? "" : "s"} waiting on your
          call
        </p>
      )}

      {sorted.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Inbox aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-medium">No requests yet</p>
              <p className="text-sm text-muted-foreground">
                When a tenant asks to rent one of your listings, it lands here
                for your decision.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sorted.map((r) => (
            <DecisionCard key={r.id} request={r} />
          ))}
        </div>
      )}
    </main>
  );
}
