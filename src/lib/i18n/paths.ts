import type { Locale } from "@/types";
import { defaultLocale } from "@/lib/i18n/config";

/** Strip /en prefix or /ar prefix from pathname */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return pathname.replace(/^\/en/, "") || "/";
  }
  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    return pathname.replace(/^\/ar/, "") || "/";
  }
  return pathname;
}

export function getLocaleFromPathname(pathname: string): Locale {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return defaultLocale;
}

/** Build a locale-aware path. Arabic stays unprefixed; English uses /en. */
export function localizedPath(path: string, locale: Locale): string {
  const base = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return base === "//" ? "/" : base;
  if (base === "/") return "/en";
  return `/en${base}`;
}

/** Switch locale while keeping the same page */
export function switchLocalePath(pathname: string, target: Locale): string {
  const bare = stripLocalePrefix(pathname);
  return localizedPath(bare, target);
}
