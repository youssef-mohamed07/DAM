import type { District } from "@/types";

/** Obour City (El Obour) — WGS84 reference points from OpenStreetMap / Wikimapia */
export const OBOUR_CENTER = { lat: 30.2283, lng: 31.4799 } as const;

export const OBOUR_MAP_BOUNDS: [[number, number], [number, number]] = [
  [30.158, 31.418],
  [30.248, 31.518],
];

export const districts: District[] = [
  {
    id: "first",
    name: { en: "First District", ar: "الحي الأول" },
    properties: 142,
    avgPrice: 8_500_000,
    investmentScore: 88,
    schools: 12,
    hospitals: 4,
    transport: { en: "Metro + Ring Road", ar: "مترو + الطريق الدائري" },
    shopping: { en: "Obour Mall", ar: "مول العبور" },
    restaurants: "45+",
    lat: 30.232,
    lng: 31.442,
  },
  {
    id: "second",
    name: { en: "Second District", ar: "الحي الثاني" },
    properties: 118,
    avgPrice: 7_200_000,
    investmentScore: 85,
    schools: 10,
    hospitals: 3,
    transport: { en: "Ring Road access", ar: "وصول للطريق الدائري" },
    shopping: { en: "Local retail centers", ar: "مراكز تجارية محلية" },
    restaurants: "38+",
    lat: 30.235,
    lng: 31.455,
  },
  {
    id: "third",
    name: { en: "Third District", ar: "الحي الثالث" },
    properties: 96,
    avgPrice: 6_800_000,
    investmentScore: 82,
    schools: 8,
    hospitals: 2,
    transport: { en: "Bus + Ring Road", ar: "أتوبيس + الطريق الدائري" },
    shopping: { en: "Community mall", ar: "مول مجتمعي" },
    restaurants: "30+",
    lat: 30.228,
    lng: 31.465,
  },
  {
    id: "fourth",
    name: { en: "Fourth District", ar: "الحي الرابع" },
    properties: 87,
    avgPrice: 6_100_000,
    investmentScore: 79,
    schools: 7,
    hospitals: 2,
    transport: { en: "Ring Road", ar: "الطريق الدائري" },
    shopping: { en: "Retail strip", ar: "شارع تجاري" },
    restaurants: "28+",
    lat: 30.224,
    lng: 31.478,
  },
  {
    id: "fifth",
    name: { en: "Fifth District", ar: "الحي الخامس" },
    properties: 74,
    avgPrice: 5_900_000,
    investmentScore: 77,
    schools: 6,
    hospitals: 2,
    transport: { en: "Internal road network", ar: "شبكة طرق داخلية" },
    shopping: { en: "Neighborhood markets", ar: "أسواق الحي" },
    restaurants: "22+",
    lat: 30.22,
    lng: 31.448,
  },
  {
    id: "sixth",
    name: { en: "Sixth District", ar: "الحي السادس" },
    properties: 68,
    avgPrice: 5_500_000,
    investmentScore: 75,
    schools: 5,
    hospitals: 1,
    transport: { en: "Ring Road", ar: "الطريق الدائري" },
    shopping: { en: "Shopping centers", ar: "مراكز تسوق" },
    restaurants: "20+",
    lat: 30.215,
    lng: 31.458,
  },
  {
    id: "seventh",
    name: { en: "Seventh District", ar: "الحي السابع" },
    properties: 61,
    avgPrice: 5_200_000,
    investmentScore: 73,
    schools: 5,
    hospitals: 1,
    transport: { en: "Bus lines", ar: "خطوط أتوبيس" },
    shopping: { en: "Local shops", ar: "محلات محلية" },
    restaurants: "18+",
    lat: 30.21,
    lng: 31.468,
  },
  {
    id: "eighth",
    name: { en: "Eighth District", ar: "الحي الثامن" },
    properties: 55,
    avgPrice: 4_900_000,
    investmentScore: 71,
    schools: 4,
    hospitals: 1,
    transport: { en: "Ring Road", ar: "الطريق الدائري" },
    shopping: { en: "Mini malls", ar: "مولات صغيرة" },
    restaurants: "16+",
    lat: 30.205,
    lng: 31.478,
  },
  {
    id: "ninth",
    name: { en: "Ninth District", ar: "الحي التاسع" },
    properties: 49,
    avgPrice: 4_600_000,
    investmentScore: 69,
    schools: 4,
    hospitals: 1,
    transport: { en: "Internal roads", ar: "طرق داخلية" },
    shopping: { en: "Markets", ar: "أسواق" },
    restaurants: "14+",
    lat: 30.2,
    lng: 31.452,
  },
  {
    id: "golf",
    name: { en: "Golf City", ar: "جولف سيتي" },
    properties: 203,
    avgPrice: 12_800_000,
    investmentScore: 96,
    schools: 15,
    hospitals: 5,
    transport: { en: "Premium shuttle + Ring Road", ar: "نقل فاخر + الطريق الدائري" },
    shopping: { en: "Golf Plaza & Carrefour", ar: "جولف بلازا وكارفور" },
    restaurants: "60+",
    lat: 30.1797,
    lng: 31.4797,
  },
  {
    id: "family",
    name: { en: "Family City", ar: "فاميلي سيتي" },
    properties: 176,
    avgPrice: 4_200_000,
    investmentScore: 91,
    schools: 18,
    hospitals: 4,
    transport: { en: "Metro access planned", ar: "وصول مترو مخطط" },
    shopping: { en: "Family Mall", ar: "فاميلي مول" },
    restaurants: "52+",
    lat: 30.188,
    lng: 31.472,
  },
  {
    id: "rock",
    name: { en: "Rock Villa", ar: "روك فيلا" },
    properties: 134,
    avgPrice: 7_200_000,
    investmentScore: 94,
    schools: 8,
    hospitals: 3,
    transport: { en: "Private compound roads", ar: "طرق الكمبوند الخاصة" },
    shopping: { en: "Boutique retail", ar: "تجزئة بوتيك" },
    restaurants: "40+",
    lat: 30.172,
    lng: 31.462,
  },
  {
    id: "new",
    name: { en: "New Obour", ar: "نيو العبور" },
    properties: 221,
    avgPrice: 5_400_000,
    investmentScore: 93,
    schools: 14,
    hospitals: 6,
    transport: { en: "Metro + Ring Road", ar: "مترو + الطريق الدائري" },
    shopping: { en: "New Obour Center", ar: "نيو العبور سنتر" },
    restaurants: "70+",
    lat: 30.218,
    lng: 31.498,
  },
];

export type DistrictGroupId = "premium" | "residential";

export const districtGroups: {
  id: DistrictGroupId;
  label: string;
  description: string;
  districtIds: string[];
}[] = [
  {
    id: "premium",
    label: "مشاريع فاخرة",
    description: "كمباوندات ومشاريع متكاملة",
    districtIds: ["golf", "rock", "new", "family"],
  },
  {
    id: "residential",
    label: "الأحياء السكنية",
    description: "الحي الأول حتى التاسع",
    districtIds: [
      "first",
      "second",
      "third",
      "fourth",
      "fifth",
      "sixth",
      "seventh",
      "eighth",
      "ninth",
    ],
  },
];

export function getDistrictsByGroup(groupId: DistrictGroupId): District[] {
  const group = districtGroups.find((g) => g.id === groupId);
  if (!group) return [];
  return group.districtIds
    .map((id) => districts.find((d) => d.id === id))
    .filter((d): d is District => Boolean(d));
}

export function getDistrictGroup(id: string): DistrictGroupId {
  return ["golf", "rock", "new", "family"].includes(id) ? "premium" : "residential";
}

export type ResidentialZoneId = "north" | "central" | "south";

export const residentialZones: {
  id: ResidentialZoneId;
  label: string;
  subtitle: string;
  districtIds: string[];
}[] = [
  {
    id: "north",
    label: "الشمال",
    subtitle: "الحي ١ — ٣",
    districtIds: ["first", "second", "third"],
  },
  {
    id: "central",
    label: "الوسط",
    subtitle: "الحي ٤ — ٦",
    districtIds: ["fourth", "fifth", "sixth"],
  },
  {
    id: "south",
    label: "الجنوب",
    subtitle: "الحي ٧ — ٩",
    districtIds: ["seventh", "eighth", "ninth"],
  },
];

const districtOrdinal: Record<string, string> = {
  first: "١",
  second: "٢",
  third: "٣",
  fourth: "٤",
  fifth: "٥",
  sixth: "٦",
  seventh: "٧",
  eighth: "٨",
  ninth: "٩",
};

export function getDistrictOrdinal(id: string): string {
  return districtOrdinal[id] ?? "";
}

export function getResidentialZone(id: string): ResidentialZoneId {
  if (["first", "second", "third"].includes(id)) return "north";
  if (["fourth", "fifth", "sixth"].includes(id)) return "central";
  return "south";
}

export function getDistrictsByZone(zoneId: ResidentialZoneId): District[] {
  const zone = residentialZones.find((z) => z.id === zoneId);
  if (!zone) return [];
  return zone.districtIds
    .map((id) => districts.find((d) => d.id === id))
    .filter((d): d is District => Boolean(d));
}

export const premiumDistrictMeta: Record<
  string,
  { badge: string; developer: string; priceFrom: string }
> = {
  golf: {
    badge: "الأيقوني",
    developer: "زغلول هولدينج",
    priceFrom: "6.16 مليون ج.م",
  },
  rock: {
    badge: "جاهز للسكن",
    developer: "روك للتطوير العقاري",
    priceFrom: "4.6 مليون ج.م",
  },
  new: {
    badge: "العبور الجديدة",
    developer: "معمار الأشراف · الفتح جروب",
    priceFrom: "1.6 مليون ج.م",
  },
  family: {
    badge: "عائلي",
    developer: "مجتمعات سكنية متكاملة",
    priceFrom: "2.4 مليون ج.م",
  },
};

export function getDistrictById(id: string): District | undefined {
  return districts.find((d) => d.id === id);
}

export function googleMapsUrl(lat: number, lng: number, label?: string): string {
  const q = label ? encodeURIComponent(label) : `${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function openStreetMapUrl(lat: number, lng: number, zoom = 14): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`;
}
