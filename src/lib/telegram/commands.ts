import { getAllSalesReps, updateSalesRep } from "@/lib/sales/repository";
import { tgSendMessage } from "@/lib/telegram/bot";
import { getGroupMembers, syncGroupAdmins, upsertGroupMember } from "@/lib/telegram/members";
import type { TgChat, TgUser } from "@/lib/telegram/types";

export async function handleTelegramCommand(
  text: string,
  from: TgUser,
  chat: TgChat,
): Promise<boolean> {
  const chatId = String(chat.id);
  await upsertGroupMember(chatId, from);

  const cmd = text.trim().split(/\s+/);
  const command = cmd[0].toLowerCase().replace(/@\w+$/, "");
  const arg = cmd[1];

  if (command === "/start") {
    if (chat.type === "private") {
      const reps = await getAllSalesReps();
      const linked = reps.find((r) => r.telegramUserId === String(from.id));
      await tgSendMessage(
        chatId,
        linked
          ? [
              `👋 أهلاً <b>${from.first_name ?? linked.name}</b>`,
              "",
              `✅ حسابك مربوط بـ <b>${linked.name}</b>`,
              "🔔 هتوصلك تفاصيل العملاء هنا في الخاص.",
            ].join("\n")
          : [
              `👋 أهلاً <b>${from.first_name ?? "مندوب"}</b>`,
              "",
              "لربط حسابك كمندوب، ارجع للجروب وابعت:",
              "<code>/link s1</code>",
              "(غيّر s1 لرقم المندوب من الداشبورد)",
            ].join("\n"),
      );
    }
    return true;
  }

  if (command === "/me" || command === "/ايدي") {
    const name = from.first_name ?? "مندوب";
    const user = from.username ? `@${from.username}` : "—";
    await tgSendMessage(
      chatId,
      [
        `👤 <b>${name}</b>`,
        `🆔 User ID: <code>${from.id}</code>`,
        `📛 Username: ${user}`,
        "",
        "لربط حسابك كمندوب، ابعت:",
        `<code>/link s1</code>`,
        "(غيّر s1 لرقم المندوب من الداشبورد)",
      ].join("\n"),
    );
    return true;
  }

  if (command === "/link" || command === "/ربط") {
    if (!arg) {
      await tgSendMessage(chatId, "⚠️ الاستخدام: <code>/link s1</code>");
      return true;
    }

    const reps = await getAllSalesReps();
    const rep = reps.find((r) => r.id === arg);
    if (!rep) {
      await tgSendMessage(chatId, `❌ مندوب <code>${arg}</code> غير موجود.`);
      return true;
    }

    const taken = reps.find((r) => r.telegramUserId === String(from.id) && r.id !== arg);
    if (taken) {
      await tgSendMessage(
        chatId,
        `⚠️ حسابك مربوط بالفعل بـ <b>${taken.name}</b>.`,
      );
      return true;
    }

    if (rep.telegramUserId && rep.telegramUserId !== String(from.id)) {
      await tgSendMessage(
        chatId,
        `⚠️ المندوب <b>${rep.name}</b> مربوط بحساب تاني.`,
      );
      return true;
    }

    await updateSalesRep(rep.id, {
      telegramUserId: String(from.id),
      telegramChatId: String(from.id),
    });
    await tgSendMessage(
      chatId,
      [
        `✅ تم ربط <b>${rep.name}</b> بحسابك.`,
        "",
        "🔔 هتوصلك تفاصيل العملاء <b>في الخاص</b> بس — محدش تاني يشوفها.",
        "",
        chat.type !== "private"
          ? "⚠️ افتح البوت في الخاص وابعت <code>/start</code> عشان الإشعارات توصلك."
          : "✅ حسابك جاهز لاستقبال العملاء.",
      ].join("\n"),
    );
    return true;
  }

  if (command === "/مندوبين" || command === "/reps") {
    const reps = await getAllSalesReps();
    const lines = reps.map((r) => {
      const linked = r.telegramUserId ? "✅" : "❌";
      return `${linked} <code>${r.id}</code> — ${r.name}`;
    });
    await tgSendMessage(
      chatId,
      `<b>فريق المبيعات</b>\n\n${lines.join("\n")}\n\nاربط نفسك: <code>/link s1</code>`,
    );
    return true;
  }

  if (command === "/اعضاء" || command === "/members" || command === "/sync") {
    const salesChatId = process.env.TELEGRAM_SALES_CHAT_ID ?? chatId;
    const synced = await syncGroupAdmins(salesChatId);
    const members = await getGroupMembers(salesChatId);

    if (members.length === 0) {
      await tgSendMessage(
        chatId,
        [
          "⚠️ مفيش أعضاء مسجّلين لسه.",
          "",
          "• خلّي البوت <b>أدمن</b> في الجروب",
          "• أو ابعت <code>/me</code> من كل مندوب",
          "• أو شغّل: <code>npm run telegram:sync</code>",
        ].join("\n"),
      );
      return true;
    }

    const lines = members.slice(0, 30).map((m) => {
      const badge = m.isAdmin ? "👑" : "👤";
      const user = m.username ? ` @${m.username}` : "";
      const linked = m.telegramUserId ? `<code>${m.telegramUserId}</code>` : "";
      return `${badge} <b>${m.displayName}</b>${user} — ${linked}`;
    });

    const syncNote = synced.ok
      ? `\n\n🔄 تم تحديث ${synced.count} أدمن من الجروب`
      : "\n\n⚠️ تعذّر جلب الأدمن — تأكد إن البوت داخل الجروب";

    await tgSendMessage(
      chatId,
      `<b>أعضاء الجروب (${members.length})</b>\n\n${lines.join("\n")}${syncNote}\n\nاربط نفسك: <code>/link s1</code>`,
    );
    return true;
  }

  return false;
}
