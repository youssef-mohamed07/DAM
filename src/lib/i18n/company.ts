import type { Locale } from "@/types";
import { company } from "@/lib/data/company";

export function getCompanyContent(locale: Locale) {
  if (locale === "ar") {
    return {
      name: company.nameAr,
      tagline: company.tagline,
      hero: company.hero,
      about: company.about,
      stats: company.stats,
      heroStats: company.heroStats,
      marketStats: company.marketStats,
      projects: company.projects,
      obourFacts: company.obourFacts,
      services: company.services,
      consultationAreas: company.consultationAreas,
      address: company.address,
      addressDetail: company.addressDetail,
      hours: company.hours,
      hoursFriday: company.hoursFriday,
    };
  }

  return {
    name: company.name,
    tagline: "Trusted brokerage for residential and commercial real estate",
    hero: {
      eyebrow: "Obour · Cairo · Egypt",
      title: "Trusted Real Estate Brokerage",
      highlight: "in Obour City",
    },
    about: {
      headline: "About us",
      lead: "A trusted real estate brokerage specializing in residential and commercial sales — with a strong focus on Obour City and New Obour.",
      facebookBio: company.about.facebookBio,
      paragraphs: [
        "DAM Properties is an Egyptian real estate brokerage connecting clients with the best opportunities in Obour City — from nine residential districts to premium compounds such as Golf City, Rock Villa, and New Obour projects.",
        "Obour City was established by cabinet decree in 1981 on about 16,000 feddans. Today it is one of Egypt's fastest-growing suburbs — close to New Cairo, Fifth Settlement, and Madinaty, linked by the Ring Road, June 30 Axis, and Obour Metro.",
        "We offer free consultation, project comparison, financing coordination, and legal support — whether you're looking for a home, villa, commercial unit, or investment in Obour.",
      ],
    },
    stats: [
      { value: "+350", label: "Closed deals", sub: "Since 2016" },
      { value: "13", label: "Areas", sub: "In Obour" },
      { value: "+12", label: "Partner projects", sub: "Compounds & malls" },
      { value: "97%", label: "Client satisfaction", sub: "2025 reviews" },
    ],
    heroStats: [
      { value: "550", label: "feddans", sub: "Golf City" },
      { value: "101", label: "villas", sub: "Rock Villa ready" },
      { value: "17,000", label: "EGP/m²", sub: "Reveal Obour from" },
      { value: "10%", label: "down payment", sub: "Flexible plans" },
    ],
    marketStats: [
      { label: "Price/m² — Golf City", val: "28,000", sub: "Apartments from 6.16M" },
      { label: "Obour price growth", val: "+12%", sub: "2024–2026" },
      { label: "Highest demand", val: "Golf City", sub: "Villas & twin houses" },
      { label: "Rental yield", val: "7–9%", sub: "Ready units" },
    ],
    projects: [
      {
        id: "golf",
        name: "Golf City Obour",
        developer: "Zaghloul Holding / Zaghloul Group",
        area: "550 feddans",
        priceFrom: "EGP 6,160,000",
        units: "Apartments · Town · Twin · Villas",
        payment: "5–10% down · 5–7 year installments",
        highlight: "First golf community in Obour — est. 1997",
      },
      {
        id: "rock",
        name: "Rock Villa Obour",
        developer: "Rock Developments",
        area: "50,000 m²",
        priceFrom: "EGP 4,600,000",
        units: "101 Asian-style villas",
        payment: "Up to 8-year installments",
        highlight: "Move-in ready — Fifth District",
      },
      {
        id: "reveal",
        name: "Reveal Obour",
        developer: "Maamar Al Ashraf",
        area: "19 feddans",
        priceFrom: "EGP 1,625,000",
        units: "Apartments from 60 m²",
        payment: "15% down · 5 years",
        highlight: "From EGP 17,000/m²",
      },
      {
        id: "jazeel",
        name: "Jazeel Residence",
        developer: "Al Fath Group",
        area: "7 feddans",
        priceFrom: "EGP 2,440,000",
        units: "Residential apartments",
        payment: "10% down · 8 years",
        highlight: "From EGP 20,900/m²",
      },
    ],
    obourFacts: [
      { title: "Location", text: "Northeast Cairo — on the Ring Road near Fifth Settlement and Madinaty" },
      { title: "Area", text: "About 16,000 feddans — 9 residential districts + premium projects" },
      { title: "Transport", text: "Obour Metro · Ring Road · June 30 Axis" },
      { title: "Amenities", text: "Carrefour · Golf Plaza · Obour International Club · Obour Specialty Hospital" },
      { title: "Education", text: "Obour Academy · Egypt University · international schools" },
      { title: "Investment", text: "Growing demand for ready compounds and metro-adjacent units" },
    ],
    services: [
      {
        title: "Verified properties",
        desc: "Title deed, reconciliation, and inspection review before any listing — especially ready compounds like Rock Villa and Golf City.",
      },
      {
        title: "Project comparison",
        desc: "We compare Golf City, Reveal, Jazeel, and more by price per m², payment plans, and delivery.",
      },
      {
        title: "Finance & legal",
        desc: "Coordination with Egyptian banks for mortgage plans and review of sale/reservation contracts.",
      },
      {
        title: "Concierge service",
        desc: "Private viewings, video tours, negotiation support, and post-contract follow-up.",
      },
    ],
    consultationAreas: [
      { id: "golf", title: "Golf City", desc: "Villas & twin houses — from 5% down, up to 7 years." },
      { id: "rock", title: "Rock Villa", desc: "101 move-in ready villas in Fifth District." },
      { id: "new-obour", title: "Reveal & Jazeel", desc: "Apartments from EGP 1.6M in New Obour." },
      { id: "finance", title: "Finance & legal", desc: "Bank financing and contract review." },
    ],
    address: "Fifth District, Obour City, Qalyubia",
    addressDetail: "Minutes from Obour Carrefour and Golf City Mall",
    hours: "Sun – Thu: 10:00 – 19:00",
    hoursFriday: "Fri: 12:00 – 17:00",
  };
}

export type CompanyContent = ReturnType<typeof getCompanyContent>;
