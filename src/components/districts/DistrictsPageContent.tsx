"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Crown,
  Building2,
  ChevronLeft,
  MapPin,
  TrendingUp,
  School,
  Train,
} from "lucide-react";
import { ObourMap } from "@/components/home/ObourMap";
import {
  districtGroups,
  getDistrictsByGroup,
  getDistrictOrdinal,
  premiumDistrictMeta,
} from "@/lib/data/districts";
import { formatPrice } from "@/lib/data/properties";
import { company } from "@/lib/data/company";
import { t } from "@/lib/utils";

export function DistrictsPageContent() {
  const premium = getDistrictsByGroup("premium");
  const residential = getDistrictsByGroup("residential");

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-black/8 pt-24">
        <div className="dam-container dam-section-gap">
          <p className="text-[11px] font-semibold tracking-[0.4em] text-gold uppercase">
            مدينة العبور
          </p>
          <h1 className="font-serif mt-4 max-w-3xl text-4xl text-[#0a0a0a] md:text-6xl">
            ١٣ منطقة — من الأحياء السكنية إلى الكمبوندات الفاخرة
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[#0a0a0a]/55">
            ٩ أحياء سكنية + ٤ مشاريع فاخرة على مساحة ١٦,٠٠٠ فدان. استكشف كل منطقة على
            الخريطة واطّلع على الأسعار والمرافق.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {company.stats.slice(1, 3).map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-black/10 bg-ivory px-5 py-3"
              >
                <p className="font-serif text-2xl text-gold">{s.value}</p>
                <p className="text-xs text-black/45">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ObourMap />

      <section className="dam-section-gap dam-section-dark dam-section-split">
        <div className="dam-container space-y-14">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <Crown className="h-5 w-5 text-gold" />
              <h2 className="font-serif text-2xl text-[#0a0a0a] md:text-3xl">
                {districtGroups[0].label}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {premium.map((d, i) => {
                const meta = premiumDistrictMeta[d.id];
                return (
                  <motion.article
                    key={d.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="dam-district-premium p-6"
                  >
                    <span className="text-[10px] tracking-widest text-gold">{meta?.badge}</span>
                    <h3 className="mt-2 text-lg font-semibold text-[#0a0a0a]">{t(d.name)}</h3>
                    <p className="mt-1 text-xs text-black/40">{meta?.developer}</p>
                    <p className="font-serif mt-4 text-xl text-gold">
                      من {formatPrice(d.avgPrice)}
                    </p>
                    <p className="mt-1 text-xs text-black/40">متوسط السعر · {meta?.priceFrom}</p>
                    <div className="dam-divider my-4" />
                    <div className="flex flex-wrap gap-3 text-[11px] text-black/45">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-gold" />
                        {d.investmentScore}/١٠٠
                      </span>
                      <span className="flex items-center gap-1">
                        <School className="h-3 w-3 text-gold" />
                        {d.schools} مدرسة
                      </span>
                      <span className="flex items-center gap-1">
                        <Train className="h-3 w-3 text-gold" />
                        {t(d.transport)}
                      </span>
                    </div>
                    <Link
                      href={`/properties?district=${d.id}`}
                      className="mt-5 inline-flex items-center gap-1 text-sm text-gold transition hover:underline"
                    >
                      عرض العقارات
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-black/60" />
              <h2 className="font-serif text-2xl text-[#0a0a0a] md:text-3xl">
                {districtGroups[1].label}
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-9">
              {residential.map((d, i) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={`/properties?district=${d.id}`}
                    className="dam-card-dark flex flex-col items-center rounded-2xl px-3 py-5 text-center transition hover:border-gold/30"
                  >
                    <span className="font-serif text-3xl text-gold">{getDistrictOrdinal(d.id)}</span>
                    <span className="mt-1 text-xs text-black/60">
                      {t(d.name).replace("الحي ", "حي ")}
                    </span>
                    <span className="mt-3 text-[10px] text-black/35">
                      من {formatPrice(d.avgPrice)}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {company.obourFacts.slice(0, 3).map((f) => (
              <div key={f.title} className="dam-card-dark rounded-2xl p-5">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gold" />
                  <h3 className="font-medium text-[#0a0a0a]">{f.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-black/50">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
