import { existsSync } from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import {
  districtFromChatTitle,
  isResaleChat,
} from "@/lib/telegram/chat-districts";
import {
  flattenTelegramExportText,
  parseListingText,
} from "@/lib/telegram/parse-listing";
import { upsertListingFromMessage } from "@/lib/telegram/messages-store";

export type ExportMessage = {
  id: number;
  type: string;
  date?: string;
  date_unixtime?: string;
  from?: string;
  from_id?: string;
  text?: unknown;
  photo?: string;
  file?: string;
};

export type ExportChat = {
  name?: string;
  type?: string;
  id: number;
  messages?: ExportMessage[];
};

export function supergroupChatId(id: number) {
  const s = String(id);
  if (s.startsWith("-100")) return s;
  return `-100${s}`;
}

export async function importTelegramExportJson(
  data: ExportChat,
  photosDir?: string,
) {
  const chatTitle = data.name ?? "Telegram Chat";
  const chatId = supergroupChatId(data.id);
  const messages = data.messages ?? [];
  const forceResale = isResaleChat(chatTitle);
  const chatDistrict = districtFromChatTitle(chatTitle);

  let saved = 0;
  let listings = 0;
  let skipped = 0;

  for (const m of messages) {
    if (m.type !== "message") {
      skipped++;
      continue;
    }

    const text = flattenTelegramExportText(m.text).trim();
    const hasMedia = Boolean(m.photo || m.file);
    if (!text && !hasMedia) {
      skipped++;
      continue;
    }

    const messageDate = m.date_unixtime
      ? new Date(parseInt(m.date_unixtime, 10) * 1000)
      : m.date
        ? new Date(m.date)
        : new Date();

    let mediaPath: string | null = null;
    if (m.photo && photosDir) {
      const photoPath = path.join(photosDir, m.photo);
      if (existsSync(photoPath)) mediaPath = photoPath;
    }

    const row = await prisma.telegramMessage.upsert({
      where: { chatId_messageId: { chatId, messageId: m.id } },
      create: {
        chatId,
        messageId: m.id,
        chatTitle,
        senderUserId: m.from_id?.replace("user", "") ?? null,
        senderName: m.from ?? null,
        text: text || null,
        hasMedia,
        mediaType: m.photo ? "photo" : m.file ? "file" : null,
        mediaPath,
        messageDate,
        raw: m as object,
      },
      update: {
        chatTitle,
        senderUserId: m.from_id?.replace("user", "") ?? undefined,
        senderName: m.from ?? undefined,
        text: text || undefined,
        hasMedia,
        mediaType: m.photo ? "photo" : m.file ? "file" : undefined,
        mediaPath: mediaPath ?? undefined,
        messageDate,
        raw: m as object,
      },
    });

    saved++;

    if (text) {
      const parsed = parseListingText(text, { chatTitle, forceResale });
      if (parsed) {
        await upsertListingFromMessage(row.id, text, {
          chatTitle,
          forceResale,
          chatDistrict,
        });
        listings++;
      }
    }
  }

  return {
    chatId,
    chatTitle,
    chatDistrict,
    saved,
    listings,
    skipped,
    total: messages.length,
  };
}
