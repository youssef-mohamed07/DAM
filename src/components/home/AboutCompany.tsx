"use client";

import Link from "next/link";
import { ChevronLeft, Users } from "lucide-react";
import { useLocale } from "@/providers/LocaleProvider";
import { getDamFamilyContent } from "@/lib/i18n/dam-family";

export function AboutCompany() {
  const { dict, path, locale } = useLocale();
  const family = getDamFamilyContent(locale);

  return (
    <section id="dam-family" className="dam-section-gap dam-section-dark">
      <div className="dam-container">
        <div className="dam-about-panel rounded-[1.75rem] px-6 py-10 text-center md:px-12 md:py-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
            <Users className="h-5 w-5" />
          </div>
          <p className="mt-5 text-[11px] font-semibold tracking-[0.35em] text-black uppercase">
            {dict.damFamilySection.eyebrow}
          </p>
          <h2 className="font-serif mt-3 text-3xl text-[#0a0a0a] md:text-4xl">{family.headline}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-black/55">{family.lead}</p>

          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {family.stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-black/8 bg-ivory px-2 py-3">
                <p className="font-serif text-xl text-black">{s.value}</p>
                <p className="mt-0.5 text-[10px] text-black/45">{s.label}</p>
              </div>
            ))}
          </div>

          <Link
            href={path("/dam-family")}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-black/20 px-6 py-2.5 text-sm text-black transition hover:bg-black hover:text-white"
          >
            {dict.damFamilySection.cta}
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
