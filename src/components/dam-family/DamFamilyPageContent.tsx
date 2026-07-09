"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Gift,
  Calendar,
  Headphones,
  UserPlus,
  Shield,
  CheckCircle2,
  ArrowLeft,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { IMAGES } from "@/lib/images";
import { whatsappUrl } from "@/lib/data/company";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LogoMark } from "@/components/ui/Logo";
import { Num } from "@/components/ui/Num";
import { useLocale } from "@/providers/LocaleProvider";
import { getDamFamilyContent } from "@/lib/i18n/dam-family";

const benefitIcons = [Shield, Headphones, Gift, Calendar, UserPlus, Users];

export function DamFamilyPageContent() {
  const { path, locale } = useLocale();
  const content = getDamFamilyContent(locale);
  const joinMessage =
    locale === "en"
      ? "Hello, I'd like to join DAM Family"
      : "مرحباً، أريد الانضمام لبرنامج دام فاميلي";

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-white pt-24">
      <section className="relative overflow-hidden border-b border-white/8">
        <div className="absolute inset-0">
          <Image src={IMAGES.interior2} alt="" fill className="object-cover opacity-25" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-[#0a0a0a]/92 to-[#0a0a0a]" />
        </div>
        <div className="dam-container relative py-16 md:py-24">
          <LogoMark size="md" priority className="mb-6 shadow-[0_0_32px_rgba(255,255,255,0.06)]" />
          <p className="text-[11px] font-semibold tracking-[0.35em] text-white/50 uppercase">
            DAM Family
          </p>
          <h1 className="font-serif mt-4 max-w-3xl text-balance text-3xl leading-tight text-white sm:text-4xl md:text-6xl">
            {content.headline}
          </h1>
          <p className="mt-4 text-sm font-medium tracking-wide text-white/70">{content.tagline}</p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">{content.lead}</p>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {content.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur-sm"
              >
                <p className="font-serif text-2xl text-white sm:text-3xl">
                  <Num>{s.value}</Num>
                </p>
                <p className="mt-1 text-sm font-medium text-white">{s.label}</p>
                <p className="text-[10px] text-white/40">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dam-section dam-section-dark">
        <div className="dam-container">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                label={{ en: "Community", ar: "المجتمع" }}
                title={{ en: "What is DAM Family?", ar: "إيه هو دام فاميلي؟" }}
                description={{
                  en: "Our client loyalty program in Obour — free for everyone who buys or reserves with us.",
                  ar: "برنامج ولاء عملائنا في العبور — مجاني لكل من يحجز أو يشتري معنا.",
                }}
              />
              <div className="space-y-5 text-base leading-[1.85] text-black/60">
                {content.intro.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-black/10">
              <Image src={IMAGES.modern} alt="" fill className="object-cover" sizes="50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-6">
                <Sparkles className="h-5 w-5 text-white" />
                <p className="text-sm text-white/85">{content.tagline}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="dam-ivory dam-section">
        <div className="dam-container">
          <SectionHeader
            label={{ en: "Benefits", ar: "المزايا" }}
            title={{ en: "Exclusive member perks", ar: "مزايا حصرية للأعضاء" }}
            description={{
              en: "From first viewing through handover and beyond.",
              ar: "من أول معاينة لحد التسليم وبعده.",
            }}
            align="center"
            light
            className="mb-12"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.benefits.map((item, i) => {
              const Icon = benefitIcons[i] ?? Gift;
              return (
                <article key={item.title} className="dam-card-elevated rounded-2xl p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[#0a0a0a]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/55">{item.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="dam-section dam-section-dark">
        <div className="dam-container">
          <SectionHeader
            label={{ en: "How it works", ar: "كيف يعمل" }}
            title={{ en: "Three simple steps", ar: "٣ خطوات بسيطة" }}
            align="center"
            className="mb-12"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {content.steps.map((step, i) => (
              <div key={step.title} className="dam-card-dark relative rounded-2xl p-8 text-center">
                <span className="font-serif text-5xl text-black/10">{i + 1}</span>
                <h3 className="mt-2 text-xl font-semibold text-[#0a0a0a]">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-black/55">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 dam-card-elevated rounded-3xl p-8 md:p-10">
            <h3 className="font-serif text-2xl text-[#0a0a0a]">{content.who.title}</h3>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {content.who.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-black/60">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-black" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="dam-ivory dam-section">
        <div className="dam-container">
          <div className="rounded-3xl border border-black/10 bg-white p-8 text-center md:p-14">
            <p className="text-[11px] tracking-widest text-black/40 uppercase">DAM Family</p>
            <h2 className="font-serif mt-4 text-3xl text-[#0a0a0a] md:text-4xl">{content.cta.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-black/55">{content.cta.lead}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={whatsappUrl(joinMessage)}
                className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-black/85"
              >
                <MessageCircle className="h-4 w-4" />
                {content.cta.primary}
              </a>
              <Link
                href={path("/contact")}
                className="inline-flex items-center gap-2 rounded-full border border-black/15 px-8 py-3.5 text-sm text-black/70 transition hover:border-black hover:text-black"
              >
                {locale === "en" ? "Book a consultation" : "احجز استشارة"}
              </Link>
              <Link
                href={path("/properties")}
                className="inline-flex items-center gap-2 text-sm text-black/50 transition hover:text-black"
              >
                {content.cta.secondary}
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
