import type { TelegramClient } from "telegram";
import type { Api } from "telegram";
import { withGramClient } from "@/lib/telegram/gram-client";
import {
  parseAllUnparsedMessages,
  saveTelegramMessage,
} from "@/lib/telegram/messages-store";
import { reparseListingsWithChatDistrict } from "@/lib/telegram/publish-listings";

export type FetchHistoryResult = {
  chatId: string;
  chatTitle: string | null;
  saved: number;
  skipped: number;
  listings: number;
  fromMessageId?: number;
};

function messageText(msg: Api.Message): string | null {
  if (!msg.message) return null;
  const t = String(msg.message).trim();
  return t || null;
}

function senderName(msg: Api.Message): string | null {
  const from = msg.fromId;
  if (!from || !("userId" in from)) return null;
  return String(from.userId);
}

async function fetchFromClient(
  client: TelegramClient,
  chatId: string,
  opts?: { fromMessageId?: number; limit?: number },
): Promise<FetchHistoryResult> {
  const entity = await client.getEntity(chatId);
  const chatTitle =
    entity && typeof entity === "object" && "title" in entity
      ? String((entity as { title?: string }).title ?? "")
      : null;

  let saved = 0;
  let skipped = 0;
  let listings = 0;

  const iterOpts: { reverse?: boolean; minId?: number; limit?: number } = {
    reverse: true,
  };
  if (opts?.fromMessageId) iterOpts.minId = opts.fromMessageId - 1;
  if (opts?.limit) iterOpts.limit = opts.limit;

  for await (const raw of client.iterMessages(entity, iterOpts)) {
    const msg = raw as Api.Message;
    if (!msg.id) {
      skipped++;
      continue;
    }

    const text = messageText(msg);
    const hasMedia = Boolean(msg.media);
    if (!text && !hasMedia) {
      skipped++;
      continue;
    }

    const result = await saveTelegramMessage({
      chatId,
      messageId: msg.id,
      chatTitle,
      senderUserId: senderName(msg),
      senderName: null,
      text,
      hasMedia,
      mediaType: hasMedia ? "photo" : null,
      messageDate: msg.date ? new Date(msg.date * 1000) : new Date(),
      raw: { id: msg.id, date: msg.date },
    });

    saved++;
    if (result.listing) listings++;
  }

  return {
    chatId,
    chatTitle,
    saved,
    skipped,
    listings,
    fromMessageId: opts?.fromMessageId,
  };
}

export async function fetchChatHistoryFromLink(
  url: string,
  mode: "from" | "all" = "from",
) {
  const { parseTelegramMessageLink } = await import("@/lib/telegram/parse-link");
  const parsed = parseTelegramMessageLink(url);
  if (!parsed) {
    throw new Error("رابط غير صالح — استخدم مثل: https://t.me/c/2855840897/11");
  }

  const result = await withGramClient((client) =>
    fetchFromClient(client, parsed.chatId, {
      fromMessageId: mode === "from" ? parsed.messageId : undefined,
    }),
  );

  const parsedBatch = await parseAllUnparsedMessages();
  await reparseListingsWithChatDistrict();

  return {
    ...result,
    parsed: parsedBatch.parsed,
    startMessageId: parsed.messageId,
  };
}

export async function fetchChatHistoryById(
  chatId: string,
  opts?: { fromMessageId?: number; limit?: number },
) {
  const result = await withGramClient((client) =>
    fetchFromClient(client, chatId, opts),
  );

  const parsedBatch = await parseAllUnparsedMessages();
  await reparseListingsWithChatDistrict();

  return { ...result, parsed: parsedBatch.parsed };
}
