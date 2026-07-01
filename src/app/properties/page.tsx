"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import Link from "next/link";
import { PropertyCard } from "@/components/property/PropertyCard";
import { searchProperties } from "@/lib/data/properties";
import { useProperties } from "@/providers/PropertiesProvider";
import { districts } from "@/lib/data/districts";
import { t } from "@/lib/utils";

function PropertiesContent() {
  const searchParams = useSearchParams();
  const { properties, loading } = useProperties();

  const filtered = useMemo(() => {
    const district = searchParams.get("district") || undefined;
    const type = searchParams.get("type") || undefined;
    const budget = searchParams.get("budget");
    const maxPrice = budget ? Number(budget) * 1_000_000 : undefined;
    return searchProperties({ district, type, maxPrice }, properties);
  }, [searchParams, properties]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-white pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div className="dam-container">
        <h1 className="font-serif text-3xl text-[#0a0a0a] sm:text-4xl md:text-5xl lg:text-6xl">
          العقارات
        </h1>
        <p className="mt-3 text-sm text-black/50 sm:mt-4 sm:text-base">
          {loading ? "…" : `${filtered.length} عقار`} · مدينة العبور
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/properties"
            className="rounded-full border border-black/15 px-4 py-2 text-sm text-black/70 hover:border-gold hover:text-gold"
          >
            الكل
          </Link>
          {districts.slice(0, 6).map((d) => (
            <Link
              key={d.id}
              href={`/properties?district=${d.id}`}
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
