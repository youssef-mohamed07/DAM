/**
 * تسجيل دخول حساب Telegram (MTProto) لسحب الرسائل القديمة
 * Usage: npm run telegram:auth
 */
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

async function main() {
  const apiId = Number(process.env.TELEGRAM_API_ID);
  const apiHash = process.env.TELEGRAM_API_HASH;
  if (!apiId || !apiHash) {
    console.error(`
❌ أضف في .env.local:
TELEGRAM_API_ID=...
TELEGRAM_API_HASH=...

احصل عليهم من: https://my.telegram.org/apps
`);
    process.exit(1);
  }

  const rl = readline.createInterface({ input, output });
  const existing = process.env.TELEGRAM_SESSION?.trim() ?? "";

  const client = new TelegramClient(
    new StringSession(existing),
    apiId,
    apiHash,
    { connectionRetries: 3 },
  );

  console.log("📱 تسجيل دخول Telegram لسحب الرسائل القديمة\n");

  await client.start({
    phoneNumber: async () => rl.question("رقم الموبايل (مع كود الدولة +20...): "),
    password: async () => rl.question("كلمة مرور 2FA (لو موجودة): "),
    phoneCode: async () => rl.question("الكود اللي وصلك على تليجرام: "),
    onError: (e) => console.error(e),
  });

  const session = String(client.session.save());
  console.log(`
✅ تم تسجيل الدخول!

أضف في .env.local:
TELEGRAM_SESSION=${session}

ثم جرّب:
npm run telegram:fetch -- "https://t.me/c/2855840897/11"
`);

  await client.disconnect();
  rl.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
