"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  MapPin,
  Sparkles,
  Send,
  CheckCircle2,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { company, whatsappUrl, facebookUrl } from "@/lib/data/company";
import { districts } from "@/lib/data/districts";
import { t, cn, formatPhoneIntl, formatPhoneLocal } from "@/lib/utils";
import { Num } from "@/components/ui/Num";
import { submitLead } from "@/lib/leads/client";

const goals = [
  { id: "buy", label: "شراء للسكن" },
  { id: "invest", label: "استثمار" },
  { id: "consult", label: "استشارة" },
] as const;

const propertyTypes = [
  { id: "apartment", label: "شقة" },
  { id: "villa", label: "فيلا" },
  { id: "commercial", label: "تجاري" },
  { id: "any", label: "مفتوح" },
] as const;

const budgets = [
  "أقل من ٢ مليون",
  "٢ — ٤ مليون",
  "٤ — ٧ مليون",
  "٧ — ١٢ مليون",
  "أكثر من ١٢ مليون",
];

type GoalId = (typeof goals)[number]["id"];
type PropertyTypeId = (typeof propertyTypes)[number]["id"];

export function ContactPageContent({
  propertySlug,
  propertyId,
  propertyTitle,
}: {
  propertySlug?: string;
  propertyId?: string;
  propertyTitle?: string;
}) {
  const [goal, setGoal] = useState<GoalId>("buy");
  const [propertyType, setPropertyType] = useState<PropertyTypeId>("apartment");
  const [budget, setBudget] = useState(budgets[2]);
  const [district, setDistrict] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const goalLabel = goals.find((g) => g.id === goal)?.label ?? "";
  const typeLabel = propertyTypes.find((p) => p.id === propertyType)?.label ?? "";
  const districtLabel = district
    ? t(districts.find((d) => d.id === district)?.name ?? { ar: district, en: district })
    : "غير محدد";

  function buildWhatsAppMessage() {
    return [
      "مرحباً DAM Properties،",
      "",
      propertyTitle && `العقار: ${propertyTitle}`,
      `الهدف: ${goalLabel}`,
      `نوع العقار: ${typeLabel}`,
      `الميزانية: ${budget}`,
      `المنطقة: ${districtLabel}`,
      name && `الاسم: ${name}`,
      phone && `الهاتف: ${phone}`,
      email && `البريد: ${email}`,
      message && "",
      message && `رسالة: ${message}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = await submitLead({
      source: "contact",
      propertyId,
      propertySlug,
      propertyTitle,
      clientName: name,
      clientPhone: phone,
      clientEmail: email || undefined,
      message: message || undefined,
      goal: goalLabel,
      propertyType: typeLabel,
      budget,
      district: districtLabel,
    });

    setSent(true);
  }

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-clip bg-white pt-24">
      <div className="pointer-events-none absolute -start-32 top-20 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -end-24 bottom-0 h-80 w-80 rounded-full bg-gold/8 blur-3xl" />

      <div className="dam-container relative pb-20 pt-8 md:pb-28 md:pt-12">
        <div className="grid min-w-0 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Copy */}
          <div className="min-w-0 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-4 py-1.5 text-xs text-gold">
                <Sparkles className="h-3.5 w-3.5" />
                استشارة مجانية
              </div>
              <h1 className="font-serif mt-6 text-4xl leading-[1.15] text-[#0a0a0a] md:text-5xl lg:text-[3.25rem]">
                {propertyTitle ? (
                  <>
                    استفسار عن
                    <br />
                    <span className="text-gradient-gold italic">{propertyTitle}</span>
                  </>
                ) : (
                  <>
                    ابدأ رحلة
                    <br />
                    <span className="text-gradient-gold italic">عقارك في العبور</span>
                  </>
                )}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-black/55">
                أخبرنا بما تبحث عنه — نرد خلال يوم عمل واحد بخطة واضحة: مقارنة مشاريع،
                معاينات خاصة، وتنسيق التمويل.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "مقارنة بين جولف سيتي وروك فيلا وريفيل وجزيل",
                  "معاينات خاصة وجولات فيديو",
                  "تنسيق التمويل ومراجعة العقود",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-black/60">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="dam-card-dark mt-10 space-y-4 rounded-2xl p-6">
                <a
                  href={`tel:${company.phone}`}
                  className="flex items-center gap-3 text-[#0a0a0a] transition hover:text-gold"
                >
                  <Phone className="h-4 w-4 text-gold" />
                  <span className="font-serif text-xl">
                    <Num>{formatPhoneIntl(company.phone)}</Num>
                  </span>
                </a>
                <a
                  href={whatsappUrl()}
                  className="flex items-center gap-3 text-sm text-black/55 transition hover:text-gold"
                >
                  <MessageCircle className="h-4 w-4 text-gold" />
                  واتساب · <Num>{formatPhoneLocal(company.phoneLocal)}</Num>
                </a>
                <p className="flex items-center gap-3 text-sm text-black/45">
                  <Clock className="h-4 w-4 text-gold" />
                  {company.hours} · {company.hoursFriday}
                </p>
                <p className="flex items-start gap-3 text-sm text-black/45">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  {company.address}
                </p>
                <a
                  href={facebookUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gold transition hover:underline"
                >
                  <Share2 className="h-4 w-4" />
                  صفحتنا على فيسبوك
                </a>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="min-w-0 lg:col-span-7"
          >
            <div className="dam-contact-form relative min-w-0 overflow-hidden rounded-[2rem] p-5 sm:p-6 md:p-10">
              <div className="pointer-events-none absolute -end-20 -top-20 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />

              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex min-h-[420px] flex-col items-center justify-center text-center"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/15">
                      <CheckCircle2 className="h-8 w-8 text-gold" />
                    </div>
                    <h2 className="font-serif mt-6 text-2xl text-[#0a0a0a]">تم إرسال طلبك بنجاح</h2>
                    <p className="mt-3 max-w-sm text-sm text-black/50">
                      تم تسجيل بياناتك وإبلاغ مندوب المبيعات تلقائياً. سيتواصل معك على واتساب قريباً على{" "}
                      <Num>{formatPhoneLocal(company.phoneLocal)}</Num>.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSent(false)}
                      className="mt-8 text-sm text-gold transition hover:underline"
                    >
                      تعديل الطلب
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="relative space-y-8"
                  >
                    <div>
                      <p className="mb-3 text-xs font-medium tracking-widest text-gold uppercase">
                        ٠١ · هدفك
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {goals.map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => setGoal(g.id)}
                            className={cn(
                              "rounded-full border px-5 py-2.5 text-sm transition-all duration-300",
                              goal === g.id
                                ? "border-gold bg-gold text-black shadow-[0_4px_24px_rgba(201,162,39,0.35)]"
                                : "border-black/15 text-black/60 hover:border-gold/40 hover:text-[#0a0a0a]",
                            )}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 text-xs font-medium tracking-widest text-gold uppercase">
                        ٠٢ · نوع العقار
                      </p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {propertyTypes.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setPropertyType(p.id)}
                            className={cn(
                              "rounded-xl border py-3 text-sm transition-all",
                              propertyType === p.id
                                ? "border-gold/50 bg-gold/15 text-gold"
                                : "border-black/10 text-black/55 hover:border-white/25",
                            )}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-medium tracking-widest text-gold uppercase">
                          ٠٣ · الميزانية
                        </label>
                        <select
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="dam-contact-input w-full"
                        >
                          {budgets.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-medium tracking-widest text-gold uppercase">
                          المنطقة المفضلة
                        </label>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="dam-contact-input w-full"
                        >
                          <option value="">كل المناطق</option>
                          {districts.map((d) => (
                            <option key={d.id} value={d.id}>
                              {t(d.name)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs text-black/40">الاسم</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="اسمك الكامل"
                          className="dam-contact-input w-full"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs text-black/40">الهاتف</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="01xxxxxxxxx"
                          className="dam-contact-input w-full"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-black/40">
                        البريد الإلكتروني (اختياري)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="dam-contact-input w-full"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-black/40">رسالتك</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        placeholder="أخبرنا بتفاصيل إضافية — موعد المعاينة، مشروع معين، أو أسئلة عن التمويل…"
                        className="dam-contact-input w-full resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="submit"
                        className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-gold to-[#e8d48a] py-4 text-sm font-semibold text-black shadow-[0_8px_32px_rgba(201,162,39,0.4)] transition hover:brightness-110"
                      >
                        <Send className="h-4 w-4 transition group-hover:-translate-x-0.5" />
                        إرسال الطلب
                      </button>
                      <a
                        href={`mailto:${company.email}?subject=استفسار عقاري - العبور`}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-black/15 py-4 text-sm text-black/70 transition hover:border-gold/40 hover:text-gold"
                      >
                        <Mail className="h-4 w-4" />
                        بريد إلكتروني
                      </a>
                    </div>

                    <p className="text-center text-[11px] text-black/30">
                      بالإرسال توافق على التواصل معك عبر DAM Properties لمساعدتك في العثور على
                      عقارك.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/properties"
              className="mt-6 inline-flex items-center gap-2 text-sm text-black/40 transition hover:text-gold"
            >
              أو استكشف العقارات مباشرة
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
