/**
 * إعداد البوت — webhook + تعليمات Privacy Mode
 * Usage: npm run telegram:setup [webhook-url]
 */
import {
  tgDeleteWebhook,
  tgGetChat,
  tgGetWebhookInfo,
  tgSetWebhook,
} from "../src/lib/telegram/bot";
import { syncGroupAdmins } from "../src/lib/telegram/members";

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_SALES_CHAT_ID;
  if (!token) {
    console.error("❌ أضف TELEGRAM_BOT_TOKEN في .env.local");
    process.exit(1);
  }

  const webhookUrl =
    process.argv[2] ||
    (process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/api/telegram/webhook`
      : null);

  console.log("🤖 إعداد بوت Telegram\n");

  if (chatId) {
    const chat = await tgGetChat(chatId);
    if (chat.ok) {
      console.log(`📋 الجروب: ${chat.result.title ?? "—"}`);
      console.log(`👥 الأعضاء (تقريبي): ${chat.result.members_count ?? "—"}`);
      console.log(`🆔 Chat ID: ${chat.result.id}\n`);
    } else {
      console.warn("⚠️ تعذّر قراءة الجروب — تأكد من TELEGRAM_SALES_CHAT_ID والبوت داخل الجروب\n");
    }
  }

  const info = await tgGetWebhookInfo();
  if (info.ok) {
    console.log(`🔗 Webhook الحالي: ${info.result.url || "(غير مضبوط)"}`);
    console.log(`📬 رسائل معلّقة: ${info.result.pending_update_count ?? 0}\n`);
  }

  if (webhookUrl && !webhookUrl.includes("localhost")) {
    await tgDeleteWebhook(false);
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    const set = await tgSetWebhook(webhookUrl, secret);
    if (set.ok) {
      console.log(`✅ تم تسجيل Webhook:\n   ${webhookUrl}\n`);
    } else {
      console.error("❌ فشل Webhook:", set.error);
    }
  } else {
    console.log("ℹ️  Webhook محلي — استخدم ngrok أو npm run telegram:poll للتطوير\n");
  }

  if (chatId) {
    const synced = await syncGroupAdmins(chatId);
    console.log(synced.ok ? `✅ تم مزامنة ${synced.count} أدمن` : `⚠️ فشل مزامنة الأدمن`);
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  مهم — عشان البوت يشوف كل الرسائل:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. افتح @BotFather في تليجرام
2. ابعت: /setprivacy
3. اختار البوت @dampropbot
4. اختار: Disable

5. خلّي البوت Admin في الجروب
6. في الجروب ابعت: /chatid  ← للتأكد من Chat ID
7. حدّث TELEGRAM_SALES_CHAT_ID في .env.local

بعد Disable — أي رسالة في الجروب هتسجّل العضو تلقائياً.
`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
