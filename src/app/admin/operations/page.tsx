"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Settings,
  Shuffle,
  Send,
  Users,
  Bell,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
  Zap,
  MessageSquare,
  Link2,
  AlertTriangle,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { fetchLeads } from "@/lib/leads/client";
import { notifyStatusColors, notifyStatusLabels } from "@/lib/leads/labels";
import type { Lead, NotifyStatus } from "@/types/leads";
import type { DistributionStrategy } from "@/lib/settings/store";
import { cn } from "@/lib/utils";

type SystemSettings = {
  autoAssign: boolean;
  autoNotifyTelegram: boolean;
  distributionStrategy: DistributionStrategy;
};

type OpsData = {
  unassigned: number;
  notifications: Record<string, number>;
  repStats: {
    salesRepId: string;
    count: number;
    repName: string;
    telegramLinked: boolean;
    telegramName?: string;
    active: boolean;
  }[];
  unlinkedReps: { id: string; name: string }[];
  settings: SystemSettings;
  strategyLabel: string;
  telegram: {
    botConfigured: boolean;
    groupConfigured: boolean;
    memberCount: number;
    botUsername?: string | null;
    statusMessage?: string;
  };
};

type TgMember = {
  telegramUserId: string;
  displayName: string;
  username: string | null;
  isAdmin: boolean;
  linkedRepId?: string;
  linkedRepName?: string;
};

const strategies: { value: DistributionStrategy; label: string; desc: string }[] = [
  { value: "round_robin", label: "بالتناوب", desc: "يوزّع بالتساوي على المندوبين النشطين" },
  { value: "property_agent", label: "مندوب العقار", desc: "يربط العميل بمندوب العقار ثم بالتناوب" },
  { value: "random", label: "عشوائي", desc: "اختيار عشوائي لكل عميل جديد" },
];

export default function AdminOperationsPage() {
  const [ops, setOps] = useState<OpsData | null>(null);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [members, setMembers] = useState<TgMember[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const load = useCallback(async () => {
    try {
      const [opsRes, tgRes, leads] = await Promise.all([
        fetch("/api/admin/operations", { credentials: "include" }).then((r) =>
          r.ok ? r.json() : null,
        ),
        fetch("/api/admin/telegram", { credentials: "include" }).then((r) =>
          r.ok ? r.json() : null,
        ),
        fetchLeads().catch(() => [] as Lead[]),
      ]);
      if (opsRes) {
        setOps(opsRes);
        setSettings(opsRes.settings);
      } else if (tgRes) {
        setOps((prev) => ({
          unassigned: prev?.unassigned ?? 0,
          notifications: prev?.notifications ?? {},
          repStats: prev?.repStats ?? [],
          unlinkedReps: prev?.unlinkedReps ?? [],
          settings: prev?.settings ?? {
            autoAssign: true,
            autoNotifyTelegram: true,
            distributionStrategy: "round_robin",
          },
          strategyLabel: prev?.strategyLabel ?? "",
          telegram: {
            botConfigured: Boolean(tgRes.botConfigured),
            groupConfigured: Boolean(tgRes.groupChatId),
            memberCount: tgRes.members?.length ?? 0,
            botUsername: tgRes.botUsername,
            statusMessage: tgRes.statusMessage,
          },
        }));
      }
      if (tgRes?.members) setMembers(tgRes.members);
      setRecentLeads(leads.slice(0, 12));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = autoRefresh ? setInterval(load, 30000) : undefined;
    return () => clearInterval(interval);
  }, [load, autoRefresh]);

  async function saveSettings(patch: Partial<SystemSettings>) {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setMsg({ text: "✓ تم حفظ الإعدادات بنجاح", type: "success" });
        await load();
        setTimeout(() => setMsg(null), 3000);
      } else {
        setMsg({ text: "✗ فشل حفظ الإعدادات", type: "error" });
      }
    } catch (err) {
      setMsg({ text: "✗ خطأ في الاتصال", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function autoDistribute() {
    setBusy("distribute");
    setMsg(null);
    try {
      const res = await fetch("/api/admin/leads/distribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mode: "auto" }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: `✓ تم توزيع ${data.count} عميل`, type: "success" });
        await load();
      } else {
        setMsg({ text: data.error ?? "✗ فشل التوزيع", type: "error" });
      }
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ text: "✗ خطأ في الاتصال", type: "error" });
    } finally {
      setBusy(null);
    }
  }

  async function syncTelegram() {
    setBusy("sync");
    setMsg(null);
    try {
      const res = await fetch("/api/admin/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "sync" }),
      });
      const data = await res.json();
      if (res.ok) {
        setMembers(data.members ?? []);
        setMsg({ text: `✓ تم مزامنة ${data.memberCount} عضو`, type: "success" });
        await load();
      } else {
        setMsg({ text: data.error ?? "✗ فشل المزامنة", type: "error" });
      }
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ text: "✗ البوت غير متصل", type: "error" });
    } finally {
      setBusy(null);
    }
  }

  async function testTelegram(repId: string) {
    setBusy(`test-${repId}`);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/telegram/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ repId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: `✓ تم الإرسال لـ ${data.sentTo}`, type: "success" });
      } else {
        setMsg({ text: data.error ?? "✗ فشل الإرسال", type: "error" });
      }
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ text: "✗ خطأ في الاتصال", type: "error" });
    } finally {
      setBusy(null);
    }
  }

  async function resendNotify(leadId: string) {
    setBusy(`notify-${leadId}`);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/notify`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: "✓ تم إعادة الإرسال", type: "success" });
        await load();
      } else {
        setMsg({ text: data.error ?? "✗ فشل الإرسال", type: "error" });
      }
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ text: "✗ خطأ في الاتصال", type: "error" });
    } finally {
      setBusy(null);
    }
  }

  if (loading && !ops) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-black/40">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        badge="مركز التشغيل"
        title="التوزيع والإشعارات"
        description="تحكم كامل في التوزيع التلقائي، تليجرام، ومتابعة الإشعارات"
      />

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white border border-black/6">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            <span className="text-sm font-medium text-black/70">تحديث تلقائي (كل 30 ثانية)</span>
          </label>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-gold/30 hover:border-gold/60 hover:bg-gold/5 transition disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            تحديث الآن
          </button>
        </div>
      </div>

      {msg ? (
        <div className={cn(
          "rounded-xl border px-4 py-3 text-sm font-medium transition-all",
          msg.type === "success" 
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-red-200 bg-red-50 text-red-800"
        )}>
          {msg.text}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="بدون مندوب"
          value={ops?.unassigned ?? 0}
          icon={AlertTriangle}
          accent="gold"
        />
        <AdminStatCard
          label="إشعارات ناجحة"
          value={ops?.notifications?.sent ?? 0}
          icon={CheckCircle2}
          accent="emerald"
        />
        <AdminStatCard
          label="إشعارات فاشلة"
          value={ops?.notifications?.failed ?? 0}
          icon={XCircle}
          accent="blue"
        />
        <AdminStatCard
          label="أعضاء تليجرام"
          value={ops?.telegram?.memberCount ?? 0}
          icon={Users}
          accent="purple"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* إعدادات النظام */}
        <div className="dam-card-elevated rounded-2xl p-6">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gold" />
            <h2 className="font-semibold text-[#0a0a0a]">إعدادات التوزيع التلقائي</h2>
          </div>
          <p className="mt-1 text-xs text-black/45">
            كل عميل جديد من الموقع يُعيَّن ويُرسل له تليجرام تلقائياً حسب هذه الإعدادات
          </p>

          <div className="mt-5 space-y-4">
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-black/6 px-4 py-3">
              <div>
                <p className="text-sm font-medium">توزيع تلقائي عند التسجيل</p>
                <p className="text-[11px] text-black/40">تعيين مندوب فوراً لكل عميل جديد</p>
              </div>
              <input
                type="checkbox"
                checked={settings?.autoAssign ?? true}
                disabled={saving}
                onChange={(e) => saveSettings({ autoAssign: e.target.checked })}
                className="h-5 w-5 accent-gold"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-black/6 px-4 py-3">
              <div>
                <p className="text-sm font-medium">إشعار تليجرام تلقائي</p>
                <p className="text-[11px] text-black/40">رسالة خاصة للمندوب بكل التفاصيل</p>
              </div>
              <input
                type="checkbox"
                checked={settings?.autoNotifyTelegram ?? true}
                disabled={saving}
                onChange={(e) => saveSettings({ autoNotifyTelegram: e.target.checked })}
                className="h-5 w-5 accent-gold"
              />
            </label>

            <div>
              <p className="mb-2 text-sm font-medium">استراتيجية التوزيع</p>
              <div className="space-y-2">
                {strategies.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    disabled={saving}
                    onClick={() => saveSettings({ distributionStrategy: s.value })}
                    className={cn(
                      "w-full rounded-xl border px-4 py-3 text-start transition",
                      settings?.distributionStrategy === s.value
                        ? "border-gold/40 bg-gold/10"
                        : "border-black/6 hover:border-gold/20",
                    )}
                  >
                    <p className="text-sm font-medium">{s.label}</p>
                    <p className="text-[11px] text-black/40">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy === "distribute" || (ops?.unassigned ?? 0) === 0}
              onClick={autoDistribute}
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40"
            >
              {busy === "distribute" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Shuffle className="h-4 w-4" />
              )}
              توزيع {ops?.unassigned ?? 0} عميل معلّق
            </button>
          </div>
        </div>

        {/* تليجرام */}
        <div className="dam-card-elevated rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Zap className="h-5 w-5 text-gold" />
                <div className={cn(
                  "absolute -top-1 -right-1 h-3 w-3 rounded-full animate-pulse",
                  ops?.telegram?.botConfigured ? "bg-emerald-500" : "bg-red-500"
                )} />
              </div>
              <div>
                <h2 className="font-semibold text-[#0a0a0a]">Telegram Bot</h2>
                <p className="text-[11px] text-black/50">
                  {ops?.telegram?.botConfigured
                    ? ops.telegram.botUsername
                      ? `@${ops.telegram.botUsername} — متصل`
                      : "متصل وفعّال"
                    : ops?.telegram?.statusMessage ?? "غير متصل"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={syncTelegram}
                disabled={busy === "sync"}
                className="inline-flex items-center gap-2 rounded-lg bg-gold/10 hover:bg-gold/20 border border-gold/30 px-4 py-2 text-sm font-medium transition disabled:opacity-50"
              >
                {busy === "sync" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                مزامنة الآن
              </button>
              <Link
                href="/admin/telegram-import"
                className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-4 py-2 text-sm text-black/60 transition hover:border-gold/30 hover:text-black"
              >
                استيراد الرسائل والعقارات
              </Link>
            </div>
          </div>

          {/* الحالة */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className={cn(
              "rounded-xl p-3 transition",
              ops?.telegram?.botConfigured 
                ? "bg-emerald-50 border border-emerald-200" 
                : "bg-red-50 border border-red-200"
            )}>
              <p className="text-[10px] text-black/40 mb-1">البوت</p>
              <p className="font-bold text-sm">
                {ops?.telegram?.botConfigured ? "✓ مفعّل" : "✗ معطّل"}
              </p>
            </div>
            <div className={cn(
              "rounded-xl p-3 transition",
              ops?.telegram?.groupConfigured 
                ? "bg-emerald-50 border border-emerald-200" 
                : "bg-amber-50 border border-amber-200"
            )}>
              <p className="text-[10px] text-black/40 mb-1">الجروب</p>
              <p className="font-bold text-sm">
                {ops?.telegram?.groupConfigured ? "✓ مضبوط" : "⚠ غير مضبوط"}
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
              <p className="text-[10px] text-black/40 mb-1">الأعضاء</p>
              <p className="font-bold text-sm">{ops?.telegram?.memberCount ?? 0}</p>
            </div>
          </div>

          {/* تحذير الـ unlinked reps */}
          {(ops?.unlinkedReps?.length ?? 0) > 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 mb-4 text-xs text-amber-800">
              <p className="font-bold mb-2">⚠ مندوبين غير مربوطين بـ Telegram:</p>
              <div className="flex flex-wrap gap-2">
                {ops?.unlinkedReps.map((r) => (
                  <code key={r.id} className="bg-white/60 rounded px-2 py-1 text-[10px] font-mono">
                    {r.name} (ID: {r.id})
                  </code>
                ))}
              </div>
            </div>
          ) : null}

          {/* قائمة الأعضاء */}
          <div>
            <p className="text-sm font-medium mb-3 text-black/70">أعضاء الـ Bot</p>
            {members.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-black/10 py-8 flex flex-col items-center justify-center text-center">
                <Users className="h-8 w-8 text-black/20 mb-2" />
                <p className="text-sm text-black/40">لا يوجد أعضاء متصلين</p>
                <p className="text-[11px] text-black/30 mt-1">اضغط "مزامنة الآن" أو اطلب من المندوبين /me</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {members.map((m) => (
                  <div
                    key={m.telegramUserId}
                    className="flex items-center justify-between rounded-lg border border-black/6 hover:border-gold/20 bg-white/40 px-4 py-3 transition group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{m.displayName}</span>
                        {m.isAdmin && <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded-full whitespace-nowrap font-bold">أدمن</span>}
                      </div>
                      <div className="text-[10px] text-black/50 mt-1">
                        {m.linkedRepName ? (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle2 className="h-3 w-3" />
                            متصل بـ {m.linkedRepName}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-600">
                            <AlertTriangle className="h-3 w-3" />
                            غير مربوط
                          </span>
                        )}
                      </div>
                    </div>
                    {m.linkedRepId && (
                      <button
                        type="button"
                        disabled={busy === `test-${m.linkedRepId}`}
                        onClick={() => testTelegram(m.linkedRepId!)}
                        className="ml-3 text-[11px] font-medium text-gold hover:text-gold-bright px-3 py-1.5 rounded-lg bg-gold/10 hover:bg-gold/20 transition disabled:opacity-40 whitespace-nowrap"
                      >
                        {busy === `test-${m.linkedRepId}` ? (
                          <Loader2 className="h-3 w-3 animate-spin inline" />
                        ) : (
                          "تجربة"
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* حمل المندوبين */}
      <div className="dam-card-elevated rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-5 w-5 text-gold" />
          <div>
            <h2 className="font-semibold text-[#0a0a0a]">حمل العملاء على المندوبين</h2>
            <p className="text-[11px] text-black/50">عدد العملاء المعيّنين لكل مندوب</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(ops?.repStats ?? []).length === 0 ? (
            <div className="col-span-full rounded-xl border-2 border-dashed border-black/10 py-8 flex items-center justify-center">
              <p className="text-sm text-black/40">لا يوجد مندوبين مسجّلين</p>
            </div>
          ) : (
            ops?.repStats.map((r) => (
              <div 
                key={r.salesRepId} 
                className={cn(
                  "rounded-xl border-2 p-4 transition",
                  r.telegramLinked 
                    ? "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300 hover:bg-emerald-50" 
                    : "border-red-200 bg-red-50/30 hover:border-red-300"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-black/90 truncate">{r.repName}</p>
                    {r.telegramName ? (
                      <p className="text-[10px] text-black/40 mt-1">@{r.telegramName}</p>
                    ) : null}
                  </div>
                  {r.telegramLinked ? (
                    <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-medium whitespace-nowrap ms-2">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      متصل
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600 text-[10px] font-medium whitespace-nowrap ms-2">
                      <XCircle className="h-3.5 w-3.5" />
                      معطّل
                    </div>
                  )}
                </div>
                <p className="text-3xl font-bold text-gold mb-1">{r.count}</p>
                <p className="text-[10px] text-black/50 mb-3">عميل معيّن</p>
                {r.telegramLinked ? (
                  <button
                    type="button"
                    disabled={busy === `test-${r.salesRepId}`}
                    onClick={() => testTelegram(r.salesRepId)}
                    className="w-full text-[11px] font-medium text-white bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                  >
                    {busy === `test-${r.salesRepId}` ? (
                      <span className="flex items-center justify-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        جاري الإرسال
                      </span>
                    ) : (
                      "إرسال رسالة تجريبية"
                    )}
                  </button>
                ) : (
                  <div className="text-[10px] text-red-600 bg-red-100 rounded-lg px-2 py-1.5 text-center font-medium">
                    غير متصل بـ Telegram
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* آخر العملاء + الإشعارات */}
      <div className="dam-card-elevated overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-black/6 px-6 py-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gold" />
            <h2 className="font-semibold text-[#0a0a0a]">آخر العملاء والإشعارات</h2>
          </div>
          <Link href="/admin/leads" className="text-xs text-gold hover:underline">
            كل العملاء
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-black/6 bg-ivory/40 text-[11px] text-black/40">
                <th className="px-6 py-3 text-start">العميل</th>
                <th className="px-6 py-3 text-start">العقار</th>
                <th className="px-6 py-3 text-start">الإشعار</th>
                <th className="px-6 py-3 text-start">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-black/35">
                    لا يوجد عملاء
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-black/4 hover:bg-gold/[0.02]">
                    <td className="px-6 py-3">
                      <Link href={`/admin/leads/${lead.id}`} className="font-medium hover:text-gold">
                        {lead.clientName || "—"}
                      </Link>
                    </td>
                    <td className="max-w-[160px] truncate px-6 py-3 text-black/55">
                      {lead.propertyTitle ?? "—"}
                    </td>
                    <td className="px-6 py-3">
                      {lead.notifyStatus ? (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-medium",
                            notifyStatusColors[lead.notifyStatus as NotifyStatus],
                          )}
                        >
                          {notifyStatusLabels[lead.notifyStatus as NotifyStatus]}
                        </span>
                      ) : (
                        <span className="text-[10px] text-black/30">—</span>
                      )}
                      {lead.notifyError ? (
                        <p className="mt-0.5 max-w-[140px] truncate text-[9px] text-red-500">
                          {lead.notifyError}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-6 py-3">
                      {lead.assignedSalesId ? (
                        <button
                          type="button"
                          disabled={busy === `notify-${lead.id}`}
                          onClick={() => resendNotify(lead.id)}
                          className="inline-flex items-center gap-1 text-[11px] text-gold hover:underline disabled:opacity-40"
                        >
                          {busy === `notify-${lead.id}` ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Send className="h-3 w-3" />
                          )}
                          إعادة إرسال
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/leads"
          className="dam-card-elevated flex items-center gap-3 rounded-2xl p-5 transition hover:border-gold/30"
        >
          <MessageSquare className="h-5 w-5 text-gold" />
          <span className="text-sm font-medium">إدارة العملاء</span>
        </Link>
        <Link
          href="/admin/sales"
          className="dam-card-elevated flex items-center gap-3 rounded-2xl p-5 transition hover:border-gold/30"
        >
          <Users className="h-5 w-5 text-gold" />
          <span className="text-sm font-medium">فريق المبيعات</span>
        </Link>
      </div>
    </div>
  );
}
