/**
 * استيراد رسائل تليجرام من تصدير Telegram Desktop (JSON)
 */
import { prisma } from "../src/lib/prisma";
import {
  parseAllUnparsedMessages,
} from "../src/lib/telegram/messages-store";
import { importTelegramExportJson } from "../src/lib/telegram/import-export";
import { reparseListingsWithChatDistrict } from "../src/lib/telegram/publish-listings";

async function main() {
  const args = process.argv.slice(2);
  const mode = args[0];

  if (mode === "export") {
    const file = args[1];
    if (!file) {
      console.error("Usage: npm run telegram:import -- export <result.json> [--photos ./photos]");
      process.exit(1);
    }
    const photosIdx = args.indexOf("--photos");
    const photosDir = photosIdx >= 0 ? args[photosIdx + 1] : undefined;
    const { readFileSync } = await import("node:fs");
    const data = JSON.parse(readFileSync(file, "utf8"));
    const result = await importTelegramExportJson(data, photosDir);
    console.log(`✓ ${result.chatTitle}: ${result.saved} رسالة · ${result.listings} عقار`);
    await parseAllUnparsedMessages();
    await reparseListingsWithChatDistrict();
    return;
  }

  if (mode === "parse") {
    const r = await parseAllUnparsedMessages();
    await reparseListingsWithChatDistrict();
    console.log(`✓ ${r.parsed} عقار من ${r.scanned} رسالة`);
    return;
  }

  console.log(`
استيراد رسائل وعقارات تليجرام
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

من الداشبورد: /admin/telegram-import (ارفع ملفات JSON)

أو من التيرمنال:
  npm run telegram:import -- export /path/to/result.json
  npm run telegram:import -- parse
`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
