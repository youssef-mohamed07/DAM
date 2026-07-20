"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  MessageCircle,
  Search,
  User,
  Building2,
  LayoutList,
  Columns3,
  RefreshCw,
  Clock,
} from "lucide-react";
import { fetchLeads, updateLead } from "@/lib/leads/client";
import { isActiveLead } from "@/lib/leads/crm";
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

const STALE_MS = 48 * 60 * 60 * 1000;

function isStale(lead: Lead) {
  if (!isActiveLead(lead.status) || lead.status === "new") return false;
  const ref = lead.assignedAt || lead.updatedAt || lead.createdAt;
  return Date.now() - new Date(ref).getTime() > STALE_MS;
}

export default function AdminLeadsContent() {
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [repFilter, setRepFilter] = useState<string>("all");
  const [staleOnly, setStaleOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("list");
  const [loading, setLoading] = useState(true);
  const [repsMap, setRepsMap] = useState<Record<string, string>>({});
  const [reps, setReps] = useState<SalesRep[]>([]);

  useEffect(() => {
    const status = searchParams.get("status") as LeadStatus | null;
    const rep = searchParams.get("rep");
    const viewParam = searchParams.get("view");
    if (status && ["new", "assigned", "contacted", "won", "lost"].includes(status)) {
      setStatusFilter(status);
    }
    if (rep) setRepFilter(rep);
    if (viewParam === "pipeline" || viewParam === "list") setView(viewParam);
  }, [searchParams]);

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
      if (repFilter === "unassigned" && lead.assignedSalesId) return false;
      if (repFilter !== "all" && repFilter !== "unassigned" && lead.assignedSalesId !== repFilter) {
        return false;
      }
      if (staleOnly && !isStale(lead)) return false;
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
  }, [leads, statusFilter, sourceFilter, repFilter, staleOnly, search]);

  const counts = useMemo(() => {
    const active = leads.filter((l) => isActiveLead(l.status));
    return {
      all: leads.length,
      active: active.length,
      new: leads.filter((l) => l.status === "new").length,
      contacted: leads.filter((l) => l.status === "contacted").length,
      won: leads.filter((l) => l.status === "won").length,
      hero: leads.filter((l) => l.source === "hero").length,
      property: leads.filter((l) => l.source === "property").length,
      contact: leads.filter((l) => l.source === "contact").length,
      unassigned: active.filter((l) => !l.assignedSalesId).length,
      stale: active.filter(isStale).length,
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
        title="العملاء والبايبلاين"
        description="قائمة · Pipeline · فلتر بالمندوب والمتابعة المتأخرة"
        action={{ label: "CRM الرئيسي", href: "/admin" }}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminStatCard label="إجمالي العملاء" value={counts.all} icon={MessageCircle} accent="blue" />
        <AdminStatCard label="نشط" value={counts.active} icon={User} accent="gold" />
        <AdminStatCard label="بدون مندوب" value={counts.unassigned} icon={User} accent="purple" />
        <AdminStatCard label="متابعة متأخرة" value={counts.stale} icon={Clock} accent="gold" />
        <AdminStatCard label="صفقات" value={counts.won} icon={Building2} accent="emerald" />
      </div>

      <div className="space-y-4 border border-black/8 bg-white p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-black/30" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث: اسم، هاتف، منطقة، ميزانية…"
              className="dam-contact-input w-full py-2.5 ps-10 text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setStaleOnly((v) => !v)}
              className={cn(
                "inline-flex items-center gap-1.5 border px-3 py-2 text-xs font-medium transition",
                staleOnly
                  ? "border-violet-300 bg-violet-50 text-violet-700"
                  : "border-black/10 text-black/55 hover:border-black/25",
              )}
            >
              <Clock className="h-3.5 w-3.5" />
              متأخر (+48س)
            </button>
            <button
              type="button"
              onClick={loadLeads}
              className="inline-flex items-center gap-1.5 border border-black/10 px-3 py-2 text-xs text-black/55 hover:border-black/25"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
              تحديث
            </button>
            <div className="flex border border-black/10 p-0.5">
              <button
                type="button"
                onClick={() => setView("list")}
                className={cn(
                  "inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium",
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
                  "inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium",
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
          <p className="text-[10px] font-semibold tracking-wide text-black/35 uppercase">المندوب</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRepFilter("all")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition",
                repFilter === "all" ? "bg-black text-white" : "bg-black/5 text-black/55 hover:bg-black/10",
              )}
            >
              الكل
            </button>
            <button
              type="button"
              onClick={() => setRepFilter("unassigned")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition",
                repFilter === "unassigned"
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100",
              )}
            >
              بدون مندوب ({counts.unassigned})
            </button>
            {reps
              .filter((r) => r.active)
              .map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRepFilter(r.id)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition",
                    repFilter === r.id
                      ? "bg-black text-white"
                      : "bg-black/5 text-black/55 hover:bg-black/10",
                  )}
                >
                  {r.name}
                  <span className="ms-1 opacity-60">
                    ({leads.filter((l) => l.assignedSalesId === r.id && isActiveLead(l.status)).length})
                  </span>
                </button>
              ))}
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
            <div key={i} className="admin-shimmer h-28" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <AdminEmptyState
          icon={MessageCircle}
          title="لا يوجد عملاء في هذا الفلتر"
          description="جرّب تغيير المصدر أو المندوب أو الحالة"
          action={{ label: "CRM الرئيسي", href: "/admin" }}
        />
      ) : view === "pipeline" ? (
        <LeadPipeline
          leads={filtered}
          repsMap={repsMap}
          onStatusChange={handleStatusChange}
        />
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
        {filtered.length} عميل معروض · الهيرو · العقارات ·
        <Link href="/contact" className="mx-1 text-black/55 hover:underline" target="_blank">
          التواصل
        </Link>
      </p>
    </div>
  );
}
