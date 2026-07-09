"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Send,
  Users,
  Shuffle,
  CheckSquare,
  Square,
  UserPlus,
  Phone,
  Building2,
  Loader2,
} from "lucide-react";
import { fetchLeads, updateLead } from "@/lib/leads/client";
import { leadStatusLabels, leadStatusColors } from "@/lib/leads/labels";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import {
  buildMessage,
  openWhatsApp,
  openWhatsAppQueue,
  type WhatsAppTemplate,
} from "@/lib/leads/whatsapp";
import type { SalesRep } from "@/lib/data/sales";
import type { Lead } from "@/types/leads";
import { cn } from "@/lib/utils";

export default function AdminWhatsAppPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [reps, setReps] = useState<SalesRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [assignRepId, setAssignRepId] = useState("");
  const [template, setTemplate] = useState<WhatsAppTemplate>("assign_sales");
  const [busy, setBusy] = useState(false);
  const [sendProgress, setSendProgress] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const [leadsRes, repsRes] = await Promise.all([
      fetchLeads().catch(() => [] as Lead[]),
      fetch("/api/admin/sales", { credentials: "include" })
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => [] as SalesRep[]),
    ]);
    setLeads(leadsRes);
    setReps(repsRes);
    if (repsRes[0] && !assignRepId) setAssignRepId(repsRes[0].id);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const unassigned = useMemo(
    () => leads.filter((l) => !l.assignedSalesId && l.status !== "lost" && l.status !== "won"),
    [leads],
  );

  const byRep = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    for (const r of reps) map[r.id] = [];
    for (const l of leads) {
      if (l.assignedSalesId && map[l.assignedSalesId]) {
        map[l.assignedSalesId].push(l);
      }
    }
    return map;
  }, [leads, reps]);

  const selectedLeads = leads.filter((l) => selected.has(l.id));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll(list: Lead[]) {
    const allSelected = list.every((l) => selected.has(l.id));
    setSelected((prev) => {
      const next = new Set(prev);
      for (const l of list) {
        if (allSelected) next.delete(l.id);
        else next.add(l.id);
      }
      return next;
    });
  }

  async function autoDistribute() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/leads/distribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mode: "auto" }),
      });
      const data = await res.json();
      await load();
      alert(`تم توزيع ${data.count} عميل على المندوبين`);
    } finally {
      setBusy(false);
    }
  }

  async function assignSelected() {
    if (!assignRepId || selected.size === 0) return;
    setBusy(true);
    try {
      await fetch("/api/admin/leads/distribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          mode: "rep",
          salesRepId: assignRepId,
          leadIds: [...selected],
        }),
      });
      setSelected(new Set());
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function assignOne(leadId: string, repId: string) {
    await updateLead(leadId, { assignedSalesId: repId });
    await load();
  }

  function sendToRep(lead: Lead, rep: SalesRep) {
    const msg = buildMessage("assign_sales", lead, rep);
    openWhatsApp(rep.whatsapp, msg);
  }

  function sendToClient(lead: Lead, tpl: WhatsAppTemplate) {
    if (!lead.clientPhone) {
      alert("لا يوجد رقم هاتف للعميل");
      return;
    }
    const msg = buildMessage(tpl, lead);
    openWhatsApp(lead.clientPhone, msg);
  }

  function bulkSendToRep() {
    const rep = reps.find((r) => r.id === assignRepId);
    if (!rep || selectedLeads.length === 0) return;

    const items = selectedLeads.map((lead) => ({
      phone: rep.whatsapp,
      message: buildMessage("assign_sales", lead, rep),
    }));

    setSendProgress(`0 / ${items.length}`);
    openWhatsAppQueue(items, 2000, (done, total) => {
      setSendProgress(`${done} / ${total}`);
      if (done === total) setTimeout(() => setSendProgress(null), 2000);
    });
  }

  function bulkSendToClients() {
    const withPhone = selectedLeads.filter((l) => l.clientPhone);
    if (withPhone.length === 0) {
      alert("لا يوجد أرقام للعملاء المحددين");
      return;
    }

    const items = withPhone.map((lead) => ({
      phone: lead.clientPhone!,
      message: buildMessage(template === "assign_sales" ? "client_greeting" : template, lead),
    }));

    setSendProgress(`0 / ${items.length}`);
    openWhatsAppQueue(items, 2000, (done, total) => {
      setSendProgress(`${done} / ${total}`);
      if (done === total) setTimeout(() => setSendProgress(null), 2000);
    });
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="مركز واتساب"
        description="توزيع العملاء وإرسال التفاصيل عبر واتساب"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="غير مُعيَّنين" value={unassigned.length} icon={UserPlus} accent="gold" />
        <AdminStatCard label="المندوبين" value={reps.filter((r) => r.active).length} icon={Users} accent="blue" />
        <AdminStatCard label="محددين" value={selected.size} icon={CheckSquare} accent="purple" />
        <AdminStatCard label="إجمالي العملاء" value={leads.length} icon={MessageCircle} accent="emerald" />
      </div>

      <div className="dam-card-elevated rounded-2xl p-5">
        <h2 className="font-semibold text-[#0a0a0a]">إجراءات</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy || unassigned.length === 0}
            onClick={autoDistribute}
            className="inline-flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 px-4 py-2.5 text-sm font-semibold text-gold disabled:opacity-40"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shuffle className="h-4 w-4" />}
            توزيع تلقائي ({unassigned.length})
          </button>
          <select value={assignRepId} onChange={(e) => setAssignRepId(e.target.value)} className="dam-contact-input w-full min-w-0 text-sm sm:w-auto">
            {reps.filter((r) => r.active).map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <button
            type="button"
            disabled={busy || selected.size === 0}
            onClick={assignSelected}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0a0a0a] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            <UserPlus className="h-4 w-4" />
            تعيين ({selected.size})
          </button>
          <button
            type="button"
            disabled={selected.size === 0}
            onClick={bulkSendToRep}
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
            إرسال للمندوب
          </button>
          <button
            type="button"
            disabled={selected.size === 0}
            onClick={bulkSendToClients}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-700 disabled:opacity-40"
          >
            <Phone className="h-4 w-4" />
            إرسال للعملاء
          </button>
        </div>
        {sendProgress ? <p className="mt-3 text-xs text-gold">جاري فتح المحادثات: {sendProgress}</p> : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {reps.filter((r) => r.active).map((rep) => (
          <div key={rep.id} className="dam-card-elevated rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{rep.name}</h3>
                <p className="text-xs text-black/45">{rep.role}</p>
              </div>
              <span className="rounded-full bg-gold/15 px-3 py-1 text-sm font-bold text-gold">
                {byRep[rep.id]?.length ?? 0}
              </span>
            </div>
            <div className="mt-3 max-h-40 space-y-2 overflow-y-auto">
              {(byRep[rep.id] ?? []).slice(0, 5).map((l) => (
                <div key={l.id} className="flex items-center justify-between rounded-lg bg-ivory/60 px-3 py-2 text-xs">
                  <span className="truncate">{l.clientName || "عميل"}</span>
                  <button type="button" onClick={() => sendToRep(l, rep)} className="shrink-0 text-gold hover:underline">إرسال</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="dam-card-elevated overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-black/6 px-5 py-4">
          <h2 className="font-semibold">في انتظار التوزيع</h2>
          <button type="button" onClick={() => toggleAll(unassigned)} className="flex items-center gap-1 text-xs text-black/45 hover:text-gold">
            {unassigned.every((l) => selected.has(l.id)) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
            تحديد الكل
          </button>
        </div>

        {loading ? (
          <p className="py-12 text-center text-black/40">جاري التحميل…</p>
        ) : unassigned.length === 0 ? (
          <p className="py-12 text-center text-black/40">كل العملاء مُعيَّنين ✓</p>
        ) : (
          <div className="divide-y divide-black/5">
            {unassigned.map((lead) => (
              <div key={lead.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <button type="button" onClick={() => toggle(lead.id)} className="text-black/30 hover:text-gold">
                  {selected.has(lead.id) ? (
                    <CheckSquare className="h-5 w-5 text-gold" />
                  ) : (
                    <Square className="h-5 w-5" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{lead.clientName || "عميل بدون اسم"}</p>
                  {lead.propertyTitle ? (
                    <p className="flex items-center gap-1 text-xs text-gold">
                      <Building2 className="h-3 w-3" />
                      {lead.propertyTitle}
                    </p>
                  ) : null}
                  <span
                    className={cn(
                      "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px]",
                      leadStatusColors[lead.status],
                    )}
                  >
                    {leadStatusLabels[lead.status]}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {reps
                    .filter((r) => r.active)
                    .map((rep) => (
                      <button
                        key={rep.id}
                        type="button"
                        onClick={() => assignOne(lead.id, rep.id)}
                        className="rounded-lg border border-black/8 px-2 py-1 text-[10px] hover:border-gold/40 hover:text-gold"
                        title={`تعيين لـ ${rep.name}`}
                      >
                        {rep.name.split(" ")[0]}
                      </button>
                    ))}
                  {lead.clientPhone ? (
                    <button
                      type="button"
                      onClick={() => sendToClient(lead, "client_greeting")}
                      className="rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-700"
                    >
                      واتساب عميل
                    </button>
                  ) : null}
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="rounded-lg border border-black/8 px-2 py-1 text-[10px] text-black/45"
                  >
                    تفاصيل
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
