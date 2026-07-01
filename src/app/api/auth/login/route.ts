import { NextResponse } from "next/server";
import {
  COOKIE,
  MAX_AGE,
  createSessionToken,
  getAdminCredentials,
} from "@/lib/auth/session";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const creds = getAdminCredentials();
  if (username !== creds.username || password !== creds.password) {
    return NextResponse.json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" }, { status: 401 });
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}
