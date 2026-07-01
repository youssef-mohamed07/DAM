"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { company } from "@/lib/data/company";
import { Num } from "@/components/ui/Num";

export function AboutCompany() {
  return (
    <section id="about" className="dam-section-gap dam-section-dark">
      <div className="dam-container">
        <div className="dam-about-panel rounded-[1.75rem] px-6 py-10 text-center md:px-12 md:py-12">
          <p className="text-[11px] font-semibold tracking-[0.35em] text-gold uppercase">
            من نحن
          </p>
          <h2 className="font-serif mt-3 text-3xl text-[#0a0a0a] md:text-4xl">
            {company.about.headline}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-black/55">
            {company.about.lead}
          </p>

          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {company.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-black/8 bg-ivory px-2 py-3"
              >
                <p className="font-serif text-xl text-gold">
                  <Num>{s.value}</Num>
                </p>
                <p className="mt-0.5 text-[10px] text-black/45">{s.label}</p>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-2.5 text-sm text-gold transition hover:bg-gold hover:text-black"
          >
            اعرف أكثر عن DAM
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
