import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact/ContactPageContent";
import { company } from "@/lib/data/company";
import { getPropertyBySlug } from "@/lib/properties/repository";

export const metadata: Metadata = {
  title: `تواصل | ${company.name}`,
  description: "احجز استشارة مجانية مع DAM Properties — معاينات خاصة ومقارنة بين مشاريع العبور.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ property?: string }>;
}) {
  const { property: propertySlug } = await searchParams;
  const property = propertySlug ? await getPropertyBySlug(propertySlug) : undefined;

  return (
    <ContactPageContent
      propertySlug={property?.slug}
      propertyId={property?.id}
      propertyTitle={property?.title}
    />
  );
}
