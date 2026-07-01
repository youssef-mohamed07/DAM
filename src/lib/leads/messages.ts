import type { Lead, LeadSource } from "@/types/leads";
import type { SalesRep } from "@/lib/data/sales";
import { company } from "@/lib/data/company";
import { leadSourceLabels } from "@/lib/leads/labels";
import { normalizeWhatsAppPhone, whatsappLink as waLink } from "@/lib/leads/whatsapp";
import { tgMention } from "@/lib/telegram/bot";

function escHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const SEP = "┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈";

const sourceMeta: Record<LeadSource, { icon: string; label: string }> = {
  property: { icon: "🏠", label: leadSourceLabels.property },
  contact: { icon: "📝", label: leadSourceLabels.contact },
  manual: { icon: "✍️", label: leadSourceLabels.manual },
};

function formatLeadTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("ar-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function field(icon: string, label: string, value: string, mono = false) {
  const v = mono ? `<code>${escHtml(value)}</code>` : `<b>${escHtml(value)}</b>`;
  return `${icon} ${label}\n    ${v}`;
}

export function whatsappLink(phone: string, message: string) {
  return waLink(phone, message);
}

export function buildSalesAssignmentMessage(
  lead: Lead,
  rep: SalesRep,
  siteUrl?: string,
) {
  const base = siteUrl ?? (typeof window !== "undefined" ? window.location.origin : "");
  const lines = [
    `مرحباً ${rep.name}،`,
    "",
    "🔔 *عميل جديد — DAM Properties*",
    "",
  ];

  if (lead.propertyTitle) {
    lines.push(`*العقار:* ${lead.propertyTitle}`);
    if (lead.notes) lines.push(`*التفاصيل:* ${lead.notes}`);
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

  if (lead.propertySlug && base) {
    lines.push("", `*رابط العقار:*`, `${base}/properties/${lead.propertySlug}`);
  }

  lines.push("", `— ${company.nameAr}`);

  return lines.join("\n");
}

export type TelegramLeadPayload = {
  text: string;
  reply_markup: {
    inline_keyboard: { text: string; url: string }[][];
  };
};

export type TelegramLeadOptions = {
  /** الاسم الحقيقي على تليجرام (مش اسم المندوب في الداشبورد) */
  telegramDisplayName?: string;
  /** رسالة خاصة للمندوب — بدون منشن في جروب */
  private?: boolean;
};

export function buildTelegramLeadPayload(
  lead: Lead,
  rep: SalesRep,
  siteUrl = "",
  options: TelegramLeadOptions = {},
): TelegramLeadPayload {
  const src = sourceMeta[lead.source];
  const when = formatLeadTime(lead.createdAt);
  const isPublicUrl = (url: string) => url.startsWith("https://");

  const tgName = options.telegramDisplayName ?? rep.name;
  const greetName = escHtml(tgName);

  const propertyLine = lead.propertyTitle
    ? ` بـ <b>${escHtml(lead.propertyTitle)}</b>`
    : "";

  const sections: string[] = [
    `🏛 <b>DAM PROPERTIES</b>`,
    SEP,
    "",
  ];

  if (options.private) {
    sections.push(
      `👋 مرحباً <b>${greetName}</b>`,
      `⚡ عميل جديد مخصص ليك${propertyLine} — <b>كلمّه دلوقتي!</b>`,
    );
  } else {
    const repLabel = rep.telegramUserId
      ? tgMention(rep.telegramUserId, greetName)
      : `<b>${greetName}</b>`;
    sections.push(
      `📣 ${repLabel}`,
      `⚡ عميل جديد مهتم${propertyLine} — <b>كلمّه دلوقتي!</b>`,
    );
  }

  sections.push(
    "",
    `${src.icon} ${src.label}  ·  🕐 ${when}`,
    "",
  );

  const clientFields: string[] = [];
  if (lead.clientName) clientFields.push(field("👤", "الاسم", lead.clientName));
  if (lead.clientPhone) clientFields.push(field("📱", "الهاتف", lead.clientPhone, true));
  if (lead.clientEmail) clientFields.push(field("✉️", "البريد", lead.clientEmail));

  if (clientFields.length) {
    sections.push("<b>━━ العميل ━━</b>", "", ...clientFields, "");
  }

  const propertyFields: string[] = [];
  if (lead.propertyTitle) propertyFields.push(field("🏘", "العقار", lead.propertyTitle));
  if (lead.notes) propertyFields.push(field("💰", "التفاصيل", lead.notes));
  if (lead.propertyType) propertyFields.push(field("📐", "النوع", lead.propertyType));
  if (lead.district) propertyFields.push(field("📍", "المنطقة", lead.district));
  if (lead.budget) propertyFields.push(field("💵", "الميزانية", lead.budget));
  if (lead.goal) propertyFields.push(field("🎯", "الهدف", lead.goal));

  if (lead.propertySlug && siteUrl) {
    const propUrl = `${siteUrl}/properties/${lead.propertySlug}`;
    if (isPublicUrl(siteUrl)) {
      propertyFields.push(field("🔗", "رابط العقار", propUrl));
    } else {
      propertyFields.push(field("🔗", "رابط العقار", propUrl, true));
    }
  }

  if (propertyFields.length) {
    sections.push("<b>━━ العقار ━━</b>", "", ...propertyFields, "");
  }

  if (lead.message) {
    sections.push(
      "<b>━━ رسالة العميل ━━</b>",
      "",
      `<blockquote>${escHtml(lead.message)}</blockquote>`,
      "",
    );
  }

  sections.push(
    SEP,
    ...(options.private
      ? [`🔖 <code>${lead.id.slice(0, 8)}</code>`]
      : [
          `👨‍💼 المسؤول: <b>${greetName}</b>`,
          `🔖 <code>${lead.id.slice(0, 8)}</code>`,
        ]),
  );

  const buttons: { text: string; url: string }[][] = [];

  if (lead.clientPhone) {
    const wa = normalizeWhatsAppPhone(lead.clientPhone);
    const greet = encodeURIComponent(
      `مرحباً ${lead.clientName ?? ""} 👋\nمعك ${rep.name} من ${company.nameAr}.\nبخصوص استفسارك${lead.propertyTitle ? ` عن ${lead.propertyTitle}` : ""} — تحب نرتب معاينة؟`,
    );
    buttons.push([{ text: "💬 واتساب العميل", url: `https://wa.me/${wa}?text=${greet}` }]);
  }

  const row2: { text: string; url: string }[] = [];
  if (lead.propertySlug && siteUrl && isPublicUrl(siteUrl)) {
    row2.push({ text: "🏠 صفحة العقار", url: `${siteUrl}/properties/${lead.propertySlug}` });
  }
  if (siteUrl && isPublicUrl(siteUrl)) {
    row2.push({ text: "📋 الداشبورد", url: `${siteUrl}/admin/leads/${lead.id}` });
  }
  if (row2.length) buttons.push(row2);

  return {
    text: sections.join("\n"),
    reply_markup: { inline_keyboard: buttons },
  };
}

export function buildTelegramLeadMessage(lead: Lead, rep: SalesRep, siteUrl?: string) {
  return buildTelegramLeadPayload(lead, rep, siteUrl ?? "").text;
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
