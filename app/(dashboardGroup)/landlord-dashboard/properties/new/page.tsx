import { getCategories } from "@/app/(publicGroup)/properties/_actions/getCategories";
import { PageHeader } from "../../../_components/PageHeader";
import { PropertyForm } from "../../_components/PropertyForm";

export default async function NewPropertyPage() {
  const { data: categories } = await getCategories();

  return (
    <main className="flex w-full max-w-4xl flex-col gap-6">
      <PageHeader
        eyebrow="Your board"
        title="Add a property"
        description="Write a listing that makes your place easy to picture — tenants decide from this card."
      />
      <PropertyForm categories={categories} />
    </main>
  );
}
