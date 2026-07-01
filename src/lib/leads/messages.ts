import type { Lead } from "@/types/leads";
import type { SalesRep } from "@/lib/data/sales";
import { company } from "@/lib/data/company";
import { normalizeWhatsAppPhone, whatsappLink as waLink } from "@/lib/leads/whatsapp";

export function whatsappLink(phone: string, message: string) {
  return waLink(phone, message);
}

export function buildSalesAssignmentMessage(lead: Lead, rep: SalesRep) {
  const lines = [
    `مرحباً ${rep.name}،`,
    "",
    "🔔 *عميل جديد — DAM Properties*",
    "",
  ];

  if (lead.propertyTitle) {
    lines.push(`*العقار:* ${lead.propertyTitle}`);
    lines.push("");
  }

  if (lead.clientName) lines.push(`*الاسم:* ${lead.clientName}`);
  if (lead.clientPhone) lines.push(`*الهاتف:* ${lead.clientPhone}`);
  if (lead.clientEmail) lines.push(`*البريد:* ${lead.clientEmail}`);
  if (lead.goal) lines.push(`*الهدف:* ${lead.goal}`);
  if (lead.propertyType) lines.push(`*النوع:* ${lead.propertyType}`);
  if (lead.budget) lines.push(`*الميزانية:* ${lead.budget}`);
  if (lead.district) lines.push(`*المنطقة المطلوبة:* ${lead.district}`);

  if (lead.message) {
    lines.push("", `*رسالة العميل:*`, lead.message);
  }

  if (lead.propertySlug) {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    lines.push("", `*رابط العقار:*`, `${base}/properties/${lead.propertySlug}`);
  }

  lines.push("", `— ${company.nameAr}`);

  return lines.join("\n");
}

export function buildClientToSalesMessage(
  lead: Partial<Lead> & { propertyTitle?: string; clientName?: string; clientPhone?: string },
  repName?: string,
) {
  const lines = [
    `مرحباً${repName ? ` ${repName}` : ""}،`,
    "",
    `أنا *${lead.clientName || "عميل"}* ومهتم بالعقار التالي:`,
    "",
  ];
  if (lead.propertyTitle) lines.push(`📍 *${lead.propertyTitle}*`);
  if (lead.clientPhone) lines.push(`📱 *رقمي:* ${lead.clientPhone}`);
  if (lead.message) lines.push("", lead.message);
  lines.push("", "أرجو التواصل معي في أقرب وقت. شكراً!");
  return lines.join("\n");
}

export function buildClientWhatsAppMessage(lead: Partial<Lead> & { propertyTitle?: string; clientName?: string }) {
  const name = lead.clientName ? ` أنا ${lead.clientName}` : "";
  if (lead.propertyTitle) {
    return `مرحباً DAM Properties،${name} أريد الاستفسار عن ${lead.propertyTitle}`;
  }
  return `مرحباً DAM Properties،${name} أريد استشارة عقارية`;
}
