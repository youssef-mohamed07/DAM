"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Percent,
  ChevronLeft,
  ArrowLeft,
  BarChart3,
  MapPin,
} from "lucide-react";
import { company, whatsappUrl } from "@/lib/data/company";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function MarketPageContent() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-white">
      <section className="border-b border-black/8 pt-24">
        <div className="dam-container dam-section-gap">
          <p className="text-[11px] font-semibold tracking-[0.4em] text-gold uppercase">السوق</p>
          <h1 className="font-serif mt-4 max-w-3xl text-balance text-3xl text-[#0a0a0a] sm:text-4xl md:text-6xl">
            مؤشرات سوق العبور ٢٠٢٥–٢٠٢٦
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[#0a0a0a]/55">
            بيانات محدثة لأبرز الكمبوندات — أسعار البدء، نمو السوق، وعائد الإيجار على الوحدات
            الجاهزة.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {company.marketStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="rounded-2xl border border-black/10 bg-ivory p-5"
              >
                <p className="text-[10px] text-black/40">{s.label}</p>
                <p className="font-serif mt-2 text-3xl text-gold">{s.val}</p>
                <p className="mt-1 text-xs text-black/45">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="dam-section-gap dam-ivory dam-section-split-light">
        <div className="dam-container">
          <SectionHeader
            label={{ en: "", ar: "المشاريع" }}
            title={{ en: "", ar: "أسعار البدء وأنظمة السداد" }}
            description={{
              en: "",
              ar: "مقارنة بين أبرز مشاريع العبور — جولف سيتي، روك فيلا، ريفيل، وجزيل.",
            }}
            light
            className="mb-10"
          />

          <div className="grid gap-4 lg:grid-cols-2">
            {company.projects.map((project, i) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="dam-district-premium flex flex-col p-7 md:flex-row md:items-center md:justify-between md:gap-8"
              >
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-gold uppercase">يبدأ من</p>
                  <p className="font-serif mt-2 text-3xl text-[#0a0a0a]">{project.priceFrom}</p>
                  <h3 className="mt-3 text-xl font-semibold text-[#0a0a0a]">{project.name}</h3>
                  <p className="mt-1 text-sm text-black/40">{project.developer}</p>
                </div>
                <div className="mt-5 md:mt-0 md:text-end">
                  <p className="text-sm text-black/55">{project.units}</p>
                  <p className="mt-2 text-sm text-black/40">{project.payment}</p>
                  <p className="mt-1 text-xs text-black/35">{project.area}</p>
                  <span className="mt-4 inline-flex rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[11px] text-gold">
                    {project.highlight}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="dam-section-gap dam-section-dark dam-section-split">
        <div className="dam-container">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeader
                label={{ en: "", ar: "تحليل" }}
                title={{ en: "", ar: "لماذا يستثمر المشترون في العبور؟" }}
                description={{
                  en: "",
                  ar: "موقع استراتيجي، مرافق متكاملة، وطلب متزايد على الكمبوندات الجاهزة.",
                }}
                className="mb-8"
              />
              <div className="space-y-4">
                {company.obourFacts.map((f) => (
                  <div
                    key={f.title}
                    className="dam-card-dark flex gap-4 rounded-2xl p-5"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <div>
                      <p className="font-medium text-[#0a0a0a]">{f.title}</p>
                      <p className="mt-1 text-sm text-black/50">{f.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="dam-about-panel rounded-3xl border border-black/10 p-8">
                <BarChart3 className="h-8 w-8 text-gold" />
                <h3 className="font-serif mt-4 text-2xl text-[#0a0a0a]">مؤشرات سريعة</h3>
                <div className="mt-6 space-y-4">
                  {company.heroStats.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center justify-between border-b border-black/8 pb-4 last:border-0"
                    >
                      <div>
                        <p className="text-sm text-black/70">{s.label}</p>
                        <p className="text-xs text-black/35">{s.sub}</p>
                      </div>
                      <p className="font-serif text-2xl text-gold">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gold/25 bg-gold/10 p-5">
                  <TrendingUp className="h-5 w-5 text-gold" />
                  <p className="font-serif mt-3 text-2xl text-gold">
                    {company.marketStats[1].val}
                  </p>
                  <p className="text-xs text-black/45">نمو الأسعار</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-ivory p-5">
                  <Percent className="h-5 w-5 text-gold" />
                  <p className="font-serif mt-3 text-2xl text-gold">
                    {company.marketStats[3].val}
                  </p>
                  <p className="text-xs text-black/45">عائد الإيجار</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              استكشف العقارات
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <a
              href={whatsappUrl("مرحباً، أريد استشارة عن سوق العبور")}
              className="inline-flex items-center gap-2 rounded-full border border-gold/35 px-7 py-3 text-sm text-gold transition hover:bg-white hover:text-black"
            >
              استشارة مجانية
              <ChevronLeft className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
