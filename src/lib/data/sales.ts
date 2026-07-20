import type { SaleCategory } from "@/types";

/** فريق المبيعات — من بيانات الفريق الرسمية */
export interface SalesRep {
  id: string;
  name: string;
  role: string;
  /** أولي أو إعادة بيع */
  saleCategory: SaleCategory;
  phone: string;
  /** رقم واتساب بدون + (مثال: 201001234567) */
  whatsapp: string;
  /** معرّف محادثة تليجرام للمندوب (اختياري) */
  telegramChatId?: string;
  /** معرّف المستخدم على تليجرام للمنشن في الجروب */
  telegramUserId?: string;
  /** ربط تلقائي بعقارات الـ agentId */
  agentId?: string;
  active: boolean;
}

function wa(local: string) {
  const digits = local.replace(/\D/g, "");
  if (digits.startsWith("20")) return digits;
  if (digits.startsWith("0")) return `20${digits.slice(1)}`;
  return `20${digits}`;
}

export const salesReps: SalesRep[] = [
  {
    id: "s1",
    name: "أحمد المليجي",
    role: "إعادة بيع",
    saleCategory: "resale",
    phone: "01010116450",
    whatsapp: wa("01010116450"),
    active: true,
  },
  {
    id: "s2",
    name: "دنيا المليجي",
    role: "أولي",
    saleCategory: "primary",
    phone: "01130081542",
    whatsapp: wa("01130081542"),
    active: true,
  },
  {
    id: "s3",
    name: "محمد وليد",
    role: "أولي",
    saleCategory: "primary",
    phone: "01130529304",
    whatsapp: wa("01130529304"),
    active: true,
  },
  {
    id: "s4",
    name: "منير سامي",
    role: "أولي",
    saleCategory: "primary",
    phone: "01130081524",
    whatsapp: wa("01130081524"),
    active: true,
  },
  {
    id: "s5",
    name: "مؤمن سليم",
    role: "أولي",
    saleCategory: "primary",
    phone: "01131464122",
    whatsapp: wa("01131464122"),
    active: true,
  },
  {
    id: "s6",
    name: "سارة رضا",
    role: "إعادة بيع",
    saleCategory: "resale",
    phone: "01068939597",
    whatsapp: wa("01068939597"),
    active: true,
  },
  {
    id: "s7",
    name: "أية يسرى",
    role: "أولي",
    saleCategory: "primary",
    phone: "01131464056",
    whatsapp: wa("01131464056"),
    active: true,
  },
];

export function getSalesRep(id: string) {
  return salesReps.find((s) => s.id === id);
}

export function getSalesRepByAgentId(agentId: string) {
  return salesReps.find((s) => s.agentId === agentId && s.active);
}

export function getActiveSalesReps() {
  return salesReps.filter((s) => s.active);
}

export function getSalesRepsByCategory(category: SaleCategory) {
  return salesReps.filter((s) => s.active && s.saleCategory === category);
}
