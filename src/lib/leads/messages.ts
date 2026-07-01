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

export function buildClientWhatsAppMessage(lead: Partial<Lead> & { propertyTitle?: string }) {
  if (lead.propertyTitle) {
    return `مرحباً DAM Properties، أريد الاستفسار عن ${lead.propertyTitle}`;
  }
  return "مرحباً DAM Properties، أريد استشارة عقارية";
}
