"use client";

import Link from "next/link";
import type { Lead, LeadStatus } from "@/types/leads";
import { leadStatusLabels, leadStatusColors } from "@/lib/leads/labels";
import { formatLeadAge, groupLeadsByStatus, pipelineStatuses } from "@/lib/leads/crm";
import { cn } from "@/lib/utils";

type Props = {
  leads: Lead[];
  repsMap: Record<string, string>;
  onStatusChange?: (id: string, status: LeadStatus) => void;
};

const nextStatus: Partial<Record<LeadStatus, LeadStatus>> = {
  new: "assigned",
  assigned: "contacted",
  contacted: "won",
};

export function LeadPipeline({ leads, repsMap, onStatusChange }: Props) {
  const grouped = groupLeadsByStatus(leads);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-[980px] gap-3">
        {pipelineStatuses.map((status) => {
          const column = grouped[status];
          return (
            <div
              key={status}
              className="flex w-[240px] shrink-0 flex-col border border-black/8 bg-[#faf9f7]"
            >
              <div className="flex items-center justify-between border-b border-black/6 px-3 py-3">
                <span
                  className={cn(
                    "px-2.5 py-0.5 text-[10px] font-semibold",
                    leadStatusColors[status],
                  )}
                >
                  {leadStatusLabels[status]}
                </span>
                <span className="text-[11px] font-medium text-black/35">{column.length}</span>
              </div>
              <div className="flex max-h-[560px] flex-col gap-2 overflow-y-auto p-2">
                {column.length === 0 ? (
                  <p className="px-2 py-8 text-center text-[11px] text-black/30">فارغ</p>
                ) : (
                  column.map((lead) => (
                    <div
                      key={lead.id}
                      className="border border-black/8 bg-white p-3 transition hover:border-black/20"
                    >
                      <Link href={`/admin/leads/${lead.id}`} className="block">
                        <p className="truncate text-sm font-semibold text-[#121212]">
                          {lead.clientName || "عميل"}
                        </p>
                        {lead.clientPhone ? (
                          <p className="mt-1 text-[11px] text-black/45" dir="ltr">
                            {lead.clientPhone}
                          </p>
                        ) : null}
                        {lead.goal || lead.budget ? (
                          <p className="mt-1 truncate text-[10px] text-black/40">
                            {[lead.goal, lead.budget].filter(Boolean).join(" · ")}
                          </p>
                        ) : null}
                        <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-black/35">
                          <span>
                            {lead.assignedSalesId
                              ? repsMap[lead.assignedSalesId] || "مندوب"
                              : "بدون مندوب"}
                          </span>
                          <span>{formatLeadAge(lead.createdAt)}</span>
                        </div>
                      </Link>
                      {onStatusChange && nextStatus[status] ? (
                        <div className="mt-2 flex gap-1 border-t border-black/5 pt-2">
                          <button
                            type="button"
                            onClick={() => onStatusChange(lead.id, nextStatus[status]!)}
                            className="flex-1 bg-black/5 py-1.5 text-[10px] font-medium text-black/60 transition hover:bg-black hover:text-white"
                          >
                            → {leadStatusLabels[nextStatus[status]!]}
                          </button>
                          {status !== "lost" && status !== "won" ? (
                            <button
                              type="button"
                              onClick={() => onStatusChange(lead.id, "lost")}
                              className="px-2 py-1.5 text-[10px] text-black/35 hover:bg-red-50 hover:text-red-600"
                            >
                              ضائع
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
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
