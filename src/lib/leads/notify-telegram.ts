import { buildTelegramLeadPayload } from "@/lib/leads/messages";
import { tgSendMessage } from "@/lib/telegram/bot";
import { getTelegramDisplayName } from "@/lib/telegram/members";
import { prisma } from "@/lib/prisma";
import { getSystemSettings } from "@/lib/settings/store";
import type { Lead } from "@/types/leads";
import type { SalesRep } from "@/lib/data/sales";

function siteUrl() {
  const vercel = process.env.VERCEL_URL;
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (vercel ? `https://${vercel}` : undefined) ||
    "http://localhost:3000"
  );
}

function resolvePrivateChatId(rep: SalesRep): string | null {
  if (rep.telegramUserId) return rep.telegramUserId;
  if (rep.telegramChatId) return rep.telegramChatId;
  return null;
}

async function recordNotifyResult(
  leadId: string,
  status: "sent" | "failed" | "skipped",
  error?: string,
) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        notifyStatus: status,
        notifiedAt: status === "sent" ? new Date() : undefined,
        notifyError: error ?? null,
      },
    });
  } catch (e) {
    console.error("[leads] record notify:", e);
  }
}

/** إرسال تفاصيل العميل خاص للمندوب المعيّن فقط */
export async function notifySalesRep(lead: Lead, rep: SalesRep): Promise<boolean> {
  const settings = await getSystemSettings();
  if (!settings.autoNotifyTelegram || process.env.TELEGRAM_AUTO_NOTIFY === "false") {
    await recordNotifyResult(lead.id, "skipped", "الإشعار التلقائي معطّل");
    return false;
  }

  const chatId = resolvePrivateChatId(rep);
  if (!chatId) {
    await recordNotifyResult(
      lead.id,
      "failed",
      "المندوب غير مربوط بتليجرام — /link ثم /start",
    );
    return false;
  }

  const telegramDisplayName =
    (rep.telegramUserId ? await getTelegramDisplayName(rep.telegramUserId) : null) ??
    rep.name;

  const payload = buildTelegramLeadPayload(lead, rep, siteUrl(), {
    private: true,
    telegramDisplayName,
  });

  const result = await tgSendMessage(chatId, payload.text, {
    reply_markup: payload.reply_markup.inline_keyboard.length
      ? payload.reply_markup
      : undefined,
  });

  if (!result.ok) {
    await recordNotifyResult(lead.id, "failed", result.error);
    console.error("[leads] Telegram DM:", result.error);
    return false;
  }

  await recordNotifyResult(lead.id, "sent");
  return true;
}
