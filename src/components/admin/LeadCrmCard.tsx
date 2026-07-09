"use client";

import Link from "next/link";
import {
  Building2,
  Clock,
  MessageCircle,
  Phone,
  Send,
  ArrowLeft,
} from "lucide-react";
import type { Lead, LeadStatus } from "@/types/leads";
import {
  leadStatusLabels,
  leadStatusColors,
  leadSourceLabels,
  leadSourceColors,
  notifyStatusLabels,
  notifyStatusColors,
} from "@/lib/leads/labels";
import { formatLeadAge, getLeadTags } from "@/lib/leads/crm";
import { openWhatsApp, buildMessage } from "@/lib/leads/whatsapp";
import type { SalesRep } from "@/lib/data/sales";
import { cn } from "@/lib/utils";

type Props = {
  lead: Lead;
  repName?: string;
  reps: SalesRep[];
  compact?: boolean;
  onStatusChange?: (id: string, status: LeadStatus) => void;
};

const statusBorder: Record<LeadStatus, string> = {
  new: "border-s-blue-500",
  assigned: "border-s-black",
  contacted: "border-s-purple-500",
  won: "border-s-emerald-500",
  lost: "border-s-black/20",
};

const quickStatuses: LeadStatus[] = ["contacted", "won", "lost"];

export function LeadCrmCard({ lead, repName, reps, compact, onStatusChange }: Props) {
  const initials = (lead.clientName || "؟")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  const tags = getLeadTags(lead);

  return (
    <article
      className={cn(
        "admin-lead-card rounded-2xl border-s-4 bg-white",
        statusBorder[lead.status],
        compact ? "p-3" : "p-5",
      )}
    >
      <div className="flex items-start gap-3">
        <Link href={`/admin/leads/${lead.id}`} className="flex min-w-0 flex-1 gap-3">
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-black/10 to-black/5 font-serif text-black",
              compact ? "h-9 w-9 text-sm" : "h-12 w-12 text-lg",
            )}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className={cn("font-semibold text-[#0a0a0a]", compact && "text-sm")}>
                {lead.clientName || "عميل بدون اسم"}
              </h3>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium",
                  leadStatusColors[lead.status],
                )}
              >
                {leadStatusLabels[lead.status]}
              </span>
            </div>

            <div className="mt-1.5 flex flex-wrap gap-1">
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium",
                  leadSourceColors[lead.source],
                )}
              >
                {leadSourceLabels[lead.source]}
              </span>
              {lead.notifyStatus ? (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium",
                    notifyStatusColors[lead.notifyStatus],
                  )}
                >
                  {notifyStatusLabels[lead.notifyStatus]}
                </span>
              ) : null}
            </div>

            {lead.propertyTitle ? (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-black/55">
                <Building2 className="h-3 w-3 shrink-0" />
                <span className="truncate">{lead.propertyTitle}</span>
              </p>
            ) : null}

            {tags.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {tags.slice(0, compact ? 2 : 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-black/[0.04] px-1.5 py-0.5 text-[10px] text-black/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-black/40">
              {lead.clientPhone ? (
                <span className="flex items-center gap-1 font-medium text-black/55" dir="ltr">
                  <Phone className="h-3 w-3" />
                  {lead.clientPhone}
                </span>
              ) : null}
              {repName ? <span>· {repName}</span> : null}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatLeadAge(lead.createdAt)}
              </span>
            </div>
          </div>
        </Link>

        {!compact ? (
          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="flex gap-1">
              {lead.clientPhone ? (
                <button
                  type="button"
                  title="واتساب العميل"
                  onClick={() =>
                    openWhatsApp(lead.clientPhone!, buildMessage("client_greeting", lead))
                  }
                  className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-600 hover:bg-emerald-500/20"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                </button>
              ) : null}
              {lead.assignedSalesId ? (
                <button
                  type="button"
                  title="إرسال للمندوب"
                  onClick={() => {
                    const rep = reps.find((r) => r.id === lead.assignedSalesId);
                    if (rep) openWhatsApp(rep.whatsapp, buildMessage("assign_sales", lead, rep));
                  }}
                  className="rounded-lg border border-black/10 bg-black/5 p-2 text-black/60 hover:bg-black/10"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              ) : null}
              <Link
                href={`/admin/leads/${lead.id}`}
                className="rounded-lg border border-black/8 p-2 text-black/30 hover:border-black/20"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {onStatusChange && !compact ? (
        <div className="mt-3 flex flex-wrap gap-1 border-t border-black/6 pt-3">
          {quickStatuses.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onStatusChange(lead.id, s)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-medium transition",
                lead.status === s
                  ? "bg-black text-white"
                  : "bg-black/5 text-black/45 hover:bg-black/10",
              )}
            >
              {leadStatusLabels[s]}
            </button>
          ))}
        </div>
      ) : null}
    </article>
  );
}
