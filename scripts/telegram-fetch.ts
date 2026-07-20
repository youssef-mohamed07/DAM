/**
 * سحب رسائل قديمة من رابط تليجرام
 * Usage:
 *   npm run telegram:fetch -- "https://t.me/c/2855840897/11"
 *   npm run telegram:fetch -- "https://t.me/c/2855840897/11" --all
 */
import { prisma } from "../src/lib/prisma";
import { fetchChatHistoryFromLink } from "../src/lib/telegram/fetch-history";
import { gramSetupInstructions, getGramConfig } from "../src/lib/telegram/gram-client";

async function main() {
  const url = process.argv[2];
  const all = process.argv.includes("--all");

  if (!url) {
    console.log(`
سحب رسائل من رابط تليجرام
━━━━━━━━━━━━━━━━━━━━━━━━━━

npm run telegram:fetch -- "https://t.me/c/2855840897/11"
npm run telegram:fetch -- "https://t.me/c/2855840897/11" --all

${getGramConfig() ? "" : gramSetupInstructions()}
`);
    process.exit(getGramConfig() ? 0 : 1);
  }

  console.log(`🔄 سحب من: ${url}`);
  console.log(all ? "📋 وضع: كل الرسائل" : "📋 وضع: من الرسالة المحددة للآخر\n");

  const result = await fetchChatHistoryFromLink(url, all ? "all" : "from");

  console.log(`\n✓ ${result.chatTitle ?? result.chatId}`);
  console.log(`  حُفظت: ${result.saved} رسالة`);
  console.log(`  عقارات: ${result.listings}`);
  console.log(`  تُخطّي: ${result.skipped}`);
  if (result.fromMessageId) console.log(`  من رسالة: #${result.fromMessageId}`);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
