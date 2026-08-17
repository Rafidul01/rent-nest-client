import { Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "../../_components/PageHeader";
import { getAdminProperties } from "../_actions/getAdminProperties";
import { PropertyRow } from "../_components/PropertyRow";

export default async function AdminPropertiesPage() {
  const properties = await getAdminProperties();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Listings"
        title="Property register"
        description="Every listing on the platform, with its landlord and letting status, in one place."
      />

      {properties.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Building2 aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-medium">No listings yet</p>
              <p className="text-sm text-muted-foreground">
                Properties landlords add will show up here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-0">
            <div className="flex flex-col">
              {properties.map((property, index) => (
                <div key={property.id}>
                  <PropertyRow property={property} />
                  {index < properties.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}