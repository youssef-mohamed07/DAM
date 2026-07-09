"use client";

import { useState } from "react";
import { districts } from "@/lib/data/districts";
import { agents } from "@/lib/data/agents";
import { slugify } from "@/lib/properties/mapper";
import { t } from "@/lib/utils";
import type { Property } from "@/types";

const types = [
  { id: "villa", label: "فيلا" },
  { id: "apartment", label: "شقة" },
  { id: "townhouse", label: "تاون هاوس" },
  { id: "duplex", label: "دوبلكس" },
  { id: "penthouse", label: "بنتهاوس" },
];

export type PropertyFormData = {
  slug: string;
  titleAr: string;
  titleEn: string;
  district: string;
  type: string;
  saleCategory: string;
  downPaymentPercent: number;
  installmentYears: number;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  finishingAr: string;
  delivery: string;
  parking: number;
  garden: boolean;
  roi: number;
  featured: boolean;
  published: boolean;
  images: string;
  descriptionAr: string;
  amenities: string;
  lat: number;
  lng: number;
  agentId: string;
  video: string;
};

export function propertyToForm(p?: Property): PropertyFormData {
  if (!p) {
    return {
      slug: "",
      titleAr: "",
      titleEn: "",
      district: "golf",
      type: "apartment",
      saleCategory: "primary",
      downPaymentPercent: 10,
      installmentYears: 6,
      price: 0,
      area: 120,
      bedrooms: 3,
      bathrooms: 2,
      finishingAr: "تشطيب كامل",
      delivery: "Ready",
      parking: 1,
      garden: false,
      roi: 8,
      featured: false,
      published: true,
      images: "",
      descriptionAr: "",
      amenities: "",
      lat: 30.18,
      lng: 31.47,
      agentId: "a3",
      video: "",
    };
  }
  return {
    slug: p.slug,
    titleAr: p.title.ar,
    titleEn: p.title.en,
    district: p.district,
    type: p.type,
    saleCategory: p.saleCategory,
    downPaymentPercent: p.downPaymentPercent ?? 10,
    installmentYears: p.installmentYears ?? 6,
    price: p.price,
    area: p.area,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    finishingAr: p.finishing.ar,
    delivery: p.delivery,
    parking: p.parking,
    garden: p.garden,
    roi: p.roi,
    featured: p.featured,
    published: p.published !== false,
    images: p.images.join("\n"),
    descriptionAr: p.description.ar,
    amenities: p.amenities.map((a) => a.ar).join("\n"),
    lat: p.lat,
    lng: p.lng,
    agentId: p.agentId,
    video: p.video ?? "",
  };
}

export function formToPayload(form: PropertyFormData) {
  return {
    slug: form.slug || slugify(form.titleAr),
    titleAr: form.titleAr,
    titleEn: form.titleEn || form.titleAr,
    district: form.district,
    type: form.type,
    saleCategory: form.saleCategory,
    downPaymentPercent: form.saleCategory === "primary" ? Number(form.downPaymentPercent) : undefined,
    installmentYears: form.saleCategory === "primary" ? Number(form.installmentYears) : undefined,
    price: Number(form.price),
    area: Number(form.area),
    bedrooms: Number(form.bedrooms),
    bathrooms: Number(form.bathrooms),
    finishingAr: form.finishingAr,
    delivery: form.delivery,
    parking: Number(form.parking),
    garden: form.garden,
    roi: Number(form.roi),
    featured: form.featured,
    published: form.published,
    images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
    descriptionAr: form.descriptionAr,
    amenities: form.amenities
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((ar) => ({ ar, en: ar })),
    lat: Number(form.lat),
    lng: Number(form.lng),
    agentId: form.agentId,
    video: form.video || undefined,
  };
}

type Props = {
  initial?: Property;
  onSubmit: (data: ReturnType<typeof formToPayload>) => Promise<void>;
  submitLabel?: string;
};

export function PropertyForm({ initial, onSubmit, submitLabel = "حفظ العقار" }: Props) {
  const [form, setForm] = useState<PropertyFormData>(() => propertyToForm(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof PropertyFormData>(key: K, value: PropertyFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit(formToPayload(form));
    } catch {
      setError("فشل الحفظ — تحقق من البيانات");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "dam-contact-input w-full text-sm";
  const labelClass = "mb-1.5 block text-xs font-medium text-black/50";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="dam-card-elevated rounded-2xl p-6">
        <h2 className="mb-4 text-sm font-bold text-gold">المعلومات الأساسية</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>عنوان العقار (عربي) *</label>
            <input
              className={inputClass}
              value={form.titleAr}
              onChange={(e) => {
                set("titleAr", e.target.value);
                if (!initial) set("slug", slugify(e.target.value));
              }}
              required
            />
          </div>
          <div>
            <label className={labelClass}>الرابط (slug)</label>
            <input className={inputClass} value={form.slug} onChange={(e) => set("slug", e.target.value)} dir="ltr" />
          </div>
          <div>
            <label className={labelClass}>المنطقة</label>
            <select className={inputClass} value={form.district} onChange={(e) => set("district", e.target.value)}>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>{t(d.name)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>النوع</label>
            <select className={inputClass} value={form.type} onChange={(e) => set("type", e.target.value)}>
              {types.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>تصنيف البيع</label>
            <select
              className={inputClass}
              value={form.saleCategory}
              onChange={(e) => set("saleCategory", e.target.value)}
            >
              <option value="primary">أولي (قسط)</option>
              <option value="resale">إعادة بيع</option>
            </select>
          </div>
          {form.saleCategory === "primary" ? (
            <>
              <div>
                <label className={labelClass}>المقدم %</label>
                <input
                  type="number"
                  className={inputClass}
                  value={form.downPaymentPercent}
                  onChange={(e) => set("downPaymentPercent", Number(e.target.value))}
                />
              </div>
              <div>
                <label className={labelClass}>سنوات التقسيط</label>
                <input
                  type="number"
                  className={inputClass}
                  value={form.installmentYears}
                  onChange={(e) => set("installmentYears", Number(e.target.value))}
                />
              </div>
            </>
          ) : null}
          <div>
            <label className={labelClass}>السعر (ج.م)</label>
            <input type="number" className={inputClass} value={form.price} onChange={(e) => set("price", Number(e.target.value))} />
          </div>
          <div>
            <label className={labelClass}>المساحة (م²)</label>
            <input type="number" className={inputClass} value={form.area} onChange={(e) => set("area", Number(e.target.value))} />
          </div>
        </div>
      </section>

      <section className="dam-card-elevated rounded-2xl p-6">
        <h2 className="mb-4 text-sm font-bold text-gold">التفاصيل</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelClass}>غرف</label>
            <input type="number" className={inputClass} value={form.bedrooms} onChange={(e) => set("bedrooms", Number(e.target.value))} />
          </div>
          <div>
            <label className={labelClass}>حمامات</label>
            <input type="number" className={inputClass} value={form.bathrooms} onChange={(e) => set("bathrooms", Number(e.target.value))} />
          </div>
          <div>
            <label className={labelClass}>مواقف</label>
            <input type="number" className={inputClass} value={form.parking} onChange={(e) => set("parking", Number(e.target.value))} />
          </div>
          <div>
            <label className={labelClass}>عائد %</label>
            <input type="number" step="0.1" className={inputClass} value={form.roi} onChange={(e) => set("roi", Number(e.target.value))} />
          </div>
          <div>
            <label className={labelClass}>التشطيب</label>
            <input className={inputClass} value={form.finishingAr} onChange={(e) => set("finishingAr", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>التسليم</label>
            <select className={inputClass} value={form.delivery} onChange={(e) => set("delivery", e.target.value)}>
              <option value="Ready">جاهز</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>المندوب</label>
            <select className={inputClass} value={form.agentId} onChange={(e) => set("agentId", e.target.value)}>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{t(a.role)}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.garden} onChange={(e) => set("garden", e.target.checked)} className="accent-gold" />
            حديقة
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="accent-gold" />
            مميز
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="accent-gold" />
            منشور على الموقع
          </label>
        </div>
      </section>

      <section className="dam-card-elevated rounded-2xl p-6">
        <h2 className="mb-4 text-sm font-bold text-gold">الصور والوصف</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>روابط الصور (سطر لكل صورة)</label>
            <textarea
              rows={4}
              className={`${inputClass} resize-none font-mono text-xs`}
              value={form.images}
              onChange={(e) => set("images", e.target.value)}
              placeholder="https://images.unsplash.com/..."
              dir="ltr"
            />
          </div>
          <div>
            <label className={labelClass}>الوصف</label>
            <textarea rows={4} className={`${inputClass} resize-none`} value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>المرافق (سطر لكل مرفق)</label>
            <textarea rows={3} className={`${inputClass} resize-none`} value={form.amenities} onChange={(e) => set("amenities", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>فيديو (اختياري)</label>
            <input className={inputClass} value={form.video} onChange={(e) => set("video", e.target.value)} dir="ltr" placeholder="https://..." />
          </div>
        </div>
      </section>

      <section className="dam-card-elevated rounded-2xl p-6">
        <h2 className="mb-4 text-sm font-bold text-gold">الموقع على الخريطة</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Latitude</label>
            <input type="number" step="0.0001" className={inputClass} value={form.lat} onChange={(e) => set("lat", Number(e.target.value))} dir="ltr" />
          </div>
          <div>
            <label className={labelClass}>Longitude</label>
            <input type="number" step="0.0001" className={inputClass} value={form.lng} onChange={(e) => set("lng", Number(e.target.value))} dir="ltr" />
          </div>
        </div>
      </section>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-gold py-3.5 text-sm font-bold text-white disabled:opacity-50 sm:w-auto sm:px-12"
      >
        {saving ? "جاري الحفظ…" : submitLabel}
      </button>
    </form>
  );
}
