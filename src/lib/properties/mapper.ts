import type { Property as DbProperty } from "@prisma/client";
import type { Property, PropertyType } from "@/types";

type Tag = { en: string; ar: string };

export function dbToProperty(row: DbProperty): Property {
  return {
    id: row.id,
    slug: row.slug,
    title: { ar: row.titleAr, en: row.titleEn },
    district: row.district,
    type: row.type as PropertyType,
    price: row.price,
    area: row.area,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    finishing: { ar: row.finishingAr, en: row.finishingEn },
    delivery: row.delivery,
    parking: row.parking,
    garden: row.garden,
    roi: row.roi,
    featured: row.featured,
    published: row.published,
    tags: (row.tags as Tag[]) ?? [],
    images: (row.images as string[]) ?? [],
    video: row.video ?? undefined,
    description: { ar: row.descriptionAr, en: row.descriptionEn },
    amenities: (row.amenities as Tag[]) ?? [],
    lat: row.lat,
    lng: row.lng,
    agentId: row.agentId,
  };
}

export function slugify(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    .replace(/-+/g, "-")
    .slice(0, 80);
}
