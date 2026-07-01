import { NextResponse } from "next/server";
import { getSystemSettings, updateSystemSettings } from "@/lib/settings/store";

export async function GET() {
  const settings = await getSystemSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const settings = await updateSystemSettings({
    ...(body.autoAssign !== undefined ? { autoAssign: Boolean(body.autoAssign) } : {}),
    ...(body.autoNotifyTelegram !== undefined
      ? { autoNotifyTelegram: Boolean(body.autoNotifyTelegram) }
      : {}),
    ...(body.distributionStrategy !== undefined
      ? { distributionStrategy: body.distributionStrategy }
      : {}),
  });
  return NextResponse.json(settings);
}
