import { districts } from "@/lib/data/districts";

const ORDINAL_TO_ID: Record<string, string> = {
  اول: "first",
  أول: "first",
  الأول: "first",
  الاول: "first",
  "1": "first",
  ثاني: "second",
  الثاني: "second",
  ثان: "second",
  "2": "second",
  ثالث: "third",
  الثالث: "third",
  "3": "third",
  رابع: "fourth",
  الرابع: "fourth",
  "4": "fourth",
  خامس: "fifth",
  الخامس: "fifth",
  "5": "fifth",
  سادس: "sixth",
  السادس: "sixth",
  "6": "sixth",
  سابع: "seventh",
  السابع: "seventh",
  "7": "seventh",
  ثامن: "eighth",
  الثامن: "eighth",
  "8": "eighth",
  تاسع: "ninth",
  التاسع: "ninth",
  "9": "ninth",
};

const CHAT_RULES: [RegExp, string][] = [
  [/جولف|golf/i, "golf"],
  [/روك|rock/i, "rock"],
  [/فاميلي|family/i, "family"],
  [/ريفيل|reveal/i, "new"],
  [/العبور\s*الجديد/i, "new"],
  [/تجاري|اداري|إداري|commercial/i, "commercial"],
  ...districts.map((d) => [new RegExp(d.name.ar.replace(/\s+/g, "\\s*"), "i"), d.id] as [RegExp, string]),
  ...districts.map((d) => [new RegExp(d.name.en, "i"), d.id] as [RegExp, string]),
];

export function districtFromChatTitle(title: string | null | undefined): string | null {
  if (!title) return null;
  const t = title.trim();

  const districtMatch = t.match(/الحي\s*(?:ال)?(\S+)/i);
  if (districtMatch) {
    const word = districtMatch[1].replace(/[ًٌٍَُِّْ]/g, "");
    const id = ORDINAL_TO_ID[word];
    if (id) return id;
  }

  for (const [re, id] of CHAT_RULES) {
    if (id && re.test(t)) return id;
  }

  return null;
}

export function isResaleChat(title: string | null | undefined): boolean {
  if (!title) return true;
  return /resale|إعادة\s*بيع|اعادة\s*بيع|سوق\s*ثانوي/i.test(title);
}

export function chatLabel(title: string | null | undefined, chatId: string): string {
  return title?.trim() || chatId;
}
