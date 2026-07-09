import type { CreateLeadInput, LeadStatus, UpdateLeadInput } from "@/types/leads";
import type { LeadCreateResponse } from "@/types/leads";
import { getPropertyBySlug } from "@/lib/properties/repository";
import { getSalesRep } from "@/lib/sales/repository";
import { pickSalesRepForLead, pickSalesRepForExistingLead } from "@/lib/leads/distribute";
import { prismaToLead } from "@/lib/leads/mapper";
import { prisma } from "@/lib/prisma";
import type { LeadStatus as PrismaLeadStatus } from "@prisma/client";
import { formatPrice } from "@/lib/data/properties";
import { districtLabel } from "@/lib/utils";
import { notifySalesRep } from "@/lib/leads/notify-telegram";
import { getSystemSettings } from "@/lib/settings/store";

export async function listLeads(filters?: {
  status?: string;
  propertyId?: string;
  assignedSalesId?: string;
  source?: string;
}) {
  const rows = await prisma.lead.findMany({
    where: {
      ...(filters?.status ? { status: filters.status as PrismaLeadStatus } : {}),
      ...(filters?.propertyId ? { propertyId: filters.propertyId } : {}),
      ...(filters?.assignedSalesId ? { assignedSalesId: filters.assignedSalesId } : {}),
      ...(filters?.source ? { source: filters.source as import("@prisma/client").LeadSource } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return rows.map(prismaToLead);
}

export async function getLead(id: string) {
  const row = await prisma.lead.findUnique({ where: { id } });
  return row ? prismaToLead(row) : null;
}

export async function createLead(input: CreateLeadInput): Promise<LeadCreateResponse> {
  let notes = "";
  let propertyType: string | undefined = input.propertyType;
  let district: string | undefined = input.district;
  let propertyAgentId: string | undefined;

  if (input.propertySlug) {
    const property = await getPropertyBySlug(input.propertySlug);
    if (property) {
      propertyType = propertyType ?? property.type;
      district = district ?? property.district;
      propertyAgentId = property.agentId;
      notes = [
        `السعر: ${formatPrice(property.price)}`,
        `المساحة: ${property.area} م²`,
        `الغرف: ${property.bedrooms}`,
        `المنطقة: ${districtLabel(property.district)}`,
      ].join(" · ");
    }
  }

  const combinedNotes = [input.notes, notes].filter(Boolean).join("\n\n") || undefined;

  const settings = await getSystemSettings();
  const rep = settings.autoAssign
    ? await pickSalesRepForLead({ propertyAgentId })
    : null;
  const assignedSalesId = rep?.id;
  const status: LeadStatus = assignedSalesId ? "assigned" : "new";

  const row = await prisma.lead.create({
    data: {
      status,
      source: input.source,
      propertyId: input.propertyId,
      propertySlug: input.propertySlug,
      propertyTitle: input.propertyTitle,
      clientName: input.clientName,
      clientPhone: input.clientPhone,
      clientEmail: input.clientEmail,
      message: input.message,
      goal: input.goal ?? "استفسار عن عقار",
      propertyType,
      budget: input.budget,
      district,
      notes: combinedNotes,
      assignedSalesId,
      assignedAt: assignedSalesId ? new Date() : undefined,
      notifyStatus: rep ? "pending" : undefined,
    },
  });

  const lead = prismaToLead(row);

  let salesNotified = false;
  if (rep) {
    salesNotified = await notifySalesRep(lead, rep);
  }

  return {
    lead: (await getLead(lead.id)) ?? lead,
    assignedRep: rep
      ? { id: rep.id, name: rep.name, whatsapp: rep.whatsapp }
      : undefined,
    salesNotified,
  };
}

export async function updateLead(id: string, input: UpdateLeadInput) {
  const current = await prisma.lead.findUnique({ where: { id } });
  if (!current) return null;

  const data: Parameters<typeof prisma.lead.update>[0]["data"] = {};

  if (input.notes !== undefined) data.notes = input.notes;

  if (input.assignedSalesId !== undefined) {
    if (input.assignedSalesId) {
      data.assignedSalesId = input.assignedSalesId;
      data.assignedAt = new Date();
      data.notifyStatus = "pending";
      if (current.status === "new") data.status = "assigned";
    } else {
      data.assignedSalesId = null;
      data.assignedAt = null;
    }
  }

  if (input.status) data.status = input.status;

  const row = await prisma.lead.update({ where: { id }, data });
  const lead = prismaToLead(row);

  const newlyAssigned =
    input.assignedSalesId &&
    input.assignedSalesId !== current.assignedSalesId;

  if (newlyAssigned && lead.assignedSalesId) {
    const rep = await getSalesRep(lead.assignedSalesId);
    if (rep) await notifySalesRep(lead, rep);
    return getLead(id);
  }

  return lead;
}

export async function assignLeadsToRep(leadIds: string[], salesRepId: string) {
  const updated = [];
  for (const id of leadIds) {
    const lead = await updateLead(id, { assignedSalesId: salesRepId });
    if (lead) updated.push(lead);
  }
  return updated;
}

export async function distributeLeads(leadIds?: string[]) {
  const { getActiveSalesReps } = await import("@/lib/sales/repository");
  const reps = await getActiveSalesReps();
  if (reps.length === 0) return { updated: [], count: 0 };

  const unassigned = await prisma.lead.findMany({
    where: {
      assignedSalesId: null,
      ...(leadIds?.length ? { id: { in: leadIds } } : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  const updated = [];

  for (const row of unassigned) {
    let propertyAgentId: string | undefined;
    if (row.propertySlug) {
      const property = await getPropertyBySlug(row.propertySlug);
      propertyAgentId = property?.agentId;
    }

    const rep = await pickSalesRepForExistingLead(prismaToLead(row), propertyAgentId);
    if (!rep) continue;

    const lead = await updateLead(row.id, { assignedSalesId: rep.id });
    if (lead) updated.push(lead);
  }

  return { updated, count: updated.length };
}

export async function resendLeadNotification(leadId: string) {
  const lead = await getLead(leadId);
  if (!lead?.assignedSalesId) return { ok: false as const, error: "لا يوجد مندوب معيّن" };

  const rep = await getSalesRep(lead.assignedSalesId);
  if (!rep) return { ok: false as const, error: "المندوب غير موجود" };

  const sent = await notifySalesRep(lead, rep);
  return {
    ok: sent,
    error: sent ? undefined : "فشل الإرسال",
    lead: await getLead(leadId),
  };
}

export async function getLeadStats() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [total, grouped, sourceGrouped, recent, todayCount] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.lead.groupBy({ by: ["source"], _count: { _all: true } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.lead.count({ where: { createdAt: { gte: startOfToday } } }),
  ]);

  const byStatus = {
    new: 0,
    assigned: 0,
    contacted: 0,
    won: 0,
    lost: 0,
  };

  for (const g of grouped) {
    byStatus[g.status] = g._count._all;
  }

  const propertyGroups = await prisma.lead.groupBy({
    by: ["propertyId"],
    where: { propertyId: { not: null } },
    _count: { _all: true },
  });

  const byProperty: Record<string, number> = {};
  for (const g of propertyGroups) {
    if (g.propertyId) byProperty[g.propertyId] = g._count._all;
  }

  const bySource: Record<string, number> = {
    property: 0,
    contact: 0,
    manual: 0,
    hero: 0,
  };
  for (const g of sourceGrouped) {
    bySource[g.source] = g._count._all;
  }

  return {
    total,
    todayCount,
    byStatus,
    bySource,
    byProperty,
    recent: recent.map(prismaToLead),
  };
}

export async function getOperationsStats() {
  const [unassigned, byRep, settings] = await Promise.all([
    prisma.lead.count({ where: { assignedSalesId: null, status: { notIn: ["won", "lost"] } } }),
    prisma.lead.groupBy({
      by: ["assignedSalesId"],
      where: { assignedSalesId: { not: null } },
      _count: { _all: true },
    }),
    getSystemSettings(),
  ]);

  const notifications: Record<string, number> = {
    sent: 0,
    failed: 0,
    pending: 0,
    skipped: 0,
  };

  try {
    const notifyStats = await prisma.lead.groupBy({
      by: ["notifyStatus"],
      _count: { _all: true },
    });
    for (const g of notifyStats) {
      if (g.notifyStatus) notifications[g.notifyStatus] = g._count._all;
    }
  } catch {
    const rows = await prisma.lead.findMany({
      select: { notifyStatus: true },
    });
    for (const row of rows) {
      if (row.notifyStatus) notifications[row.notifyStatus]++;
    }
  }

  return {
    unassigned,
    notifications,
    byRep: byRep.map((g) => ({
      salesRepId: g.assignedSalesId!,
      count: g._count._all,
    })),
    settings,
  };
}
