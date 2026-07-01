/**
 * مزامنة أعضاء جروب السيلز من Telegram API
 * - getChatAdministrators: الأدمنز
 * - getUpdates: أي حد كتب في الجروب أو انضم
 */
import { PrismaClient } from "@prisma/client";
import { tgGetUpdates } from "../src/lib/telegram/bot";
import { syncGroupAdmins, upsertGroupMember } from "../src/lib/telegram/members";
import type { TgUser } from "../src/lib/telegram/types";

type TgUpdate = {
  update_id: number;
  message?: {
    chat?: { id: number };
    from?: TgUser;
    new_chat_members?: TgUser[];
  };
  chat_member?: {
    chat?: { id: number };
    new_chat_member?: { status: string; user: TgUser };
  };
};

async function main() {
  const chatId = process.env.TELEGRAM_SALES_CHAT_ID;
  if (!chatId) {
    console.error("أضف TELEGRAM_SALES_CHAT_ID في .env.local");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  let fromUpdates = 0;

  console.log("🔄 جلب أدمنز الجروب...");
  const admins = await syncGroupAdmins(chatId);
  if (admins.ok) {
    console.log(`✓ ${admins.count} أدمن`);
  } else {
    console.warn("⚠️ فشل جلب الأدمنز:", admins.error);
  }

  console.log("🔄 مسح آخر الرسائل (getUpdates)...");
  let offset: number | undefined;
  for (let page = 0; page < 20; page++) {
    const batch = await tgGetUpdates(offset);
    if (!batch.ok || batch.updates.length === 0) break;

    for (const raw of batch.updates as TgUpdate[]) {
      offset = raw.update_id + 1;
      const msg = raw.message;
      const cm = raw.chat_member;

      if (msg?.chat?.id && String(msg.chat.id) === chatId) {
        if (msg.from && !msg.from.is_bot) {
          await upsertGroupMember(chatId, msg.from);
          fromUpdates++;
        }
        for (const u of msg.new_chat_members ?? []) {
          if (!u.is_bot) {
            await upsertGroupMember(chatId, u);
            fromUpdates++;
          }
        }
      }

      if (cm?.chat?.id && String(cm.chat.id) === chatId && cm.new_chat_member?.user) {
        const status = cm.new_chat_member.status;
        if (status !== "left" && status !== "kicked" && !cm.new_chat_member.user.is_bot) {
          await upsertGroupMember(chatId, cm.new_chat_member.user, {
            isAdmin: status === "administrator" || status === "creator",
          });
          fromUpdates++;
        }
      }
    }
  }

  const members = await prisma.telegramGroupMember.findMany({
    where: { chatId, isBot: false },
    orderBy: [{ isAdmin: "desc" }, { lastSeenAt: "desc" }],
  });

  console.log(`\n✓ أعضاء الجروب المسجّلين: ${members.length}`);
  for (const m of members) {
    const name = [m.firstName, m.lastName].filter(Boolean).join(" ") || m.username || m.telegramUserId;
    const badge = m.isAdmin ? "👑" : "👤";
    console.log(`  ${badge} ${name} — ID: ${m.telegramUserId}${m.username ? ` (@${m.username})` : ""}`);
  }

  if (fromUpdates > 0) console.log(`\n(من getUpdates: ${fromUpdates} تحديث)`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
