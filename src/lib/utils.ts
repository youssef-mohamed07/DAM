import type { PropertyType, Locale } from "@/types";
import { getDistrictById } from "@/lib/data/districts";
import { getDictionary } from "@/lib/i18n/dictionary";
import { translate, type Bilingual } from "@/lib/i18n/translate";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Bilingual field — pass locale when outside React (server components). */
export function t(obj: Bilingual, locale: Locale = "ar"): string {
  return translate(obj, locale);
}

export const PROPERTY_TYPE_AR: Record<PropertyType, string> = {
  villa: "فيلا",
  apartment: "شقة",
  penthouse: "بنتهاوس",
  duplex: "دوبلكس",
  townhouse: "تاون هاوس",
};

export function propertyTypeLabel(type: PropertyType, locale: Locale = "ar"): string {
  return getDictionary(locale).propertyTypes[type];
}

export function districtLabel(id: string, locale: Locale = "ar"): string {
  const district = getDistrictById(id);
  if (!district) return id;
  return translate(district.name, locale);
}

export function deliveryLabel(delivery: string, locale: Locale = "ar"): string {
  const dict = getDictionary(locale).delivery as Record<string, string>;
  return dict[delivery] ?? delivery;
}

export function yesNo(value: boolean, locale: Locale = "ar"): string {
  const dict = getDictionary(locale);
  return value ? dict.yes : dict.no;
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

/** سعر — أرقام إنجليزية */
export function formatPriceEGP(price: number, locale: Locale = "ar"): string {
  const dict = getDictionary(locale);
  return `${formatNumber(price)} ${dict.currency}`;
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
