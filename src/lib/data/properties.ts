import type { Property } from "@/types";
import { districts } from "./districts";
import { IMAGES } from "@/lib/images";

export const properties: Property[] = [
  {
    id: "p1",
    slug: "golf-twin-golf-view",
    title: { en: "Golf City Twin House Golf View", ar: "توين هاوس فيو جولف — جولف سيتي" },
    district: "golf",
    type: "townhouse",
    saleCategory: "primary",
    downPaymentPercent: 10,
    installmentYears: 6,
    price: 18_850_000,
    area: 290,
    bedrooms: 4,
    bathrooms: 4,
    finishing: { en: "Semi-Finished", ar: "نصف تشطيب" },
    delivery: "Ready",
    parking: 2,
    garden: true,
    roi: 11.5,
    featured: true,
    tags: [
      { en: "Golf View", ar: "إطلالة جولف" },
      { en: "Zaghloul Holdings", ar: "زغلول هولدينج" },
    ],
    images: [IMAGES.villa1, IMAGES.pool, IMAGES.interior2],
    description: {
      en: "Twin house with 290 m² built-up area and 210 m² private garden overlooking Golf City fairways. Developed by Zaghloul Holdings — Egypt's landmark golf community since 1997.",
      ar: "توين هاوس ٢٩٠ م² بحديقة ٢١٠ م² وإطلالة على ملاعب جولف سيتي. مشروع زغلول هولدينج — أول مجتمع جولف في العبور على ٥٥٠ فدان. مقدم ١٠٪ وتقسيط ٦ سنوات.",
    },
    amenities: [
      { en: "Golf Course View", ar: "إطلالة ملعب جولف" },
      { en: "Private Garden", ar: "حديقة خاصة" },
      { en: "Golf Plaza & Carrefour", ar: "جولف بلازا وكارفور" },
      { en: "24/7 Security", ar: "أمن 24/7" },
    ],
    lat: 30.183,
    lng: 31.472,
    agentId: "a3",
  },
  {
    id: "p2",
    slug: "rock-villa-townhouse",
    title: { en: "Rock Villa Townhouse", ar: "تاون هاوس روك فيلا" },
    district: "rock",
    type: "townhouse",
    saleCategory: "primary",
    downPaymentPercent: 10,
    installmentYears: 8,
    price: 5_600_000,
    area: 255,
    bedrooms: 4,
    bathrooms: 3,
    finishing: { en: "Fully Finished", ar: "تشطيب كامل" },
    delivery: "Ready",
    parking: 2,
    garden: true,
    roi: 9.2,
    featured: true,
    tags: [
      { en: "Ready to Move", ar: "جاهز للسكن" },
      { en: "Rock Developments", ar: "روك للتطوير" },
    ],
    images: [IMAGES.pool, IMAGES.villa4, IMAGES.modern],
    description: {
      en: "Asian-inspired townhouse in Rock Villa compound — 101 ready villas on 50,000 m² in Obour's Fifth District. Minutes from Carrefour Obour and Golf City Mall.",
      ar: "تاون هاوس ٢٥٥ م² في روك فيلا — ١٠١ فيلا جاهزة بتصميم آسيوي على ٥٠,٠٠٠ م² بالحي الخامس. دقائق من كارفور العبور ومول جولف سيتي. تقسيط حتى ٨ سنوات.",
    },
    amenities: [
      { en: "Landscaped Compound", ar: "كمبوند منسق" },
      { en: "Commercial Area", ar: "منطقة تجارية" },
      { en: "Ready Delivery", ar: "تسليم فوري" },
      { en: "Asian Architecture", ar: "طراز آسيوي" },
    ],
    lat: 30.178,
    lng: 31.468,
    agentId: "a1",
  },
  {
    id: "p3",
    slug: "reveal-obour-apartment",
    title: { en: "Reveal Obour Apartment", ar: "شقة ريفيل العبور" },
    district: "new",
    type: "apartment",
    saleCategory: "primary",
    downPaymentPercent: 15,
    installmentYears: 5,
    price: 5_387_559,
    area: 177,
    bedrooms: 3,
    bathrooms: 2,
    finishing: { en: "Semi-Finished", ar: "نصف تشطيب" },
    delivery: "Q4 2028",
    parking: 1,
    garden: false,
    roi: 12.8,
    featured: true,
    tags: [
      { en: "Al Ashraaf", ar: "معمار الأشراف" },
      { en: "New Launch", ar: "إطلاق جديد" },
    ],
    images: [IMAGES.penthouse, IMAGES.apartment, IMAGES.interior1],
    description: {
      en: "177 m² apartment in Reveal Obour by Al Ashraaf Developments — 19-feddan compound with international-standard amenities. From EGP 17,000/m² with 15% down payment.",
      ar: "شقة ١٧٧ م² في كمبوند ريفيل العبور من معمار الأشراف — ١٩ فدان بمواصفات عالمية. سعر المتر من ١٧,٠٠٠ ج.م · مقدم ١٥٪ وتقسيط ٥ سنوات.",
    },
    amenities: [
      { en: "Swimming Pools", ar: "مسابح" },
      { en: "Club House", ar: "نادي اجتماعي" },
      { en: "Green Spaces", ar: "مساحات خضراء" },
      { en: "Flexible Payment", ar: "سداد مرن" },
    ],
    lat: 30.218,
    lng: 31.498,
    agentId: "a2",
  },
  {
    id: "p4",
    slug: "golf-apartment-220",
    title: { en: "Golf City 220m² Apartment", ar: "شقة ٢٢٠ م² جولف سيتي" },
    district: "golf",
    type: "apartment",
    saleCategory: "primary",
    downPaymentPercent: 10,
    installmentYears: 6,
    price: 6_160_000,
    area: 220,
    bedrooms: 4,
    bathrooms: 3,
    finishing: { en: "Semi-Finished", ar: "نصف تشطيب" },
    delivery: "Ready",
    parking: 2,
    garden: false,
    roi: 10.8,
    featured: true,
    tags: [{ en: "Golf City", ar: "جولف سيتي" }],
    images: [IMAGES.villa3, IMAGES.modern, IMAGES.interior1],
    description: {
      en: "220 m² apartment with 4 bedrooms in Golf City — starting price tier for Zaghloul Holdings' flagship Obour compound. 10% down, 6-year installment plan.",
      ar: "شقة ٢٢٠ م² بـ ٤ غرف في جولف سيتي — من فئات الأسعار الابتدائية لمشروع زغلول هولدينج. مقدم ١٠٪ وتقسيط ٦ سنوات · قسط ربع سنوي ٢٣١,٠٠٠ ج.م.",
    },
    amenities: [
      { en: "Golf Community", ar: "مجتمع جولف" },
      { en: "Retail & Dining", ar: "تجزئة ومطاعم" },
      { en: "Ring Road Access", ar: "وصول للطريق الدائري" },
    ],
    lat: 30.181,
    lng: 31.470,
    agentId: "a3",
  },
  {
    id: "p5",
    slug: "jazeel-residence-2br",
    title: { en: "Jazeel Residence 2BR", ar: "شقة جزيل ريزيدنس — غرفتين" },
    district: "new",
    type: "apartment",
    saleCategory: "primary",
    downPaymentPercent: 10,
    installmentYears: 8,
    price: 2_440_000,
    area: 120,
    bedrooms: 2,
    bathrooms: 2,
    finishing: { en: "Core & Shell", ar: "مشطب" },
    delivery: "Q2 2027",
    parking: 1,
    garden: false,
    roi: 13.5,
    featured: false,
    tags: [{ en: "El Fath Group", ar: "الفتح جروب" }],
    images: [IMAGES.apartment, IMAGES.interior1, IMAGES.interior2],
    description: {
      en: "2-bedroom unit in Jazeel Residence New Obour by El Fath Group — 7 feddans on Middle Ring Road. EGP 20,900/m² with 10% down and up to 8-year installments.",
      ar: "وحدة غرفتين في جزيل ريزيدنس العبور الجديدة من الفتح جروب — ٧ أفدنة على الطريق الدائري الأوسطي. سعر المتر ٢٠,٩٠٠ ج.م · مقدم ١٠٪ وتقسيط ٨ سنوات.",
    },
    amenities: [
      { en: "Ring Road Front", ar: "واجهة الطريق الدائري" },
      { en: "Landscaping", ar: "مساحات خضراء" },
      { en: "10% Down Payment", ar: "مقدم ١٠٪" },
    ],
    lat: 30.215,
    lng: 31.492,
    agentId: "a2",
  },
  {
    id: "p6",
    slug: "golf-townhouse-corner",
    title: { en: "Golf City Corner Townhouse", ar: "تاون هاوس كورنر جولف سيتي" },
    district: "golf",
    type: "townhouse",
    saleCategory: "primary",
    downPaymentPercent: 10,
    installmentYears: 6,
    price: 16_165_000,
    area: 285,
    bedrooms: 4,
    bathrooms: 4,
    finishing: { en: "Semi-Finished", ar: "نصف تشطيب" },
    delivery: "Ready",
    parking: 2,
    garden: true,
    roi: 11.0,
    featured: true,
    tags: [
      { en: "Corner Unit", ar: "وحدة كورنر" },
      { en: "Ready", ar: "استلام فوري" },
    ],
    images: [IMAGES.villa3, IMAGES.villa2, IMAGES.pool],
    description: {
      en: "Corner townhouse 285 m² with lake and garden in Golf City — ready for immediate handover. 10% down, 6-year installments (~EGP 179,611/month).",
      ar: "تاون هاوس كورنر ٢٨٥ م² ببحيرة وحديقة في جولف سيتي — استلام فوري. مقدم ١٠٪ وتقسيط ٦ سنوات · قسط شهري نحو ١٧٩,٦١١ ج.م.",
    },
    amenities: [
      { en: "Lake View", ar: "إطلالة بحيرة" },
      { en: "Corner Garden", ar: "حديقة كورنر" },
      { en: "Immediate Delivery", ar: "تسليم فوري" },
    ],
    lat: 30.182,
    lng: 31.471,
    agentId: "a3",
  },
  {
    id: "p7",
    slug: "first-district-metro-apartment",
    title: { en: "First District Metro Apartment", ar: "شقة الحي الأول — قرب المترو" },
    district: "first",
    type: "apartment",
    saleCategory: "resale",
    price: 4_800_000,
    area: 155,
    bedrooms: 3,
    bathrooms: 2,
    finishing: { en: "Fully Finished", ar: "تشطيب كامل" },
    delivery: "Ready",
    parking: 1,
    garden: false,
    roi: 9.5,
    featured: false,
    tags: [{ en: "Metro Access", ar: "قرب مترو العبور" }],
    images: [IMAGES.apartment, IMAGES.interior1, IMAGES.interior2],
    description: {
      en: "Fully finished 3-bedroom apartment in Obour First District — walking distance to metro and Obour Mall. Ideal for families seeking urban connectivity.",
      ar: "شقة ٣ غرف تشطيب كامل في الحي الأول — قرب مترو العبور ومول العبور. مناسبة للعائلات الباحثة عن مواصلات سريعة للقاهرة الجديدة.",
    },
    amenities: [
      { en: "Metro Nearby", ar: "قرب المترو" },
      { en: "Obour Mall", ar: "مول العبور" },
      { en: "Fully Finished", ar: "تشطيب كامل" },
    ],
    lat: 30.232,
    lng: 31.442,
    agentId: "a1",
  },
  {
    id: "p8",
    slug: "rock-villa-553",
    title: { en: "Rock Villa Signature 553m²", ar: "فيلا روك فيلا ٥٥٣ م²" },
    district: "rock",
    type: "villa",
    saleCategory: "resale",
    price: 12_500_000,
    area: 553,
    bedrooms: 6,
    bathrooms: 6,
    finishing: { en: "Bespoke", ar: "تشطيب مخصص" },
    delivery: "Ready",
    parking: 4,
    garden: true,
    roi: 8.8,
    featured: true,
    tags: [
      { en: "Standalone Villa", ar: "فيلا مستقلة" },
      { en: "Largest Layout", ar: "أكبر مساحة" },
    ],
    images: [IMAGES.villa1, IMAGES.villa4, IMAGES.modern],
    description: {
      en: "Largest villa layout in Rock Villa compound — up to 553 m² with private garden. One of 101 Asian-inspired villas ready for immediate occupancy.",
      ar: "أكبر مساحة فيلا في روك فيلا — ٥٥٣ م² بحديقة خاصة. من بين ١٠١ فيلا جاهزة بتصميم آسيوي فريد في قلب الحي الخامس.",
    },
    amenities: [
      { en: "Private Garden", ar: "حديقة خاصة" },
      { en: "Staff Quarters", ar: "غرف خدم" },
      { en: "Home Cinema Ready", ar: "جاهزة لسينما منزلية" },
    ],
    lat: 30.172,
    lng: 31.462,
    agentId: "a1",
  },
];

export function getPropertyBySlug(slug: string) {
  return properties.find((p) => p.slug === slug);
}

export function formatPrice(price: number) {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price)} ج.م`;
}

export function searchProperties(
  query: {
    text?: string;
    district?: string;
    type?: string;
    saleCategory?: string;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    bedrooms?: number;
    bathrooms?: number;
  },
  list?: Property[],
) {
  let results = [...(list ?? properties)];

  if (query.saleCategory) {
    results = results.filter((p) => p.saleCategory === query.saleCategory);
  }
  if (query.district) {
    results = results.filter((p) => p.district === query.district);
  }
  if (query.type) {
    results = results.filter((p) => p.type === query.type);
  }
  if (query.minPrice) {
    results = results.filter((p) => p.price >= query.minPrice!);
  }
  if (query.maxPrice) {
    results = results.filter((p) => p.price <= query.maxPrice!);
  }
  if (query.minArea) {
    results = results.filter((p) => p.area >= query.minArea!);
  }
  if (query.bedrooms) {
    results = results.filter((p) => p.bedrooms >= query.bedrooms!);
  }
  if (query.bathrooms) {
    results = results.filter((p) => p.bathrooms >= query.bathrooms!);
  }

  if (query.text) {
    const t = query.text.toLowerCase();
    const villaMatch = t.includes("villa") || t.includes("فيلا");
    const aptMatch = t.includes("apartment") || t.includes("شقة");
    const golfMatch = t.includes("golf");
    const underMatch = t.match(/under\s+(\d+)\s*million|أقل من\s+(\d+)/i);
    const inMatch = t.match(/in\s+([\w\s]+)|في\s+([\w\s\u0600-\u06FF]+)/i);

    if (villaMatch) results = results.filter((p) => p.type === "villa");
    if (aptMatch) results = results.filter((p) => p.type === "apartment");
    if (golfMatch) results = results.filter((p) => p.district === "golf");

    if (underMatch) {
      const millions = Number(underMatch[1] || underMatch[2]);
      if (millions) results = results.filter((p) => p.price <= millions * 1_000_000);
    }

    if (inMatch) {
      const loc = (inMatch[1] || inMatch[2] || "").toLowerCase().trim();
      const district = districts.find(
        (d) =>
          d.name.en.toLowerCase().includes(loc) ||
          d.id.includes(loc.replace(/\s/g, "")),
      );
      if (district) results = results.filter((p) => p.district === district.id);
    }
  }

  return results;
}
