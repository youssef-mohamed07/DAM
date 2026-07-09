import type { Locale } from "@/types";

export type Bilingual = { ar: string; en: string };

export function translate(obj: Bilingual, locale: Locale): string {
  return locale === "en" ? obj.en : obj.ar;
}
