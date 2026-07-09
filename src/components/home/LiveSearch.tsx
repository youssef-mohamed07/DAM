"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { searchProperties, formatPrice } from "@/lib/data/properties";
import { useProperties } from "@/providers/PropertiesProvider";
import { t } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function LiveSearch() {
  const [query, setQuery] = useState("");
  const { properties } = useProperties();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchProperties({ text: query }, properties).slice(0, 4);
  }, [query, properties]);

  const suggestions = [
    "فيلا أقل من 12 مليون في جولف سيتي",
    "شقة 3 غرف في الحي الأول",
    "بنتهاوس في نيو العبور",
  ];

  return (
    <section className="section-padding bg-[#0B0B0B]">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label={{ en: "", ar: "بحث ذكي" }}
          title={{ en: "", ar: "ابحث باللغة الطبيعية" }}
          align="center"
        />

        <div className="relative mx-auto max-w-3xl">
          <div className="glass flex items-center gap-3 rounded-2xl px-5 py-4">
            <Sparkles className="h-5 w-5 shrink-0 text-white" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='مثال: "أريد فيلا أقل من 12 مليون في جولف سيتي"'
              className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none"
            />
            <Search className="h-5 w-5 text-white/40" />
          </div>

          {!query && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60 transition hover:border-white/40 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass mt-4 overflow-hidden rounded-2xl"
            >
              {results.map((p) => (
                <Link
                  key={p.id}
                  href={`/properties/${p.slug}`}
                  className="flex items-center gap-4 border-b border-white/5 p-4 transition hover:bg-white/5 last:border-0"
                >
                  <div className="relative h-14 w-20 overflow-hidden rounded-lg">
                    <Image src={p.images[0]} alt="" fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{t(p.title)}</p>
                    <p className="text-sm text-white/50">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
