"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, GitCompare, Bed, Bath, Maximize, ArrowUpLeft, MessageCircle } from "lucide-react";
import type { Property } from "@/types";
import { useFavorites, useCompare } from "@/providers/FavoritesProvider";
import { usePropertyInterest } from "@/components/leads/usePropertyInterest";
import { formatPrice } from "@/lib/data/properties";
import { saleCategoryLabel, formatPaymentPlan } from "@/lib/properties/sale-category";
import { Num } from "@/components/ui/Num";
import { useLocale } from "@/providers/LocaleProvider";

interface PropertyCardProps {
  property: Property;
  index?: number;
  variant?: "default" | "hero" | "compact";
}

export function PropertyCard({ property, index = 0, variant = "default" }: PropertyCardProps) {
  const { t, path, dict, locale } = useLocale();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCompare } = useCompare();
  const { open: openInterest, modal: interestModal } = usePropertyInterest({
    id: property.id,
    slug: property.slug,
    title: t(property.title),
  });
  const fav = isFavorite(property.id);

  const paymentPlan = formatPaymentPlan(property, locale);
  const categoryLabel = saleCategoryLabel(property.saleCategory, locale);

  if (variant === "hero") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="group dam-card-elevated overflow-hidden rounded-2xl"
      >
        <Link href={path(`/properties/${property.slug}`)} className="block">
          <div className="relative aspect-[4/3] overflow-hidden lg:aspect-[16/11]">
            <Image
              src={property.images[0]}
              alt={t(property.title)}
              fill
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute start-5 top-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold tracking-wider text-black uppercase">
                {categoryLabel}
              </span>
              {property.tags.slice(0, 1).map((tag) => (
                <span
                  key={tag.en}
                  className="rounded-full bg-white px-3 py-1 text-[10px] font-bold tracking-wider text-black uppercase"
                >
                  {t(tag)}
                </span>
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <p className="text-xs tracking-widest text-white/80 uppercase">{dict.featured}</p>
              <h3 className="font-serif mt-2 text-3xl text-white md:text-4xl">
                {t(property.title)}
              </h3>
              <p className="mt-3 text-2xl font-medium text-white">
                <Num>{formatPrice(property.price)}</Num>
              </p>
              {paymentPlan ? (
                <p className="mt-2 text-sm text-white/75">{paymentPlan}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1.5">
                  <Bed className="h-4 w-4 text-white/80" /> {property.bedrooms} {dict.bedrooms}
                </span>
                <span className="flex items-center gap-1.5">
                  <Bath className="h-4 w-4 text-white/80" /> {property.bathrooms} {dict.bathrooms}
                </span>
                <span className="flex items-center gap-1.5">
                  <Maximize className="h-4 w-4 text-white/80" /> {property.area} {dict.sqm}
                </span>
              </div>
            </div>
            <div className="absolute end-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white opacity-0 transition group-hover:opacity-100">
              <ArrowUpLeft className="h-4 w-4" />
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  if (variant === "compact") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        className="group dam-card overflow-hidden rounded-xl"
      >
        <Link href={path(`/properties/${property.slug}`)} className="flex gap-4 p-3">
          <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={property.images[0]}
              alt={t(property.title)}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="112px"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="truncate font-serif text-lg text-[#0a0a0a]">{t(property.title)}</p>
            <p className="mt-1 text-sm font-medium text-gold">
              <Num>{formatPrice(property.price)}</Num>
            </p>
            <p className="mt-1 text-xs text-black/45">
              {categoryLabel}
              {paymentPlan ? ` · ${paymentPlan}` : ""}
            </p>
            <p className="mt-1 text-xs text-black/45">
              {property.bedrooms} {dict.bedrooms} · {property.area} {dict.sqm}
            </p>
          </div>
          <ArrowUpLeft className="mt-1 h-4 w-4 shrink-0 text-black/30 transition group-hover:text-gold" />
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.07 }}
      className="group dam-card overflow-hidden rounded-2xl"
    >
      <Link href={path(`/properties/${property.slug}`)}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={property.images[0]}
            alt={t(property.title)}
            fill
            className="object-cover transition duration-600 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
          <div className="absolute start-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold tracking-wider text-black uppercase">
              {categoryLabel}
            </span>
            {property.tags[0] && (
              <span className="rounded-full bg-black/95 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                {t(property.tags[0])}
              </span>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="font-serif text-xl text-white">{t(property.title)}</p>
            <p className="mt-1 text-lg font-medium text-gold">
              <Num>{formatPrice(property.price)}</Num>
            </p>
            {paymentPlan ? (
              <p className="mt-1 text-xs text-white/70">{paymentPlan}</p>
            ) : (
              <p className="mt-1 text-xs text-white/70">{dict.propertiesPage.cashSale}</p>
            )}
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex gap-3 text-xs text-black/50">
          <span className="flex items-center gap-1">
            <Bed className="h-3.5 w-3.5 text-gold" /> {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5 text-gold" /> {property.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="h-3.5 w-3.5 text-gold" /> {property.area}م²
          </span>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="اهتمام"
            onClick={openInterest}
            className="rounded-full p-2 text-gold transition hover:bg-gold/10"
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="المفضلة"
            onClick={() => toggleFavorite(property.id)}
            className={`rounded-full p-2 transition ${fav ? "bg-gold text-white" : "text-white/40 hover:bg-black/5 hover:text-white"}`}
          >
            <Heart className={`h-3.5 w-3.5 ${fav ? "fill-current" : ""}`} />
          </button>
          <button
            type="button"
            aria-label="مقارنة"
            onClick={() => addToCompare(property)}
            className="rounded-full p-2 text-black/40 transition hover:bg-black/5 hover:text-black"
          >
            <GitCompare className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {interestModal}
    </motion.article>
  );
}
