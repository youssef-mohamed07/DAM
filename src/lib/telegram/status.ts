import { tgApi } from "@/lib/telegram/bot";
import { getGroupMembers } from "@/lib/telegram/members";

export type TelegramHealth = {
  botConfigured: boolean;
  botOnline: boolean;
  groupConfigured: boolean;
  botUsername: string | null;
  groupChatId: string | null;
  memberCount: number;
  statusMessage: string;
};

export async function getTelegramHealth(): Promise<TelegramHealth> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const groupChatId = process.env.TELEGRAM_SALES_CHAT_ID ?? null;

  if (!token) {
    return {
      botConfigured: false,
      botOnline: false,
      groupConfigured: Boolean(groupChatId),
      botUsername: null,
      groupChatId,
      memberCount: 0,
      statusMessage: "أضف TELEGRAM_BOT_TOKEN في .env.local ثم أعد تشغيل السيرفر",
    };
  }

  const me = await tgApi<{ username?: string; first_name?: string }>("getMe");
  const botOnline = me.ok;
  const botUsername = me.ok ? (me.result.username ?? null) : null;

  const members = groupChatId ? await getGroupMembers(groupChatId) : [];

  let statusMessage = "متصل ويعمل";
  if (!botOnline) {
    statusMessage = "التوكن موجود لكن البوت لا يستجيب — تحقق من TELEGRAM_BOT_TOKEN";
  } else if (!groupChatId) {
    statusMessage = "البوت شغال — أضف TELEGRAM_SALES_CHAT_ID للجروب";
  } else if (members.length === 0) {
    statusMessage = "البوت شغال — اضغط مزامنة لجلب أعضاء الجروب";
  }

  return {
    botConfigured: true,
    botOnline,
    groupConfigured: Boolean(groupChatId),
    botUsername,
    groupChatId,
    memberCount: members.length,
    statusMessage,
  };
}
