/**
 * سحب الرسائل المتاحة عبر Bot API + تحليل العقارات
 * Usage:
 *   npm run telegram:pull
 *   npm run telegram:pull -- --parse
 */
import { tgGetUpdates } from "../src/lib/telegram/bot";
import { parseAllUnparsedMessages } from "../src/lib/telegram/messages-store";
import { processTelegramUpdate } from "../src/lib/telegram/updates";

async function main() {
  const shouldParse = process.argv.includes("--parse");

  console.log("🔄 سحب الرسائل من Telegram (Bot API)...\n");
  console.log("ℹ️  البوت يشوف الرسائل الجديدة فقط — مش التاريخ الكامل.");
  console.log("   للتاريخ الكامل: npm run telegram:import -- export <result.json>\n");

  let offset: number | undefined;
  let pulled = 0;

  for (let page = 0; page < 200; page++) {
    const batch = await tgGetUpdates(offset);
    if (!batch.ok) {
      console.error("✗ فشل getUpdates:", batch.error);
      process.exit(1);
    }
    if (batch.updates.length === 0) break;

    for (const raw of batch.updates) {
      const u = raw as { update_id: number };
      offset = u.update_id + 1;
      await processTelegramUpdate(raw as Record<string, unknown>);
      pulled++;
    }
  }

  console.log(`✓ تم معالجة ${pulled} تحديث`);

  if (shouldParse || pulled > 0) {
    const result = await parseAllUnparsedMessages();
    console.log(`✓ تحليل عقارات: ${result.parsed} من ${result.scanned} رسالة`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
