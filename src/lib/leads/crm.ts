import type { Lead, LeadSource, LeadStatus } from "@/types/leads";
import { leadSourceLabels, leadStatusLabels } from "@/lib/leads/labels";

export type LeadContactLine = { icon?: string; label: string; value: string };

export function parseContactLines(notes?: string): LeadContactLine[] {
  if (!notes?.trim()) return [];
  return notes
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^(\S+)\s+([^:]+):\s*(.+)$/);
      if (m) return { icon: m[1], label: m[2].trim(), value: m[3].trim() };
      return { label: "ملاحظة", value: line };
    });
}

export function getLeadTags(lead: Lead) {
  const tags: string[] = [];
  if (lead.goal) tags.push(lead.goal);
  if (lead.propertyType) tags.push(lead.propertyType);
  if (lead.budget) tags.push(lead.budget);
  if (lead.district) tags.push(lead.district);
  return tags;
}

export function formatLeadAge(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `منذ ${mins} د`;
  const hours = Math.floor(mins / 60);
  if (hours < 48) return `منذ ${hours} س`;
  return new Date(iso).toLocaleDateString("ar-EG", { day: "numeric", month: "short" });
}

export const pipelineStatuses: LeadStatus[] = ["new", "assigned", "contacted", "won", "lost"];

export function groupLeadsByStatus(leads: Lead[]) {
  const map: Record<LeadStatus, Lead[]> = {
    new: [],
    assigned: [],
    contacted: [],
    won: [],
    lost: [],
  };
  for (const lead of leads) {
    map[lead.status].push(lead);
  }
  return map;
}

export function sourceLabel(source: LeadSource) {
  return leadSourceLabels[source];
}

export function statusLabel(status: LeadStatus) {
  return leadStatusLabels[status];
}

export function isActiveLead(status: LeadStatus) {
  return status !== "won" && status !== "lost";
}
