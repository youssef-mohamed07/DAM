"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Building2, Star, Eye, EyeOff, Pencil, Trash2, ExternalLink, LayoutGrid } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminFilterPills } from "@/components/admin/AdminFilterPills";
import { formatPrice } from "@/lib/data/properties";
import { t, districtLabel } from "@/lib/utils";
import type { Property } from "@/types";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "featured" | "draft">("all");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/properties", { credentials: "include" });
    if (res.ok) setProperties(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(id: string, field: "featured" | "published", value: boolean) {
    await fetch(`/api/admin/properties/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ [field]: value }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("حذف هذا العقار نهائياً؟")) return;
    await fetch(`/api/admin/properties/${id}`, { method: "DELETE", credentials: "include" });
    load();
  }

  const filtered = properties.filter((p) => {
    if (filter === "featured") return p.featured;
    if (filter === "published") return p.published !== false;
    if (filter === "draft") return p.published === false;
    return true;
  });

  const publishedCount = properties.filter((p) => p.published !== false).length;
  const featuredCount = properties.filter((p) => p.featured).length;
  const draftCount = properties.filter((p) => p.published === false).length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="إدارة العقارات"
        description="أضف، عدّل، انشر، أو أخفِ العقارات على الموقع"
        action={{ label: "إضافة عقار", href: "/admin/properties/new" }}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="إجمالي العقارات" value={properties.length} icon={Building2} accent="gold" />
        <AdminStatCard label="منشورة" value={publishedCount} icon={Eye} accent="emerald" />
        <AdminStatCard label="مميزة" value={featuredCount} icon={Star} accent="purple" />
        <AdminStatCard label="مسودات" value={draftCount} icon={LayoutGrid} accent="blue" />
      </div>

      <AdminFilterPills
        value={filter}
        onChange={setFilter}
        options={[
          { id: "all", label: "الكل", count: properties.length },
          { id: "published", label: "منشور", count: publishedCount },
          { id: "draft", label: "مسودة", count: draftCount },
          { id: "featured", label: "مميز", count: featuredCount },
        ]}
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="admin-shimmer h-72 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <AdminEmptyState
          icon={Building2}
          title="لا توجد عقارات"
          description="ابدأ بإضافة أول عقار ليظهر على الموقع"
          action={{ label: "إضافة عقار", href: "/admin/properties/new" }}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="dam-card-elevated group overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-ivory">
                {p.images[0] ? (
                  <Image
                    src={p.images[0]}
                    alt=""
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Building2 className="h-10 w-10 text-black/15" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute start-3 top-3 flex flex-wrap gap-1">
                  {p.featured ? (
                    <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-white">
                      مميز
                    </span>
                  ) : null}
                  {p.published !== false ? (
                    <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-medium text-white">
                      منشور
                    </span>
                  ) : (
                    <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
                      مسودة
                    </span>
                  )}
                </div>
                <p className="absolute bottom-3 start-3 end-3 font-semibold text-white drop-shadow">
                  {formatPrice(p.price)}
                </p>
              </div>

              <div className="p-4">
                <h3 className="line-clamp-2 font-semibold leading-snug text-[#0a0a0a]">
                  {t(p.title)}
                </h3>
                <p className="mt-1 text-xs text-black/45">
                  {districtLabel(p.district)} · {p.area}م² · {p.bedrooms} غرف
                </p>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-black/6 pt-4">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => toggle(p.id, "featured", !p.featured)}
                      className="rounded-lg border border-black/8 p-2 hover:border-gold/40"
                      title="مميز"
                    >
                      <Star
                        className={`h-3.5 w-3.5 ${p.featured ? "fill-gold text-gold" : "text-black/30"}`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggle(p.id, "published", p.published === false)}
                      className="rounded-lg border border-black/8 p-2 hover:border-gold/40"
                      title="نشر/إخفاء"
                    >
                      {p.published !== false ? (
                        <Eye className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5 text-black/30" />
                      )}
                    </button>
                    <Link
                      href={`/admin/properties/${p.id}`}
                      className="rounded-lg border border-black/8 p-2 hover:border-gold/40"
                    >
                      <Pencil className="h-3.5 w-3.5 text-black/50" />
                    </Link>
                    <Link
                      href={`/properties/${p.slug}`}
                      target="_blank"
                      className="rounded-lg border border-black/8 p-2 hover:border-gold/40"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-black/50" />
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="rounded-lg border border-black/8 p-2 text-black/40 hover:border-red-200 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
