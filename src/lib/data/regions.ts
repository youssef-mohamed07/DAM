/** مناطق العمل — أسواق DAM */

export type MarketRegion = {
  id: string;
  name: { en: string; ar: string };
};

export const marketRegions: MarketRegion[] = [
  { id: "obour", name: { en: "Obour", ar: "العبور" } },
  { id: "new-obour", name: { en: "New Obour", ar: "العبور الجديدة" } },
  { id: "new-cairo", name: { en: "New Cairo", ar: "القاهرة الجديدة" } },
  { id: "october", name: { en: "6th of October", ar: "أكتوبر" } },
  { id: "zayed", name: { en: "Sheikh Zayed", ar: "الشيخ زايد" } },
  { id: "shorouk", name: { en: "Shorouk", ar: "الشروق" } },
  { id: "badr", name: { en: "Badr", ar: "بدر" } },
  { id: "north-coast", name: { en: "North Coast", ar: "الساحل الشمالي" } },
  { id: "sokhna", name: { en: "Ain Sokhna", ar: "العين السخنة" } },
];

export function getMarketRegion(id: string) {
  return marketRegions.find((r) => r.id === id);
}
