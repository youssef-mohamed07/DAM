import { NextResponse } from "next/server";
import { processTelegramUpdate } from "@/lib/telegram/updates";

export async function POST(request: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && request.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    await processTelegramUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[telegram webhook]", e);
    return NextResponse.json({ ok: true });
  }
}
