import type { Property } from "@/types";
import { properties as staticProperties } from "@/lib/data/properties";
import { dbToProperty } from "@/lib/properties/mapper";
import { prisma } from "@/lib/prisma";

export async function getAllProperties(opts?: { publishedOnly?: boolean }) {
  try {
    const rows = await prisma.property.findMany({
      where: opts?.publishedOnly ? { published: true } : undefined,
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    });
    if (rows.length > 0) return rows.map(dbToProperty);
  } catch {
    /* fallback */
  }
  return opts?.publishedOnly !== false ? staticProperties : staticProperties;
}

export async function getPropertyBySlug(slug: string) {
  try {
    const row = await prisma.property.findUnique({ where: { slug } });
    if (row?.published) return dbToProperty(row);
    if (row && !row.published) return null;
  } catch {
    /* fallback */
  }
  return staticProperties.find((p) => p.slug === slug) ?? null;
}

export async function getPropertyById(id: string) {
  try {
    const row = await prisma.property.findUnique({ where: { id } });
    if (row) return dbToProperty(row);
  } catch {
    /* fallback */
  }
  return staticProperties.find((p) => p.id === id) ?? null;
}

export function searchPropertiesList(
  list: Property[],
  query: {
    text?: string;
    district?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    bedrooms?: number;
    bathrooms?: number;
  },
) {
  let results = [...list];
  if (query.district) results = results.filter((p) => p.district === query.district);
  if (query.type) results = results.filter((p) => p.type === query.type);
  if (query.minPrice) results = results.filter((p) => p.price >= query.minPrice!);
  if (query.maxPrice) results = results.filter((p) => p.price <= query.maxPrice!);
  if (query.minArea) results = results.filter((p) => p.area >= query.minArea!);
  if (query.bedrooms) results = results.filter((p) => p.bedrooms >= query.bedrooms!);
  if (query.bathrooms) results = results.filter((p) => p.bathrooms >= query.bathrooms!);
  return results;
}

export type PropertyInput = {
  slug: string;
  titleAr: string;
  titleEn?: string;
  district: string;
  type: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  finishingAr: string;
  finishingEn?: string;
  delivery?: string;
  parking?: number;
  garden?: boolean;
  roi?: number;
  featured?: boolean;
  published?: boolean;
  tags?: { en: string; ar: string }[];
  images?: string[];
  descriptionAr: string;
  descriptionEn?: string;
  amenities?: { en: string; ar: string }[];
  lat?: number;
  lng?: number;
  agentId: string;
  video?: string;
};

export async function createProperty(input: PropertyInput) {
  const id = `p${Date.now()}`;
  const row = await prisma.property.create({
    data: {
      id,
      slug: input.slug,
      titleAr: input.titleAr,
      titleEn: input.titleEn ?? input.titleAr,
      district: input.district,
      type: input.type,
      price: input.price,
      area: input.area,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      finishingAr: input.finishingAr,
      finishingEn: input.finishingEn ?? "",
      delivery: input.delivery ?? "Ready",
      parking: input.parking ?? 0,
      garden: input.garden ?? false,
      roi: input.roi ?? 0,
      featured: input.featured ?? false,
      published: input.published ?? true,
      tags: input.tags ?? [],
      images: input.images ?? [],
      descriptionAr: input.descriptionAr,
      descriptionEn: input.descriptionEn ?? "",
      amenities: input.amenities ?? [],
      lat: input.lat ?? 30.18,
      lng: input.lng ?? 31.47,
      agentId: input.agentId,
      video: input.video ?? null,
    },
  });
  return dbToProperty(row);
}

export async function updateProperty(id: string, input: Partial<PropertyInput>) {
  const row = await prisma.property.update({
    where: { id },
    data: {
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.titleAr !== undefined ? { titleAr: input.titleAr } : {}),
      ...(input.titleEn !== undefined ? { titleEn: input.titleEn } : {}),
      ...(input.district !== undefined ? { district: input.district } : {}),
      ...(input.type !== undefined ? { type: input.type } : {}),
      ...(input.price !== undefined ? { price: input.price } : {}),
      ...(input.area !== undefined ? { area: input.area } : {}),
      ...(input.bedrooms !== undefined ? { bedrooms: input.bedrooms } : {}),
      ...(input.bathrooms !== undefined ? { bathrooms: input.bathrooms } : {}),
      ...(input.finishingAr !== undefined ? { finishingAr: input.finishingAr } : {}),
      ...(input.finishingEn !== undefined ? { finishingEn: input.finishingEn } : {}),
      ...(input.delivery !== undefined ? { delivery: input.delivery } : {}),
      ...(input.parking !== undefined ? { parking: input.parking } : {}),
      ...(input.garden !== undefined ? { garden: input.garden } : {}),
      ...(input.roi !== undefined ? { roi: input.roi } : {}),
      ...(input.featured !== undefined ? { featured: input.featured } : {}),
      ...(input.published !== undefined ? { published: input.published } : {}),
      ...(input.tags !== undefined ? { tags: input.tags } : {}),
      ...(input.images !== undefined ? { images: input.images } : {}),
      ...(input.descriptionAr !== undefined ? { descriptionAr: input.descriptionAr } : {}),
      ...(input.descriptionEn !== undefined ? { descriptionEn: input.descriptionEn } : {}),
      ...(input.amenities !== undefined ? { amenities: input.amenities } : {}),
      ...(input.lat !== undefined ? { lat: input.lat } : {}),
      ...(input.lng !== undefined ? { lng: input.lng } : {}),
      ...(input.agentId !== undefined ? { agentId: input.agentId } : {}),
      ...(input.video !== undefined ? { video: input.video || null } : {}),
    },
  });
  return dbToProperty(row);
}

export async function deleteProperty(id: string) {
  await prisma.property.delete({ where: { id } });
}
