// app/(public)/properties/[id]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, BedDouble, Bath, Ruler } from "lucide-react";
import { getPropertyById } from "../_actions/getPropertyById";
import RequestToRentButton from "../_components/RequestToRentButton";
import ReviewsList from "../_components/ReviewsList";
import { getUser } from "@/service/getUser";

interface PropertyDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { id } = await params;

  let property;
  try {
    const res = await getPropertyById(id);
    property = res.data;
  } catch {
    notFound();
  }

  if (!property) {
    notFound();
  }

  const user = await getUser();
  const isLoggedIn = user.success;
  const isTenant = user.success && user.data.role === "TENANT";

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Image gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-lg overflow-hidden mb-6">
        <div className="relative h-80 md:h-96 bg-muted">
          {property.images?.[0] ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {property.images?.slice(1, 5).map((img, i) => (
            <div key={i} className="relative h-38 md:h-46 bg-muted">
              <Image
                src={img}
                alt={`${property.title} ${i + 2}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: details */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {property.category && <Badge>{property.category.name}</Badge>}
              {!property.isAvailable && (
                <Badge variant="destructive">Not Available</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <p className="flex items-center text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {property.address}, {property.city}
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <span className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4" /> {property.bedrooms} Bedrooms
            </span>
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4" /> {property.bathrooms} Bathrooms
            </span>
            {property.areaSqft && (
              <span className="flex items-center gap-1.5">
                <Ruler className="h-4 w-4" /> {property.areaSqft} sqft
              </span>
            )}
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {property.description}
            </p>
          </div>

          {property.amenities?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <Badge key={a} variant="secondary">
                    {a}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-2">Listed by</h2>
            <p className="text-sm">{property.landlord?.name}</p>
            <p className="text-sm text-muted-foreground">
              {property.landlord?.email}
            </p>
          </div>

          <ReviewsList propertyId={property.id} />
        </div>

        {/* Right: sticky CTA card */}
        <div className="md:col-span-1">
          <div className="sticky top-20 rounded-lg border p-6 space-y-4">
            <p className="text-3xl font-bold">
              ৳{property.price.toLocaleString()}
              <span className="text-base font-normal text-muted-foreground">
                /mo
              </span>
            </p>
            <RequestToRentButton
              propertyId={property.id}
              isAvailable={property.isAvailable}
              isTenant={isTenant}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
