import { prisma } from "@/lib/prisma";
import { salesReps as staticReps } from "@/lib/data/sales";
import type { SalesRep } from "@/lib/data/sales";

function rowToRep(row: {
  id: string;
  name: string;
  role: string;
  phone: string;
  whatsapp: string;
  telegramChatId: string | null;
  telegramUserId: string | null;
  agentId: string | null;
  active: boolean;
}): SalesRep {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    phone: row.phone,
    whatsapp: row.whatsapp,
    telegramChatId: row.telegramChatId ?? undefined,
    telegramUserId: row.telegramUserId ?? undefined,
    agentId: row.agentId ?? undefined,
    active: row.active,
  };
}

export async function getAllSalesReps() {
  try {
    const rows = await prisma.salesRep.findMany({ orderBy: { name: "asc" } });
    if (rows.length > 0) return rows.map(rowToRep);
  } catch {
    /* fallback */
  }
  return staticReps;
}

export async function getActiveSalesReps() {
  const all = await getAllSalesReps();
  return all.filter((s) => s.active);
}

export async function getSalesRep(id: string) {
  const all = await getAllSalesReps();
  return all.find((s) => s.id === id);
}

export async function getSalesRepByAgentId(agentId: string) {
  const all = await getActiveSalesReps();
  return all.find((s) => s.agentId === agentId);
}

/** توزيع عشوائي على مندوب نشط */
export async function pickRandomSalesRep() {
  const reps = await getActiveSalesReps();
  if (reps.length === 0) return null;
  return reps[Math.floor(Math.random() * reps.length)];
}

export type SalesRepInput = {
  name: string;
  role: string;
  phone: string;
  whatsapp: string;
  telegramChatId?: string;
  telegramUserId?: string;
  agentId?: string;
  active?: boolean;
};

export async function createSalesRep(input: SalesRepInput) {
  const id = `s${Date.now()}`;
  const row = await prisma.salesRep.create({
    data: {
      id,
      name: input.name,
      role: input.role,
      phone: input.phone,
      whatsapp: input.whatsapp,
      telegramChatId: input.telegramChatId ?? null,
      telegramUserId: input.telegramUserId ?? null,
      agentId: input.agentId ?? null,
      active: input.active ?? true,
    },
  });
  return rowToRep(row);
}

export async function updateSalesRep(id: string, input: Partial<SalesRepInput>) {
  const row = await prisma.salesRep.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.role !== undefined ? { role: input.role } : {}),
      ...(input.phone !== undefined ? { phone: input.phone } : {}),
      ...(input.whatsapp !== undefined ? { whatsapp: input.whatsapp } : {}),
      ...(input.telegramChatId !== undefined
        ? { telegramChatId: input.telegramChatId || null }
        : {}),
      ...(input.telegramUserId !== undefined
        ? { telegramUserId: input.telegramUserId || null }
        : {}),
      ...(input.agentId !== undefined ? { agentId: input.agentId || null } : {}),
      ...(input.active !== undefined ? { active: input.active } : {}),
    },
  });
  return rowToRep(row);
}

export async function deleteSalesRep(id: string) {
  await prisma.salesRep.delete({ where: { id } });
}
