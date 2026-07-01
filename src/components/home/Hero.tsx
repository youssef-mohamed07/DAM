"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Search, MapPin, Home, ChevronDown, Calendar, ArrowLeft } from "lucide-react";
import { IMAGES } from "@/lib/images";
import { districts } from "@/lib/data/districts";
import { formatPrice } from "@/lib/data/properties";
import { useProperties } from "@/providers/PropertiesProvider";
import { company } from "@/lib/data/company";
import { t } from "@/lib/utils";
import { Num } from "@/components/ui/Num";

const typeOptions = [
  { value: "villa", label: "فيلا" },
  { value: "apartment", label: "شقة" },
  { value: "penthouse", label: "بنتهاوس" },
  { value: "duplex", label: "دوبلكس" },
];

export function Hero() {
  const { properties } = useProperties();
  const spotlight = properties.find((p) => p.slug === "golf-twin-golf-view") ?? properties[0];
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 120]);
  const opacity = useTransform(scrollY, [0, 350], [1, 0]);
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-[#080808]">
      <motion.div style={{ y }} className="absolute inset-0">
        {!videoFailed ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={IMAGES.heroPoster}
            onError={() => setVideoFailed(true)}
            className="dam-hero-video h-full w-full object-cover"
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
            className="dam-hero-video object-cover"
            sizes="100vw"
          />
        )}
        <div className="dam-hero-overlay absolute inset-0" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex min-h-[92svh] flex-col justify-end pb-28 pt-32 md:pb-32 md:pt-36"
      >
        <div className="dam-container grid items-end gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-[11px] font-semibold tracking-[0.45em] text-gold-bright uppercase"
            >
              {company.hero.eyebrow}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="dam-hero-title font-serif mt-5 max-w-3xl text-[2.75rem] leading-[1.08] font-semibold text-white md:text-6xl lg:text-7xl"
            >
              {company.hero.title}
              <br />
              <span className="text-gradient-gold italic">{company.hero.highlight}</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold text-black shadow-[0_6px_28px_rgba(201,162,39,0.45)] transition hover:brightness-110"
              >
                استكشف العقارات
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-md transition hover:border-gold hover:bg-gold/15 hover:text-gold-bright"
              >
                <Calendar className="h-4 w-4" />
                احجز استشارة
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl border border-gold/25 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:p-6">
              <p className="mb-4 text-xs font-bold tracking-widest text-gold uppercase">
                ابحث عن عقارك
              </p>
              <div className="space-y-3">
                <div className="relative">
                  <MapPin className="absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-gold" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="select-light w-full rounded-xl py-3 pe-4 ps-10 text-sm outline-none focus:ring-1 focus:ring-gold"
                  >
                    <option value="">كل المناطق</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {t(d.name)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <Home className="absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-gold" />
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="select-light w-full rounded-xl py-3 pe-4 ps-10 text-sm outline-none focus:ring-1 focus:ring-gold"
                  >
                    <option value="">كل الأنواع</option>
                    {typeOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Link
                  href={`/properties?district=${location}&type=${type}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3 text-sm font-semibold text-black transition hover:brightness-110"
                >
                  <Search className="h-4 w-4" />
                  بحث
                </Link>
              </div>
            </div>

            {spotlight && (
              <Link
                href={`/properties/${spotlight.slug}`}
                className="mt-4 block rounded-2xl border border-gold/20 bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition hover:border-gold/50"
              >
                <p className="text-[10px] font-bold tracking-widest text-gold uppercase">
                  عقار مميز
                </p>
                <p className="font-serif mt-1 text-xl font-medium text-[#0a0a0a]">{t(spotlight.title)}</p>
                <p className="mt-1 text-sm font-bold text-gold">
                  <Num>{formatPrice(spotlight.price)}</Num>
                </p>
              </Link>
            )}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-20 start-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-white/45"
      >
        <span className="text-[9px] tracking-[0.35em] uppercase">اكتشف</span>
        <ChevronDown className="h-4 w-4" />
      </motion.div>
    </section>
  );
}
