import type { Metadata } from "next";
import { DistrictsPageContent } from "@/components/districts/DistrictsPageContent";
import { company } from "@/lib/data/company";

export const metadata: Metadata = {
  title: `الأحياء | ${company.name}`,
  description: "استكشف أحياء مدينة العبور والكمبوندات الفاخرة — جولف سيتي، روك فيلا، والعبور الجديدة.",
};

export default function DistrictsPage() {
  return <DistrictsPageContent />;
}
