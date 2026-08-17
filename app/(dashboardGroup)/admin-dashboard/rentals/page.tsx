import { KeyRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Property, RentalRequest, User } from "@/app/lib/types";
import { PageHeader } from "../../_components/PageHeader";
import { getAdminUsers } from "../_actions/getAdminUsers";
import { getAdminProperties } from "../_actions/getAdminProperties";
import { getAdminRentals } from "../_actions/getAdminRentals";
import { RentalRow, RentalRowProps } from "../_components/RentalRow";

type JoinedRental = RentalRowProps["rental"];

const joinRentals = (
  rentals: RentalRequest[],
  users: User[],
  properties: Property[],
): JoinedRental[] => {
  const userMap = new Map(users.map((u) => [u.id, u]));
  const propertyMap = new Map(
    properties.map((p) => [
      p.id,
      {
        id: p.id,
        title: p.title,
        city: p.city,
        images: p.images,
      },
    ]),
  );

  return rentals.map((r) => ({
    ...r,
    tenant: userMap.get(r.tenantId)
      ? {
          id: r.tenantId,
          name: userMap.get(r.tenantId)!.name,
          email: userMap.get(r.tenantId)!.email,
          phone: userMap.get(r.tenantId)!.phone,
        }
      : r.tenant ?? null,
    property: propertyMap.get(r.propertyId) ?? r.property ?? null,
  }));
};

export default async function AdminRentalsPage() {
  const [rentals, users, properties] = await Promise.all([
    getAdminRentals(),
    getAdminUsers(),
    getAdminProperties(),
  ]);

  const joined = joinRentals(rentals, users, properties);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Rentals"
        title="Rental requests"
        description="Every rental request across the market, newest first — spot stuck or unusual ones at a glance."
      />

      {joined.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <KeyRound aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-medium">No rental requests yet</p>
              <p className="text-sm text-muted-foreground">
                Requests tenants submit will show up here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-0">
            <div className="flex flex-col">
              {joined.map((rental, index) => (
                <div key={rental.id}>
                  <RentalRow rental={rental} />
                  {index < joined.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}