import Link from "next/link";
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUser } from "@/service/getUser";
import { getLandlordProperties } from "../_actions/getLandlordProperties";
import { PageHeader } from "../../_components/PageHeader";
import { PropertyTile } from "../_components/PropertyTile";

export default async function LandlordPropertiesPage() {
  const user = await getUser();
  const landlordId = user.data?.id as string;

  const properties = await getLandlordProperties(landlordId);

  return (
    <main className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          eyebrow="Your board"
          title="Properties"
          description="Your listings — flip the light on to keep them in front of tenants."
        />
        <Button asChild className="w-fit">
          <Link href="/landlord-dashboard/properties/new">
            <Plus className="size-4" />
            Add property
          </Link>
        </Button>
      </div>

      {properties.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Building2 aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-medium">No properties on your board</p>
              <p className="text-sm text-muted-foreground">
                Add your first listing and start receiving rental requests.
              </p>
            </div>
            <Button asChild>
              <Link href="/landlord-dashboard/properties/new">
                <Plus className="size-4" />
                List your first property
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((p) => (
            <PropertyTile key={p.id} property={p} />
          ))}
        </div>
      )}
    </main>
  );
}
