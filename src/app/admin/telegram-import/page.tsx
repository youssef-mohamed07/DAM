"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  RefreshCw,
  Search,
  MessageSquare,
  Building2,
  Hash,
  Loader2,
  Upload,
  Globe,
  MapPin,
  CheckCircle2,
  FileJson,
  Link2,
  Sparkles,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { districtLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Stats = {
  messages: number;
  listings: number;
  withCode: number;
  published: number;
  chats: {
    chatId: string;
    chatTitle: string | null;
    count: number;
    district: string | null;
  }[];
  byDistrict: { district: string | null; count: number }[];
};

type ListingRow = {
  id: string;
  listingCode: string | null;
  saleCategory: string;
  propertyType: string | null;
  district: string | null;
  compound: string | null;
  price: number | null;
  area: number | null;
  bedrooms: number | null;
  propertyId: string | null;
  status: string;
  rawText: string;
  message: {
    chatId: string;
    messageId: number;
    chatTitle: string | null;
    messageDate: string;
    hasMedia: boolean;
  };
};

type Toast = { type: "success" | "error"; text: string };

function formatPrice(n: number | null) {
  if (!n) return "—";
  return new Intl.NumberFormat("ar-EG").format(n) + " ج.م";
}

export default function TelegramImportPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [q, setQ] = useState("");
  const [chatId, setChatId] = useState<string | "all">("all");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [linkUrl, setLinkUrl] = useState("https://t.me/c/2855840897/11");
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (t: Toast) => {
    setToast(t);
    setTimeout(() => setToast(null), 5000);
  };

  const load = useCallback(async (query?: string, filterChat?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (filterChat && filterChat !== "all") params.set("chatId", filterChat);
      params.set("limit", "100");
      const res = await fetch(`/api/admin/telegram/import?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("تعذّر تحميل البيانات");
      const data = await res.json();
      setStats(data.stats);
      setListings(data.listings);
    } catch (e) {
      showToast({ type: "error", text: e instanceof Error ? e.message : "خطأ" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(q, chatId);
  }, [load, q, chatId]);

  async function runAction(action: "pull" | "parse" | "publish") {
    setWorking(action);
    try {
      const res = await fetch("/api/admin/telegram/import", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          chatId: chatId !== "all" ? chatId : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "فشل");

      if (action === "pull") {
        showToast({
          type: "success",
          text: `تم سحب ${data.pulled ?? 0} رسالة · ${data.parsed?.parsed ?? 0} عقار`,
        });
      } else if (action === "parse") {
        showToast({
          type: "success",
          text: `تم تحليل ${data.parsed?.parsed ?? 0} عقار`,
        });
      } else {
        showToast({
          type: "success",
          text: `نُشر ${data.published ?? 0} عقار على الموقع (resale)`,
        });
      }
      await load(q, chatId);
    } catch (e) {
      showToast({ type: "error", text: e instanceof Error ? e.message : "خطأ" });
    } finally {
      setWorking(null);
    }
  }

  async function fetchFromLink(mode: "from" | "all") {
    if (!linkUrl.trim()) {
      showToast({ type: "error", text: "الصق رابط الرسالة أو الجروب" });
      return;
    }

    setWorking(mode === "all" ? "fetch-all" : "fetch");
    try {
      const res = await fetch("/api/admin/telegram/import/fetch", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: linkUrl.trim(), mode }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "GRAM_NOT_CONFIGURED") {
          throw new Error(
            "محتاج إعداد MTProto — شغّل npm run telegram:auth بعد إضافة API_ID و API_HASH",
          );
        }
        throw new Error(data.error ?? "فشل السحب");
      }
      showToast({
        type: "success",
        text: `تم سحب ${data.saved} رسالة من ${data.chatTitle ?? "الجروب"} · ${data.listings} عقار`,
      });
      await load(q, chatId);
    } catch (e) {
      showToast({ type: "error", text: e instanceof Error ? e.message : "خطأ" });
    } finally {
      setWorking(null);
    }
  }

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.name.endsWith(".json"));
    if (!list.length) {
      showToast({ type: "error", text: "ارفع ملف result.json من تصدير Telegram" });
      return;
    }

    setWorking("upload");
    try {
      const form = new FormData();
      for (const f of list) form.append("files", f);

      const res = await fetch("/api/admin/telegram/import/upload", {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "فشل الرفع");

      const total = (data.imported as { saved: number }[]).reduce((s, r) => s + r.saved, 0);
      showToast({
        type: "success",
        text: `تم استيراد ${total} رسالة من ${list.length} جروب`,
      });
      await load(q, chatId);
    } catch (e) {
      showToast({ type: "error", text: e instanceof Error ? e.message : "خطأ" });
    } finally {
      setWorking(null);
    }
  }

  const pendingPublish = useMemo(
    () => (stats?.listings ?? 0) - (stats?.published ?? 0),
    [stats],
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="استيراد تليجرام"
        description="اسحب رسائل الجروبات القديمة، رتّبها حسب الحي، وانشر العقارات كإعادة بيع على الموقع"
        action={{ label: "العقارات على الموقع", href: "/admin/properties" }}
      />

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm font-medium",
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800",
            )}
          >
            {toast.text}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* خطوات */}
      <div className="grid gap-4 lg:grid-cols-3">
        {[
          {
            step: "1",
            title: "استيراد الرسائل",
            desc: "ارفع ملف JSON من Telegram Desktop لكل جروب (Resale + الأحياء)",
            icon: Upload,
            accent: "gold" as const,
          },
          {
            step: "2",
            title: "تحليل وتصنيف",
            desc: "النظام يستخرج الكود والسعر ويربط العقار بالحي حسب اسم الجروب",
            icon: Sparkles,
            accent: "purple" as const,
          },
          {
            step: "3",
            title: "نشر على الموقع",
            desc: "كل العقارات تُضاف تلقائياً كـ Resale في صفحة العقارات",
            icon: Globe,
            accent: "emerald" as const,
          },
        ].map((item) => (
          <div key={item.step} className="dam-card-elevated rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-sm font-bold text-gold">
                {item.step}
              </span>
              <item.icon className="h-5 w-5 text-black/40" />
            </div>
            <h3 className="mt-3 font-semibold text-[#0a0a0a]">{item.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-black/50">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* سحب من رابط */}
      <div className="dam-card-elevated rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <Link2 className="h-5 w-5 text-gold" />
          <h3 className="font-semibold text-[#0a0a0a]">سحب من رابط تليجرام</h3>
        </div>
        <p className="text-xs text-black/50 mb-4">
          الصق رابط رسالة من الجروب — مثل{" "}
          <span className="font-mono text-black/60">t.me/c/2855840897/11</span> (جروب Resale)
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://t.me/c/2855840897/11"
            dir="ltr"
            className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
          />
          <button
            type="button"
            onClick={() => fetchFromLink("from")}
            disabled={!!working}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50"
          >
            {working === "fetch" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            من الرسالة للآخر
          </button>
          <button
            type="button"
            onClick={() => fetchFromLink("all")}
            disabled={!!working}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-medium transition hover:border-gold/30 disabled:opacity-50"
          >
            {working === "fetch-all" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            كل الجروب
          </button>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-black/40">
          يتطلب إعداد مرة واحدة:{" "}
          <a href="https://my.telegram.org/apps" target="_blank" rel="noreferrer" className="text-gold hover:underline">
            my.telegram.org
          </a>{" "}
          → <code className="rounded bg-black/5 px-1">TELEGRAM_API_ID</code> +{" "}
          <code className="rounded bg-black/5 px-1">TELEGRAM_API_HASH</code> →{" "}
          <code className="rounded bg-black/5 px-1">npm run telegram:auth</code>
        </p>
      </div>

      {/* رفع الملفات */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
        }}
        className={cn(
          "dam-card-elevated relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition",
          dragOver ? "border-gold bg-gold/5" : "border-black/10 hover:border-gold/40",
        )}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10">
          {working === "upload" ? (
            <Loader2 className="h-7 w-7 animate-spin text-gold" />
          ) : (
            <FileJson className="h-7 w-7 text-gold" />
          )}
        </div>
        <h3 className="mt-4 text-lg font-semibold text-[#0a0a0a]">
          اسحب ملفات التصدير هنا
        </h3>
        <p className="mx-auto mt-2 max-w-lg text-sm text-black/50">
          من Telegram Desktop: الإعدادات → متقدم → تصدير بيانات تليجرام → JSON.
          ارفع <code className="rounded bg-black/5 px-1.5 py-0.5 text-xs">result.json</code> لكل
          جروب (يمكن أكثر من ملف مرة واحدة).
        </p>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={working === "upload"}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-2.5 text-sm font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          اختيار ملفات JSON
        </button>
      </div>

      {/* أزرار */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => runAction("pull")}
          disabled={!!working}
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium transition hover:border-gold/30 disabled:opacity-50"
        >
          {working === "pull" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          رسائل جديدة (البوت)
        </button>
        <button
          type="button"
          onClick={() => runAction("parse")}
          disabled={!!working}
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium transition hover:border-gold/30 disabled:opacity-50"
        >
          {working === "parse" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          إعادة التحليل
        </button>
        <button
          type="button"
          onClick={() => {
            if (!confirm(`نشر ${pendingPublish} عقار على الموقع كـ Resale؟`)) return;
            runAction("publish");
          }}
          disabled={!!working || pendingPublish <= 0}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-40"
        >
          {working === "publish" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          نشر على الموقع ({pendingPublish})
        </button>
        <Link
          href="/admin/operations"
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2.5 text-sm text-black/50 hover:text-black"
        >
          إعدادات البوت
        </Link>
      </div>

      {/* إحصائيات */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminStatCard icon={MessageSquare} label="رسائل" value={stats?.messages ?? 0} accent="blue" />
        <AdminStatCard icon={Building2} label="عقارات" value={stats?.listings ?? 0} accent="gold" />
        <AdminStatCard icon={Hash} label="بكود" value={stats?.withCode ?? 0} accent="purple" />
        <AdminStatCard icon={Globe} label="منشور" value={stats?.published ?? 0} accent="emerald" />
        <AdminStatCard icon={MapPin} label="جروبات" value={stats?.chats?.length ?? 0} accent="gold" />
      </div>

      {/* فلتر الجروبات */}
      {stats?.chats && stats.chats.length > 0 ? (
        <div className="dam-card-elevated rounded-2xl p-5">
          <h3 className="mb-3 text-sm font-semibold text-[#0a0a0a]">حسب الجروب / الحي</h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setChatId("all")}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-medium transition",
                chatId === "all"
                  ? "bg-gold text-white"
                  : "bg-black/5 text-black/55 hover:bg-black/8",
              )}
            >
              الكل · {stats.messages}
            </button>
            {stats.chats.map((c) => (
              <button
                key={c.chatId}
                type="button"
                onClick={() => setChatId(c.chatId)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-medium transition",
                  chatId === c.chatId
                    ? "bg-gold text-white"
                    : "bg-black/5 text-black/55 hover:bg-black/8",
                )}
              >
                {c.chatTitle ?? c.chatId}
                {c.district ? ` · ${districtLabel(c.district, "ar")}` : ""} · {c.count}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* قائمة العقارات */}
      <div className="dam-card-elevated overflow-hidden rounded-2xl">
        <div className="flex flex-col gap-3 border-b border-black/6 p-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold text-[#0a0a0a]">العقارات المستخرجة</h3>
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/30" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="بحث بالكود أو النص..."
              className="w-full rounded-xl border border-black/10 bg-white py-2.5 ps-10 pe-4 text-sm outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-black/40">
            <Loader2 className="h-5 w-5 animate-spin" />
            جاري التحميل...
          </div>
        ) : listings.length === 0 ? (
          <div className="py-20 text-center">
            <MessageSquare className="mx-auto h-10 w-10 text-black/15" />
            <p className="mt-3 text-sm text-black/45">ارفع ملفات التصدير لعرض العقارات هنا</p>
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {listings.map((row, i) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-start"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {row.listingCode ? (
                      <span className="rounded-lg bg-emerald-50 px-2.5 py-1 font-mono text-sm font-medium text-emerald-700">
                        {row.listingCode}
                      </span>
                    ) : (
                      <span className="text-xs text-black/35">بدون كود</span>
                    )}
                    <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-600">
                      resale
                    </span>
                    {row.propertyId ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        منشور
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm font-medium text-[#0a0a0a]">
                    {[row.propertyType, row.district ? districtLabel(row.district, "ar") : null, row.compound]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </p>
                  <p className="text-xs text-black/45">
                    {formatPrice(row.price)}
                    {row.area ? ` · ${row.area} م²` : ""}
                    {row.bedrooms ? ` · ${row.bedrooms} غرف` : ""}
                  </p>
                  <p className="text-[11px] text-black/35">
                    {row.message.chatTitle} ·{" "}
                    {new Date(row.message.messageDate).toLocaleDateString("ar-EG")}
                    {row.message.hasMedia ? " · 📷" : ""}
                  </p>
                </div>
                <p className="max-h-28 overflow-auto rounded-xl bg-black/[0.03] p-3 text-xs leading-relaxed text-black/55 whitespace-pre-wrap">
                  {row.rawText}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
