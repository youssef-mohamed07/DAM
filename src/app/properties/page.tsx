"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import Link from "next/link";
import { PropertyCard } from "@/components/property/PropertyCard";
import { searchProperties } from "@/lib/data/properties";
import { useProperties } from "@/providers/PropertiesProvider";
import { districts } from "@/lib/data/districts";
import { useLocale } from "@/providers/LocaleProvider";

function PropertiesContent() {
  const { t, path, dict } = useLocale();
  const searchParams = useSearchParams();
  const { properties, loading } = useProperties();

  const filtered = useMemo(() => {
    const district = searchParams.get("district") || undefined;
    const type = searchParams.get("type") || undefined;
    const saleCategory = searchParams.get("category") || undefined;
    const budget = searchParams.get("budget");
    const maxPrice = budget ? Number(budget) * 1_000_000 : undefined;
    return searchProperties({ district, type, saleCategory, maxPrice }, properties);
  }, [searchParams, properties]);

  const category = searchParams.get("category");

  function categoryHref(value?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("category", value);
    else params.delete("category");
    const q = params.toString();
    return q ? `${path("/properties")}?${q}` : path("/properties");
  }

  function districtHref(districtId?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (districtId) params.set("district", districtId);
    else params.delete("district");
    const q = params.toString();
    return q ? `${path("/properties")}?${q}` : path("/properties");
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-white pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div className="dam-container">
        <h1 className="font-serif text-3xl text-[#0a0a0a] sm:text-4xl md:text-5xl lg:text-6xl">
          {dict.propertiesPage.title}
        </h1>
        <p className="mt-3 text-sm text-black/50 sm:mt-4 sm:text-base">
          {loading ? "…" : `${filtered.length} ${dict.propertiesPage.count}`} · {dict.propertiesPage.inObour}
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href={categoryHref()}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              !category
                ? "border-black bg-black text-white"
                : "border-black/15 text-black/70 hover:border-black/30 hover:text-black"
            }`}
          >
            {dict.propertiesPage.all}
          </Link>
          <Link
            href={categoryHref("primary")}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              category === "primary"
                ? "border-black bg-black text-white"
                : "border-black/15 text-black/70 hover:border-black/30 hover:text-black"
            }`}
          >
            {dict.propertiesPage.primary}
          </Link>
          <Link
            href={categoryHref("resale")}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              category === "resale"
                ? "border-black bg-black text-white"
                : "border-black/15 text-black/70 hover:border-black/30 hover:text-black"
            }`}
          >
            {dict.propertiesPage.resale}
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={districtHref()}
            className="rounded-full border border-black/15 px-4 py-2 text-sm text-black/70 hover:border-black/30 hover:text-black"
          >
            {dict.hero.allDistricts}
          </Link>
          {districts.slice(0, 6).map((d) => (
            <Link
              key={d.id}
              href={districtHref(d.id)}
              className="rounded-full border border-black/15 px-4 py-2 text-sm text-black/70 hover:border-gold hover:text-gold"
            >
              {t(d.name)}
            </Link>
          ))}
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(filtered.length ? filtered : properties).map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <PropertiesContent />
    </Suspense>
  );
}
