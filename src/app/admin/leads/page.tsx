"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Search,
  User,
  Building2,
  Phone,
  Clock,
  ArrowLeft,
  Send,
} from "lucide-react";
import { fetchLeads } from "@/lib/leads/client";
import { leadStatusLabels, leadStatusColors, leadSourceLabels } from "@/lib/leads/labels";
import { openWhatsApp, buildMessage } from "@/lib/leads/whatsapp";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminFilterPills } from "@/components/admin/AdminFilterPills";
import type { SalesRep } from "@/lib/data/sales";
import type { Lead, LeadStatus } from "@/types/leads";
import { cn } from "@/lib/utils";

const statusBorder: Record<LeadStatus, string> = {
  new: "border-s-blue-500",
  assigned: "border-s-gold",
  contacted: "border-s-purple-500",
  won: "border-s-emerald-500",
  lost: "border-s-black/20",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [repsMap, setRepsMap] = useState<Record<string, string>>({});
  const [reps, setReps] = useState<SalesRep[]>([]);

  useEffect(() => {
    fetch("/api/admin/sales", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then((repsList: SalesRep[]) => {
        setReps(repsList);
        setRepsMap(Object.fromEntries(repsList.map((r) => [r.id, r.name])));
      })
      .catch(() => {
        setReps([]);
        setRepsMap({});
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchLeads()
      .then(setLeads)
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = leads.filter((lead) => {
    if (filter !== "all" && lead.status !== filter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      lead.clientName?.toLowerCase().includes(q) ||
      lead.clientPhone?.includes(q) ||
      lead.propertyTitle?.toLowerCase().includes(q)
    );
  });

  const counts = useMemo(() => {
    const all = leads;
    return {
      all: all.length,
      new: all.filter((l) => l.status === "new").length,
      assigned: all.filter((l) => l.status === "assigned").length,
      contacted: all.filter((l) => l.status === "contacted").length,
      won: all.filter((l) => l.status === "won").length,
      lost: all.filter((l) => l.status === "lost").length,
    };
  }, [leads]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="العملاء المحتملون"
        description="استفسارات العقارات والتواصل"
        action={{ label: "مركز واتساب", href: "/admin/whatsapp" }}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="إجمالي العملاء" value={counts.all} icon={MessageCircle} accent="blue" />
        <AdminStatCard label="عملاء جدد" value={counts.new} icon={User} accent="gold" />
        <AdminStatCard label="تم التواصل" value={counts.contacted} icon={Phone} accent="purple" />
        <AdminStatCard label="صفقات مكتملة" value={counts.won} icon={Building2} accent="emerald" />
      </div>

      <div className="dam-card-elevated rounded-2xl p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-black/30" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالاسم، الهاتف، العقار…"
              className="dam-contact-input w-full py-2.5 ps-10 text-sm"
            />
          </div>
          <AdminFilterPills
            value={filter}
            onChange={setFilter}
            options={[
              { id: "all" as const, label: "الكل", count: counts.all },
              { id: "new" as const, label: "جديد", count: counts.new },
              { id: "assigned" as const, label: "مُعيَّن", count: counts.assigned },
              { id: "contacted" as const, label: "تم التواصل", count: counts.contacted },
              { id: "won" as const, label: "تم البيع", count: counts.won },
              { id: "lost" as const, label: "ملغي", count: counts.lost },
            ]}
          />
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="admin-shimmer h-24 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <AdminEmptyState
            icon={MessageCircle}
            title="لا يوجد عملاء في هذا التصنيف"
            description="جرّب تغيير الفلتر أو انتظر استفسارات جديدة من الموقع"
          />
        ) : (
          filtered.map((lead) => {
            const repName = lead.assignedSalesId ? repsMap[lead.assignedSalesId] : null;
            const initials = (lead.clientName || "؟")
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("");

            return (
              <div
                key={lead.id}
                className={cn(
                  "admin-lead-card rounded-2xl border-s-4 p-5",
                  statusBorder[lead.status],
                )}
              >
                <div className="flex flex-wrap items-start gap-4">
                  <Link href={`/admin/leads/${lead.id}`} className="flex min-w-0 flex-1 gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 font-serif text-lg text-gold">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-[#0a0a0a]">
                          {lead.clientName || "عميل بدون اسم"}
                        </h2>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[10px] font-medium",
                            leadStatusColors[lead.status],
                          )}
                        >
                          {leadStatusLabels[lead.status]}
                        </span>
                      </div>
                      {lead.propertyTitle ? (
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-gold">
                          <Building2 className="h-3.5 w-3.5 shrink-0" />
                          {lead.propertyTitle}
                        </p>
                      ) : null}
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-black/45">
                        <span>{leadSourceLabels[lead.source]}</span>
                        {lead.clientPhone ? (
                          <span className="flex items-center gap-1" dir="ltr">
                            <Phone className="h-3 w-3" />
                            {lead.clientPhone}
                          </span>
                        ) : null}
                        {repName ? <span>· {repName}</span> : null}
                      </div>
                    </div>
                  </Link>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <time className="flex items-center gap-1 text-[10px] text-black/35">
                      <Clock className="h-3 w-3" />
                      {new Date(lead.createdAt).toLocaleDateString("ar-EG", {
                        day: "numeric",
                        month: "short",
                      })}
                    </time>
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
                          className="rounded-lg border border-gold/20 bg-gold/10 p-2 text-gold hover:bg-gold/20"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      ) : null}
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="rounded-lg border border-black/8 p-2 text-black/30 hover:border-gold/40"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
