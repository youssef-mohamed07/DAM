import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/AboutPageContent";
import { company } from "@/lib/data/company";

export const metadata: Metadata = {
  title: `من نحن | ${company.name}`,
  description: company.about.lead,
};

export default function AboutPage() {
  return <AboutPageContent />;
}
