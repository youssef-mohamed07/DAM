"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Columns3,
  MessageSquare,
  PhoneMissed,
  RefreshCw,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { fetchLeads, fetchLeadStats, updateLead } from "@/lib/leads/client";
import { formatLeadAge, isActiveLead } from "@/lib/leads/crm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { LeadCrmCard } from "@/components/admin/LeadCrmCard";
import { LeadPipeline } from "@/components/admin/LeadPipeline";
import type { SalesRep } from "@/lib/data/sales";
import type { Lead, LeadStatus } from "@/types/leads";
import { cn } from "@/lib/utils";

type OpsSummary = {
  unassigned: number;
  notifications: Record<string, number>;
  byRep: { salesRepId: string; count: number }[];
};

type Stats = {
  total: number;
  todayCount?: number;
  byStatus: Record<string, number>;
  bySource?: Record<string, number>;
};

const STALE_MS = 48 * 60 * 60 * 1000;

function isStale(lead: Lead) {
  if (!isActiveLead(lead.status)) return false;
  if (lead.status === "new") return false;
  const ref = lead.assignedAt || lead.updatedAt || lead.createdAt;
  return Date.now() - new Date(ref).getTime() > STALE_MS;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [ops, setOps] = useState<OpsSummary | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [reps, setReps] = useState<SalesRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, leadsList, repsList, opsRes] = await Promise.all([
        fetchLeadStats().catch(() => null),
        fetchLeads().catch(() => [] as Lead[]),
        fetch("/api/admin/sales", { credentials: "include" })
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => []),
        fetch("/api/admin/operations", { credentials: "include" })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
      ]);
      setStats(s);
      setLeads(Array.isArray(leadsList) ? leadsList : []);
      setReps(Array.isArray(repsList) ? repsList : []);
      if (opsRes) {
        setOps({
          unassigned: opsRes.unassigned ?? 0,
          notifications: opsRes.notifications ?? {},
          byRep: opsRes.byRep ?? opsRes.repStats ?? [],
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const repsMap = useMemo(
    () => Object.fromEntries(reps.map((r) => [r.id, r.name])),
    [reps],
  );

  const activeLeads = useMemo(
    () => leads.filter((l) => isActiveLead(l.status)),
    [leads],
  );

  const queue = useMemo(() => {
    const unassigned = activeLeads.filter((l) => !l.assignedSalesId);
    const fresh = activeLeads.filter(
      (l) => l.status === "new" && l.assignedSalesId,
    );
    const merged = [...unassigned, ...fresh].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    // unique by id
    const seen = new Set<string>();
    return merged.filter((l) => {
      if (seen.has(l.id)) return false;
      seen.add(l.id);
      return true;
    }).slice(0, 8);
  }, [activeLeads]);

  const followUps = useMemo(
    () =>
      activeLeads
        .filter(isStale)
        .sort(
          (a, b) =>
            new Date(a.updatedAt || a.createdAt).getTime() -
            new Date(b.updatedAt || b.createdAt).getTime(),
        )
        .slice(0, 6),
    [activeLeads],
  );

  const repLoad = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of activeLeads) {
      if (!l.assignedSalesId) continue;
      counts.set(l.assignedSalesId, (counts.get(l.assignedSalesId) ?? 0) + 1);
    }
    return reps
      .filter((r) => r.active)
      .map((r) => ({
        rep: r,
        active: counts.get(r.id) ?? 0,
        total: ops?.byRep.find((b) => b.salesRepId === r.id)?.count ?? 0,
      }))
      .sort((a, b) => b.active - a.active);
  }, [activeLeads, reps, ops]);

  async function handleStatusChange(id: string, status: LeadStatus) {
    try {
      const updated = await updateLead(id, { status });
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
      setStats((s) => {
        if (!s) return s;
        const byStatus = { ...s.byStatus };
        const old = leads.find((l) => l.id === id);
        if (old) byStatus[old.status] = Math.max(0, (byStatus[old.status] ?? 1) - 1);
        byStatus[status] = (byStatus[status] ?? 0) + 1;
        return { ...s, byStatus };
      });
    } catch {
      setMsg("فشل تحديث الحالة");
    }
  }

  async function distributeUnassigned() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/leads/distribute", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "auto" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "فشل التوزيع");
      setMsg(`تم توزيع ${data.count ?? data.updated?.length ?? "—"} عميل`);
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "فشل التوزيع");
    } finally {
      setBusy(false);
    }
  }

  const failedNotify = ops?.notifications?.failed ?? 0;
  const pendingNotify = ops?.notifications?.pending ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <AdminPageHeader
          title="CRM · مركز العملاء"
          description="طابور العمل · البايبلاين · متابعة المندوبين"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => load()}
            className="inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-black/70 transition hover:border-black/25"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            تحديث
          </button>
          <button
            type="button"
            disabled={busy || (ops?.unassigned ?? 0) === 0}
            onClick={distributeUnassigned}
            className="inline-flex items-center gap-2 bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black/90 disabled:opacity-40"
          >
            <Zap className="h-4 w-4" />
            توزيع غير المعيّنين
          </button>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-2.5 text-sm font-medium"
          >
            <Columns3 className="h-4 w-4" />
            كل العملاء
          </Link>
        </div>
      </div>

      {msg ? (
        <div className="border border-black/10 bg-white px-4 py-3 text-sm text-black/70">
          {msg}
        </div>
      ) : null}

      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <AdminStatCard
          label="جديد"
          value={stats?.byStatus?.new ?? 0}
          icon={MessageSquare}
          accent="blue"
        />
        <AdminStatCard
          label="بدون مندوب"
          value={ops?.unassigned ?? 0}
          icon={UserPlus}
          accent="gold"
        />
        <AdminStatCard
          label="اليوم"
          value={stats?.todayCount ?? 0}
          icon={TrendingUp}
          accent="emerald"
        />
        <AdminStatCard
          label="متابعة متأخرة"
          value={followUps.length}
          icon={Clock}
          accent="purple"
        />
        <AdminStatCard
          label="إشعار فاشل"
          value={failedNotify}
          icon={PhoneMissed}
          accent="gold"
        />
        <AdminStatCard
          label="صفقات مكتملة"
          value={stats?.byStatus?.won ?? 0}
          icon={CheckCircle2}
          accent="emerald"
        />
      </div>

      {/* Alerts */}
      {(ops?.unassigned ?? 0) > 0 || failedNotify > 0 || pendingNotify > 0 ? (
        <div className="grid gap-3 md:grid-cols-3">
          {(ops?.unassigned ?? 0) > 0 ? (
            <Link
              href="/admin/leads?status=new"
              className="flex items-start gap-3 border border-amber-200 bg-amber-50 px-4 py-3 transition hover:border-amber-300"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  {ops?.unassigned} عميل بدون مندوب
                </p>
                <p className="mt-0.5 text-xs text-amber-800/70">يحتاج توزيع فوري</p>
              </div>
            </Link>
          ) : null}
          {failedNotify > 0 ? (
            <Link
              href="/admin/operations"
              className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 transition hover:border-red-300"
            >
              <PhoneMissed className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <div>
                <p className="text-sm font-semibold text-red-900">
                  {failedNotify} إشعار تليجرام فاشل
                </p>
                <p className="mt-0.5 text-xs text-red-800/70">راجع التوزيع والإشعارات</p>
              </div>
            </Link>
          ) : null}
          {followUps.length > 0 ? (
            <div className="flex items-start gap-3 border border-violet-200 bg-violet-50 px-4 py-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
              <div>
                <p className="text-sm font-semibold text-violet-900">
                  {followUps.length} متابعة متأخرة (+48س)
                </p>
                <p className="mt-0.5 text-xs text-violet-800/70">لم يُحدَّث وضع العميل</p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Action queue */}
        <section className="border border-black/8 bg-white">
          <div className="flex items-center justify-between border-b border-black/6 px-5 py-4">
            <div>
              <h2 className="font-semibold text-[#121212]">طابور العمل</h2>
              <p className="mt-0.5 text-xs text-black/40">
                غير معيّن + عملاء جدد يحتاجون حركة
              </p>
            </div>
            <span className="bg-black/5 px-2.5 py-1 text-xs font-medium text-black/50">
              {queue.length}
            </span>
          </div>
          <div className="divide-y divide-black/5 p-3">
            {loading ? (
              <p className="py-12 text-center text-sm text-black/35">جاري التحميل…</p>
            ) : queue.length === 0 ? (
              <p className="py-12 text-center text-sm text-black/35">
                الطابور فاضي — كل العملاء متعيّنين
              </p>
            ) : (
              queue.map((lead) => (
                <div key={lead.id} className="py-2">
                  <LeadCrmCard
                    lead={lead}
                    reps={reps}
                    repName={
                      lead.assignedSalesId
                        ? repsMap[lead.assignedSalesId]
                        : undefined
                    }
                    onStatusChange={handleStatusChange}
                  />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Follow-ups + reps */}
        <div className="space-y-6">
          <section className="border border-black/8 bg-white">
            <div className="flex items-center justify-between border-b border-black/6 px-5 py-4">
              <div>
                <h2 className="font-semibold text-[#121212]">متابعة متأخرة</h2>
                <p className="mt-0.5 text-xs text-black/40">أكثر من 48 ساعة بدون تحديث</p>
              </div>
            </div>
            <div className="divide-y divide-black/5">
              {followUps.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-black/35">
                  مفيش متابعات متأخرة
                </p>
              ) : (
                followUps.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/admin/leads/${lead.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-black/[0.02]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#121212]">
                        {lead.clientName || "عميل"}
                      </p>
                      <p className="mt-0.5 text-xs text-black/40">
                        {lead.assignedSalesId
                          ? repsMap[lead.assignedSalesId] || "مندوب"
                          : "بدون مندوب"}
                        {lead.clientPhone ? ` · ${lead.clientPhone}` : ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] text-violet-600">
                      {formatLeadAge(lead.updatedAt || lead.createdAt)}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section className="border border-black/8 bg-white">
            <div className="flex items-center justify-between border-b border-black/6 px-5 py-4">
              <div>
                <h2 className="font-semibold text-[#121212]">حمل المندوبين</h2>
                <p className="mt-0.5 text-xs text-black/40">العملاء النشطون حالياً</p>
              </div>
              <Link href="/admin/sales" className="text-xs text-black/45 hover:text-black">
                الفريق
              </Link>
            </div>
            <div className="divide-y divide-black/5">
              {repLoad.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-black/35">لا يوجد مندوبون</p>
              ) : (
                repLoad.map(({ rep, active }) => (
                  <Link
                    key={rep.id}
                    href={`/admin/leads?rep=${rep.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-black/[0.02]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#121212]">
                        {rep.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-black/40">
                        {rep.saleCategory === "resale" ? "Resale" : "Primary"} · {rep.role}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "min-w-[2rem] text-center text-sm font-bold",
                          active === 0 ? "text-black/25" : "text-[#121212]",
                        )}
                      >
                        {active}
                      </span>
                      <Users className="h-3.5 w-3.5 text-black/25" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Pipeline */}
      <section className="border border-black/8 bg-white p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-[#121212]">بايبلاين المبيعات</h2>
            <p className="mt-0.5 text-xs text-black/40">
              العملاء النشطون حسب المرحلة — اضغط للتفاصيل أو غيّر الحالة
            </p>
          </div>
          <Link
            href="/admin/leads?view=pipeline"
            className="text-xs font-medium text-black/50 hover:text-black"
          >
            فتح كامل
          </Link>
        </div>
        {loading ? (
          <p className="py-16 text-center text-sm text-black/35">جاري التحميل…</p>
        ) : (
          <LeadPipeline
            leads={activeLeads}
            repsMap={repsMap}
            onStatusChange={handleStatusChange}
          />
        )}
      </section>
    </div>
  );
}
