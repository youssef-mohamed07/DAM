import { PrismaClient, LeadStatus, LeadSource } from "@prisma/client";
import { properties } from "../src/lib/data/properties";
import { salesReps } from "../src/lib/data/sales";

const prisma = new PrismaClient();

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10 + (n % 8), 30, 0, 0);
  return d;
}

const demoLeads = [
  {
    id: "a1000001-0001-4000-8000-000000000001",
    status: LeadStatus.new,
    source: LeadSource.property,
    propertyId: "p1",
    propertySlug: "golf-twin-golf-view",
    propertyTitle: "توين هاوس فيو جولف — جولف سيتي",
    clientName: "محمد علي إبراهيم",
    clientPhone: "01012345678",
    clientEmail: "mohamed.ali@gmail.com",
    message: "مهتم بالتوين هاوس — هل متاح معاينة نهاية الأسبوع؟",
    assignedSalesId: "s3",
    assignedAt: daysAgo(0),
    createdAt: daysAgo(0),
  },
  {
    id: "a1000001-0001-4000-8000-000000000002",
    status: LeadStatus.assigned,
    source: LeadSource.property,
    propertyId: "p2",
    propertySlug: "rock-villa-townhouse",
    propertyTitle: "تاون هاوس روك فيلا",
    clientName: "سارة محمود حسن",
    clientPhone: "01098765432",
    message: "أبحث عن وحدة جاهزة للسكن فوراً في روك فيلا",
    assignedSalesId: "s1",
    assignedAt: daysAgo(1),
    notes: "عميلة جادة — تفضّل التواصل واتساب بعد ٥ مساءً",
    createdAt: daysAgo(1),
  },
  {
    id: "a1000001-0001-4000-8000-000000000003",
    status: LeadStatus.contacted,
    source: LeadSource.property,
    propertyId: "p3",
    propertySlug: "reveal-obour-apartment",
    propertyTitle: "شقة ريفيل العبور",
    clientName: "أحمد حسن عبدالله",
    clientPhone: "01155667788",
    clientEmail: "ahmed.h@outlook.com",
    message: "شقة 3 غرف — هل يوجد تقسيط بدون فوائد؟",
    assignedSalesId: "s2",
    assignedAt: daysAgo(2),
    notes: "تم التواصل — ينتظر عرض سعر مفصّل",
    createdAt: daysAgo(3),
  },
  {
    id: "a1000001-0001-4000-8000-000000000004",
    status: LeadStatus.won,
    source: LeadSource.property,
    propertyId: "p4",
    propertySlug: "golf-apartment-220",
    propertyTitle: "شقة 220م² جولف سيتي",
    clientName: "نور الدين مصطفى",
    clientPhone: "01234567890",
    message: "تم الاتفاق — جاري إجراءات التعاقد",
    assignedSalesId: "s3",
    assignedAt: daysAgo(5),
    notes: "✅ تم حجز الوحدة — مقدم 10%",
    createdAt: daysAgo(7),
  },
  {
    id: "a1000001-0001-4000-8000-000000000005",
    status: LeadStatus.lost,
    source: LeadSource.property,
    propertyId: "p5",
    propertySlug: "jazeel-residence-2br",
    propertyTitle: "شقة جزيل ريزيدنس غرفتين",
    clientName: "كريم سامي فؤاد",
    clientPhone: "01066778899",
    message: "السعر أعلى من الميزانية — شكراً",
    assignedSalesId: "s2",
    assignedAt: daysAgo(4),
    notes: "الميزانية 4 مليون — الوحدة 5.2 مليون",
    createdAt: daysAgo(6),
  },
  {
    id: "a1000001-0001-4000-8000-000000000006",
    status: LeadStatus.new,
    source: LeadSource.contact,
    clientName: "ياسمين فاروق",
    clientPhone: "01111222333",
    clientEmail: "yasmine.f@yahoo.com",
    goal: "شراء للسكن",
    propertyType: "فيلا",
    budget: "10–15 مليون",
    district: "جولف سيتي",
    message: "أبحث عن فيلا بحديقة في العبور — ميزانية حتى 15 مليون",
    createdAt: daysAgo(0),
  },
  {
    id: "a1000001-0001-4000-8000-000000000007",
    status: LeadStatus.assigned,
    source: LeadSource.property,
    propertyId: "p6",
    propertySlug: "golf-townhouse-corner",
    propertyTitle: "تاون هاوس كورنر جولف سيتي",
    clientName: "هشام عبدالرحمن",
    clientPhone: "01055443322",
    message: "مهتم بالكورنر — هل السعر قابل للتفاوض؟",
    assignedSalesId: "s3",
    assignedAt: daysAgo(1),
    createdAt: daysAgo(2),
  },
  {
    id: "a1000001-0001-4000-8000-000000000008",
    status: LeadStatus.contacted,
    source: LeadSource.contact,
    clientName: "منى السيد أحمد",
    clientPhone: "01288776655",
    goal: "استثمار",
    propertyType: "شقة",
    budget: "3–5 مليون",
    district: "الحي الأول",
    message: "أريد شقة للإيجار في الحي الأول — عائد استثماري جيد",
    assignedSalesId: "s1",
    assignedAt: daysAgo(2),
    notes: "مهتمة بشقة مترو الحي الأول",
    createdAt: daysAgo(4),
  },
  {
    id: "a1000001-0001-4000-8000-000000000009",
    status: LeadStatus.new,
    source: LeadSource.property,
    propertyId: "p7",
    propertySlug: "first-district-metro-apartment",
    propertyTitle: "شقة مترو الحي الأول",
    clientName: "عمر خالد",
    clientPhone: "01099887766",
    message: "استفسار عن شقة قريبة من المترو",
    createdAt: daysAgo(1),
  },
  {
    id: "a1000001-0001-4000-8000-000000000010",
    status: LeadStatus.assigned,
    source: LeadSource.property,
    propertyId: "p8",
    propertySlug: "rock-villa-553",
    propertyTitle: "فيلا روك فيلا 553م²",
    clientName: "دينا محمود",
    clientPhone: "01133445566",
    clientEmail: "dina.m@gmail.com",
    message: "فيلا كبيرة للعائلة — هل التشطيب كامل؟",
    assignedSalesId: "s1",
    assignedAt: daysAgo(0),
    createdAt: daysAgo(1),
  },
  {
    id: "a1000001-0001-4000-8000-000000000011",
    status: LeadStatus.contacted,
    source: LeadSource.manual,
    clientName: "طارق إبراهيم",
    clientPhone: "01222334455",
    goal: "شراء",
    budget: "20 مليون+",
    district: "جولف سيتي",
    message: "عميل VIP — إحالة من شريك — يبحث عن توين هاوس فاخر",
    assignedSalesId: "s4",
    assignedAt: daysAgo(1),
    notes: "أولوية عالية — اتصل به شخصياً",
    createdAt: daysAgo(2),
  },
  {
    id: "a1000001-0001-4000-8000-000000000012",
    status: LeadStatus.won,
    source: LeadSource.property,
    propertyId: "p2",
    propertySlug: "rock-villa-townhouse",
    propertyTitle: "تاون هاوس روك فيلا",
    clientName: "رانيا عادل",
    clientPhone: "01077665544",
    message: "تم التعاقد على تاون هاوس روك فيلا",
    assignedSalesId: "s1",
    assignedAt: daysAgo(10),
    notes: "✅ صفقة مكتملة — عمولة محسوبة",
    createdAt: daysAgo(14),
  },
];

async function main() {
  console.log("Seeding properties…");
  for (const p of properties) {
    const isDraft = p.slug === "first-district-metro-apartment";
    await prisma.property.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        slug: p.slug,
        titleAr: p.title.ar,
        titleEn: p.title.en,
        district: p.district,
        type: p.type,
        price: p.price,
        area: p.area,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        finishingAr: p.finishing.ar,
        finishingEn: p.finishing.en,
        delivery: p.delivery,
        parking: p.parking,
        garden: p.garden,
        roi: p.roi,
        featured: p.featured,
        published: !isDraft,
        tags: p.tags,
        images: p.images,
        descriptionAr: p.description.ar,
        descriptionEn: p.description.en,
        amenities: p.amenities,
        lat: p.lat,
        lng: p.lng,
        agentId: p.agentId,
        video: p.video ?? null,
      },
      update: {
        slug: p.slug,
        titleAr: p.title.ar,
        titleEn: p.title.en,
        price: p.price,
        featured: p.featured,
        published: !isDraft,
      },
    });
  }

  console.log("Seeding sales reps…");
  for (const s of salesReps) {
    await prisma.salesRep.upsert({
      where: { id: s.id },
      create: {
        id: s.id,
        name: s.name,
        role: s.role,
        phone: s.phone,
        whatsapp: s.whatsapp,
        agentId: s.agentId ?? null,
        active: s.active,
      },
      update: {
        name: s.name,
        role: s.role,
        phone: s.phone,
        whatsapp: s.whatsapp,
        agentId: s.agentId ?? null,
        active: s.active,
      },
    });
  }

  console.log("Seeding demo leads…");
  for (const lead of demoLeads) {
    const { createdAt, assignedAt, ...data } = lead;
    await prisma.lead.upsert({
      where: { id: lead.id },
      create: { ...data, createdAt, assignedAt: assignedAt ?? null },
      update: { ...data, assignedAt: assignedAt ?? null },
    });
  }

  console.log(
    `Done — ${properties.length} properties, ${salesReps.length} sales reps, ${demoLeads.length} leads.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
