"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { IMAGES } from "@/lib/images";
import { company, whatsappUrl } from "@/lib/data/company";
import { useLocale } from "@/providers/LocaleProvider";
import { useApp } from "@/providers/AppProvider";
import { HeroPropertyFlow } from "@/components/home/HeroPropertyFlow";
import { Num } from "@/components/ui/Num";

export function Hero() {
  const { loaded } = useApp();
  const { dict, path, company: co } = useLocale();
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <section className="relative w-full overflow-hidden bg-[#0a0a0a]">
      {/* Background — fixed layer, no scroll-linked opacity */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {loaded && !videoFailed ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={IMAGES.heroPoster}
            onError={() => setVideoFailed(true)}
            className="h-full w-full object-cover opacity-50"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-luxurious-house-with-a-pool-3281-large.mp4"
              type="video/mp4"
            />
          </video>
        ) : (
          <Image
            src={IMAGES.heroPoster}
            alt=""
            fill
            priority
            className="object-cover opacity-45"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-[#0a0a0a]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-[#0a0a0a]/70" />
      </div>

      <div className="dam-container relative z-10 px-4 pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_420px] lg:gap-12 xl:grid-cols-[1fr_440px] xl:gap-16">
          {/* Copy */}
          <motion.div
            initial={loaded ? { opacity: 0, y: 20 } : false}
            animate={loaded ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl pt-2 lg:pt-6"
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-white/70 uppercase">
              <MapPin className="h-3 w-3" />
              {co.hero.eyebrow}
            </p>

            <h1 className="font-serif mt-6 text-balance text-4xl leading-[1.12] font-semibold text-white sm:text-5xl lg:text-6xl">
              {co.hero.title}
              <span className="mt-2 block text-2xl font-normal text-white/75 sm:text-3xl lg:text-4xl">
                {co.hero.highlight}
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
              {co.tagline}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {co.stats.slice(0, 4).map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-center backdrop-blur-sm"
                >
                  <p className="font-serif text-xl text-white sm:text-2xl">
                    <Num>{s.value}</Num>
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-white/55 sm:text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={path("/properties")}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/90"
              >
                {dict.hero.explore}
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
              >
                <Phone className="h-4 w-4" />
                {dict.nav.whatsapp}
              </a>
            </div>
          </motion.div>

          {/* Form — stays visible while scrolling through hero */}
          <motion.div
            initial={loaded ? { opacity: 0, y: 24 } : false}
            animate={loaded ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:sticky lg:top-28 lg:self-start"
          >
            <HeroPropertyFlow />
            <p className="mt-3 text-center text-[11px] text-white/35">
              {company.nameAr} · {dict.trustBar.obour}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
