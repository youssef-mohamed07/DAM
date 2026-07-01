import type { Lead } from "@/types/leads";
import type { SalesRep } from "@/lib/data/sales";
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

export async function pickSalesRepForLead(opts?: {
  propertyAgentId?: string;
  strategy?: DistributionStrategy;
}): Promise<SalesRep | null> {
  const reps = await getActiveSalesReps();
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
  return pickSalesRepForLead({ propertyAgentId });
}
