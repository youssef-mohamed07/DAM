"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLocale } from "@/providers/LocaleProvider";
import { switchLocalePath } from "@/lib/i18n/paths";
import type { Locale } from "@/types";

export function LanguageSwitcher({ className, inverted }: { className?: string; inverted?: boolean }) {
  const pathname = usePathname();
  const { locale, dict } = useLocale();

  const options: { code: Locale; label: string }[] = [
    { code: "ar", label: dict.language.ar },
    { code: "en", label: dict.language.en },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border p-0.5 text-[11px] font-semibold",
        inverted ? "border-white/20 bg-white/10" : "border-black/10 bg-black/[0.03]",
        className,
      )}
      role="group"
      aria-label={dict.language.switch}
    >
      {options.map((opt) => {
        const active = locale === opt.code;
        return (
          <Link
            key={opt.code}
            href={switchLocalePath(pathname, opt.code)}
            className={cn(
              "rounded-full px-2.5 py-1 transition",
              active
                ? inverted
                  ? "bg-white text-black"
                  : "bg-black text-white"
                : inverted
                  ? "text-white/70 hover:text-white"
                  : "text-black/50 hover:text-black",
            )}
            aria-current={active ? "true" : undefined}
          >
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}
