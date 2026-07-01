import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE, verifySessionToken } from "@/lib/auth/session";

export async function GET() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: "admin" });
}
