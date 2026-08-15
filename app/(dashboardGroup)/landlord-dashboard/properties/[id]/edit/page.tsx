import { notFound } from "next/navigation";
import { getCategories } from "@/app/(publicGroup)/properties/_actions/getCategories";
import { getUser } from "@/service/getUser";
import { getLandlordProperties } from "../../../_actions/getLandlordProperties";
import { PageHeader } from "../../../../_components/PageHeader";
import { PropertyForm } from "../../../_components/PropertyForm";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  const landlordId = user.data?.id as string;

  const [properties, categoriesRes] = await Promise.all([
    getLandlordProperties(landlordId),
    getCategories(),
  ]);

  const property = properties.find((p) => p.id === id);

  if (!property) {
    notFound();
  }

  return (
    <main className="flex w-full max-w-4xl flex-col gap-6">
      <PageHeader
        eyebrow="Your board"
        title="Edit property"
        description="Update the listing details — changes go live the moment you save."
      />
      <PropertyForm categories={categoriesRes.data} property={property} />
    </main>
  );
}
