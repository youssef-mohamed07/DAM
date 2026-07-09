import { handleTelegramCommand } from "@/lib/telegram/commands";
import { upsertGroupMember } from "@/lib/telegram/members";
import type { TgChat, TgUser } from "@/lib/telegram/types";

type TgMessage = {
  message_id?: number;
  from?: TgUser;
  chat?: TgChat;
  text?: string;
  new_chat_members?: TgUser[];
  left_chat_member?: TgUser;
};

function recordUsers(chatId: string, users: TgUser[] | undefined, isAdmin = false) {
  if (!users?.length) return Promise.resolve();
  return Promise.all(
    users.filter((u) => !u.is_bot).map((u) => upsertGroupMember(chatId, u, { isAdmin })),
  );
}

async function handleMessage(message: TgMessage) {
  if (!message.chat?.id) return;

  const chatId = String(message.chat.id);
  const isGroup = message.chat.type === "group" || message.chat.type === "supergroup";

  if (message.from && !message.from.is_bot) {
    await upsertGroupMember(chatId, message.from);
  }

  if (message.new_chat_members?.length) {
    await recordUsers(chatId, message.new_chat_members);
  }

  if (message.left_chat_member && !message.left_chat_member.is_bot) {
    // نحتفظ بالعضو في الداتابيز — مفيد للربط لاحقاً
    await upsertGroupMember(chatId, message.left_chat_member);
  }

  if (message.text?.startsWith("/") && message.from) {
    await handleTelegramCommand(message.text, message.from, message.chat);
    return;
  }

  // أي رسالة في الجروب (بعد تعطيل Privacy Mode) — تسجيل المرسل
  if (isGroup && message.from && !message.from.is_bot) {
    await upsertGroupMember(chatId, message.from);
  }
}

/** معالجة update واحد من Telegram (webhook أو polling) */
export async function processTelegramUpdate(body: Record<string, unknown>) {
  const chatMember = body.chat_member as
    | {
        chat?: { id: number };
        new_chat_member?: { status: string; user: TgUser };
      }
    | undefined;

  if (chatMember?.chat?.id && chatMember.new_chat_member?.user) {
    const chatId = String(chatMember.chat.id);
    const status = chatMember.new_chat_member.status;
    if (status !== "left" && status !== "kicked" && !chatMember.new_chat_member.user.is_bot) {
      await upsertGroupMember(chatId, chatMember.new_chat_member.user, {
        isAdmin: status === "administrator" || status === "creator",
      });
    }
  }

  const myChatMember = body.my_chat_member as typeof chatMember;
  if (myChatMember?.chat?.id && myChatMember.new_chat_member?.user) {
    const chatId = String(myChatMember.chat.id);
    const status = myChatMember.new_chat_member.status;
    if (status !== "left" && status !== "kicked") {
      await upsertGroupMember(chatId, myChatMember.new_chat_member.user, {
        isAdmin: status === "administrator" || status === "creator",
      });
    }
  }

  const message = body.message as TgMessage | undefined;
  if (message) await handleMessage(message);

  const edited = body.edited_message as TgMessage | undefined;
  if (edited) await handleMessage(edited);
}
