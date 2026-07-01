import type { Lead } from "@/types/leads";
import type { SalesRep } from "@/lib/data/sales";
import { company } from "@/lib/data/company";
import { buildSalesAssignmentMessage } from "@/lib/leads/messages";

/** تحويل رقم مصري محلي (01…) إلى صيغة واتساب دولية (20…) */
export function normalizeWhatsAppPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("20")) return digits;
  if (digits.startsWith("0")) return `20${digits.slice(1)}`;
  if (digits.length === 10) return `20${digits}`;
  return digits;
}

export function whatsappLink(phone: string, message: string) {
  return `https://wa.me/${normalizeWhatsAppPhone(phone)}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(phone: string, message: string) {
  window.open(whatsappLink(phone, message), "_blank", "noopener,noreferrer");
}

/** فتح عدة محادثات بالتتابع (واتساب مجاني — بدون API) */
export function openWhatsAppQueue(
  items: { phone: string; message: string }[],
  delayMs = 1500,
  onProgress?: (index: number, total: number) => void,
) {
  items.forEach((item, i) => {
    setTimeout(() => {
      openWhatsApp(item.phone, item.message);
      onProgress?.(i + 1, items.length);
    }, i * delayMs);
  });
}

export type WhatsAppTemplate = "assign_sales" | "client_greeting" | "client_followup" | "client_property";

export function buildClientGreetingMessage(lead: Lead) {
  const name = lead.clientName ? ` ${lead.clientName}` : "";
  if (lead.propertyTitle) {
    return `مرحباً${name}، معك فريق ${company.nameAr} 👋\n\nشكراً لاهتمامك بـ *${lead.propertyTitle}*. كيف يمكننا مساعدتك؟`;
  }
  return `مرحباً${name}، معك فريق ${company.nameAr} 👋\n\nشكراً لتواصلك معنا. كيف يمكننا مساعدتك في العثور على عقار مناسب في العبور؟`;
}

export function buildClientFollowUpMessage(lead: Lead) {
  const name = lead.clientName ? lead.clientName : "حضرتك";
  const property = lead.propertyTitle ? ` بخصوص *${lead.propertyTitle}*` : "";
  return `مرحباً ${name}،\n\nنود متابعة استفسارك${property}.\nهل ما زلت مهتماً؟ يسعدنا ترتيب معاينة أو إرسال تفاصيل إضافية.\n\n— ${company.nameAr}`;
}

export function buildMessage(
  template: WhatsAppTemplate,
  lead: Lead,
  rep?: SalesRep,
): string {
  switch (template) {
    case "assign_sales":
      if (!rep) throw new Error("مندوب مطلوب");
      return buildSalesAssignmentMessage(lead, rep);
    case "client_greeting":
      return buildClientGreetingMessage(lead);
    case "client_followup":
      return buildClientFollowUpMessage(lead);
    case "client_property":
      return lead.propertyTitle
        ? `مرحباً DAM Properties، أريد الاستفسار عن ${lead.propertyTitle}`
        : buildClientGreetingMessage(lead);
    default:
      return buildClientGreetingMessage(lead);
  }
}

export const templateLabels: Record<WhatsAppTemplate, string> = {
  assign_sales: "إرسال للمندوب",
  client_greeting: "ترحيب بالعميل",
  client_followup: "متابعة العميل",
  client_property: "استفسار العقار",
};

/** توزيع تلقائي: حسب agentId العقار ثم round-robin */
export function pickRepForLead(
  lead: Lead,
  reps: SalesRep[],
  propertyAgentId?: string,
  roundRobinIndex?: number,
): SalesRep | null {
  const active = reps.filter((r) => r.active);
  if (active.length === 0) return null;

  if (propertyAgentId) {
    const match = active.find((r) => r.agentId === propertyAgentId);
    if (match) return match;
  }

  if (roundRobinIndex !== undefined) {
    return active[roundRobinIndex % active.length];
  }

  return active[0];
}
