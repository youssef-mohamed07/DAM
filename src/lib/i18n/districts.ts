import type { Locale } from "@/types";

const premiumMeta = {
  ar: {
    golf: { badge: "الأيقوني", developer: "زغلول هولدينج", priceFrom: "6.16 مليون ج.م" },
    rock: { badge: "جاهز للسكن", developer: "روك للتطوير العقاري", priceFrom: "4.6 مليون ج.م" },
    new: { badge: "العبور الجديدة", developer: "معمار الأشراف · الفتح جروب", priceFrom: "1.6 مليون ج.م" },
    family: { badge: "عائلي", developer: "مجتمعات سكنية متكاملة", priceFrom: "2.4 مليون ج.م" },
  },
  en: {
    golf: { badge: "Iconic", developer: "Zaghloul Holding", priceFrom: "EGP 6.16M" },
    rock: { badge: "Move-in ready", developer: "Rock Developments", priceFrom: "EGP 4.6M" },
    new: { badge: "New Obour", developer: "Maamar Al Ashraf · Al Fath", priceFrom: "EGP 1.6M" },
    family: { badge: "Family", developer: "Integrated communities", priceFrom: "EGP 2.4M" },
  },
} as const;

export function getPremiumDistrictMeta(locale: Locale) {
  return premiumMeta[locale];
}
