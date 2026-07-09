import type { Metadata } from "next";
import { DamFamilyPageContent } from "@/components/dam-family/DamFamilyPageContent";
import { company } from "@/lib/data/company";
import { getDamFamilyContent } from "@/lib/i18n/dam-family";

const content = getDamFamilyContent("ar");

export const metadata: Metadata = {
  title: `دام فاميلي | ${company.nameAr}`,
  description: content.lead,
};

export default function DamFamilyPage() {
  return <DamFamilyPageContent />;
}
