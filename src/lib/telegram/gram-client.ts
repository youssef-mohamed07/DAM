import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

export type GramConfig = {
  apiId: number;
  apiHash: string;
  session: string;
};

export function getGramConfig(): GramConfig | null {
  const apiId = Number(process.env.TELEGRAM_API_ID);
  const apiHash = process.env.TELEGRAM_API_HASH;
  const session = process.env.TELEGRAM_SESSION?.trim();
  if (!apiId || !apiHash || !session) return null;
  return { apiId, apiHash, session };
}

export function gramSetupInstructions() {
  return [
    "1. ادخل https://my.telegram.org → API development tools",
    "2. انسخ api_id و api_hash في .env.local:",
    "   TELEGRAM_API_ID=...",
    "   TELEGRAM_API_HASH=...",
    "3. شغّل: npm run telegram:auth",
    "4. انسخ TELEGRAM_SESSION في .env.local",
    "5. جرّب السحب تاني من الرابط",
  ].join("\n");
}

export async function withGramClient<T>(
  fn: (client: TelegramClient) => Promise<T>,
): Promise<T> {
  const cfg = getGramConfig();
  if (!cfg) {
    throw new Error(`GRAM_NOT_CONFIGURED\n\n${gramSetupInstructions()}`);
  }

  const client = new TelegramClient(
    new StringSession(cfg.session),
    cfg.apiId,
    cfg.apiHash,
    { connectionRetries: 3 },
  );

  await client.connect();
  if (!(await client.checkAuthorization())) {
    await client.disconnect();
    throw new Error(`GRAM_SESSION_INVALID\n\nشغّل: npm run telegram:auth`);
  }

  try {
    return await fn(client);
  } finally {
    await client.disconnect();
  }
}
