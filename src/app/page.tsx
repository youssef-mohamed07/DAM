import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { FeaturedProperties } from "@/components/home/Sections";
import { ObourMap } from "@/components/home/ObourMap";
import { AboutCompany } from "@/components/home/AboutCompany";
import {
  InvestmentDashboard,
  TestimonialsSection,
  AgentsSection,
  FAQSection,
  ContactCTA,
} from "@/components/home/Sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <FeaturedProperties />
      <ObourMap />
      <AboutCompany />
      <InvestmentDashboard />
      <TestimonialsSection />
      <AgentsSection />
      <FAQSection />
      <ContactCTA />
    </>
  );
}
