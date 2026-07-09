"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  Phone,
  ExternalLink,
  Building2,
  Calendar,
} from "lucide-react";
import { fetchLead, updateLead } from "@/lib/leads/client";
import {
  leadStatusLabels,
  leadStatusColors,
  leadSourceLabels,
  leadSourceColors,
  notifyStatusLabels,
  notifyStatusColors,
} from "@/lib/leads/labels";
import { buildSalesAssignmentMessage } from "@/lib/leads/messages";
import { parseContactLines, getLeadTags } from "@/lib/leads/crm";
import { LeadCrmTimeline } from "@/components/admin/LeadCrmTimeline";
import {
  openWhatsApp,
  buildMessage,
  templateLabels,
  type WhatsAppTemplate,
} from "@/lib/leads/whatsapp";
import type { SalesRep } from "@/lib/data/sales";
import { company } from "@/lib/data/company";
import type { Lead, LeadStatus } from "@/types/leads";
import { cn } from "@/lib/utils";

const statuses: LeadStatus[] = ["new", "assigned", "contacted", "won", "lost"];

export default function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState("");
  const [salesId, setSalesId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [reps, setReps] = useState<SalesRep[]>([]);
  const [waTemplate, setWaTemplate] = useState<WhatsAppTemplate>("client_greeting");

  useEffect(() => {
    fetch("/api/admin/sales", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then(setReps)
      .catch(() => setReps([]));
  }, []);

  useEffect(() => {
    fetchLead(id)
      .then((l) => {
        setLead(l);
        setNotes(l.notes ?? "");
        setSalesId(l.assignedSalesId ?? "");
      })
      .catch(() => setError("العميل غير موجود"));
  }, [id]);

  async function save(patch: Parameters<typeof updateLead>[1]) {
    if (!lead) return;
    setSaving(true);
    try {
      const updated = await updateLead(lead.id, patch);
      setLead(updated);
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-black/50">{error}</p>
        <Link href="/admin/leads" className="mt-4 inline-block text-gold">
          العودة للقائمة
        </Link>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="space-y-3 py-20">
        <div className="admin-shimmer mx-auto h-8 w-48 rounded-lg" />
        <div className="admin-shimmer mx-auto h-64 max-w-3xl rounded-2xl" />
      </div>
    );
  }

  const rep = lead.assignedSalesId ? reps.find((r) => r.id === lead.assignedSalesId) : null;
  const selectedRep = salesId ? reps.find((r) => r.id === salesId) : null;
  const contactLines = parseContactLines(lead.notes);
  const tags = getLeadTags(lead);
  const initials = (lead.clientName || "؟")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  function sendToSales() {
    const target = selectedRep ?? rep;
    if (!target) return;
    const msg = buildSalesAssignmentMessage(lead!, target);
    openWhatsApp(target.whatsapp, msg);
  }

  function contactClient() {
    if (!lead!.clientPhone) {
      alert("لا يوجد رقم هاتف للعميل");
      return;
    }
    openWhatsApp(lead!.clientPhone, buildMessage(waTemplate, lead!));
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-2 text-sm text-black/45 transition hover:text-gold"
      >
        <ArrowRight className="h-4 w-4" />
        العودة للعملاء
      </Link>

      <div className="dam-card-elevated overflow-hidden rounded-2xl">
        <div className="border-b border-black/6 bg-gradient-to-l from-gold/8 to-transparent px-6 py-6">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/25 to-gold/5 font-serif text-2xl text-gold">
              {initials}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-[#0a0a0a]">
                  {lead.clientName || "عميل جديد"}
                </h1>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    leadStatusColors[lead.status],
                  )}
                >
                  {leadStatusLabels[lead.status]}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-medium",
                    leadSourceColors[lead.source],
                  )}
                >
                  {leadSourceLabels[lead.source]}
                </span>
                {lead.notifyStatus ? (
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-medium",
                      notifyStatusColors[lead.notifyStatus],
                    )}
                  >
                    تليجرام: {notifyStatusLabels[lead.notifyStatus]}
                  </span>
                ) : null}
                <span className="flex items-center gap-1 text-xs text-black/45">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(lead.createdAt).toLocaleString("ar-EG")}
                </span>
              </div>
              {tags.length ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-black/[0.05] px-2 py-0.5 text-[10px] text-black/55"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
          {lead.propertyTitle ? (
            <section className="rounded-xl border border-black/6 bg-ivory/50 p-5 lg:col-span-2">
              <h2 className="admin-section-title flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5" />
                العقار
              </h2>
              <p className="mt-2 text-lg font-semibold text-[#0a0a0a]">{lead.propertyTitle}</p>
              {lead.propertySlug ? (
                <a
                  href={`/properties/${lead.propertySlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-gold hover:underline"
                >
                  عرض على الموقع
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </section>
          ) : null}

          <section className="rounded-xl border border-black/6 p-5">
            <h2 className="admin-section-title">بيانات التواصل</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {lead.clientPhone ? (
                <div>
                  <dt className="text-black/40">الموبايل</dt>
                  <dd className="font-medium" dir="ltr">
                    <a href={`tel:${lead.clientPhone}`} className="hover:text-gold">
                      {lead.clientPhone}
                    </a>
                  </dd>
                </div>
              ) : null}
              {lead.clientEmail ? (
                <div>
                  <dt className="text-black/40">البريد</dt>
                  <dd className="font-medium">
                    <a href={`mailto:${lead.clientEmail}`} className="hover:text-gold">
                      {lead.clientEmail}
                    </a>
                  </dd>
                </div>
              ) : null}
              {lead.propertyType ? (
                <div>
                  <dt className="text-black/40">نوع العقار</dt>
                  <dd>{lead.propertyType}</dd>
                </div>
              ) : null}
              {lead.goal ? (
                <div>
                  <dt className="text-black/40">الهدف</dt>
                  <dd>{lead.goal}</dd>
                </div>
              ) : null}
              {lead.budget ? (
                <div>
                  <dt className="text-black/40">الميزانية</dt>
                  <dd>{lead.budget}</dd>
                </div>
              ) : null}
              {lead.district ? (
                <div>
                  <dt className="text-black/40">المنطقة</dt>
                  <dd>{lead.district}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          {contactLines.length > 0 ? (
            <section className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-5 lg:col-span-2">
              <h2 className="admin-section-title">أرقام من الفورم</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {contactLines.map((line, i) => (
                  <li key={i} className="flex flex-wrap gap-2">
                    <span className="text-black/40">{line.label}:</span>
                    <span className="font-medium" dir="ltr">
                      {line.value}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {lead.message ? (
            <section className="rounded-xl border border-black/6 bg-ivory/30 p-5 lg:col-span-2">
              <h2 className="admin-section-title">تفاصيل الطلب (من الموقع)</h2>
              <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-black/65">
                {lead.message}
              </pre>
            </section>
          ) : null}

          <section className="rounded-xl border border-black/6 p-5 lg:col-span-2">
            <h2 className="admin-section-title">تعيين لمندوب</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <select
                value={salesId}
                onChange={(e) => setSalesId(e.target.value)}
                className="dam-contact-input min-w-0 flex-1 text-sm sm:min-w-[180px]"
              >
                <option value="">اختر مندوباً</option>
                {reps.filter((r) => r.active).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!salesId || saving}
                onClick={() => save({ assignedSalesId: salesId })}
                className="rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
              >
                حفظ
              </button>
            </div>
            {rep ? (
              <p className="mt-3 text-xs text-black/45">
                المُعيَّن: <span className="font-medium text-gold">{rep.name}</span>
              </p>
            ) : null}
          </section>

          <section className="rounded-xl border border-black/6 p-5 lg:col-span-2">
            <h2 className="admin-section-title">الحالة والملاحظات الداخلية</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => save({ status: s })}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-xs transition",
                    lead.status === s
                      ? "border-gold bg-gold/12 text-gold"
                      : "border-black/10 text-black/50 hover:border-gold/30",
                  )}
                >
                  {leadStatusLabels[s]}
                </button>
              ))}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="ملاحظات داخلية…"
              className="dam-contact-input mt-4 w-full resize-none text-sm"
            />
            <button
              type="button"
              disabled={saving}
              onClick={() => save({ notes })}
              className="mt-3 rounded-xl border border-black/10 px-4 py-2 text-sm hover:border-gold/40"
            >
              حفظ الملاحظات
            </button>
          </section>
          </div>

          <div className="space-y-6">
            <LeadCrmTimeline
              status={lead.status}
              createdAt={lead.createdAt}
              assignedAt={lead.assignedAt}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-black/6 bg-ivory/30 px-6 py-5">
          <button
            type="button"
            onClick={sendToSales}
            disabled={!salesId && !rep}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-sm font-bold text-white disabled:opacity-40"
          >
            <MessageCircle className="h-4 w-4" />
            إرسال للمندوب
          </button>
          <div className="flex flex-1 flex-wrap gap-2">
            <select
              value={waTemplate}
              onChange={(e) => setWaTemplate(e.target.value as WhatsAppTemplate)}
              className="dam-contact-input min-w-0 flex-1 text-sm sm:min-w-[140px]"
            >
              {(Object.keys(templateLabels) as WhatsAppTemplate[])
                .filter((k) => k !== "assign_sales")
                .map((k) => (
                  <option key={k} value={k}>
                    {templateLabels[k]}
                  </option>
                ))}
            </select>
            <button
              type="button"
              onClick={contactClient}
              disabled={!lead.clientPhone}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5 text-sm font-semibold text-emerald-700 disabled:opacity-40"
            >
              <Phone className="h-4 w-4" />
              واتساب العميل
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-[11px] text-black/30">
        رقم الشركة: {company.phoneDisplay}
      </p>
    </div>
  );
}
