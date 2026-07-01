/** فريق المبيعات — عدّل أرقام الواتساب هنا */
export interface SalesRep {
  id: string;
  name: string;
  role: string;
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

export const salesReps: SalesRep[] = [
  {
    id: "s1",
    name: "أحمد مصطفى",
    role: "روك فيلا والأحياء السكنية",
    phone: "01011234567",
    whatsapp: "201011234567",
    agentId: "a1",
    active: true,
  },
  {
    id: "s2",
    name: "محمد رشدي",
    role: "العبور الجديدة — ريفيل وجزيل",
    phone: "01022345678",
    whatsapp: "201022345678",
    agentId: "a2",
    active: true,
  },
  {
    id: "s3",
    name: "سارة علي",
    role: "جولف سيتي — زغلول هولدينج",
    phone: "01033456789",
    whatsapp: "201033456789",
    agentId: "a3",
    active: true,
  },
  {
    id: "s4",
    name: "كريم حسن",
    role: "تمويل وقانون عقاري",
    phone: "01008657085",
    whatsapp: "201008657085",
    agentId: "a4",
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
