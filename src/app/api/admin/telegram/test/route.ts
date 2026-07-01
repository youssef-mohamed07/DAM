import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { buildTelegramLeadPayload } from "@/lib/leads/messages";
import { tgSendMessage } from "@/lib/telegram/bot";
import { getTelegramDisplayName } from "@/lib/telegram/members";
import { getSalesRep } from "@/lib/sales/repository";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const repId = body.repId as string | undefined;

  if (!repId) {
    return NextResponse.json({ error: "repId مطلوب" }, { status: 400 });
  }

  const rep = await getSalesRep(repId);
  if (!rep?.telegramUserId) {
    return NextResponse.json({ error: "المندوب غير مربوط بتليجرام" }, { status: 400 });
  }

  const tgName = (await getTelegramDisplayName(rep.telegramUserId)) ?? rep.name;
  const now = new Date().toISOString();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const payload = buildTelegramLeadPayload(
    {
      id: "test-admin",
      createdAt: now,
      updatedAt: now,
      status: "assigned",
      source: "manual",
      propertyTitle: "رسالة تجربة من الداشبورد",
      clientName: "عميل تجريبي",
      clientPhone: "01000000000",
      message: "هذه رسالة اختبار — النظام يعمل ✅",
      assignedSalesId: rep.id,
      assignedAt: now,
    },
    rep,
    siteUrl,
    { private: true, telegramDisplayName: tgName },
  );

  const result = await tgSendMessage(rep.telegramUserId, payload.text, {
    reply_markup: payload.reply_markup.inline_keyboard.length
      ? payload.reply_markup
      : undefined,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, sentTo: tgName });
}
