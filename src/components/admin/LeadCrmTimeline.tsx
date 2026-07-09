"use client";

import { cn } from "@/lib/utils";
import { leadStatusLabels } from "@/lib/leads/labels";
import type { LeadStatus } from "@/types/leads";

const steps: LeadStatus[] = ["new", "assigned", "contacted", "won"];

const order: Record<LeadStatus, number> = {
  new: 0,
  assigned: 1,
  contacted: 2,
  won: 3,
  lost: -1,
};

export function LeadCrmTimeline({
  status,
  createdAt,
  assignedAt,
}: {
  status: LeadStatus;
  createdAt: string;
  assignedAt?: string;
}) {
  const current = status === "lost" ? -1 : order[status];

  return (
    <div className="rounded-2xl border border-black/8 bg-white p-5">
      <h2 className="admin-section-title">مسار العميل</h2>
      <ol className="mt-5 space-y-0">
        {steps.map((step, i) => {
          const done = current >= i;
          const active = current === i;
          return (
            <li key={step} className="relative flex gap-4 pb-6 last:pb-0">
              {i < steps.length - 1 ? (
                <span
                  className={cn(
                    "absolute start-[11px] top-6 h-full w-px",
                    done ? "bg-black/25" : "bg-black/8",
                  )}
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                  done ? "bg-black text-white" : "border border-black/15 bg-white text-black/30",
                  active && "ring-2 ring-black/15",
                )}
              >
                {i + 1}
              </span>
              <div>
                <p className={cn("text-sm font-medium", done ? "text-[#0a0a0a]" : "text-black/35")}>
                  {leadStatusLabels[step]}
                </p>
                {step === "new" ? (
                  <p className="text-[10px] text-black/40">
                    {new Date(createdAt).toLocaleString("ar-EG")}
                  </p>
                ) : null}
                {step === "assigned" && assignedAt ? (
                  <p className="text-[10px] text-black/40">
                    {new Date(assignedAt).toLocaleString("ar-EG")}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
      {status === "lost" ? (
        <p className="mt-3 rounded-lg bg-black/5 px-3 py-2 text-xs text-black/50">
          تم إغلاق الطلب كـ «ملغي»
        </p>
      ) : null}
    </div>
  );
}
