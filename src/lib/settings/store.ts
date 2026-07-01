import { prisma } from "@/lib/prisma";

export type DistributionStrategy = "random" | "round_robin" | "property_agent";

export type SystemSettings = {
  autoAssign: boolean;
  autoNotifyTelegram: boolean;
  distributionStrategy: DistributionStrategy;
};

const DEFAULTS: SystemSettings = {
  autoAssign: true,
  autoNotifyTelegram: true,
  distributionStrategy: "round_robin",
};

const KEYS = {
  autoAssign: "auto_assign",
  autoNotifyTelegram: "auto_notify_telegram",
  distributionStrategy: "distribution_strategy",
  rrIndex: "distribution_rr_index",
} as const;

async function getRaw(key: string): Promise<string | null> {
  try {
    const row = await prisma.appSetting.findUnique({ where: { key } });
    return row?.value ?? null;
  } catch {
    return null;
  }
}

async function setRaw(key: string, value: string) {
  await prisma.appSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}

export async function getSystemSettings(): Promise<SystemSettings> {
  const [autoAssign, autoNotify, strategy] = await Promise.all([
    getRaw(KEYS.autoAssign),
    getRaw(KEYS.autoNotifyTelegram),
    getRaw(KEYS.distributionStrategy),
  ]);

  return {
    autoAssign: autoAssign === null ? DEFAULTS.autoAssign : autoAssign === "true",
    autoNotifyTelegram:
      autoNotify === null ? DEFAULTS.autoNotifyTelegram : autoNotify === "true",
    distributionStrategy:
      (strategy as DistributionStrategy) || DEFAULTS.distributionStrategy,
  };
}

export async function updateSystemSettings(
  patch: Partial<SystemSettings>,
): Promise<SystemSettings> {
  if (patch.autoAssign !== undefined) {
    await setRaw(KEYS.autoAssign, String(patch.autoAssign));
  }
  if (patch.autoNotifyTelegram !== undefined) {
    await setRaw(KEYS.autoNotifyTelegram, String(patch.autoNotifyTelegram));
  }
  if (patch.distributionStrategy !== undefined) {
    await setRaw(KEYS.distributionStrategy, patch.distributionStrategy);
  }
  return getSystemSettings();
}

export async function getRoundRobinIndex(): Promise<number> {
  const raw = await getRaw(KEYS.rrIndex);
  return raw ? parseInt(raw, 10) || 0 : 0;
}

export async function bumpRoundRobinIndex() {
  const next = (await getRoundRobinIndex()) + 1;
  await setRaw(KEYS.rrIndex, String(next));
  return next;
}

export const distributionStrategyLabels: Record<DistributionStrategy, string> = {
  random: "عشوائي",
  round_robin: "بالتناوب (Round Robin)",
  property_agent: "حسب مندوب العقار",
};
