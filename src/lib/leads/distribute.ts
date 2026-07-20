import type { Lead } from "@/types/leads";
import type { SalesRep } from "@/lib/data/sales";
import type { SaleCategory } from "@/types";
import { getActiveSalesReps } from "@/lib/sales/repository";
import {
  bumpRoundRobinIndex,
  getRoundRobinIndex,
  getSystemSettings,
  type DistributionStrategy,
} from "@/lib/settings/store";

function pickRandom(reps: SalesRep[]) {
  return reps[Math.floor(Math.random() * reps.length)];
}

function pickRoundRobin(reps: SalesRep[], index: number) {
  return reps[index % reps.length];
}

function pickByAgent(reps: SalesRep[], agentId?: string, rrIndex?: number) {
  if (agentId) {
    const match = reps.find((r) => r.agentId === agentId);
    if (match) return match;
  }
  if (rrIndex !== undefined) return pickRoundRobin(reps, rrIndex);
  return reps[0];
}

function filterByCategory(reps: SalesRep[], category?: SaleCategory) {
  if (!category) return reps;
  const matched = reps.filter((r) => r.saleCategory === category);
  return matched.length > 0 ? matched : reps;
}

export function detectSaleCategoryFromText(...parts: (string | undefined)[]): SaleCategory | undefined {
  const blob = parts.filter(Boolean).join(" ");
  if (/إعادة\s*بيع|اعادة\s*بيع|resale/i.test(blob)) return "resale";
  if (/أولي|اولي|primary/i.test(blob)) return "primary";
  return undefined;
}

export async function pickSalesRepForLead(opts?: {
  propertyAgentId?: string;
  saleCategory?: SaleCategory;
  strategy?: DistributionStrategy;
}): Promise<SalesRep | null> {
  const all = await getActiveSalesReps();
  const reps = filterByCategory(all, opts?.saleCategory);
  if (reps.length === 0) return null;

  const settings = await getSystemSettings();
  const strategy = opts?.strategy ?? settings.distributionStrategy;

  if (strategy === "random") return pickRandom(reps);

  if (strategy === "property_agent") {
    const rr = await getRoundRobinIndex();
    const rep = pickByAgent(reps, opts?.propertyAgentId, rr);
    await bumpRoundRobinIndex();
    return rep;
  }

  const rr = await getRoundRobinIndex();
  const rep = pickRoundRobin(reps, rr);
  await bumpRoundRobinIndex();
  return rep;
}

export async function pickSalesRepForExistingLead(
  lead: Lead,
  propertyAgentId?: string,
): Promise<SalesRep | null> {
  const saleCategory =
    detectSaleCategoryFromText(lead.goal, lead.message, lead.notes) ?? undefined;
  return pickSalesRepForLead({ propertyAgentId, saleCategory });
}
