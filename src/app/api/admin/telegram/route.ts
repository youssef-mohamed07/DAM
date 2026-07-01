import { NextResponse } from "next/server";
import { getGroupMembers, syncGroupAdmins } from "@/lib/telegram/members";
import { getTelegramHealth } from "@/lib/telegram/status";
import { getAllSalesReps } from "@/lib/sales/repository";

export async function GET() {
  const [health, reps] = await Promise.all([getTelegramHealth(), getAllSalesReps()]);

  const chatId = health.groupChatId;
  const members = chatId ? await getGroupMembers(chatId) : [];

  const rows = members.map((m) => {
    const linked = reps.find((r) => r.telegramUserId === m.telegramUserId);
    return { ...m, linkedRepId: linked?.id, linkedRepName: linked?.name };
  });

  const unlinkedReps = reps
    .filter((r) => r.active)
    .map((r) => ({
      ...r,
      telegramLinked: Boolean(r.telegramUserId),
    }));

  return NextResponse.json({
    botConfigured: health.botConfigured && health.botOnline,
    groupChatId: chatId,
    botUsername: health.botUsername,
    statusMessage: health.statusMessage,
    members: rows,
    reps: unlinkedReps,
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const chatId = process.env.TELEGRAM_SALES_CHAT_ID;

  if (body.action === "sync") {
    if (!chatId) {
      return NextResponse.json({ error: "TELEGRAM_SALES_CHAT_ID غير مضبوط" }, { status: 400 });
    }
    const result = await syncGroupAdmins(chatId);
    const members = await getGroupMembers(chatId);
    return NextResponse.json({ ...result, memberCount: members.length, members });
  }

  return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });
}
