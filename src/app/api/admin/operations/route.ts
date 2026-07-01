import { NextResponse } from "next/server";
import { getOperationsStats } from "@/lib/leads/store";
import { getAllSalesReps } from "@/lib/sales/repository";
import { getTelegramHealth } from "@/lib/telegram/status";
import { distributionStrategyLabels } from "@/lib/settings/store";

export async function GET() {
  const [ops, reps, telegram] = await Promise.all([
    getOperationsStats(),
    getAllSalesReps(),
    getTelegramHealth(),
  ]);

  const members = telegram.groupChatId
    ? await import("@/lib/telegram/members").then((m) =>
        m.getGroupMembers(telegram.groupChatId!),
      )
    : [];

  const repStats = ops.byRep.map((r) => {
    const rep = reps.find((x) => x.id === r.salesRepId);
    const member = rep?.telegramUserId
      ? members.find((m) => m.telegramUserId === rep.telegramUserId)
      : undefined;
    return {
      ...r,
      repName: rep?.name ?? r.salesRepId,
      telegramLinked: Boolean(rep?.telegramUserId),
      telegramName: member?.displayName,
      active: rep?.active ?? false,
    };
  });

  const unlinkedReps = reps.filter((r) => r.active && !r.telegramUserId);

  return NextResponse.json({
    ...ops,
    repStats,
    unlinkedReps: unlinkedReps.map((r) => ({ id: r.id, name: r.name })),
    telegram: {
      botConfigured: telegram.botConfigured && telegram.botOnline,
      groupConfigured: telegram.groupConfigured,
      memberCount: telegram.memberCount,
      botUsername: telegram.botUsername,
      statusMessage: telegram.statusMessage,
    },
    strategyLabel: distributionStrategyLabels[ops.settings.distributionStrategy],
  });
}
