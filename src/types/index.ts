export type Locale = "en" | "ar";

export type PropertyType = "villa" | "apartment" | "duplex" | "penthouse" | "townhouse";

export type SaleCategory = "primary" | "resale";

export interface District {
  id: string;
  name: { en: string; ar: string };
  properties: number;
  avgPrice: number;
  investmentScore: number;
  schools: number;
  hospitals: number;
  transport: { en: string; ar: string };
  shopping: { en: string; ar: string };
  restaurants: string;
  /** WGS84 coordinates — center of the district in Obour City */
  lat: number;
  lng: number;
}

export interface Property {
  id: string;
  slug: string;
  title: { en: string; ar: string };
  district: string;
  type: PropertyType;
  saleCategory: SaleCategory;
  downPaymentPercent?: number;
  installmentYears?: number;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  finishing: { en: string; ar: string };
  delivery: string;
  parking: number;
  garden: boolean;
  roi: number;
  featured: boolean;
  published?: boolean;
  tags: { en: string; ar: string }[];
  images: string[];
  video?: string;
  description: { en: string; ar: string };
  amenities: { en: string; ar: string }[];
  lat: number;
  lng: number;
  agentId: string;
}

export interface Agent {
  id: string;
  name: { en: string; ar: string };
  role: { en: string; ar: string };
  phone: string;
  email: string;
  whatsapp: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: { en: string; ar: string };
  excerpt: { en: string; ar: string };
  category: { en: string; ar: string };
  image: string;
  date: string;
}

export interface Testimonial {
  id: string;
  name: { en: string; ar: string };
  quote: { en: string; ar: string };
  rating: number;
  image: string;
  property: { en: string; ar: string };
}
