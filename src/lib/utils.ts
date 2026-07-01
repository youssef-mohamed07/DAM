import type { PropertyType } from "@/types";
import { getDistrictById } from "@/lib/data/districts";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Arabic-only UI strings */
export function t(obj: { en: string; ar: string }): string {
  return obj.ar;
}

export const PROPERTY_TYPE_AR: Record<PropertyType, string> = {
  villa: "فيلا",
  apartment: "شقة",
  penthouse: "بنتهاوس",
  duplex: "دوبلكس",
  townhouse: "تاون هاوس",
};

export function propertyTypeLabel(type: PropertyType): string {
  return PROPERTY_TYPE_AR[type];
}

export function districtLabel(id: string): string {
  return getDistrictById(id)?.name.ar ?? id;
}

export function deliveryLabel(delivery: string): string {
  const labels: Record<string, string> = {
    Ready: "جاهز للتسليم",
    "Q2 2026": "الربع الثاني 2026",
    "Q4 2025": "الربع الرابع 2025",
  };
  return labels[delivery] ?? delivery;
}

export function yesNo(value: boolean): string {
  return value ? "نعم" : "لا";
}

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** تحويل الأرقام الهندية إلى أرقام إنجليزية */
export function toWesternDigits(value: string | number): string {
  const str = String(value);
  return str.replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)));
}

/** تنسيق رقم بفواصل إنجليزية */
export function formatNumber(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

/** سعر بالجنيه — أرقام إنجليزية */
export function formatPriceEGP(price: number): string {
  return `${formatNumber(price)} ج.م`;
}

/** هاتف دولي للعرض */
export function formatPhoneIntl(phone = "+20 100 865 7085"): string {
  return toWesternDigits(phone);
}

/** هاتف محلي للعرض: 0100 865 7085 */
export function formatPhoneLocal(phone = "01008657085"): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("01")) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return toWesternDigits(phone);
}

/** وقت للعرض */
export function formatTimeRange(start: string, end: string): string {
  return `${toWesternDigits(start)} – ${toWesternDigits(end)}`;
}
