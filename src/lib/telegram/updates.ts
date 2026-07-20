import { handleTelegramCommand } from "@/lib/telegram/commands";
import { upsertGroupMember } from "@/lib/telegram/members";
import { saveTelegramMessage } from "@/lib/telegram/messages-store";
import type { TgChat, TgUser } from "@/lib/telegram/types";

type TgPhotoSize = { file_id: string };

type TgMessage = {
  message_id?: number;
  date?: number;
  from?: TgUser;
  chat?: TgChat;
  text?: string;
  caption?: string;
  photo?: TgPhotoSize[];
  document?: { file_id: string; mime_type?: string };
  video?: { file_id: string };
  new_chat_members?: TgUser[];
  left_chat_member?: TgUser;
};

function recordUsers(chatId: string, users: TgUser[] | undefined, isAdmin = false) {
  if (!users?.length) return Promise.resolve();
  return Promise.all(
    users.filter((u) => !u.is_bot).map((u) => upsertGroupMember(chatId, u, { isAdmin })),
  );
}

function senderName(from?: TgUser) {
  if (!from) return null;
  const full = [from.first_name, from.last_name].filter(Boolean).join(" ").trim();
  return full || (from.username ? `@${from.username}` : null);
}

async function persistMessage(message: TgMessage) {
  if (!message.chat?.id || !message.message_id) return;

  const chatId = String(message.chat.id);
  const isGroup = message.chat.type === "group" || message.chat.type === "supergroup";
  if (!isGroup) return;

  const text = message.text ?? message.caption ?? null;
  const photo = message.photo?.length ? message.photo[message.photo.length - 1] : null;

  let mediaType: string | null = null;
  let mediaFileId: string | null = null;
  if (photo) {
    mediaType = "photo";
    mediaFileId = photo.file_id;
  } else if (message.document) {
    mediaType = "document";
    mediaFileId = message.document.file_id;
  } else if (message.video) {
    mediaType = "video";
    mediaFileId = message.video.file_id;
  }

  if (!text && !mediaFileId) return;

  await saveTelegramMessage({
    chatId,
    messageId: message.message_id,
    chatTitle: message.chat.title ?? null,
    senderUserId: message.from ? String(message.from.id) : null,
    senderName: senderName(message.from),
    text,
    hasMedia: Boolean(mediaFileId),
    mediaType,
    mediaFileId,
    messageDate: new Date((message.date ?? Date.now() / 1000) * 1000),
    raw: message,
  });
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
    await upsertGroupMember(chatId, message.left_chat_member);
  }

  if (message.text?.startsWith("/") && message.from) {
    await handleTelegramCommand(message.text, message.from, message.chat);
    return;
  }

  if (isGroup && message.from && !message.from.is_bot) {
    await upsertGroupMember(chatId, message.from);
  }

  await persistMessage(message);
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
