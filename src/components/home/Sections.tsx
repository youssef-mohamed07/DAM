"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Star,
  MessageCircle,
  Phone,
  Mail,
  ArrowLeft,
  Plus,
  TrendingUp,
  Percent,
  Landmark,
  Home,
  Building2,
  Scale,
} from "lucide-react";
import { testimonials, faqItems } from "@/lib/data/content";
import { company, whatsappUrl, facebookUrl } from "@/lib/data/company";
import { PropertyCard } from "@/components/property/PropertyCard";
import { formatPrice } from "@/lib/data/properties";
import { useProperties } from "@/providers/PropertiesProvider";
import { t, formatPhoneIntl, formatPhoneLocal } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Num } from "@/components/ui/Num";

export function FeaturedProperties() {
  const { properties } = useProperties();
  const featured = properties.filter((p) => p.featured);
  const [hero, ...rest] = featured.length ? featured : properties.slice(0, 3);

  return (
    <section className="dam-section-gap dam-section-dark pt-4 md:pt-6">
      <div className="dam-container relative">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            label={{ en: "", ar: "المجموعة" }}
            title={{ en: "", ar: "عقارات مختارة في العبور" }}
            description={{
              en: "",
              ar: "وحدات حقيقية في جولف سيتي وروك فيلا وريفيل العبور — بأسعار محدثة وأنظمة سداد مرنة.",
            }}
            className="mb-0"
          />
          <Link
            href="/properties"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-gold/30 px-5 py-2.5 text-sm text-gold transition hover:bg-gold hover:text-black"
          >
            عرض الكل ({properties.length})
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {hero && <PropertyCard property={hero} variant="hero" />}
          </div>
          <div className="flex flex-col gap-4 lg:col-span-5">
            {rest.slice(0, 3).map((p, i) => (
              <PropertyCard key={p.id} property={p} variant="compact" index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function InvestmentDashboard() {
  const growth = company.marketStats[1];
  const yieldStat = company.marketStats[3];

  return (
    <section id="investment" className="dam-section-gap dam-ivory dam-section-split-light">
      <div className="dam-container relative">
        <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            label={{ en: "", ar: "السوق" }}
            title={{ en: "", ar: "أبرز مشاريع العبور" }}
            description={{
              en: "",
              ar: "أسعار البدء وأنظمة السداد — جولف سيتي، روك فيلا، ريفيل، وجزيل.",
            }}
            light
            className="mb-0 max-w-xl"
          />

          <div className="flex flex-wrap gap-3 lg:shrink-0">
            <div className="flex items-center gap-3 rounded-2xl border border-gold/25 bg-white px-5 py-3 shadow-sm">
              <TrendingUp className="h-5 w-5 text-gold" />
              <div>
                <p className="font-serif text-2xl text-gold">{growth.val}</p>
                <p className="text-[11px] text-black/45">{growth.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-black/8 bg-white px-5 py-3 shadow-sm">
              <Percent className="h-5 w-5 text-gold" />
              <div>
                <p className="font-serif text-2xl text-gold">{yieldStat.val}</p>
                <p className="text-[11px] text-black/45">{yieldStat.label}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {company.projects.map((project, i) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="dam-district-premium group flex flex-col p-6"
            >
              <p className="text-[10px] font-medium tracking-[0.2em] text-gold uppercase">
                يبدأ من
              </p>
              <p className="font-serif mt-2 text-2xl text-[#0a0a0a] transition group-hover:text-gold">
                {project.priceFrom}
              </p>
              <h3 className="mt-4 text-base font-semibold text-[#0a0a0a]">{project.name}</h3>
              <p className="mt-1 text-xs text-black/40">{project.developer}</p>

              <div className="dam-divider my-5" />

              <p className="text-sm text-black/55">{project.units}</p>
              <p className="mt-2 text-xs text-black/40">{project.payment}</p>

              <span className="mt-auto inline-flex w-fit rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[11px] text-gold">
                {project.highlight}
              </span>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-6 py-2.5 text-sm text-white transition hover:bg-gold hover:text-black"
          >
            استكشف كل العقارات
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const [featured, ...others] = testimonials;

  return (
    <section className="dam-section-gap dam-section-dark dam-section-split">
      <div className="dam-container relative">
        <SectionHeader
          label={{ en: "", ar: "عملاؤنا" }}
          title={{ en: "", ar: "ماذا يقول المشترون" }}
          description={{
            en: "",
            ar: "تجارب حقيقية من عملاء اشتروا عبر DAM في جولف سيتي وروك فيلا وريفيل العبور.",
          }}
          align="center"
          className="mb-12"
        />

        <div className="grid gap-6 lg:grid-cols-12">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="dam-card-dark flex flex-col justify-between rounded-3xl p-8 lg:col-span-7 lg:p-10"
          >
            <div>
              <div className="flex gap-1">
                {Array.from({ length: featured.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="font-serif mt-6 text-2xl leading-relaxed text-[#0a0a0a] md:text-3xl">
                &ldquo;{t(featured.quote)}&rdquo;
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-gold/30">
                <Image src={featured.image} alt="" fill className="object-cover" />
              </div>
              <div>
                <p className="font-medium text-[#0a0a0a]">{t(featured.name)}</p>
                <p className="text-sm text-black/45">{t(featured.property)}</p>
              </div>
            </div>
          </motion.blockquote>

          <div className="flex flex-col gap-4 lg:col-span-5">
            {others.map((item) => (
              <div key={item.id} className="dam-card-dark rounded-2xl p-6">
                <div className="flex gap-1">
                  {Array.from({ length: item.rating }).map((_, j) => (
                    <Star key={j} className="h-3 w-3 fill-gold text-gold" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-black/60">
                  &ldquo;{t(item.quote)}&rdquo;
                </p>
                <p className="mt-4 text-sm font-medium text-[#0a0a0a]">{t(item.name)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AgentsSection() {
  const areaIcons = {
    golf: Landmark,
    rock: Home,
    "new-obour": Building2,
    finance: Scale,
  } as const;

  return (
    <section className="dam-section-gap dam-ivory dam-section-split-light">
      <div className="dam-container">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            label={{ en: "", ar: "استشارة" }}
            title={{ en: "", ar: "كيف نساعدك؟" }}
            description={{
              en: "",
              ar: "تخصص في كل منطقة ومشروع — تواصل مباشرة مع فريق DAM.",
            }}
            light
            className="mb-0 max-w-lg"
          />
          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappUrl("مرحباً، أريد استشارة عقارية في العبور")}
              className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gold hover:text-black"
            >
              <MessageCircle className="h-4 w-4" />
              واتساب
            </a>
            <a
              href={`tel:${company.phone}`}
              className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-2.5 text-sm text-black/70 transition hover:border-gold hover:text-gold"
            >
              <Phone className="h-4 w-4" />
              <Num>{formatPhoneLocal(company.phoneLocal)}</Num>
            </a>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {company.consultationAreas.map((area, i) => {
            const Icon = areaIcons[area.id as keyof typeof areaIcons] ?? Building2;
            return (
              <motion.article
                key={area.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-black/[0.06] bg-white p-6 transition hover:border-gold/30 hover:shadow-[0_8px_32px_rgba(201,162,39,0.08)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/25 bg-gold/10">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="mt-5 font-semibold text-[#0a0a0a]">{area.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/50">{area.desc}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="dam-section-gap dam-section-dark dam-section-split">
      <div className="dam-container relative max-w-3xl">
        <SectionHeader
          label={{ en: "", ar: "الأسئلة الشائعة" }}
          title={{ en: "", ar: "كل ما تحتاج معرفته" }}
          description={{
            en: "",
            ar: "إجابات عن الأسعار والتمويل والمشاريع في مدينة العبور.",
          }}
          align="center"
          className="mb-10"
        />
        <div className="space-y-3">
          {faqItems.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`dam-card-dark overflow-hidden rounded-2xl transition ${
                  isOpen ? "border-gold/30 bg-gold/5" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
                >
                  <span className="font-medium text-[#0a0a0a]">{t(item.q)}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 transition ${
                      isOpen ? "rotate-45 border-gold/40 bg-gold/10" : ""
                    }`}
                  >
                    <Plus className="h-4 w-4 text-gold" />
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-black/55">
                    {t(item.a)}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ContactCTA() {
  return (
    <section className="dam-ivory dam-section">
      <div className="dam-container">
        <div className="relative overflow-hidden rounded-[2rem] border border-gold/25 bg-white px-8 py-14 text-center shadow-[0_24px_80px_rgba(0,0,0,0.06)] md:px-16 md:py-20">
          <div className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -start-16 h-48 w-48 rounded-full bg-gold/8 blur-2xl" />
          <p className="text-[11px] font-semibold tracking-[0.4em] text-gold uppercase">
            ابدأ رحلتك
          </p>
          <h2 className="font-serif relative mx-auto mt-4 max-w-2xl text-3xl text-[#0a0a0a] md:text-5xl">
            جاهز لعقارك في العبور؟
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-black/55">
            استشارة مجانية · معاينات خاصة · مقارنة بين المشاريع
          </p>
          <p className="relative mt-3 font-serif text-2xl text-gold">
            <Num>{formatPhoneIntl(company.phone)}</Num>
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-black transition hover:brightness-110"
            >
              تواصل معنا
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <a
              href={whatsappUrl("مرحباً، أريد استشارة عقارية في العبور")}
              className="rounded-full border border-black/15 px-8 py-3.5 text-sm text-black/70 transition hover:border-gold hover:text-gold"
            >
              واتساب
            </a>
            <a
              href={facebookUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-black/15 px-8 py-3.5 text-sm text-black/70 transition hover:border-gold hover:text-gold"
            >
              فيسبوك
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  const fields = [
    { key: "name", label: "الاسم" },
    { key: "email", label: "البريد الإلكتروني" },
    { key: "phone", label: "الهاتف" },
    { key: "message", label: "رسالتك" },
  ];

  return (
    <section className="dam-ivory dam-section">
      <div className="dam-container grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeader
            label={{ en: "", ar: "تواصل" }}
            title={{ en: "", ar: "تواصل معنا" }}
            description={{
              en: "",
              ar: "أخبرنا بما تبحث عنه — نرد خلال يوم عمل واحد.",
            }}
            light
            className="mb-8"
          />
          <form className="space-y-4">
            {fields.map((f) =>
              f.key === "message" ? (
                <textarea
                  key={f.key}
                  rows={4}
                  placeholder={f.label}
                  className="w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-gold"
                />
              ) : (
                <input
                  key={f.key}
                  type={f.key === "email" ? "email" : "text"}
                  placeholder={f.label}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-gold"
                />
              ),
            )}
            <button
              type="button"
              className="w-full rounded-xl bg-[#0a0a0a] py-4 font-semibold text-white transition hover:bg-gold hover:text-black"
            >
              إرسال
            </button>
          </form>
        </div>
        <div className="rounded-3xl bg-[#0a0a0a] p-8 text-white md:p-10">
          <h3 className="font-serif text-2xl text-gold">{company.name}</h3>
          <p className="mt-4 text-white/55">{company.address}</p>
          <p className="mt-1 text-sm text-white/40">{company.addressDetail}</p>
          <p className="mt-4 text-white/55">{company.hours}</p>
          <p className="text-white/45">{company.hoursFriday}</p>
          <div className="mt-6 space-y-3 text-sm text-white/55">
            <p>{company.phoneDisplay}</p>
            <p>{company.phoneLocal}</p>
            <p>{company.email}</p>
            <a
              href={facebookUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold transition hover:underline"
            >
              صفحتنا على فيسبوك
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MortgageSection() {
  const [loan, setLoan] = useState(5_000_000);
  const [rate, setRate] = useState(18);
  const [years, setYears] = useState(15);
  const monthly =
    (loan * (rate / 100 / 12) * Math.pow(1 + rate / 100 / 12, years * 12)) /
    (Math.pow(1 + rate / 100 / 12, years * 12) - 1);

  return (
    <section className="dam-section dam-section-dark">
      <div className="dam-container max-w-xl">
        <SectionHeader
          label={{ en: "", ar: "أدوات" }}
          title={{ en: "", ar: "حاسبة التمويل" }}
          align="center"
          className="mb-8"
        />
        <div className="dam-card-dark space-y-6 rounded-3xl p-8">
          {[
            { label: "مبلغ القرض", val: loan, set: setLoan, min: 1_000_000, max: 20_000_000, step: 100_000, display: formatPrice(loan) },
            { label: "الفائدة %", val: rate, set: setRate, min: 10, max: 25, step: 1, display: `${rate}٪` },
            { label: "المدة (سنوات)", val: years, set: setYears, min: 5, max: 25, step: 1, display: `${years}` },
          ].map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">{f.label}</span>
                <span className="font-medium text-white">{f.display}</span>
              </div>
              <input
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={f.val}
                onChange={(e) => f.set(+e.target.value)}
                className="mt-2 w-full accent-gold"
              />
            </div>
          ))}
          <div className="rounded-2xl border border-gold/25 bg-gold/10 p-6 text-center">
            <p className="text-xs tracking-widest text-white/40">القسط الشهري</p>
            <p className="font-serif mt-2 text-3xl text-gold">{formatPrice(Math.round(monthly))}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
