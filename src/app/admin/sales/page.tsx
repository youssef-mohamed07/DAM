"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone, Plus, Pencil, Trash2, X, Users, UserCheck } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { whatsappLink } from "@/lib/leads/messages";
import type { SalesRep } from "@/lib/data/sales";

const emptyForm = {
  name: "",
  role: "",
  phone: "",
  whatsapp: "",
  telegramChatId: "",
  telegramUserId: "",
  agentId: "",
  active: true,
};

const avatarColors = [
  "from-gold/30 to-gold/10 text-gold",
  "from-blue-500/20 to-blue-500/5 text-blue-600",
  "from-purple-500/20 to-purple-500/5 text-purple-600",
  "from-emerald-500/20 to-emerald-500/5 text-emerald-600",
];

export default function AdminSalesPage() {
  const [reps, setReps] = useState<SalesRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/sales", { credentials: "include" });
    if (res.ok) setReps(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openAdd() {
    setForm(emptyForm);
    setEditId(null);
    setModal("add");
  }

  function openEdit(rep: SalesRep) {
    setForm({
      name: rep.name,
      role: rep.role,
      phone: rep.phone,
      whatsapp: rep.whatsapp,
      telegramChatId: rep.telegramChatId ?? "",
      telegramUserId: rep.telegramUserId ?? "",
      agentId: rep.agentId ?? "",
      active: rep.active,
    });
    setEditId(rep.id);
    setModal("edit");
  }

  async function save() {
    const payload = {
      ...form,
      agentId: form.agentId || undefined,
      telegramChatId: form.telegramChatId || undefined,
      telegramUserId: form.telegramUserId || undefined,
    };
    const url = modal === "edit" && editId ? `/api/admin/sales/${editId}` : "/api/admin/sales";
    const method = modal === "edit" ? "PATCH" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    setModal(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("حذف هذا المندوب؟")) return;
    await fetch(`/api/admin/sales/${id}`, { method: "DELETE", credentials: "include" });
    load();
  }

  const activeCount = reps.filter((r) => r.active).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <AdminPageHeader
          title="فريق المبيعات"
          description="إدارة المندوبين — واتساب وتليجرام"
        />
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-black shadow-[0_4px_20px_rgba(201,162,39,0.3)] transition hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          إضافة مندوب
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminStatCard label="إجمالي المندوبين" value={reps.length} icon={Users} accent="gold" />
        <AdminStatCard label="نشطون" value={activeCount} icon={UserCheck} accent="emerald" />
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="admin-shimmer h-52 rounded-2xl" />
          ))}
        </div>
      ) : reps.length === 0 ? (
        <AdminEmptyState
          icon={Users}
          title="لا يوجد مندوبين"
          description="أضف أول مندوب مبيعات لبدء تعيين العملاء تلقائياً"
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {reps.map((rep, i) => (
            <div key={rep.id} className="admin-sales-card relative overflow-hidden rounded-2xl p-6">
              <div className="absolute -end-6 -top-6 h-24 w-24 rounded-full bg-gold/5" />
              <div className="relative flex items-start justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br font-serif text-xl ${avatarColors[i % avatarColors.length]}`}
                >
                  {rep.name.charAt(0)}
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(rep)}
                    className="rounded-lg border border-black/8 bg-white p-2 hover:border-gold/40"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(rep.id)}
                    className="rounded-lg border border-black/8 bg-white p-2 hover:border-red-200 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <h2 className="relative mt-4 text-lg font-semibold text-[#0a0a0a]">{rep.name}</h2>
              <p className="relative text-sm text-black/50">{rep.role}</p>
              <p className="relative mt-2 text-xs text-black/40" dir="ltr">
                WhatsApp: {rep.whatsapp}
                {rep.telegramUserId ? ` · @${rep.telegramUserId}` : ""}
              </p>
              <span
                className={`relative mt-3 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                  rep.active ? "bg-emerald-500/10 text-emerald-700" : "bg-black/8 text-black/40"
                }`}
              >
                {rep.active ? "● نشط" : "غير نشط"}
              </span>
              <div className="relative mt-5 flex gap-2">
                <a
                  href={whatsappLink(rep.whatsapp, `مرحباً ${rep.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold py-3 text-sm font-bold text-black shadow-sm transition hover:brightness-110"
                >
                  <MessageCircle className="h-4 w-4" />
                  واتساب
                </a>
                <a
                  href={`tel:${rep.phone}`}
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-3 transition hover:border-gold/40"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {modal === "add" ? "إضافة مندوب" : "تعديل مندوب"}
              </h3>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-lg p-1 hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              {(["name", "role", "phone", "whatsapp"] as const).map((key) => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-medium text-black/45">
                    {key === "name"
                      ? "الاسم"
                      : key === "role"
                        ? "التخصص"
                        : key === "phone"
                          ? "الهاتف"
                          : "واتساب"}
                  </label>
                  <input
                    className="dam-contact-input w-full text-sm"
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    dir={key === "whatsapp" || key === "phone" ? "ltr" : undefined}
                  />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-xs font-medium text-black/45">
                  Telegram User ID (للمنشن)
                </label>
                <input
                  className="dam-contact-input w-full text-sm"
                  value={form.telegramUserId}
                  onChange={(e) => setForm({ ...form, telegramUserId: e.target.value })}
                  placeholder="5481253954"
                  dir="ltr"
                />
                <p className="mt-1 text-[10px] text-black/35">
                  المندوب يبعت <code>/me</code> للبوت في الجروب، أو <code>/link s1</code> للربط التلقائي
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-black/45">
                  Telegram Chat ID (اختياري)
                </label>
                <input
                  className="dam-contact-input w-full text-sm"
                  value={form.telegramChatId}
                  onChange={(e) => setForm({ ...form, telegramChatId: e.target.value })}
                  placeholder="-1001234567890"
                  dir="ltr"
                />
                <p className="mt-1 text-[10px] text-black/35">
                  لو فاضي، الرسائل تروح لـ TELEGRAM_SALES_CHAT_ID في الإعدادات
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-black/45">Agent ID</label>
                <input
                  className="dam-contact-input w-full text-sm"
                  value={form.agentId}
                  onChange={(e) => setForm({ ...form, agentId: e.target.value })}
                  placeholder="a1"
                  dir="ltr"
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="accent-gold"
                />
                نشط
              </label>
            </div>
            <button
              type="button"
              onClick={save}
              className="mt-6 w-full rounded-xl bg-gold py-3 text-sm font-bold text-black"
            >
              حفظ
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
