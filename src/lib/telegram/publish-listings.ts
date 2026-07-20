import { prisma } from "@/lib/prisma";
import { IMAGES } from "@/lib/images";
import { districtFromChatTitle } from "@/lib/telegram/chat-districts";
import { districts } from "@/lib/data/districts";

const DEFAULT_AGENT = "a1";

const TYPE_IMAGES: Record<string, string> = {
  villa: IMAGES.villa1,
  townhouse: IMAGES.villa4,
  duplex: IMAGES.modern,
  penthouse: IMAGES.penthouse,
  apartment: IMAGES.apartment,
};

function slugify(code: string, fallback: string) {
  const base = code
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base ? `resale-${base}` : `resale-${fallback.slice(0, 8)}`;
}

function buildTitle(listing: {
  listingCode: string | null;
  propertyType: string | null;
  compound: string | null;
  area: number | null;
  bedrooms: number | null;
  chatTitle: string | null;
}) {
  const parts: string[] = [];
  if (listing.compound) parts.push(listing.compound);
  if (listing.propertyType) {
    const typeAr: Record<string, string> = {
      villa: "فيلا",
      apartment: "شقة",
      townhouse: "توين هاوس",
      duplex: "دوبلكس",
      penthouse: "بنتهاوس",
    };
    parts.push(typeAr[listing.propertyType] ?? listing.propertyType);
  }
  if (listing.bedrooms) parts.push(`${listing.bedrooms} غرف`);
  if (listing.area) parts.push(`${listing.area} م²`);
  if (listing.listingCode) parts.push(`كود ${listing.listingCode}`);
  if (parts.length) return parts.join(" — ");
  return listing.chatTitle ? `عقار إعادة بيع — ${listing.chatTitle}` : "عقار إعادة بيع";
}

function resolveDistrict(listing: {
  district: string | null;
  chatTitle: string | null;
}) {
  return (
    listing.district ??
    districtFromChatTitle(listing.chatTitle) ??
    "new"
  );
}

async function uniqueSlug(base: string) {
  let slug = base;
  let n = 1;
  while (await prisma.property.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

export async function publishListingToSite(listingId: string) {
  const listing = await prisma.telegramListing.findUnique({
    where: { id: listingId },
    include: { message: true },
  });
  if (!listing) return { ok: false as const, error: "not_found" };
  if (listing.propertyId) {
    return { ok: true as const, propertyId: listing.propertyId, skipped: true };
  }

  const district = resolveDistrict({
    district: listing.district,
    chatTitle: listing.message.chatTitle,
  });

  const code = listing.listingCode ?? `tg-${listing.message.messageId}`;
  const slug = await uniqueSlug(slugify(code, listing.id));

  const titleAr = buildTitle({
    listingCode: listing.listingCode,
    propertyType: listing.propertyType,
    compound: listing.compound,
    area: listing.area,
    bedrooms: listing.bedrooms,
    chatTitle: listing.message.chatTitle,
  });

  const districtName =
    districts.find((d) => d.id === district)?.name.ar ?? district;

  const descriptionAr = [
    listing.rawText,
    listing.paymentNotes ? `\n\n${listing.paymentNotes}` : "",
    listing.message.chatTitle ? `\n\n📍 الجروب: ${listing.message.chatTitle}` : "",
    listing.listingCode ? `\n🔖 الكود: ${listing.listingCode}` : "",
  ]
    .filter(Boolean)
    .join("");

  const image =
    TYPE_IMAGES[listing.propertyType ?? "apartment"] ?? IMAGES.apartment;

  const property = await prisma.property.create({
    data: {
      id: `tl-${listing.id}`,
      slug,
      titleAr,
      titleEn: titleAr,
      district,
      type: listing.propertyType ?? "apartment",
      saleCategory: "resale",
      price: listing.price ?? 0,
      area: listing.area ?? 0,
      bedrooms: listing.bedrooms ?? 0,
      bathrooms: listing.bathrooms ?? 0,
      finishingAr: listing.finishing ?? "—",
      finishingEn: listing.finishing ?? "—",
      delivery: listing.delivery ?? "Ready",
      parking: 1,
      garden: /حديقة|garden/i.test(listing.rawText),
      roi: 0,
      featured: false,
      published: true,
      tags: [
        { en: "Resale", ar: "إعادة بيع" },
        { en: districtName, ar: districtName },
        ...(listing.listingCode
          ? [{ en: listing.listingCode, ar: listing.listingCode }]
          : []),
      ],
      images: [image],
      descriptionAr,
      descriptionEn: descriptionAr,
      amenities: [],
      agentId: DEFAULT_AGENT,
      telegramListingCode: listing.listingCode,
      telegramChatId: listing.message.chatId,
      telegramMessageId: listing.message.messageId,
    },
  });

  await prisma.telegramListing.update({
    where: { id: listingId },
    data: { propertyId: property.id, status: "published" },
  });

  return { ok: true as const, propertyId: property.id, slug: property.slug };
}

export async function publishAllListings(opts?: { chatId?: string }) {
  const listings = await prisma.telegramListing.findMany({
    where: {
      propertyId: null,
      ...(opts?.chatId ? { message: { chatId: opts.chatId } } : {}),
    },
    include: { message: true },
    orderBy: { createdAt: "asc" },
  });

  let published = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of listings) {
    try {
      const result = await publishListingToSite(row.id);
      if (result.ok) {
        if ("skipped" in result && result.skipped) skipped++;
        else published++;
      }
    } catch (e) {
      errors.push(`${row.id}: ${e instanceof Error ? e.message : "error"}`);
    }
  }

  return { published, skipped, total: listings.length, errors };
}

export async function reparseListingsWithChatDistrict() {
  const listings = await prisma.telegramListing.findMany({
    include: { message: true },
  });

  let updated = 0;
  for (const row of listings) {
    const chatDistrict = districtFromChatTitle(row.message.chatTitle);
    const data: { saleCategory: string; district?: string } = {
      saleCategory: "resale",
    };
    if (chatDistrict) data.district = chatDistrict;

    await prisma.telegramListing.update({
      where: { id: row.id },
      data,
    });
    updated++;
  }

  return { updated, total: listings.length };
}
