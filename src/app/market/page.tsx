import type { Metadata } from "next";
import { MarketPageContent } from "@/components/market/MarketPageContent";
import { company } from "@/lib/data/company";

export const metadata: Metadata = {
  title: `السوق | ${company.name}`,
  description: "مؤشرات سوق العبور — أسعار المشاريع، نمو الأسعار، وعائد الإيجار في جولف سيتي وروك فيلا وريفيل.",
};

export default function MarketPage() {
  return <MarketPageContent />;
}
