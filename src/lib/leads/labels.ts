import type { LeadStatus, NotifyStatus } from "@/types/leads";

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "جديد",
  assigned: "مُعيَّن",
  contacted: "تم التواصل",
  won: "تم البيع",
  lost: "ملغي",
};

export const leadStatusColors: Record<LeadStatus, string> = {
  new: "bg-blue-500/10 text-blue-700",
  assigned: "bg-gold/15 text-gold",
  contacted: "bg-purple-500/10 text-purple-700",
  won: "bg-emerald-500/10 text-emerald-700",
  lost: "bg-black/8 text-black/45",
};

export const leadSourceLabels = {
  property: "صفحة عقار",
  contact: "نموذج تواصل",
  manual: "يدوي",
};

export const notifyStatusLabels: Record<NotifyStatus, string> = {
  pending: "قيد الإرسال",
  sent: "تم الإرسال",
  failed: "فشل",
  skipped: "متخطى",
};

export const notifyStatusColors: Record<NotifyStatus, string> = {
  pending: "bg-amber-500/10 text-amber-700",
  sent: "bg-emerald-500/10 text-emerald-700",
  failed: "bg-red-500/10 text-red-700",
  skipped: "bg-black/8 text-black/45",
};
