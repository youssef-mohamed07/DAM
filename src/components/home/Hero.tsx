"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, MapPin, Home, ChevronDown, Calendar, ArrowLeft, Sparkles } from "lucide-react";
import { IMAGES } from "@/lib/images";
import { districts } from "@/lib/data/districts";
import { formatPrice } from "@/lib/data/properties";
import { useProperties } from "@/providers/PropertiesProvider";
import { company } from "@/lib/data/company";
import { t } from "@/lib/utils";
import { Num } from "@/components/ui/Num";
import { useApp } from "@/providers/AppProvider";

const typeOptions = [
  { value: "villa", label: "فيلا" },
  { value: "apartment", label: "شقة" },
  { value: "penthouse", label: "بنتهاوس" },
  { value: "duplex", label: "دوبلكس" },
];

export function Hero() {
  const { loaded } = useApp();
  const { properties } = useProperties();
  const spotlight = properties.find((p) => p.slug === "golf-twin-golf-view") ?? properties[0];
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 120]);
  const opacity = useTransform(scrollY, [0, 350], [1, 0]);
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [videoFailed, setVideoFailed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px), (prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section className="relative min-h-[100svh] w-full max-w-full overflow-x-clip">
      {/* Animated Background */}
      <motion.div style={reduceMotion ? undefined : { y }} className="absolute inset-0">
        {loaded && !videoFailed ? (
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
        <div className="dam-hero-overlay absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
        
        {/* Animated Gradient Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-gold-bright/10 via-transparent to-transparent"
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </motion.div>

      {/* Content Section */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex min-h-[100svh] flex-col justify-between pb-20 pt-28 sm:pb-28 sm:pt-32 md:pb-32 md:pt-36"
      >
        <div className="dam-container grid min-w-0 items-end gap-12 sm:gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Left Content */}
          <div className="min-w-0 lg:col-span-7 space-y-8">
            {/* Badge */}
            <motion.div
              initial={loaded ? { opacity: 0, x: -30 } : false}
              animate={loaded ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-gold-bright/30 bg-gold-bright/10 px-4 py-2 backdrop-blur-sm w-fit"
            >
              <Sparkles className="h-3 w-3 text-gold-bright" />
              <span className="text-xs font-semibold text-gold-bright tracking-widest uppercase">
                العقارات الفاخرة
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={loaded ? { opacity: 0, y: 40 } : false}
              animate={loaded ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="space-y-3"
            >
              <h1 className="dam-hero-title font-serif text-4xl leading-[1.08] font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                {company.hero.title}
              </h1>
              <p className="text-2xl sm:text-3xl md:text-4xl font-light text-gold-bright/90 italic">
                {company.hero.highlight}
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={loaded ? { opacity: 0, y: 20 } : false}
              animate={loaded ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed"
            >
              استكشف مجموعة حصرية من العقارات الفاخرة في أجمل المناطق، مع خدمات استشارية متميزة وتصاميم معمارية عصرية.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={loaded ? { opacity: 0, y: 24 } : false}
              animate={loaded ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-wrap gap-3 pt-2 sm:gap-4"
            >
              <Link
                href="/properties"
                className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-bright px-7 py-3.5 text-sm sm:text-base font-bold text-black shadow-lg shadow-gold/40 transition duration-300 hover:shadow-xl hover:shadow-gold/60 hover:scale-105"
              >
                استكشف العقارات
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.div>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/5 px-7 py-3.5 text-sm sm:text-base font-semibold text-white backdrop-blur-md transition duration-300 hover:border-gold hover:bg-gold/20 hover:text-gold-bright"
              >
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                احجز استشارة
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Search & Featured */}
          <motion.div
            initial={loaded ? { opacity: 0, y: 32 } : false}
            animate={loaded ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="min-w-0 w-full lg:col-span-5 space-y-4"
          >
            {/* Search Card */}
            <motion.div 
              whileHover={reduceMotion ? undefined : { y: -4 }}
              className="min-w-0 overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-white/95 to-white/90 p-6 shadow-2xl backdrop-blur-xl"
            >
              <p className="mb-5 text-xs font-bold tracking-widest text-gold uppercase flex items-center gap-2">
                <Search className="h-3 w-3" />
                ابحث عن عقارك المثالي
              </p>
              <div className="space-y-4">
                <div className="relative group">
                  <MapPin className="absolute top-1/2 start-4 h-4 w-4 -translate-y-1/2 text-gold group-hover:text-gold-bright transition" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="select-light w-full min-w-0 max-w-full rounded-xl py-3.5 pe-4 ps-11 text-sm font-medium outline-none focus:ring-2 focus:ring-gold/50 bg-white/60 hover:bg-white transition"
                  >
                    <option value="">كل المناطق</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {t(d.name)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative group">
                  <Home className="absolute top-1/2 start-4 h-4 w-4 -translate-y-1/2 text-gold group-hover:text-gold-bright transition" />
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="select-light w-full min-w-0 max-w-full rounded-xl py-3.5 pe-4 ps-11 text-sm font-medium outline-none focus:ring-2 focus:ring-gold/50 bg-white/60 hover:bg-white transition"
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
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-bright py-3.5 text-sm font-bold text-black transition duration-300 hover:shadow-lg hover:shadow-gold/40 active:scale-95"
                >
                  <Search className="h-4 w-4" />
                  بحث الآن
                </Link>
              </div>
            </motion.div>

            {/* Featured Property Card */}
            {spotlight && (
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link
                  href={`/properties/${spotlight.slug}`}
                  className="group block min-w-0 overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-white/80 to-white/70 p-4 sm:p-5 shadow-xl backdrop-blur-sm transition hover:border-gold/60 hover:shadow-2xl hover:shadow-gold/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-[10px] font-bold tracking-widest text-gold uppercase flex items-center gap-1.5">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                      عقار مميز
                    </p>
                  </div>
                  <p className="font-serif text-lg sm:text-xl font-bold text-[#0a0a0a] group-hover:text-gold transition line-clamp-2">
                    {t(spotlight.title)}
                  </p>
                  <p className="mt-2 text-base sm:text-lg font-bold text-gold group-hover:text-gold-bright transition">
                    <Num>{formatPrice(spotlight.price)}</Num>
                  </p>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 sm:flex"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase font-light">اكتشف المزيد</span>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
