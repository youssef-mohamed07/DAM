import type { Lead as PrismaLead } from "@prisma/client";
import type { Lead, LeadSource, LeadStatus } from "@/types/leads";

export function prismaToLead(row: PrismaLead): Lead {
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    status: row.status as LeadStatus,
    source: row.source as LeadSource,
    propertyId: row.propertyId ?? undefined,
    propertySlug: row.propertySlug ?? undefined,
    propertyTitle: row.propertyTitle ?? undefined,
    clientName: row.clientName ?? undefined,
    clientPhone: row.clientPhone ?? undefined,
    clientEmail: row.clientEmail ?? undefined,
    message: row.message ?? undefined,
    goal: row.goal ?? undefined,
    propertyType: row.propertyType ?? undefined,
    budget: row.budget ?? undefined,
    district: row.district ?? undefined,
    assignedSalesId: row.assignedSalesId ?? undefined,
    assignedAt: row.assignedAt?.toISOString(),
    notes: row.notes ?? undefined,
  };
}
