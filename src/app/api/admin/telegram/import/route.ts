import { NextResponse } from "next/server";
import { tgGetUpdates } from "@/lib/telegram/bot";
import {
  getTelegramImportStats,
  listTelegramListings,
  parseAllUnparsedMessages,
} from "@/lib/telegram/messages-store";
import {
  publishAllListings,
  publishListingToSite,
  reparseListingsWithChatDistrict,
} from "@/lib/telegram/publish-listings";
import { processTelegramUpdate } from "@/lib/telegram/updates";

export const maxDuration = 120;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const chatId = searchParams.get("chatId") ?? undefined;
  const limit = Number(searchParams.get("limit") ?? "50");
  const offset = Number(searchParams.get("offset") ?? "0");

  const [stats, listings] = await Promise.all([
    getTelegramImportStats(),
    listTelegramListings({ q, chatId, limit, offset }),
  ]);

  return NextResponse.json({ stats, listings });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  if (body.action === "pull") {
    let offset: number | undefined;
    let pulled = 0;

    for (let page = 0; page < 100; page++) {
      const batch = await tgGetUpdates(offset);
      if (!batch.ok || batch.updates.length === 0) break;
      for (const raw of batch.updates) {
        const u = raw as { update_id: number };
        offset = u.update_id + 1;
        await processTelegramUpdate(raw as Record<string, unknown>);
        pulled++;
      }
    }

    const parsed = await parseAllUnparsedMessages();
    const districts = await reparseListingsWithChatDistrict();
    const stats = await getTelegramImportStats();

    return NextResponse.json({ ok: true, pulled, parsed, districts, stats });
  }

  if (body.action === "parse") {
    const parsed = await parseAllUnparsedMessages();
    const districts = await reparseListingsWithChatDistrict();
    const stats = await getTelegramImportStats();
    return NextResponse.json({ ok: true, parsed, districts, stats });
  }

  if (body.action === "publish") {
    const result = await publishAllListings({
      chatId: body.chatId as string | undefined,
    });
    const stats = await getTelegramImportStats();
    return NextResponse.json({ ok: true, ...result, stats });
  }

  if (body.action === "publishOne" && body.listingId) {
    const result = await publishListingToSite(body.listingId as string);
    const stats = await getTelegramImportStats();
    return NextResponse.json({ ...result, stats });
  }

  return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });
}
