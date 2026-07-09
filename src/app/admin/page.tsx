"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  MessageSquare,
  Users,
  TrendingUp,
  ArrowLeft,
  Phone,
  CheckCircle2,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fetchLeadStats } from "@/lib/leads/client";
import { leadStatusLabels, leadStatusColors, leadSourceLabels } from "@/lib/leads/labels";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import type { Lead, LeadStatus } from "@/types/leads";

const CHART_COLORS = ["#3b82f6", "#000000", "#8b5cf6", "#10b981", "#6b7280"];

export default function AdminPage() {
  const [stats, setStats] = useState<{
    total: number;
    todayCount?: number;
    byStatus: Record<string, number>;
    bySource?: Record<string, number>;
    recent: Lead[];
  } | null>(null);
  const [propertyCount, setPropertyCount] = useState<number | null>(null);
  const [publishedCount, setPublishedCount] = useState(0);

  useEffect(() => {
    fetchLeadStats().then(setStats).catch(() => setStats(null));
    fetch("/api/admin/properties", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (Array.isArray(list)) {
          setPropertyCount(list.length);
          setPublishedCount(list.filter((p: { published?: boolean }) => p.published !== false).length);
        }
      })
      .catch(() => setPropertyCount(null));
  }, []);

  const sourceChart = useMemo(() => {
    if (!stats?.bySource) return [];
    return [
      { name: "فورم الهيرو", value: stats.bySource.hero ?? 0 },
      { name: "صفحة عقار", value: stats.bySource.property ?? 0 },
      { name: "تواصل", value: stats.bySource.contact ?? 0 },
      { name: "يدوي", value: stats.bySource.manual ?? 0 },
    ].filter((d) => d.value > 0);
  }, [stats]);

  const statusChart = useMemo(() => {
    if (!stats) return [];
    return (Object.keys(leadStatusLabels) as LeadStatus[]).map((key) => ({
      name: leadStatusLabels[key],
      value: stats.byStatus[key] ?? 0,
      key,
    }));
  }, [stats]);

  const conversionRate = stats
    ? Math.round(((stats.byStatus.won ?? 0) / Math.max(stats.total, 1)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="نظرة عامة"
        description="متابعة العملاء والمبيعات والعقارات"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminStatCard label="إجمالي العملاء" value={stats?.total ?? "—"} icon={MessageSquare} accent="blue" />
        <AdminStatCard label="اليوم" value={stats?.todayCount ?? 0} icon={TrendingUp} accent="gold" trend="جديد" />
        <AdminStatCard label="فورم الهيرو" value={stats?.bySource?.hero ?? 0} icon={Sparkles} accent="purple" />
        <AdminStatCard label="مُعيَّن للسيلز" value={stats?.byStatus?.assigned ?? 0} icon={Users} accent="purple" />
        <AdminStatCard label="نسبة الإغلاق" value={`${conversionRate}%`} icon={CheckCircle2} accent="emerald" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <AdminStatCard label="العقارات" value={propertyCount ?? "—"} icon={Building2} accent="gold" />
        <AdminStatCard label="منشورة" value={publishedCount} icon={Sparkles} accent="emerald" />
        <AdminStatCard label="صفقات مكتملة" value={stats?.byStatus?.won ?? 0} icon={CheckCircle2} accent="blue" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="dam-card-elevated min-w-0 rounded-2xl p-4 sm:p-6 xl:col-span-2">
          <h2 className="font-semibold text-[#0a0a0a]">توزيع العملاء حسب الحالة</h2>
          <div className="mt-6 h-64">
            {stats && stats.total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00000008" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #00000010", fontSize: 12 }} />
                  <Bar dataKey="value" fill="#000000" radius={[8, 8, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-black/30">
                {stats ? "لا توجد بيانات" : "جاري التحميل…"}
              </div>
            )}
          </div>
        </div>

        <div className="dam-card-elevated min-w-0 rounded-2xl p-4 sm:p-6">
          <h2 className="font-semibold text-[#0a0a0a]">مصادر العملاء</h2>
          <div className="mt-4 h-52">
            {sourceChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceChart}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={68}
                    paddingAngle={3}
                  >
                    {sourceChart.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-black/30">
                لا توجد بيانات مصادر بعد
              </div>
            )}
          </div>
          <Link href="/admin/leads" className="mt-2 inline-block text-xs font-medium text-gold hover:underline">
            فتح CRM العملاء
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="dam-card-elevated overflow-hidden rounded-2xl lg:col-span-2">
          <div className="flex items-center justify-between border-b border-black/6 px-6 py-4">
            <h2 className="font-semibold text-[#0a0a0a]">أحدث العملاء</h2>
            <Link href="/admin/leads" className="text-xs font-medium text-gold hover:underline">عرض الكل</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-black/6 bg-ivory/40 text-[11px] text-black/40">
                  <th className="px-6 py-3 text-start font-medium">العميل</th>
                  <th className="px-6 py-3 text-start font-medium">العقار</th>
                  <th className="px-6 py-3 text-start font-medium">المصدر</th>
                  <th className="px-6 py-3 text-start font-medium">الهاتف</th>
                  <th className="px-6 py-3 text-start font-medium">الحالة</th>
                  <th className="px-6 py-3 text-start font-medium">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.recent ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-black/35">لا يوجد عملاء</td>
                  </tr>
                ) : (
                  stats?.recent.map((lead) => (
                    <tr key={lead.id} className="border-b border-black/4 hover:bg-gold/[0.03]">
                      <td className="px-6 py-3.5">
                        <Link href={`/admin/leads/${lead.id}`} className="font-medium hover:text-gold">
                          {lead.clientName || "—"}
                        </Link>
                      </td>
                      <td className="max-w-[180px] truncate px-6 py-3.5 text-black/60">{lead.propertyTitle ?? lead.district ?? "—"}</td>
                      <td className="px-6 py-3.5 text-xs text-black/50">{leadSourceLabels[lead.source]}</td>
                      <td className="px-6 py-3.5 text-xs text-black/55" dir="ltr">{lead.clientPhone ?? "—"}</td>
                      <td className="px-6 py-3.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${leadStatusColors[lead.status]}`}>
                          {leadStatusLabels[lead.status]}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-[11px] text-black/40">
                        {new Date(lead.createdAt).toLocaleDateString("ar-EG")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="dam-card-elevated rounded-2xl p-6">
            <h2 className="font-semibold text-[#0a0a0a]">إجراءات سريعة</h2>
            <div className="mt-4 space-y-2">
              {[
                { href: "/admin/operations", label: "التوزيع والإشعارات", icon: MessageCircle },
                { href: "/admin/properties/new", label: "إضافة عقار", icon: Building2 },
                { href: "/admin/leads", label: "العملاء", icon: MessageSquare },
                { href: "/admin/sales", label: "فريق المبيعات", icon: Users },
                { href: "/admin/properties", label: `العقارات (${propertyCount ?? "…"})`, icon: Building2 },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl border border-black/6 px-4 py-3 transition hover:border-gold/30 hover:bg-gold/5"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <item.icon className="h-4 w-4 text-gold" />
                    {item.label}
                  </span>
                  <ArrowLeft className="h-4 w-4 text-black/25" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent p-6">
            <div className="flex items-center gap-2 text-gold">
              <Phone className="h-4 w-4" />
              <span className="text-xs font-bold uppercase">تلميح</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-black/55">
              العملاء يُسجَّلون ويُوزَّعون تلقائياً على المندوبين مع إشعار تليجرام خاص. تحكم كامل من مركز التشغيل.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
