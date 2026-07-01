"use client";

import { use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Heart,
  GitCompare,
  Share2,
  Phone,
  Mail,
  Calendar,
  Download,
  Printer,
} from "lucide-react";
import { formatPrice } from "@/lib/data/properties";
import { usePropertyBySlug } from "@/providers/PropertiesProvider";
import { agents } from "@/lib/data/agents";
import { company, whatsappUrl } from "@/lib/data/company";
import { PropertyInquiryButton } from "@/components/leads/PropertyInquiryButton";
import { useFavorites, useCompare } from "@/providers/FavoritesProvider";
import {
  t,
  propertyTypeLabel,
  districtLabel,
  deliveryLabel,
} from "@/lib/utils";

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { property, loading } = usePropertyBySlug(slug);
  const { toggleFavorite, isFavorite, addRecent } = useFavorites();
  const { addToCompare } = useCompare();

  useEffect(() => {
    if (property) addRecent(property.id);
  }, [property?.id, addRecent]);

  if (loading) {
    return <div className="min-h-screen bg-white pt-32 text-center text-black/40">جاري التحميل…</div>;
  }

  if (!property) notFound();

  const agent = agents.find((a) => a.id === property.agentId);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${property.lat},${property.lng}`;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-white pt-24 sm:pt-28">
      <div className="relative h-[50svh] min-h-[280px] sm:h-[60svh] md:h-[70vh]">
        <Image src={property.images[0]} alt="" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 md:p-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[10px] tracking-[0.3em] text-gold uppercase sm:text-xs sm:tracking-[0.4em]">
              {propertyTypeLabel(property.type)} · {districtLabel(property.district)}
            </p>
            <h1 className="font-serif mt-2 text-balance text-2xl text-white sm:text-3xl md:text-4xl lg:text-6xl">
              {t(property.title)}
            </h1>
            <p className="mt-3 text-xl font-semibold text-gold sm:mt-4 sm:text-2xl md:text-3xl">
              {formatPrice(property.price)}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="dam-container py-8 sm:py-12">
        <div className="flex flex-wrap gap-3">
          {[
            { icon: Heart, action: () => toggleFavorite(property.id), active: isFavorite(property.id), label: "مفضلة" },
            { icon: GitCompare, action: () => addToCompare(property), label: "مقارنة" },
            { icon: Share2, action: () => {}, label: "مشاركة" },
            { icon: Download, action: () => {}, label: "تحميل" },
            { icon: Printer, action: () => window.print(), label: "طباعة" },
          ].map(({ icon: Icon, action, active, label }, i) => (
            <button
              key={i}
              type="button"
              aria-label={label}
              onClick={action}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                active ? "border-gold bg-gold text-black" : "border-black/15 text-black/70 hover:border-gold hover:text-gold"
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <div className="grid grid-cols-3 gap-2">
              {property.images.map((img, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>

            <div className="dam-card-elevated rounded-2xl p-4 text-center text-black/45">
              جولة ٣٦٠° · فيديو درون · مخطط تفاعلي
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0a0a0a]">الوصف</h2>
              <p className="mt-4 leading-relaxed text-black/65">{t(property.description)}</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0a0a0a]">المرافق</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <span key={a.en} className="rounded-full border border-gold/30 px-4 py-2 text-sm text-gold">
                    {t(a)}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex aspect-video items-center justify-center rounded-2xl border border-black/8 bg-ivory text-black/55 transition hover:border-gold hover:text-gold"
            >
              <MapPin className="ms-2 h-5 w-5" /> عرض على خرائط جوجل
            </a>
          </div>

          <div className="space-y-6">
            <div className="dam-card-elevated rounded-2xl p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Bed className="mx-auto h-5 w-5 text-gold" />
                  <p className="mt-2 text-2xl font-semibold text-[#0a0a0a]">{property.bedrooms}</p>
                  <p className="text-xs text-black/45">غرف</p>
                </div>
                <div>
                  <Bath className="mx-auto h-5 w-5 text-gold" />
                  <p className="mt-2 text-2xl font-semibold text-[#0a0a0a]">{property.bathrooms}</p>
                  <p className="text-xs text-black/45">حمام</p>
                </div>
                <div>
                  <Maximize className="mx-auto h-5 w-5 text-gold" />
                  <p className="mt-2 text-2xl font-semibold text-[#0a0a0a]">{property.area}</p>
                  <p className="text-xs text-black/45">م²</p>
                </div>
              </div>
              <div className="mt-6 space-y-2 text-sm text-black/55">
                <p>العائد: <span className="text-gold">{property.roi}٪</span></p>
                <p>التشطيب: {t(property.finishing)}</p>
                <p>التسليم: {deliveryLabel(property.delivery)}</p>
                <p>درجة الاستثمار: <span className="text-gold">٩٢/١٠٠</span></p>
              </div>
            </div>

            {agent && (
              <div className="dam-card-elevated rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 font-serif text-2xl text-gold">
                    D
                  </div>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">{company.nameAr}</p>
                    <p className="text-sm text-black/50">{t(agent.role)}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <PropertyInquiryButton
                    propertyId={property.id}
                    propertySlug={property.slug}
                    propertyTitle={t(property.title)}
                    className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-gold py-3 text-sm font-bold text-black transition hover:brightness-110"
                  />
                  <a
                    href={`tel:${company.phone}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gold py-3 text-sm font-medium text-black"
                  >
                    <Phone className="h-4 w-4" /> اتصال
                  </a>
                  <a
                    href={`mailto:${company.email}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-black/12 py-3 text-sm text-black/70"
                  >
                    <Mail className="h-4 w-4" /> بريد
                  </a>
                  <Link
                    href={`/contact?property=${property.slug}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-black/12 py-3 text-sm text-black/70"
                  >
                    <Calendar className="h-4 w-4" /> معاينة
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
