/**
 * مزامنة أعضاء جروب السيلز من Telegram API
 * - getChatAdministrators: الأدمنز
 * - getUpdates: أي حد كتب في الجروب أو انضم
 */
import { prisma } from "../src/lib/prisma";
import { tgGetChat, tgGetUpdates } from "../src/lib/telegram/bot";
import { syncGroupAdmins } from "../src/lib/telegram/members";
import { processTelegramUpdate } from "../src/lib/telegram/updates";

async function main() {
  const chatId = process.env.TELEGRAM_SALES_CHAT_ID;
  if (!chatId) {
    console.error("أضف TELEGRAM_SALES_CHAT_ID في .env.local");
    process.exit(1);
  }

  let fromUpdates = 0;

  const chatInfo = await tgGetChat(chatId);
  if (chatInfo.ok) {
    console.log(`📋 ${chatInfo.result.title} — ~${chatInfo.result.members_count ?? "?"} عضو`);
  }

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

    for (const raw of batch.updates) {
      const u = raw as { update_id: number };
      offset = u.update_id + 1;
      await processTelegramUpdate(raw as Record<string, unknown>);
      fromUpdates++;
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
