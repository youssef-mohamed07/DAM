"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  School,
  Hospital,
  Train,
  ShoppingBag,
  Utensils,
  MapPin,
  ExternalLink,
  Layers,
  Crown,
  Building2,
  ChevronLeft,
  Sparkles,
  Gem,
} from "lucide-react";
import {
  districts,
  districtGroups,
  residentialZones,
  getDistrictsByGroup,
  getDistrictGroup,
  getDistrictsByZone,
  getResidentialZone,
  getDistrictOrdinal,
  premiumDistrictMeta,
  googleMapsUrl,
  openStreetMapUrl,
} from "@/lib/data/districts";
import { formatPrice } from "@/lib/data/properties";
import { useProperties } from "@/providers/PropertiesProvider";
import { t } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { District } from "@/types";
import type { DistrictGroupId, ResidentialZoneId } from "@/lib/data/districts";

const ObourLeafletMap = dynamic(
  () => import("./ObourLeafletMap").then((m) => m.ObourLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[360px] items-center justify-center bg-[#e8e0d4] text-sm text-black/40">
        جاري تحميل الخريطة…
      </div>
    ),
  },
);

const flagship = districts.find((d) => d.id === "golf")!;

function PremiumPicker({
  active,
  onSelect,
}: {
  active: District;
  onSelect: (d: District) => void;
}) {
  const list = getDistrictsByGroup("premium");

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {list.map((d) => {
        const selected = d.id === active.id;
        const meta = premiumDistrictMeta[d.id];
        return (
          <button
            key={d.id}
            type="button"
            onClick={() => onSelect(d)}
            className={`dam-district-premium relative p-4 text-start ${selected ? "is-active" : ""}`}
          >
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[9px] tracking-wider text-gold">
                  {meta?.badge}
                </span>
                {selected && <Gem className="h-3.5 w-3.5 text-gold" />}
              </div>
              <p className="mt-2 font-serif text-lg leading-tight text-[#0a0a0a]">{t(d.name)}</p>
              <p className="mt-0.5 text-[10px] text-black/50">{meta?.developer}</p>
              <p className="mt-1 text-sm font-semibold text-gold">من {meta?.priceFrom}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-black/8">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-gold to-[#e8d48a]"
                    style={{ width: `${d.investmentScore}%` }}
                  />
                </div>
                <span className="text-[10px] text-black/45">{d.investmentScore}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ResidentialPicker({
  zoneId,
  active,
  onSelect,
  onZoneChange,
}: {
  zoneId: ResidentialZoneId;
  active: District;
  onSelect: (d: District) => void;
  onZoneChange: (z: ResidentialZoneId) => void;
}) {
  const zoneDistricts = getDistrictsByZone(zoneId);

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        {residentialZones.map((z) => {
          const on = z.id === zoneId;
          return (
            <button
              key={z.id}
              type="button"
              onClick={() => onZoneChange(z.id)}
              className={`dam-zone-pill flex-1 px-2 py-2 text-center ${on ? "is-active" : "text-black/55 hover:bg-white"}`}
            >
              <span className="block text-xs font-semibold">{z.label}</span>
              <span className={`block text-[9px] ${on ? "text-white/50" : "text-black/35"}`}>
                {z.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {zoneDistricts.map((d) => {
          const selected = d.id === active.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelect(d)}
              className={`group relative overflow-hidden rounded-xl border px-2 py-3 text-center transition ${
                selected
                  ? "border-gold bg-gradient-to-b from-gold/15 to-white shadow-md"
                  : "border-black/8 bg-white hover:border-gold/35 hover:shadow-sm"
              }`}
            >
              <span
                className={`font-serif text-2xl leading-none ${selected ? "text-gold" : "text-black/25 group-hover:text-gold/60"}`}
              >
                {getDistrictOrdinal(d.id)}
              </span>
              <p
                className={`mt-1 text-[11px] font-medium leading-tight ${selected ? "text-[#0a0a0a]" : "text-black/60"}`}
              >
                {t(d.name)}
              </p>
              <p className="mt-1 text-[9px] text-black/40">{formatPrice(d.avgPrice)}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ObourMap() {
  const { properties } = useProperties();
  const [groupId, setGroupId] = useState<DistrictGroupId>("premium");
  const [zoneId, setZoneId] = useState<ResidentialZoneId>("north");
  const [active, setActive] = useState<District>(flagship);
  const [showListings, setShowListings] = useState(true);

  const visibleDistricts = useMemo(() => getDistrictsByGroup(groupId), [groupId]);

  const districtProperties = useMemo(
    () => (showListings ? properties.filter((p) => p.district === active.id) : []),
    [active.id, showListings, properties],
  );

  const allMapProperties = useMemo(
    () => (showListings ? properties : []),
    [showListings, properties],
  );

  useEffect(() => {
    if (!visibleDistricts.some((d) => d.id === active.id)) {
      const first = visibleDistricts[0] ?? flagship;
      setActive(first);
      if (groupId === "residential") {
        setZoneId(getResidentialZone(first.id));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only reset when group changes
  }, [groupId, visibleDistricts]);

  const selectGroup = (id: DistrictGroupId) => {
    setGroupId(id);
    const first = getDistrictsByGroup(id)[0];
    if (first) {
      setActive(first);
      if (id === "residential") setZoneId(getResidentialZone(first.id));
    }
  };

  const selectZone = (z: ResidentialZoneId) => {
    setZoneId(z);
    const first = getDistrictsByZone(z)[0];
    if (first) setActive(first);
  };

  return (
    <section id="map" className="dam-ivory dam-section">
      <div className="dam-container">
        <SectionHeader
          label={{ en: "", ar: "خريطة حية" }}
          title={{ en: "", ar: "استكشف أحياء العبور" }}
          description={{
            en: "",
            ar: "مشاريع فاخرة وأحياء سكنية منظمة — اختَر المنطقة والخريطة تتحرك تلقائياً لموقعها.",
          }}
          align="center"
          light
          size="large"
          className="mb-12"
        />

        <div className="grid min-w-0 gap-6 xl:grid-cols-12 xl:gap-6">
          <aside className="min-w-0 xl:col-span-4 xl:order-1">
            <div className="dam-glass-light overflow-hidden rounded-3xl">
              <div className="relative grid grid-cols-2">
                {districtGroups.map((g) => {
                  const Icon = g.id === "premium" ? Crown : Building2;
                  const on = groupId === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => selectGroup(g.id)}
                      className={`relative flex flex-col items-center gap-1.5 px-4 py-5 text-center transition-all duration-300 ${
                        on
                          ? "bg-[#0a0a0a] text-white"
                          : "bg-white/40 text-black/50 hover:bg-white/70"
                      }`}
                    >
                      {on && (
                        <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-l from-transparent via-gold to-transparent" />
                      )}
                      <Icon className={`h-4 w-4 ${on ? "text-gold" : ""}`} />
                      <span className="text-sm font-semibold">{g.label}</span>
                      <span className={`text-[10px] ${on ? "text-white/45" : "text-black/35"}`}>
                        {g.districtIds.length} مناطق
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-black/6 p-5">
                <div className="mb-4 flex items-center gap-2">
                  {groupId === "premium" ? (
                    <Sparkles className="h-3.5 w-3.5 text-gold" />
                  ) : (
                    <MapPin className="h-3.5 w-3.5 text-black/40" />
                  )}
                  <p className="text-xs text-black/50">
                    {districtGroups.find((g) => g.id === groupId)?.description}
                  </p>
                </div>

                {groupId === "premium" ? (
                  <PremiumPicker active={active} onSelect={setActive} />
                ) : (
                  <ResidentialPicker
                    zoneId={zoneId}
                    active={active}
                    onSelect={setActive}
                    onZoneChange={selectZone}
                  />
                )}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="border-t border-black/6 bg-gradient-to-b from-[#faf7f2] to-white p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] tracking-[0.2em] text-gold">المنطقة المختارة</p>
                      <h3 className="font-serif mt-1 text-2xl text-[#0a0a0a]">{t(active.name)}</h3>
                    </div>
                    <div className="rounded-2xl border border-gold/25 bg-gold/10 px-3 py-2 text-center">
                      <p className="text-[9px] text-black/45">الاستثمار</p>
                      <p className="text-sm font-bold text-gold">{active.investmentScore}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xl font-semibold text-gold">
                    {formatPrice(active.avgPrice)}
                    <span className="ms-1.5 text-xs font-normal text-black/40">متوسط السعر</span>
                  </p>
                  <p className="mt-1 text-xs text-black/45">
                    {active.properties} عقار مسجل
                    {districtProperties.length > 0 && (
                      <span className="text-gold"> · {districtProperties.length} من DAM</span>
                    )}
                  </p>
                  <Link
                    href={`/properties?district=${active.id}`}
                    className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[#0a0a0a] py-3 text-sm font-medium text-white transition hover:bg-gold hover:text-black"
                  >
                    استكشف العقارات
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </aside>

          <div className="min-w-0 space-y-5 xl:col-span-8 xl:order-2">
            <div className="overflow-hidden rounded-3xl border border-black/8 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/8 bg-gradient-to-l from-[#faf7f2] to-white px-5 py-3.5">
                <div className="flex items-center gap-2 text-sm text-black/65">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15">
                    <MapPin className="h-4 w-4 text-gold" />
                  </span>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">{t(active.name)}</p>
                    <p className="text-[11px] text-black/40">
                      {active.lat.toFixed(4)}° شمالاً · {active.lng.toFixed(4)}° شرقاً
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowListings((v) => !v)}
                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition ${
                      showListings
                        ? "bg-gold/15 text-[#0a0a0a] ring-1 ring-gold/25"
                        : "bg-black/5 text-black/50"
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    عقارات DAM
                  </button>
                  <a
                    href={googleMapsUrl(active.lat, active.lng, t(active.name))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-full bg-[#0a0a0a] px-3.5 py-2 text-xs font-medium text-white transition hover:bg-gold hover:text-black"
                  >
                    خرائط جوجل
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              <div className="relative h-[min(460px,58vh)] w-full bg-[#e8e0d4]">
                <ObourLeafletMap
                  districts={districts}
                  visibleDistricts={visibleDistricts}
                  properties={allMapProperties}
                  active={active}
                  onSelect={(d) => {
                    setActive(d);
                    const g = getDistrictGroup(d.id);
                    setGroupId(g);
                    if (g === "residential") setZoneId(getResidentialZone(d.id));
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-black/8 bg-[#faf7f2] px-5 py-3 text-[11px] text-black/45">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-gold" />
                  عقارات DAM
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-gold bg-white" />
                  أحياء المجموعة
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-full bg-gold shadow-[0_0_8px_#C9A227]" />
                  المنطقة النشطة
                </span>
                <a
                  href={openStreetMapUrl(active.lat, active.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ms-auto text-gold hover:underline"
                >
                  OpenStreetMap
                </a>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="dam-glass-light rounded-3xl p-6"
              >
                <h4 className="flex items-center gap-2 text-sm font-semibold text-black/70">
                  <Sparkles className="h-4 w-4 text-gold" />
                  مرافق وتفاصيل {t(active.name)}
                </h4>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {[
                    { icon: TrendingUp, label: "الاستثمار", val: `${active.investmentScore}/١٠٠` },
                    { icon: School, label: "مدارس", val: active.schools },
                    { icon: Hospital, label: "مستشفيات", val: active.hospitals },
                    { icon: Train, label: "مواصلات", val: t(active.transport) },
                    { icon: ShoppingBag, label: "تسوق", val: t(active.shopping) },
                    { icon: Utensils, label: "مطاعم", val: active.restaurants },
                  ].map(({ icon: Icon, label, val }) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-black/5 bg-white/80 p-3.5 text-center sm:text-start"
                    >
                      <Icon className="mx-auto mb-2 h-4 w-4 text-gold sm:mx-0" />
                      <p className="text-[10px] text-black/40">{label}</p>
                      <p className="mt-0.5 text-xs font-semibold leading-snug">{val}</p>
                    </div>
                  ))}
                </div>

                {districtProperties.length > 0 && (
                  <ul className="mt-5 divide-y divide-black/6 overflow-hidden rounded-2xl border border-black/8 bg-white/70">
                    {districtProperties.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/properties/${p.slug}`}
                          className="flex items-center justify-between px-5 py-3.5 text-sm transition hover:bg-gold/5"
                        >
                          <span className="font-medium">{t(p.title)}</span>
                          <span className="font-semibold text-gold">{formatPrice(p.price)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5">
                  <a
                    href={googleMapsUrl(active.lat, active.lng, t(active.name))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/12 bg-white/60 px-5 py-2.5 text-sm text-black/70 transition hover:border-gold hover:text-gold"
                  >
                    الاتجاهات على خرائط جوجل
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
