import { NextResponse } from "next/server";
import { fetchChatHistoryFromLink } from "@/lib/telegram/fetch-history";
import { gramSetupInstructions, getGramConfig } from "@/lib/telegram/gram-client";
import { getTelegramImportStats } from "@/lib/telegram/messages-store";

export const maxDuration = 300;

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const url = body.url as string | undefined;
  const mode = body.mode === "all" ? "all" : "from";

  if (!url?.trim()) {
    return NextResponse.json({ error: "الرابط مطلوب" }, { status: 400 });
  }

  if (!getGramConfig()) {
    return NextResponse.json(
      {
        error: "GRAM_NOT_CONFIGURED",
        instructions: gramSetupInstructions(),
      },
      { status: 400 },
    );
  }

  try {
    const result = await fetchChatHistoryFromLink(url.trim(), mode);
    const stats = await getTelegramImportStats();
    return NextResponse.json({ ok: true, ...result, stats });
  } catch (e) {
    const message = e instanceof Error ? e.message : "فشل السحب";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
