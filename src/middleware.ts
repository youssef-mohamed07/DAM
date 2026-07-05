import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE, verifySessionToken } from "@/lib/auth/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // روابط قديمة /en من مشروع تاني أو history المتصفح
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en\/?/, "/") || "/";
    return NextResponse.redirect(url);
  }

  if (pathname === "/admin/login") {
    const token = request.cookies.get(COOKIE)?.value;
    if (token && (await verifySessionToken(token))) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(COOKIE)?.value;
    if (!token || !(await verifySessionToken(token))) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("from", pathname);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    const token = request.cookies.get(COOKIE)?.value;
    if (!token || !(await verifySessionToken(token))) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/leads")) {
    if (request.method === "POST" && pathname === "/api/leads") {
      return NextResponse.next();
    }
    const token = request.cookies.get(COOKIE)?.value;
    if (!token || !(await verifySessionToken(token))) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/en", "/en/:path*", "/admin/:path*", "/api/leads/:path*", "/api/admin/:path*"],
};
