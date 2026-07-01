import { NextResponse } from "next/server";
import { handleTelegramCommand } from "@/lib/telegram/commands";
import { isSalesGroupChat, upsertGroupMember } from "@/lib/telegram/members";
import type { TgUser } from "@/lib/telegram/types";

function recordUsers(chatId: string, users: TgUser[] | undefined, isAdmin = false) {
  if (!users?.length) return;
  return Promise.all(users.filter((u) => !u.is_bot).map((u) => upsertGroupMember(chatId, u, { isAdmin })));
}

export async function POST(request: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && request.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const chatMember = body?.chat_member;
    if (chatMember?.chat?.id && chatMember.new_chat_member?.user) {
      const chatId = String(chatMember.chat.id);
      const status = chatMember.new_chat_member.status;
      if (status !== "left" && status !== "kicked") {
        await upsertGroupMember(chatId, chatMember.new_chat_member.user, {
          isAdmin: status === "administrator" || status === "creator",
        });
      }
    }

    const message = body?.message;
    if (message?.chat?.id) {
      const chatId = String(message.chat.id);

      if (message.from) {
        await upsertGroupMember(chatId, message.from);
      }

      await recordUsers(chatId, message.new_chat_members);

      if (message.text?.startsWith("/")) {
        await handleTelegramCommand(message.text, message.from, message.chat);
      } else if (isSalesGroupChat(chatId) && message.from && !message.from.is_bot) {
        await upsertGroupMember(chatId, message.from);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[telegram webhook]", e);
    return NextResponse.json({ ok: true });
  }
}
