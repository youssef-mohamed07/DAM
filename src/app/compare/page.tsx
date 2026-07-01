"use client";

import Image from "next/image";
import Link from "next/link";
import { useCompare } from "@/providers/FavoritesProvider";
import { formatPrice } from "@/lib/data/properties";
import { t, districtLabel, yesNo } from "@/lib/utils";

const rows = [
  { key: "price", label: "السعر", fmt: (p: { price: number }) => formatPrice(p.price) },
  { key: "area", label: "المساحة", fmt: (p: { area: number }) => `${p.area} م²` },
  { key: "bedrooms", label: "غرف النوم", fmt: (p: { bedrooms: number }) => String(p.bedrooms) },
  { key: "bathrooms", label: "الحمامات", fmt: (p: { bathrooms: number }) => String(p.bathrooms) },
  { key: "roi", label: "العائد", fmt: (p: { roi: number }) => `${p.roi}٪` },
  { key: "district", label: "المنطقة", fmt: (p: { district: string }) => districtLabel(p.district) },
  { key: "parking", label: "مواقف", fmt: (p: { parking: number }) => String(p.parking) },
  { key: "garden", label: "حديقة", fmt: (p: { garden: boolean }) => yesNo(p.garden) },
];

export default function ComparePage() {
  const { compare, removeFromCompare, clearCompare } = useCompare();

  if (!compare.length) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 pt-24 text-center">
        <h1 className="font-serif text-4xl text-[#0a0a0a]">مقارنة العقارات</h1>
        <p className="mt-4 text-black/50">أضف عقارات للمقارنة</p>
        <Link href="/properties" className="mt-8 rounded-full bg-gold px-8 py-3 font-semibold text-black">
          تصفح العقارات
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="mx-auto max-w-7xl overflow-x-auto px-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-4xl text-[#0a0a0a]">مقارنة</h1>
          <button type="button" onClick={clearCompare} className="text-sm text-gold">
            مسح الكل
          </button>
        </div>
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr>
              <th className="p-4 text-start text-black/50" />
              {compare.map((p) => (
                <th key={p.id} className="p-4">
                  <div className="relative mx-auto h-32 w-full max-w-[200px] overflow-hidden rounded-xl">
                    <Image src={p.images[0]} alt="" fill className="object-cover" />
                  </div>
                  <p className="mt-3 font-medium text-[#0a0a0a]">{t(p.title)}</p>
                  <button type="button" onClick={() => removeFromCompare(p.id)} className="mt-1 text-xs text-red-400">
                    إزالة
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-t border-white/10">
                <td className="p-4 text-black/60">{row.label}</td>
                {compare.map((p) => (
                  <td key={p.id} className="p-4 text-center text-white">
                    {row.fmt(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
