import { prisma } from "@/lib/prisma";
import { tgGetChatAdministrators } from "@/lib/telegram/bot";
import type { TgUser } from "@/lib/telegram/types";

export type GroupMember = {
  telegramUserId: string;
  chatId: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  isBot: boolean;
  isAdmin: boolean;
  displayName: string;
  lastSeenAt: Date;
};

function displayName(first?: string | null, last?: string | null, username?: string | null) {
  const full = [first, last].filter(Boolean).join(" ").trim();
  if (full) return full;
  if (username) return `@${username}`;
  return "مستخدم";
}

export async function upsertGroupMember(
  chatId: string,
  user: TgUser,
  opts?: { isAdmin?: boolean },
) {
  if (user.is_bot) return null;

  const telegramUserId = String(user.id);
  const row = await prisma.telegramGroupMember.upsert({
    where: {
      chatId_telegramUserId: { chatId, telegramUserId },
    },
    create: {
      chatId,
      telegramUserId,
      firstName: user.first_name ?? null,
      lastName: user.last_name ?? null,
      username: user.username ?? null,
      isBot: false,
      isAdmin: opts?.isAdmin ?? false,
    },
    update: {
      firstName: user.first_name ?? null,
      lastName: user.last_name ?? null,
      username: user.username ?? null,
      ...(opts?.isAdmin !== undefined ? { isAdmin: opts.isAdmin } : {}),
    },
  });

  return row;
}

export async function syncGroupAdmins(chatId: string) {
  const admins = await tgGetChatAdministrators(chatId);
  if (!admins.ok) return { ok: false as const, error: admins.error, count: 0 };

  let count = 0;
  for (const entry of admins.members) {
    if (entry.user.is_bot) continue;
    await upsertGroupMember(chatId, entry.user, { isAdmin: true });
    count++;
  }

  return { ok: true as const, count };
}

export async function getGroupMembers(chatId: string): Promise<GroupMember[]> {
  try {
    const rows = await prisma.telegramGroupMember.findMany({
      where: { chatId, isBot: false },
      orderBy: [{ isAdmin: "desc" }, { lastSeenAt: "desc" }],
    });
    return rows.map((r) => ({
      telegramUserId: r.telegramUserId,
      chatId: r.chatId,
      firstName: r.firstName,
      lastName: r.lastName,
      username: r.username,
      isBot: r.isBot,
      isAdmin: r.isAdmin,
      displayName: displayName(r.firstName, r.lastName, r.username),
      lastSeenAt: r.lastSeenAt,
    }));
  } catch {
    return [];
  }
}

export async function getTelegramDisplayName(telegramUserId: string): Promise<string | null> {
  try {
    const row = await prisma.telegramGroupMember.findFirst({
      where: { telegramUserId },
      orderBy: { lastSeenAt: "desc" },
    });
    if (!row) return null;
    return displayName(row.firstName, row.lastName, row.username);
  } catch {
    return null;
  }
}

export function isSalesGroupChat(chatId: string | number) {
  const salesChat = process.env.TELEGRAM_SALES_CHAT_ID;
  if (!salesChat) return false;
  return String(chatId) === salesChat;
}
