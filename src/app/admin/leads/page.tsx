"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Search,
  User,
  Building2,
  Phone,
  LayoutList,
  Columns3,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { fetchLeads, updateLead } from "@/lib/leads/client";
import { leadStatusLabels, leadSourceLabels } from "@/lib/leads/labels";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminFilterPills } from "@/components/admin/AdminFilterPills";
import { LeadCrmCard } from "@/components/admin/LeadCrmCard";
import { LeadPipeline } from "@/components/admin/LeadPipeline";
import type { SalesRep } from "@/lib/data/sales";
import type { Lead, LeadSource, LeadStatus } from "@/types/leads";
import { cn } from "@/lib/utils";

type SourceFilter = LeadSource | "all";
type ViewMode = "list" | "pipeline";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("list");
  const [loading, setLoading] = useState(true);
  const [repsMap, setRepsMap] = useState<Record<string, string>>({});
  const [reps, setReps] = useState<SalesRep[]>([]);

  const loadLeads = useCallback(() => {
    setLoading(true);
    fetchLeads()
      .then(setLeads)
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

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
    loadLeads();
  }, [loadLeads]);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      if (sourceFilter !== "all" && lead.source !== sourceFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        lead.clientName?.toLowerCase().includes(q) ||
        lead.clientPhone?.includes(q) ||
        lead.clientEmail?.toLowerCase().includes(q) ||
        lead.notes?.toLowerCase().includes(q) ||
        lead.message?.toLowerCase().includes(q) ||
        lead.propertyTitle?.toLowerCase().includes(q) ||
        lead.goal?.toLowerCase().includes(q) ||
        lead.district?.toLowerCase().includes(q)
      );
    });
  }, [leads, statusFilter, sourceFilter, search]);

  const counts = useMemo(() => {
    const active = leads.filter((l) => l.status !== "won" && l.status !== "lost");
    return {
      all: leads.length,
      active: active.length,
      new: leads.filter((l) => l.status === "new").length,
      contacted: leads.filter((l) => l.status === "contacted").length,
      won: leads.filter((l) => l.status === "won").length,
      hero: leads.filter((l) => l.source === "hero").length,
      property: leads.filter((l) => l.source === "property").length,
      contact: leads.filter((l) => l.source === "contact").length,
    };
  }, [leads]);

  async function handleStatusChange(id: string, status: LeadStatus) {
    try {
      const updated = await updateLead(id, { status });
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="CRM — العملاء"
        description="متابعة الاستفسارات من الهيرو والعقارات ونموذج التواصل"
        action={{ label: "مركز التشغيل", href: "/admin/operations" }}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminStatCard label="إجمالي العملاء" value={counts.all} icon={MessageCircle} accent="blue" />
        <AdminStatCard label="نشط" value={counts.active} icon={User} accent="gold" />
        <AdminStatCard label="فورم الهيرو" value={counts.hero} icon={Sparkles} accent="gold" />
        <AdminStatCard label="تم التواصل" value={counts.contacted} icon={Phone} accent="purple" />
        <AdminStatCard label="صفقات" value={counts.won} icon={Building2} accent="emerald" />
      </div>

      <div className="dam-card-elevated space-y-4 rounded-2xl p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-black/30" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث: اسم، هاتف، إيميل، منطقة، ميزانية…"
              className="dam-contact-input w-full py-2.5 ps-10 text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={loadLeads}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-2 text-xs text-black/55 hover:border-black/25"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
              تحديث
            </button>
            <div className="flex rounded-full border border-black/10 p-0.5">
              <button
                type="button"
                onClick={() => setView("list")}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium",
                  view === "list" ? "bg-black text-white" : "text-black/50",
                )}
              >
                <LayoutList className="h-3.5 w-3.5" />
                قائمة
              </button>
              <button
                type="button"
                onClick={() => setView("pipeline")}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium",
                  view === "pipeline" ? "bg-black text-white" : "text-black/50",
                )}
              >
                <Columns3 className="h-3.5 w-3.5" />
                Pipeline
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-semibold tracking-wide text-black/35 uppercase">المصدر</p>
          <AdminFilterPills
            value={sourceFilter}
            onChange={setSourceFilter}
            options={[
              { id: "all" as const, label: "كل المصادر", count: counts.all },
              { id: "hero" as const, label: leadSourceLabels.hero, count: counts.hero },
              { id: "property" as const, label: leadSourceLabels.property, count: counts.property },
              { id: "contact" as const, label: leadSourceLabels.contact, count: counts.contact },
            ]}
          />
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-semibold tracking-wide text-black/35 uppercase">الحالة</p>
          <AdminFilterPills
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { id: "all" as const, label: "الكل", count: counts.all },
              { id: "new" as const, label: leadStatusLabels.new, count: counts.new },
              { id: "assigned" as const, label: leadStatusLabels.assigned },
              { id: "contacted" as const, label: leadStatusLabels.contacted, count: counts.contacted },
              { id: "won" as const, label: leadStatusLabels.won, count: counts.won },
              { id: "lost" as const, label: leadStatusLabels.lost },
            ]}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="admin-shimmer h-28 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <AdminEmptyState
          icon={MessageCircle}
          title="لا يوجد عملاء في هذا الفلتر"
          description="جرّب تغيير المصدر أو الحالة — الطلبات من الموقع تظهر تلقائياً هنا"
          action={{ label: "فتح الموقع", href: "/" }}
        />
      ) : view === "pipeline" ? (
        <LeadPipeline leads={filtered} repsMap={repsMap} />
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <LeadCrmCard
              key={lead.id}
              lead={lead}
              repName={lead.assignedSalesId ? repsMap[lead.assignedSalesId] : undefined}
              reps={reps}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      <p className="text-center text-[11px] text-black/35">
        {filtered.length} عميل معروض · مربوط بفورم الهيرو وصفحات العقارات و
        <Link href="/contact" className="mx-1 text-black/55 hover:underline" target="_blank">
          التواصل
        </Link>
      </p>
    </div>
  );
}
