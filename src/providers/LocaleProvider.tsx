"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/types";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionary";
import { getCompanyContent, type CompanyContent } from "@/lib/i18n/company";
import { getLocaleFromPathname, localizedPath } from "@/lib/i18n/paths";
import { localeDir } from "@/lib/i18n/config";
import { translate, type Bilingual } from "@/lib/i18n/translate";

type LocaleContextValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  dict: Dictionary;
  company: CompanyContent;
  t: (obj: Bilingual) => string;
  path: (href: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const dir = localeDir(locale);

  const value = useMemo<LocaleContextValue>(() => {
    const dict = getDictionary(locale);
    return {
      locale,
      dir,
      dict,
      company: getCompanyContent(locale),
      t: (obj: Bilingual) => translate(obj, locale),
      path: (href: string) => localizedPath(href, locale),
    };
  }, [locale, dir]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

/** For admin routes outside LocaleProvider */
export function useLocaleOptional(): LocaleContextValue | null {
  return useContext(LocaleContext);
}
