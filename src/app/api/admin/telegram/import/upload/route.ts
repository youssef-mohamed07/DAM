import { NextResponse } from "next/server";
import { getTelegramImportStats, parseAllUnparsedMessages } from "@/lib/telegram/messages-store";
import { importTelegramExportJson } from "@/lib/telegram/import-export";
import { reparseListingsWithChatDistrict } from "@/lib/telegram/publish-listings";

export const maxDuration = 300;

export async function POST(request: Request) {
  const form = await request.formData();
  const files = form.getAll("files");

  if (!files.length) {
    return NextResponse.json({ error: "ارفع ملف result.json واحد على الأقل" }, { status: 400 });
  }

  const results: Awaited<ReturnType<typeof importTelegramExportJson>>[] = [];
  const errors: string[] = [];

  for (const entry of files) {
    if (!(entry instanceof File)) continue;
    if (!entry.name.endsWith(".json")) {
      errors.push(`${entry.name}: ليس ملف JSON`);
      continue;
    }

    try {
      const text = await entry.text();
      const data = JSON.parse(text);
      const result = await importTelegramExportJson(data);
      results.push(result);
    } catch (e) {
      errors.push(`${entry.name}: ${e instanceof Error ? e.message : "فشل القراءة"}`);
    }
  }

  const parsed = await parseAllUnparsedMessages();
  const districts = await reparseListingsWithChatDistrict();
  const stats = await getTelegramImportStats();

  return NextResponse.json({
    ok: true,
    imported: results,
    parsed,
    districts,
    stats,
    errors,
  });
}
