import type { CreateLeadInput, LeadStatus, UpdateLeadInput } from "@/types/leads";
import type { LeadCreateResponse } from "@/types/leads";
import { getPropertyBySlug } from "@/lib/properties/repository";
import { pickRandomSalesRep } from "@/lib/sales/repository";
import { prismaToLead } from "@/lib/leads/mapper";
import { prisma } from "@/lib/prisma";
import type { LeadStatus as PrismaLeadStatus } from "@prisma/client";
import { formatPrice } from "@/lib/data/properties";
import { districtLabel } from "@/lib/utils";

export async function listLeads(filters?: {
  status?: string;
  propertyId?: string;
  assignedSalesId?: string;
}) {
  const rows = await prisma.lead.findMany({
    where: {
      ...(filters?.status ? { status: filters.status as PrismaLeadStatus } : {}),
      ...(filters?.propertyId ? { propertyId: filters.propertyId } : {}),
      ...(filters?.assignedSalesId ? { assignedSalesId: filters.assignedSalesId } : {}),
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

  if (input.propertySlug) {
    const property = await getPropertyBySlug(input.propertySlug);
    if (property) {
      propertyType = propertyType ?? property.type;
      district = district ?? property.district;
      notes = [
        `السعر: ${formatPrice(property.price)}`,
        `المساحة: ${property.area} م²`,
        `الغرف: ${property.bedrooms}`,
        `المنطقة: ${districtLabel(property.district)}`,
      ].join(" · ");
    }
  }

  const rep = await pickRandomSalesRep();
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
      notes: notes || undefined,
      assignedSalesId,
      assignedAt: assignedSalesId ? new Date() : undefined,
    },
  });

  const lead = prismaToLead(row);

  return {
    lead,
    assignedRep: rep
      ? { id: rep.id, name: rep.name, whatsapp: rep.whatsapp }
      : undefined,
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
      if (current.status === "new") data.status = "assigned";
    } else {
      data.assignedSalesId = null;
      data.assignedAt = null;
    }
  }

  if (input.status) data.status = input.status;

  const row = await prisma.lead.update({ where: { id }, data });
  return prismaToLead(row);
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

  let rr = 0;
  const updated = [];

  for (const row of unassigned) {
    const repId = reps[rr % reps.length].id;
    rr++;
    const lead = await updateLead(row.id, { assignedSalesId: repId });
    if (lead) updated.push(lead);
  }

  return { updated, count: updated.length };
}

export async function getLeadStats() {
  const [total, grouped, recent] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
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

  return {
    total,
    byStatus,
    byProperty,
    recent: recent.map(prismaToLead),
  };
}
