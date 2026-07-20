import { prisma } from "@/lib/prisma";
import { districtFromChatTitle, isResaleChat } from "@/lib/telegram/chat-districts";
import { parseListingText } from "@/lib/telegram/parse-listing";

export type IncomingTelegramMessage = {
  chatId: string;
  messageId: number;
  chatTitle?: string | null;
  senderUserId?: string | null;
  senderName?: string | null;
  text?: string | null;
  hasMedia?: boolean;
  mediaType?: string | null;
  mediaFileId?: string | null;
  mediaPath?: string | null;
  messageDate: Date;
  raw?: unknown;
};

export async function saveTelegramMessage(input: IncomingTelegramMessage) {
  const text = input.text?.trim() || null;

  const row = await prisma.telegramMessage.upsert({
    where: {
      chatId_messageId: { chatId: input.chatId, messageId: input.messageId },
    },
    create: {
      chatId: input.chatId,
      messageId: input.messageId,
      chatTitle: input.chatTitle ?? null,
      senderUserId: input.senderUserId ?? null,
      senderName: input.senderName ?? null,
      text,
      hasMedia: input.hasMedia ?? false,
      mediaType: input.mediaType ?? null,
      mediaFileId: input.mediaFileId ?? null,
      mediaPath: input.mediaPath ?? null,
      messageDate: input.messageDate,
      raw: input.raw ? (input.raw as object) : undefined,
    },
    update: {
      chatTitle: input.chatTitle ?? undefined,
      senderUserId: input.senderUserId ?? undefined,
      senderName: input.senderName ?? undefined,
      text: text ?? undefined,
      hasMedia: input.hasMedia ?? undefined,
      mediaType: input.mediaType ?? undefined,
      mediaFileId: input.mediaFileId ?? undefined,
      mediaPath: input.mediaPath ?? undefined,
      messageDate: input.messageDate,
      raw: input.raw ? (input.raw as object) : undefined,
    },
  });

  let listing = null;
  if (text) {
    listing = await upsertListingFromMessage(row.id, text, {
      chatTitle: input.chatTitle,
      forceResale: isResaleChat(input.chatTitle),
      chatDistrict: districtFromChatTitle(input.chatTitle),
    });
  }

  return { message: row, listing };
}

export async function upsertListingFromMessage(
  messageDbId: string,
  text: string,
  opts?: { chatTitle?: string | null; forceResale?: boolean; chatDistrict?: string | null },
) {
  const parsed = parseListingText(text, opts);
  if (!parsed) return null;

  const district = parsed.district ?? opts?.chatDistrict ?? districtFromChatTitle(opts?.chatTitle);
  const saleCategory =
    opts?.forceResale || isResaleChat(opts?.chatTitle) ? "resale" : parsed.saleCategory;

  return prisma.telegramListing.upsert({
    where: { messageDbId },
    create: {
      messageDbId,
      listingCode: parsed.listingCode,
      saleCategory,
      propertyType: parsed.propertyType,
      district,
      compound: parsed.compound,
      price: parsed.price,
      area: parsed.area,
      bedrooms: parsed.bedrooms,
      bathrooms: parsed.bathrooms,
      finishing: parsed.finishing,
      delivery: parsed.delivery,
      paymentNotes: parsed.paymentNotes,
      rawText: text,
      parsed: parsed as object,
      status: "parsed",
    },
    update: {
      listingCode: parsed.listingCode,
      saleCategory,
      propertyType: parsed.propertyType,
      district,
      compound: parsed.compound,
      price: parsed.price,
      area: parsed.area,
      bedrooms: parsed.bedrooms,
      bathrooms: parsed.bathrooms,
      finishing: parsed.finishing,
      delivery: parsed.delivery,
      paymentNotes: parsed.paymentNotes,
      rawText: text,
      parsed: parsed as object,
    },
  });
}

export async function parseAllUnparsedMessages() {
  const messages = await prisma.telegramMessage.findMany({
    where: {
      text: { not: null },
      listing: null,
    },
    orderBy: { messageDate: "asc" },
  });

  let parsed = 0;
  for (const m of messages) {
    if (!m.text) continue;
    const listing = await upsertListingFromMessage(m.id, m.text, {
      chatTitle: m.chatTitle,
      forceResale: isResaleChat(m.chatTitle),
      chatDistrict: districtFromChatTitle(m.chatTitle),
    });
    if (listing) parsed++;
  }
  return { scanned: messages.length, parsed };
}

export async function getTelegramImportStats() {
  const [messages, listings, withCode, published, chats, byDistrict] = await Promise.all([
    prisma.telegramMessage.count(),
    prisma.telegramListing.count(),
    prisma.telegramListing.count({ where: { listingCode: { not: null } } }),
    prisma.telegramListing.count({ where: { propertyId: { not: null } } }),
    prisma.telegramMessage.groupBy({
      by: ["chatId", "chatTitle"],
      _count: { _all: true },
      orderBy: { _count: { chatId: "desc" } },
    }),
    prisma.telegramListing.groupBy({
      by: ["district"],
      _count: { _all: true },
      where: { district: { not: null } },
    }),
  ]);

  return {
    messages,
    listings,
    withCode,
    published,
    chats: chats.map((c) => ({
      chatId: c.chatId,
      chatTitle: c.chatTitle,
      count: c._count._all,
      district: districtFromChatTitle(c.chatTitle),
    })),
    byDistrict: byDistrict.map((d) => ({
      district: d.district,
      count: d._count._all,
    })),
  };
}

export async function listTelegramListings(opts?: {
  limit?: number;
  offset?: number;
  q?: string;
  chatId?: string;
}) {
  const limit = opts?.limit ?? 50;
  const offset = opts?.offset ?? 0;
  const q = opts?.q?.trim();

  return prisma.telegramListing.findMany({
    where: {
      ...(opts?.chatId ? { message: { chatId: opts.chatId } } : {}),
      ...(q
        ? {
            OR: [
              { listingCode: { contains: q, mode: "insensitive" } },
              { rawText: { contains: q, mode: "insensitive" } },
              { compound: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      message: {
        select: {
          chatId: true,
          messageId: true,
          chatTitle: true,
          messageDate: true,
          hasMedia: true,
          senderName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}
