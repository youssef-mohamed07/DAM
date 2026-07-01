import type { TgUser } from "@/lib/telegram/types";

const API = () => `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

export async function tgApi<T = unknown>(method: string, body?: Record<string, unknown>) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false as const, error: "no token" };

  const res = await fetch(`${API()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!data.ok) return { ok: false as const, error: JSON.stringify(data) };
  return { ok: true as const, result: data.result as T };
}

export function tgMention(userId: string, name: string) {
  return `<a href="tg://user?id=${userId}">${name}</a>`;
}

type ChatMember = { status: string; user: TgUser };

export async function tgGetChatAdministrators(chatId: string) {
  const res = await tgApi<ChatMember[]>("getChatAdministrators", { chat_id: chatId });
  if (!res.ok) return { ok: false as const, error: res.error, members: [] as ChatMember[] };
  return { ok: true as const, members: res.result };
}

export async function tgGetUpdates(offset?: number) {
  const res = await tgApi<unknown[]>("getUpdates", {
    offset,
    limit: 100,
    allowed_updates: ["message", "chat_member", "my_chat_member"],
  });
  if (!res.ok) return { ok: false as const, error: res.error, updates: [] as unknown[] };
  return { ok: true as const, updates: res.result };
}

export async function tgSendMessage(
  chatId: string,
  text: string,
  extra?: { reply_markup?: unknown; parse_mode?: string },
) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false as const, error: "no token" };

  const res = await fetch(`${API()}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      ...extra,
    }),
  });

  const data = await res.json();
  if (!data.ok) return { ok: false as const, error: JSON.stringify(data) };
  return { ok: true as const, data };
}

export async function tgSetWebhook(url: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return false;
  const res = await fetch(`${API()}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      allowed_updates: ["message", "chat_member", "my_chat_member"],
    }),
  });
  const data = await res.json();
  return data.ok === true;
}
