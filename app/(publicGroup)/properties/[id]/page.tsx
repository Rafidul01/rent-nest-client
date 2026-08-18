// app/(public)/properties/[id]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, MapPin, BedDouble, Bath, Ruler, UserRound, Phone, Mail } from "lucide-react";
import { getPropertyById } from "../_actions/getPropertyById";
import RequestToRentButton from "../_components/RequestToRentButton";
import ReviewsList from "../_components/ReviewsList";
import { LettingLamp } from "../../_components/LettingLamp";
import { getUser } from "@/service/getUser";

interface PropertyDetailsPageProps {
  params: Promise<{ id: string }>;
}

function getInitials(name?: string) {
  return (name ?? "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
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
  const available = property.isAvailable;

  const images = property.images?.length
    ? property.images.slice(0, 5)
    : [];

  const specs = [
    { icon: BedDouble, label: `${property.bedrooms} bedroom${property.bedrooms === 1 ? "" : "s"}` },
    { icon: Bath, label: `${property.bathrooms} bathroom${property.bathrooms === 1 ? "" : "s"}` },
    ...(property.areaSqft
      ? [{ icon: Ruler, label: `${property.areaSqft.toLocaleString()} sqft` }]
      : []),
  ];

  return (
    <main className="bg-paper text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/properties" className="transition-colors hover:text-foreground">
            The board
          </Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="truncate font-medium text-foreground">{property.title}</span>
        </nav>

        {/* Gallery */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
            <div className="relative h-72 overflow-hidden rounded-2xl bg-muted sm:h-96 lg:col-span-3 lg:h-[30rem]">
              <Image
                src={images[0]}
                alt={property.title}
                fill
                priority
                sizes="(min-width: 1024px) 75vw, 100vw"
                className="object-cover"
              />
            </div>
            {images.slice(1, 3).length > 0 && (
              <div className="hidden grid-rows-2 gap-2 lg:grid">
                {images.slice(1, 3).map((img, i) => (
                  <div key={i} className="relative h-full overflow-hidden rounded-2xl bg-muted">
                    <Image
                      src={img}
                      alt={`${property.title} ${i + 2}`}
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Left: details */}
          <div className="flex min-w-0 flex-col gap-8">
            <header className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {property.category && <Badge>{property.category.name}</Badge>}
                <span
                  className={
                    available
                      ? "flex items-center gap-1.5 text-sm font-medium text-primary"
                      : "flex items-center gap-1.5 text-sm text-muted-foreground"
                  }
                >
                  <LettingLamp lit={available} className="size-4" />
                  {available ? "Open for requests" : "Let out"}
                </span>
              </div>
              <h1 className="font-display text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {property.title}
              </h1>
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-4 shrink-0" aria-hidden="true" />
                {property.address}, {property.city}
              </p>
            </header>

            <div className="flex flex-wrap gap-2">
              {specs.map((spec) => (
                <span
                  key={spec.label}
                  className="flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-sm tabular-nums"
                >
                  <spec.icon className="size-4 text-primary" aria-hidden="true" />
                  {spec.label}
                </span>
              ))}
            </div>

            <section className="flex flex-col gap-2 border-t pt-6">
              <h2 className="font-display text-xl font-semibold tracking-tight">About this place</h2>
              <p className="text-sm leading-7 text-muted-foreground">{property.description}</p>
            </section>

            {property.amenities?.length > 0 && (
              <section className="flex flex-col gap-3 border-t pt-6">
                <h2 className="font-display text-xl font-semibold tracking-tight">Amenities</h2>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {property.amenities.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm capitalize"
                    >
                      <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                      {a}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="flex flex-col gap-3 border-t pt-6">
              <h2 className="font-display text-xl font-semibold tracking-tight">Listed by</h2>
              <div className="flex items-center gap-3 rounded-2xl border bg-card p-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                  {getInitials(property.landlord?.name)}
                </div>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="truncate font-medium">{property.landlord?.name ?? "RentNest landlord"}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="size-3" aria-hidden="true" />
                    {property.landlord?.email ?? "—"}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="size-3" aria-hidden="true" />
                    {property.landlord?.phone ?? "Phone shared on request"}
                  </p>
                </div>
              </div>
            </section>

            <ReviewsList propertyId={property.id} />
          </div>

          {/* Right: dark apply panel */}
          <aside className="lg:col-start-2">
            <div className="relative overflow-hidden rounded-2xl bg-sidebar p-6 text-sidebar-foreground shadow-lg lg:sticky lg:top-20">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(24rem 14rem at 110% -10%, oklch(0.85 0.13 80 / 0.14), transparent 60%)",
                }}
              />
              <div className="relative flex flex-col gap-5">
                <div className="flex items-end justify-between gap-3">
                  <p className="font-display text-3xl font-semibold tabular-nums tracking-tight">
                    ৳{property.price.toLocaleString()}
                    <span className="text-base font-normal text-sidebar-foreground/60">/mo</span>
                  </p>
                  <span className="flex items-center gap-1.5 text-xs text-lamp">
                    <LettingLamp lit={available} className="size-4" />
                    {available ? "Lit" : "Dim"}
                  </span>
                </div>

                <RequestToRentButton
                  propertyId={property.id}
                  isAvailable={property.isAvailable}
                  isTenant={isTenant}
                  isLoggedIn={isLoggedIn}
                  onDark
                />

                <div className="flex items-center gap-3 border-t border-sidebar-foreground/10 pt-4">
                  <span className="h-px flex-1 bg-sidebar-foreground/10" aria-hidden="true" />
                  <UserRound className="size-4 text-sidebar-foreground/50" aria-hidden="true" />
                  <span className="h-px flex-1 bg-sidebar-foreground/10" aria-hidden="true" />
                </div>
                <p className="text-center text-xs leading-5 text-sidebar-foreground/55">
                  Requesting is free. You only pay the first month after the
                  landlord lights your stay.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}