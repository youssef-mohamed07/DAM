/**
 * استقبال رسائل Telegram محلياً (بدون webhook)
 * Usage: npm run telegram:poll
 */
import { tgGetUpdates } from "../src/lib/telegram/bot";
import { processTelegramUpdate } from "../src/lib/telegram/updates";

async function main() {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error("❌ أضف TELEGRAM_BOT_TOKEN في .env.local");
    process.exit(1);
  }

  console.log("🔄 Polling — البوت يستقبل كل الرسائل (لازم Privacy Mode = Disable)");
  console.log("   اضغط Ctrl+C للإيقاف\n");

  let offset: number | undefined;

  while (true) {
    const batch = await tgGetUpdates(offset);
    if (!batch.ok) {
      console.error("خطأ:", batch.error);
      await sleep(3000);
      continue;
    }

    for (const update of batch.updates) {
      const u = update as { update_id: number };
      offset = u.update_id + 1;
      await processTelegramUpdate(update as Record<string, unknown>);
      const msg = (update as { message?: { from?: { first_name?: string }; text?: string } }).message;
      if (msg?.from) {
        const name = msg.from.first_name ?? "?";
        const preview = msg.text?.slice(0, 40) ?? "(media)";
        console.log(`  📩 ${name}: ${preview}`);
      }
    }

    if (batch.updates.length === 0) await sleep(1500);
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
