import { districts } from "@/lib/data/districts";

const PROPERTY_KEYWORDS =
  /عقار|شقة|فيلا|توين|تاون|هاوس|دوبلكس|بنتهاوس|استوديو|كمبوند|متر|غرف|حمام|سعر|مقدم|تقسيط|resale|apartment|villa|townhouse|duplex/i;

const CODE_PATTERNS = [
  /(?:كود(?:\s*الوحدة)?|الكود|code|unit\s*code|رقم\s*الوحدة)\s*[:：\-]?\s*([A-Za-z0-9][A-Za-z0-9\-_/]{1,20})/i,
  /#\s*([A-Za-z]?[0-9]{3,}[A-Za-z0-9\-_/]*)/,
  /\b((?:R|RES|P|U|DAM)[-_]?[0-9]{2,}[A-Za-z0-9\-_/]*)\b/i,
];

const TYPE_MAP: [RegExp, string][] = [
  [/فيلا|villa/i, "villa"],
  [/توين\s*هاوس|twin\s*house/i, "townhouse"],
  [/تاون\s*هاوس|townhouse/i, "townhouse"],
  [/دوبلكس|duplex/i, "duplex"],
  [/بنتهاوس|penthouse/i, "penthouse"],
  [/استوديو|studio/i, "apartment"],
  [/شقة|apartment/i, "apartment"],
];

const DISTRICT_ALIASES: [RegExp, string][] = [
  ...districts.map((d) => [new RegExp(d.name.ar.replace(/\s+/g, "\\s*"), "i"), d.id] as [RegExp, string]),
  [/جولف|golf/i, "golf"],
  [/روك|rock/i, "rock"],
  [/ريفيل|reveal/i, "new"],
  [/العبور\s*الجديد/i, "new"],
  [/تجاري|اداري|commercial/i, "commercial"],
];

export type ParsedListing = {
  listingCode: string | null;
  saleCategory: "primary" | "resale";
  propertyType: string | null;
  district: string | null;
  compound: string | null;
  price: number | null;
  area: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  finishing: string | null;
  delivery: string | null;
  paymentNotes: string | null;
};

export function looksLikeListing(text: string): boolean {
  const t = text.trim();
  if (t.length < 25) return false;
  if (extractListingCode(t)) return true;
  const hasPrice = parsePrice(t) !== null;
  const hasArea = parseArea(t) !== null;
  return PROPERTY_KEYWORDS.test(t) && (hasPrice || hasArea);
}

export function extractListingCode(text: string): string | null {
  for (const re of CODE_PATTERNS) {
    const m = text.match(re);
    if (m?.[1]) return m[1].toUpperCase().replace(/\s+/g, "");
  }
  return null;
}

export function parsePrice(text: string): number | null {
  const million = text.match(
    /(?:السعر|سعر|price|إجمالي|اجمالي)\s*[:：]?\s*([0-9]+(?:[.,][0-9]+)?)\s*(?:مليون|million|m)\b/i,
  );
  if (million) {
    const n = parseFloat(million[1].replace(",", "."));
    if (!Number.isNaN(n)) return Math.round(n * 1_000_000);
  }

  const direct = text.match(
    /(?:السعر|سعر|price|إجمالي|اجمالي)\s*[:：]?\s*([0-9][0-9,.\s]{4,})/i,
  );
  if (direct) {
    const digits = direct[1].replace(/[^\d]/g, "");
    const n = parseInt(digits, 10);
    if (n >= 100_000) return n;
  }

  const loose = text.match(/\b([0-9]{1,2}[.,][0-9])\s*(?:مليون|million)\b/i);
  if (loose) {
    const n = parseFloat(loose[1].replace(",", "."));
    if (!Number.isNaN(n)) return Math.round(n * 1_000_000);
  }

  const egp = text.match(/\b([0-9][0-9,.\s]{6,})\s*(?:ج\.?م|egp|جنيه)/i);
  if (egp) {
    const n = parseInt(egp[1].replace(/[^\d]/g, ""), 10);
    if (n >= 100_000) return n;
  }

  return null;
}

export function parseArea(text: string): number | null {
  const m = text.match(
    /(?:المساحة|مساحة|بمساحة|area|متر|م²|م2)\s*[:：]?\s*([0-9]{2,4}(?:[.,][0-9]+)?)/i,
  );
  if (!m) return null;
  const n = parseFloat(m[1].replace(",", "."));
  return Number.isNaN(n) ? null : Math.round(n);
}

function parseCount(text: string, patterns: RegExp[]): number | null {
  for (const re of patterns) {
    const m = text.match(re);
    if (m?.[1]) {
      const n = parseInt(m[1], 10);
      if (!Number.isNaN(n)) return n;
    }
  }
  return null;
}

export function parseBedrooms(text: string): number | null {
  return parseCount(text, [
    /(?:غرف(?:\s*نوم)?|bedrooms?|br)\s*[:：]?\s*([0-9]+)/i,
    /([0-9]+)\s*(?:غرف(?:\s*نوم)?|bedroom)/i,
  ]);
}

export function parseBathrooms(text: string): number | null {
  return parseCount(text, [
    /(?:حمام(?:ات)?|bathrooms?)\s*[:：]?\s*([0-9]+)/i,
    /([0-9]+)\s*(?:حمام|bathroom)/i,
  ]);
}

function inferPropertyType(text: string): string | null {
  for (const [re, type] of TYPE_MAP) {
    if (re.test(text)) return type;
  }
  return null;
}

function inferDistrict(chatTitle: string | null | undefined, text: string): string | null {
  const hay = `${chatTitle ?? ""}\n${text}`;
  for (const [re, id] of DISTRICT_ALIASES) {
    if (re.test(hay)) return id;
  }
  if (/resale|إعادة\s*بيع|اعادة\s*بيع/i.test(hay)) return null;
  return null;
}

function inferCompound(text: string): string | null {
  const m = text.match(/(?:كمبوند|compound|مشروع|بروجكت)\s*[:：]?\s*([^\n،,.]{3,40})/i);
  return m?.[1]?.trim() ?? null;
}

function inferFinishing(text: string): string | null {
  if (/تشطيب\s*كامل|fully\s*finished|full\s*finish/i.test(text)) return "تشطيب كامل";
  if (/نصف\s*تشطيب|semi\s*finish/i.test(text)) return "نصف تشطيب";
  if (/سوبر\s*لوكس|ultra/i.test(text)) return "سوبر لوكس";
  if (/مش\s*متشطب|بدون\s*تشطيب|core\s*and\s*shell/i.test(text)) return "بدون تشطيب";
  return null;
}

function inferDelivery(text: string): string | null {
  if (/تسليم\s*فوري|جاهز(?:\s*للسكن)?|ready\s*to\s*move|immediate/i.test(text)) return "Ready";
  const q = text.match(/تسليم\s*[:：]?\s*(Q[1-4]\s*20\d{2}|20\d{2})/i);
  if (q) return q[1];
  return null;
}

function inferPaymentNotes(text: string): string | null {
  const parts: string[] = [];
  const down = text.match(/(?:مقدم|down\s*payment)\s*[:：]?\s*([^\n،,.]{2,30})/i);
  if (down) parts.push(`مقدم: ${down[1].trim()}`);
  const inst = text.match(/(?:تقسيط|قسط|installment)\s*[:：]?\s*([^\n،,.]{2,40})/i);
  if (inst) parts.push(`تقسيط: ${inst[1].trim()}`);
  const cash = text.match(/(?:كاش|cash)\s*[:：]?\s*([^\n،,.]{2,30})/i);
  if (cash) parts.push(`كاش: ${cash[1].trim()}`);
  return parts.length ? parts.join(" · ") : null;
}

export function parseListingText(
  text: string,
  opts?: { chatTitle?: string | null; forceResale?: boolean },
): ParsedListing | null {
  const raw = text.trim();
  if (!looksLikeListing(raw)) return null;

  const resale =
    opts?.forceResale ||
    /resale|إعادة\s*بيع|اعادة\s*بيع|سوق\s*ثانوي/i.test(`${opts?.chatTitle ?? ""}\n${raw}`);

  return {
    listingCode: extractListingCode(raw),
    saleCategory: resale ? "resale" : "primary",
    propertyType: inferPropertyType(raw),
    district: inferDistrict(opts?.chatTitle, raw),
    compound: inferCompound(raw),
    price: parsePrice(raw),
    area: parseArea(raw),
    bedrooms: parseBedrooms(raw),
    bathrooms: parseBathrooms(raw),
    finishing: inferFinishing(raw),
    delivery: inferDelivery(raw),
    paymentNotes: inferPaymentNotes(raw),
  };
}

/** Normalize Telegram Desktop export `text` field (string | entity array). */
export function flattenTelegramExportText(text: unknown): string {
  if (typeof text === "string") return text;
  if (!Array.isArray(text)) return "";
  return text
    .map((part) => {
      if (typeof part === "string") return part;
      if (part && typeof part === "object" && "text" in part) {
        return String((part as { text: string }).text);
      }
      return "";
    })
    .join("");
}
