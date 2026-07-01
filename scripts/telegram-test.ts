/**
 * إرسال رسالة تجربة خاصة للمندوب (مش في الجروب)
 */
import { PrismaClient } from "@prisma/client";
import { buildTelegramLeadPayload } from "../src/lib/leads/messages";
import { tgSendMessage } from "../src/lib/telegram/bot";
import { getGroupMembers, getTelegramDisplayName, syncGroupAdmins } from "../src/lib/telegram/members";
import type { Lead } from "../src/types/leads";

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const groupChatId = process.env.TELEGRAM_SALES_CHAT_ID;
  if (!token || !groupChatId) {
    console.error("أضف TELEGRAM_BOT_TOKEN و TELEGRAM_SALES_CHAT_ID في .env.local");
    process.exit(1);
  }

  const prisma = new PrismaClient();

  console.log("🔄 مزامنة أعضاء الجروب...");
  await syncGroupAdmins(groupChatId);

  const members = await getGroupMembers(groupChatId);
  if (members.length === 0) {
    console.error("✗ مفيش أعضاء. خلّي المندوبين يبعتوا /me في الجروب");
    process.exit(1);
  }

  const reps = await prisma.salesRep.findMany({ where: { active: true } });
  let rep = reps.find((r) => r.telegramUserId && members.some((m) => m.telegramUserId === r.telegramUserId));

  if (!rep) {
    const target = members.find((m) => !m.isBot) ?? members[0];
    rep = reps[0];
    if (!rep) {
      console.error("✗ مفيش مندوبين في الداتابيز");
      process.exit(1);
    }
    await prisma.salesRep.update({
      where: { id: rep.id },
      data: { telegramUserId: target.telegramUserId, telegramChatId: target.telegramUserId },
    });
    rep = { ...rep, telegramUserId: target.telegramUserId, telegramChatId: target.telegramUserId };
    console.log(`✓ ربط ${rep.name} بـ ${target.displayName}`);
  }

  const tgName = (await getTelegramDisplayName(rep.telegramUserId!)) ?? rep.name;
  console.log(`✓ الإرسال خاص لـ ${tgName} (${rep.telegramUserId})`);

  const now = new Date().toISOString();
  const lead: Lead = {
    id: "test-" + Date.now(),
    createdAt: now,
    updatedAt: now,
    status: "assigned",
    source: "property",
    propertySlug: "golf-twin-golf-view",
    propertyTitle: "توين هاوس فيو جولف — تجربة",
    clientName: "سارة محمود",
    clientPhone: "01011223344",
    message: "مهتمة بمعاينة يوم السبت",
    goal: "اهتمام بعقار",
    propertyType: "townhouse",
    district: "golf",
    notes: "السعر: 18,850,000 ج.م",
    assignedSalesId: rep.id,
    assignedAt: now,
  };

  const salesRep = {
    id: rep.id,
    name: rep.name,
    role: rep.role,
    phone: rep.phone,
    whatsapp: rep.whatsapp,
    telegramUserId: rep.telegramUserId!,
    active: rep.active,
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";
  const payload = buildTelegramLeadPayload(lead, salesRep, siteUrl, {
    private: true,
    telegramDisplayName: tgName,
  });

  const result = await tgSendMessage(rep.telegramUserId!, payload.text, {
    reply_markup: payload.reply_markup.inline_keyboard.length
      ? payload.reply_markup
      : undefined,
  });

  if (result.ok) {
    console.log(`✓ تم إرسال رسالة التجربة خاص لـ ${tgName}`);
  } else {
    console.error("✗ فشل الإرسال:", result.error);
    console.error("💡 افتح @dampropbot في الخاص وابعت /start ثم جرّب تاني");
    process.exit(1);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
