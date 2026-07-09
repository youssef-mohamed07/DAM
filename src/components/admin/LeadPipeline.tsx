"use client";

import Link from "next/link";
import type { Lead } from "@/types/leads";
import { leadStatusLabels, leadStatusColors } from "@/lib/leads/labels";
import { groupLeadsByStatus, pipelineStatuses } from "@/lib/leads/crm";
import { cn } from "@/lib/utils";

type Props = {
  leads: Lead[];
  repsMap: Record<string, string>;
};

export function LeadPipeline({ leads, repsMap }: Props) {
  const grouped = groupLeadsByStatus(leads);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-[900px] gap-3">
        {pipelineStatuses.map((status) => {
          const column = grouped[status];
          return (
            <div
              key={status}
              className="flex w-[220px] shrink-0 flex-col rounded-2xl border border-black/8 bg-ivory/40"
            >
              <div className="flex items-center justify-between border-b border-black/6 px-3 py-3">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                    leadStatusColors[status],
                  )}
                >
                  {leadStatusLabels[status]}
                </span>
                <span className="text-[10px] font-medium text-black/35">{column.length}</span>
              </div>
              <div className="flex max-h-[520px] flex-col gap-2 overflow-y-auto p-2">
                {column.length === 0 ? (
                  <p className="px-2 py-6 text-center text-[10px] text-black/30">فارغ</p>
                ) : (
                  column.map((lead) => (
                    <Link
                      key={lead.id}
                      href={`/admin/leads/${lead.id}`}
                      className="block rounded-xl border border-black/6 bg-white p-3 transition hover:border-black/15 hover:shadow-sm"
                    >
                      <p className="truncate text-sm font-semibold text-[#0a0a0a]">
                        {lead.clientName || "عميل"}
                      </p>
                      {lead.clientPhone ? (
                        <p className="mt-1 text-[10px] text-black/45" dir="ltr">
                          {lead.clientPhone}
                        </p>
                      ) : null}
                      {lead.budget ? (
                        <p className="mt-1 truncate text-[10px] text-black/40">{lead.budget}</p>
                      ) : null}
                      {lead.assignedSalesId && repsMap[lead.assignedSalesId] ? (
                        <p className="mt-2 text-[10px] text-black/35">
                          {repsMap[lead.assignedSalesId]}
                        </p>
                      ) : null}
                    </Link>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
