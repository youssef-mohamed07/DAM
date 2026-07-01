import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    slug: "obour-investment-2026",
    title: { en: "Why Obour City Is Egypt's Top Investment in 2026", ar: "لماذا العبور أفضل استثمار في مصر 2026" },
    excerpt: {
      en: "Obour spans 16,000 feddans with 12%+ annual growth. Golf City from EGP 6.16M, Rock Villa ready units, Reveal from EGP 17,000/m².",
      ar: "العبور ١٦,٠٠٠ فدان بنمو +١٢٪ سنوياً. جولف سيتي من ٦.١٦ مليون، روك فيلا جاهز، ريفيل من ١٧ ألف ج.م/م².",
    },
    category: { en: "Investment", ar: "استثمار" },
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    date: "2026-03-15",
  },
  {
    id: "b2",
    slug: "golf-city-lifestyle",
    title: { en: "The Golf City Lifestyle: Beyond the Fairway", ar: "أسلوب حياة جولف سيتي: ما بعد الملعب" },
    excerpt: {
      en: "Zaghloul Holdings' 550-feddan golf community since 1997 — apartments, townhouses, twins up to EGP 18.85M.",
      ar: "مجتمع زغلول هولدينج على ٥٥٠ فدان منذ ١٩٩٧ — شقق وتاون وتوين حتى ١٨.٨٥ مليون.",
    },
    category: { en: "Lifestyle", ar: "أسلوب حياة" },
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    date: "2026-03-08",
  },
  {
    id: "b3",
    slug: "mortgage-guide-egypt",
    title: { en: "Luxury Mortgage Guide for Egyptian Buyers", ar: "دليل التمويل العقاري الفاخر للمشترين المصريين" },
    excerpt: {
      en: "Developer installments vs bank mortgages — 10% down, 5–8 year plans, and legal review tips from DAM.",
      ar: "تقسيط المطور مقابل التمويل البنكي — مقدم ١٠٪، ٥–٨ سنوات، ونصائح قانونية من DAM.",
    },
    category: { en: "Finance", ar: "تمويل" },
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    date: "2026-02-28",
  },
];
