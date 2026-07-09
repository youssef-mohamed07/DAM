import type { Locale, Property, SaleCategory } from "@/types";

export const SALE_CATEGORIES: SaleCategory[] = ["primary", "resale"];

export function saleCategoryLabel(category: SaleCategory, locale: Locale = "ar"): string {
  if (category === "primary") return locale === "en" ? "Primary" : "أولي";
  return locale === "en" ? "Resale" : "إعادة بيع";
}

export function isReadyDelivery(delivery: string): boolean {
  return delivery === "Ready" || delivery.toLowerCase() === "ready";
}

export function formatPaymentPlan(property: Property, locale: Locale = "ar"): string | null {
  if (property.saleCategory === "resale") return null;

  const down = property.downPaymentPercent;
  const years = property.installmentYears;

  if (locale === "en") {
    const parts: string[] = [];
    if (down != null) parts.push(`${down}% down`);
    if (years != null) parts.push(`${years}-year installments`);
    if (isReadyDelivery(property.delivery)) parts.push("immediate delivery");
    else if (property.delivery) parts.push(`delivery ${property.delivery}`);
    return parts.length ? parts.join(" · ") : "Installment plan";
  }

  const parts: string[] = [];
  if (down != null) parts.push(`مقدم ${down}%`);
  if (years != null) parts.push(`تقسيط ${years} سنوات`);
  if (isReadyDelivery(property.delivery)) parts.push("تسليم فوري");
  else if (property.delivery) parts.push(`تسليم ${property.delivery}`);
  return parts.length ? parts.join(" · ") : "قسط على أقساط";
}
