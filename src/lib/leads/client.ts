import type { CreateLeadInput, Lead, LeadCreateResponse, UpdateLeadInput } from "@/types/leads";

export async function submitLead(input: CreateLeadInput): Promise<LeadCreateResponse | null> {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchLeads(params?: Record<string, string>) {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  const res = await fetch(`/api/leads${qs}`, { credentials: "include" });
  if (!res.ok) throw new Error("فشل تحميل العملاء");
  return res.json() as Promise<Lead[]>;
}

export async function fetchLead(id: string) {
  const res = await fetch(`/api/leads/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("العميل غير موجود");
  return res.json() as Promise<Lead>;
}

export async function updateLead(id: string, input: UpdateLeadInput) {
  const res = await fetch(`/api/leads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    credentials: "include",
  });
  if (!res.ok) throw new Error("فشل التحديث");
  return res.json() as Promise<Lead>;
}

export async function fetchLeadStats() {
  const res = await fetch("/api/leads/stats", { credentials: "include" });
  if (!res.ok) throw new Error("فشل تحميل الإحصائيات");
  return res.json();
}
