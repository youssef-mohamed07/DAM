"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Scale,
  Crown,
  Sparkles,
  MapPin,
  Building2,
  CheckCircle2,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { company, whatsappUrl, facebookUrl } from "@/lib/data/company";
import { IMAGES } from "@/lib/images";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LogoMark } from "@/components/ui/Logo";
import { Num } from "@/components/ui/Num";
import { formatPhoneIntl, formatPhoneLocal } from "@/lib/utils";

const serviceIcons = [Shield, Scale, Crown, Sparkles];

function districtHref(id: string) {
  return `/properties?district=${id === "reveal" || id === "jazeel" ? "new" : id}`;
}

export function AboutPageContent() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-white pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/8">
        <div className="absolute inset-0">
          <Image src={IMAGES.heroPoster} alt="" fill className="object-cover opacity-30" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/90 to-[#0a0a0a]" />
        </div>
        <div className="dam-container relative py-16 md:py-24">
          <LogoMark size="md" priority className="mb-6" />
          <p className="sr-only">DAM Properties</p>
          <h1 className="font-serif mt-4 max-w-3xl text-balance text-3xl leading-tight text-white sm:text-4xl md:text-6xl">
            {company.about.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            {company.about.lead}
          </p>
          <p className="mt-3 text-sm italic text-white/40">{company.about.facebookBio}</p>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {company.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur-sm"
              >
                <p className="font-serif text-3xl text-gold">{s.value}</p>
                <p className="mt-1 text-sm font-medium text-white">{s.label}</p>
                <p className="text-[10px] text-white/40">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* قصتنا */}
      <section className="dam-section dam-section-dark">
        <div className="dam-container">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                label={{ en: "", ar: "قصتنا" }}
                title={{ en: "", ar: "متخصصون في العبور منذ ٢٠١٦" }}
                description={{
                  en: "",
                  ar: "نربط المشترين والمستثمرين بأفضل الفرص في مدينة العبور والعبور الجديدة.",
                }}
              />
              <div className="space-y-5 text-base leading-[1.85] text-black/60">
                {company.about.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10">
              <Image src={IMAGES.pool} alt="" fill className="object-cover" sizes="50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-sm text-white/80">{company.address}</p>
                <p className="text-xs text-white/45">{company.addressDetail}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* خدماتنا */}
      <section className="dam-ivory dam-section">
        <div className="dam-container">
          <SectionHeader
            label={{ en: "", ar: "خدماتنا" }}
            title={{ en: "", ar: "ماذا نقدم لك" }}
            description={{
              en: "",
              ar: "من أول استشارة حتى توقيع العقد ومتابعة ما بعد البيع.",
            }}
            align="center"
            light
            className="mb-12"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {company.services.map((item, i) => {
              const Icon = serviceIcons[i] ?? Crown;
              return (
                <article key={item.title} className="dam-card-elevated rounded-2xl p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[#0a0a0a]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/55">{item.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* المشاريع */}
      <section className="dam-section dam-section-dark">
        <div className="dam-container">
          <SectionHeader
            label={{ en: "", ar: "شركاؤنا" }}
            title={{ en: "", ar: "مشاريع نُسوّقها في العبور" }}
            description={{
              en: "",
              ar: "كمبوندات ومشاريع سكنية وتجارية بأسعار وأنظمة سداد محدثة.",
            }}
            align="center"
            className="mb-12"
          />
          <div className="grid gap-5 md:grid-cols-2">
            {company.projects.map((p) => (
              <Link
                key={p.id}
                href={districtHref(p.id)}
                className="dam-card-dark group rounded-2xl p-6 transition hover:border-gold/35"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] tracking-wider text-gold/80">{p.developer}</p>
                    <h3 className="font-serif mt-2 text-2xl text-[#0a0a0a] group-hover:text-gold">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-sm text-black/45">{p.highlight}</p>
                  </div>
                  <Building2 className="h-5 w-5 shrink-0 text-gold/50" />
                </div>
                <ul className="mt-5 space-y-2 border-t border-black/8 pt-4 text-sm text-black/55">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
                    {p.area} · {p.units}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
                    من {p.priceFrom}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
                    {p.payment}
                  </li>
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* لماذا العبور */}
      <section className="dam-ivory dam-section">
        <div className="dam-container">
          <SectionHeader
            label={{ en: "", ar: "السوق" }}
            title={{ en: "", ar: "لماذا مدينة العبور؟" }}
            description={{
              en: "",
              ar: "أحد أسرع مدن الضواحي نمواً في مصر — موقع استراتيجي ومرافق متكاملة.",
            }}
            align="center"
            light
            className="mb-12"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {company.obourFacts.map((f) => (
              <div key={f.title} className="dam-card-elevated rounded-2xl p-5">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gold" />
                  <h3 className="font-semibold text-[#0a0a0a]">{f.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-black/55">{f.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {company.heroStats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-black/8 bg-white p-5 text-center"
              >
                <p className="font-serif text-2xl text-gold">{s.value}</p>
                <p className="mt-1 text-sm font-medium">{s.label}</p>
                <p className="text-xs text-black/40">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* تواصل */}
      <section className="dam-section dam-section-dark">
        <div className="dam-container">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="dam-card-dark rounded-3xl p-8">
              <h2 className="font-serif text-2xl text-[#0a0a0a]">تواصل معنا</h2>
              <p className="mt-3 text-sm text-black/55">
                استشارة مجانية · معاينات خاصة · رد خلال يوم عمل
              </p>
              <ul className="mt-8 space-y-4 text-sm text-black/60">
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gold" />
                  <span>
                    <Num>{formatPhoneIntl(company.phone)}</Num>
                  </span>
                  <span className="text-black/40">
                    (<Num>{formatPhoneLocal(company.phoneLocal)}</Num>)
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gold" />
                  {company.email}
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gold" />
                  {company.hours} · {company.hoursFriday}
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gold" />
                  {company.address}
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={whatsappUrl("مرحباً، أريد معرفة المزيد عن DAM Properties")}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-black"
                >
                  <MessageCircle className="h-4 w-4" />
                  واتساب
                </a>
                <a
                  href={facebookUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-black/15 px-5 py-2.5 text-sm text-black/70 transition hover:border-gold hover:text-gold"
                >
                  <Share2 className="h-4 w-4" />
                  فيسبوك
                </a>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent p-8 text-center md:p-12">
              <p className="text-[11px] tracking-widest text-gold uppercase">الخطوة التالية</p>
              <h2 className="font-serif mt-4 text-3xl text-[#0a0a0a]">جاهز تبدأ رحلتك؟</h2>
              <p className="mt-4 text-black/55">
                احجز استشارة مجانية وخلينا نساعدك تختار العقار المناسب في العبور.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center justify-center gap-2 self-center rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-black transition hover:brightness-110"
              >
                احجز استشارة
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link
                href="/properties"
                className="mt-4 text-sm text-gold/80 transition hover:text-gold"
              >
                أو تصفّح العقارات المتاحة
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
