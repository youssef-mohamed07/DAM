"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Search,
  Building2,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { districts } from "@/lib/data/districts";
import { submitLead } from "@/lib/leads/client";
import { saleCategoryLabel } from "@/lib/properties/sale-category";
import { propertyTypeLabel } from "@/lib/utils";
import { useLocale } from "@/providers/LocaleProvider";
import type { PropertyType, SaleCategory } from "@/types";

type FlowStep =
  | "category"
  | "delivery"
  | "payment"
  | "resaleDetails"
  | "preferences"
  | "needs"
  | "contact"
  | "success";

type PrimaryDelivery = "ready" | "1y" | "2026" | "2027" | "2028plus" | "flexible";
type ResaleMoveIn = "ready" | "soon";
type ResaleFinishing = "full" | "semi" | "core";
type ResalePayment = "cash" | "flexible";
type PurchaseGoal = "live" | "invest" | "both";
type Timeline = "asap" | "1m" | "3m" | "6m" | "browse";
type ContactTime = "morning" | "afternoon" | "evening" | "any";

const PRIMARY_TYPES: PropertyType[] = ["apartment", "villa", "townhouse", "duplex", "penthouse"];
const RESALE_TYPES: PropertyType[] = ["apartment", "villa", "townhouse", "duplex"];
const YEAR_OPTIONS = [5, 6, 7, 8];
const DOWN_OPTIONS = [5, 10, 15];
const BEDROOM_OPTIONS = [1, 2, 3, 4, 5];
const AREA_OPTIONS = [80, 120, 150, 200, 250];

function FlowField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-black/55">{label}</label>
      {children}
    </div>
  );
}

function OptionGrid<T extends string>({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: { value: T; label: string }[];
  value: T | "";
  onChange: (v: T) => void;
  columns?: 2 | 3;
}) {
  return (
    <div className={`grid gap-2 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-xl border px-3 py-3 text-xs font-semibold leading-snug transition ${
            value === opt.value
              ? "border-black bg-black text-white shadow-sm"
              : "border-black/12 bg-white text-black/65 hover:border-black/25"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const selectClass =
  "select-light w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-sm font-medium text-[#0a0a0a] outline-none transition focus:border-black/35 focus:ring-2 focus:ring-black/5";

export function HeroPropertyFlow() {
  const { dict, t, path, locale } = useLocale();
  const f = dict.hero.flow;

  const [step, setStep] = useState<FlowStep>("category");
  const [saleCategory, setSaleCategory] = useState<SaleCategory | "">("");
  const [primaryDelivery, setPrimaryDelivery] = useState<PrimaryDelivery | "">("");
  const [installmentYears, setInstallmentYears] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [resaleMoveIn, setResaleMoveIn] = useState<ResaleMoveIn | "">("");
  const [resaleFinishing, setResaleFinishing] = useState<ResaleFinishing | "">("");
  const [resalePayment, setResalePayment] = useState<ResalePayment | "">("");
  const [district, setDistrict] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [minArea, setMinArea] = useState("");
  const [purchaseGoal, setPurchaseGoal] = useState<PurchaseGoal | "">("");
  const [timeline, setTimeline] = useState<Timeline | "">("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappSame, setWhatsappSame] = useState(true);
  const [whatsapp, setWhatsapp] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [contactTime, setContactTime] = useState<ContactTime>("any");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const budgets =
    saleCategory === "resale" ? f.resaleBudgets : f.primaryBudgets;
  const typeOptions = saleCategory === "resale" ? RESALE_TYPES : PRIMARY_TYPES;

  const stepOrder = useMemo((): FlowStep[] => {
    if (saleCategory === "primary") {
      return ["category", "delivery", "payment", "preferences", "needs", "contact"];
    }
    if (saleCategory === "resale") {
      return ["category", "resaleDetails", "preferences", "needs", "contact"];
    }
    return ["category"];
  }, [saleCategory]);

  const stepLabels: Record<FlowStep, string> = {
    category: f.stepCategory,
    delivery: f.stepDelivery,
    payment: f.stepPayment,
    resaleDetails: f.stepResale,
    preferences: f.stepPreferences,
    needs: f.stepNeeds,
    contact: f.stepContact,
    success: "",
  };

  const stepIndex = step === "success" ? stepOrder.length : stepOrder.indexOf(step);
  const progress =
    step === "success" ? 100 : ((stepIndex + 1) / stepOrder.length) * 100;

  const districtLabel = district
    ? t(districts.find((d) => d.id === district)?.name ?? { ar: district, en: district })
    : dict.hero.allDistricts;

  const typeLabel = propertyType
    ? propertyTypeLabel(propertyType as PropertyType, locale)
    : dict.hero.allTypes;

  const primaryDeliveryLabel = useMemo(() => {
    const map: Record<PrimaryDelivery, string> = {
      ready: f.deliveryReady,
      "1y": f.delivery1y,
      "2026": f.delivery2026,
      "2027": f.delivery2027,
      "2028plus": f.delivery2028,
      flexible: f.deliveryFlexible,
    };
    return primaryDelivery ? map[primaryDelivery] : "";
  }, [primaryDelivery, f]);

  function selectCategory(cat: SaleCategory) {
    setSaleCategory(cat);
    setBudget(cat === "resale" ? f.resaleBudgets[2] : f.primaryBudgets[2]);
    setStep(cat === "primary" ? "delivery" : "resaleDetails");
  }

  function goBack() {
    setError("");
    const idx = stepOrder.indexOf(step);
    if (idx > 0) setStep(stepOrder[idx - 1]);
    else if (step === "category") return;
    else setStep("category");
  }

  function goNext() {
    setError("");
    const idx = stepOrder.indexOf(step);
    if (idx < stepOrder.length - 1) setStep(stepOrder[idx + 1]);
  }

  function validateAndNext(current: FlowStep) {
    if (current === "delivery" && !primaryDelivery) {
      setError(locale === "en" ? "Choose a handover timeline" : "اختار مدة الاستلام");
      return;
    }
    if (current === "resaleDetails" && (!resaleMoveIn || !resaleFinishing || !resalePayment)) {
      setError(locale === "en" ? "Complete all options" : "كمّل كل الاختيارات");
      return;
    }
    if (current === "needs" && (!purchaseGoal || !timeline)) {
      setError(locale === "en" ? "Choose goal and timeline" : "اختار الهدف وموعد الشراء");
      return;
    }
    setError("");
    goNext();
  }

  function validateContactAndSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError(locale === "en" ? "Name and mobile are required" : "الاسم والموبايل مطلوبين");
      return;
    }
    const wa = whatsappSame ? phone.trim() : whatsapp.trim();
    if (!wa) {
      setError(locale === "en" ? "WhatsApp number is required" : "رقم الواتساب مطلوب");
      return;
    }
    void submitForm(wa);
  }

  function propertiesUrl() {
    const params = new URLSearchParams();
    if (saleCategory) params.set("category", saleCategory);
    if (district) params.set("district", district);
    if (propertyType) params.set("type", propertyType);
    const q = params.toString();
    return q ? path(`/properties?${q}`) : path("/properties");
  }

  function goalLabel() {
    if (purchaseGoal === "live") return f.goalLive;
    if (purchaseGoal === "invest") return f.goalInvest;
    if (purchaseGoal === "both") return f.goalBoth;
    return "—";
  }

  function timelineLabel() {
    const map: Record<Timeline, string> = {
      asap: f.timelineAsap,
      "1m": f.timeline1m,
      "3m": f.timeline3m,
      "6m": f.timeline6m,
      browse: f.timelineBrowse,
    };
    return timeline ? map[timeline] : "—";
  }

  function contactTimeLabel() {
    const map: Record<ContactTime, string> = {
      morning: f.timeMorning,
      afternoon: f.timeAfternoon,
      evening: f.timeEvening,
      any: f.timeAny,
    };
    return contactTime ? map[contactTime] : f.timeAny;
  }

  function buildDashboardNotes(whatsappNumber: string) {
    const lines = [
      `📱 ${f.phone}: ${phone.trim()}`,
      `💬 ${f.whatsapp}: ${whatsappNumber}`,
    ];
    if (altPhone.trim()) lines.push(`📞 ${f.altPhone}: ${altPhone.trim()}`);
    if (email.trim()) lines.push(`✉️ ${f.email}: ${email.trim()}`);
    if (city.trim()) lines.push(`📍 ${f.city}: ${city.trim()}`);
    lines.push(
      `🛏 ${f.bedrooms}: ${bedrooms || f.bedroomsAny}`,
      `📐 ${f.minArea}: ${minArea ? `${minArea} م²` : f.areaAny}`,
      `🎯 ${f.purchaseGoal}: ${goalLabel()}`,
      `⏱ ${f.timeline}: ${timelineLabel()}`,
      `🕐 ${f.contactTime}: ${contactTimeLabel()}`,
    );
    return lines.join("\n");
  }

  function buildMessage(whatsappNumber: string) {
    const lines = [
      locale === "en" ? "Hero form inquiry" : "طلب فورم الهيرو",
      `${locale === "en" ? "Category" : "التصنيف"}: ${saleCategory ? saleCategoryLabel(saleCategory, locale) : "—"}`,
    ];

    if (saleCategory === "primary") {
      lines.push(`${f.stepDelivery}: ${primaryDeliveryLabel || "—"}`);
      if (installmentYears) {
        lines.push(`${f.installmentYears}: ${installmentYears} ${locale === "en" ? "years" : "سنوات"}`);
      }
      if (downPayment) lines.push(`${f.downPayment}: ${downPayment}%`);
    }

    if (saleCategory === "resale") {
      lines.push(
        `${f.moveIn}: ${resaleMoveIn === "ready" ? f.resaleMoveReady : resaleMoveIn === "soon" ? f.resaleMoveSoon : "—"}`,
        `${f.finishing}: ${
          resaleFinishing === "full"
            ? f.finishingFull
            : resaleFinishing === "semi"
              ? f.finishingSemi
              : resaleFinishing === "core"
                ? f.finishingCore
                : "—"
        }`,
        `${locale === "en" ? "Payment" : "السداد"}: ${
          resalePayment === "cash" ? f.paymentCash : resalePayment === "flexible" ? f.paymentFlexible : "—"
        }`,
      );
    }

    lines.push(
      `${f.district}: ${districtLabel}`,
      `${f.propertyType}: ${typeLabel}`,
      `${f.budget}: ${budget || "—"}`,
      `${f.bedrooms}: ${bedrooms || f.bedroomsAny}`,
      `${f.minArea}: ${minArea ? `${minArea} m²` : f.areaAny}`,
      `${f.purchaseGoal}: ${goalLabel()}`,
      `${f.timeline}: ${timelineLabel()}`,
      "",
      `${f.phone}: ${phone.trim()}`,
      `${f.whatsapp}: ${whatsappNumber}`,
    );
    if (altPhone.trim()) lines.push(`${f.altPhone}: ${altPhone.trim()}`);
    if (email.trim()) lines.push(`${f.email}: ${email.trim()}`);
    if (city.trim()) lines.push(`${f.city}: ${city.trim()}`);
    lines.push(`${f.contactTime}: ${contactTimeLabel()}`);

    if (note.trim()) {
      lines.push("", note.trim());
    }

    return lines.join("\n");
  }

  async function submitForm(whatsappNumber: string) {
    setLoading(true);
    setError("");
    try {
      const result = await submitLead({
        source: "hero",
        clientName: name.trim(),
        clientPhone: phone.trim(),
        clientEmail: email.trim() || undefined,
        message: buildMessage(whatsappNumber),
        notes: buildDashboardNotes(whatsappNumber),
        goal: `${saleCategory === "primary" ? "أولي" : "إعادة بيع"} · ${goalLabel()}`,
        propertyType: typeLabel,
        budget: budget || undefined,
        district: districtLabel,
      });
      if (!result) throw new Error("failed");
      setStep("success");
    } catch {
      setError(locale === "en" ? "Could not send — try again" : "تعذر الإرسال — حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  function resetFlow() {
    setStep("category");
    setSaleCategory("");
    setPrimaryDelivery("");
    setInstallmentYears("");
    setDownPayment("");
    setResaleMoveIn("");
    setResaleFinishing("");
    setResalePayment("");
    setDistrict("");
    setPropertyType("");
    setBudget("");
    setBedrooms("");
    setMinArea("");
    setPurchaseGoal("");
    setTimeline("");
    setName("");
    setPhone("");
    setWhatsappSame(true);
    setWhatsapp("");
    setAltPhone("");
    setEmail("");
    setCity("");
    setContactTime("any");
    setNote("");
    setError("");
  }

  const summaryChips = [
    saleCategory ? saleCategoryLabel(saleCategory, locale) : null,
    saleCategory === "primary" ? primaryDeliveryLabel : null,
    saleCategory === "resale" && resaleFinishing
      ? resaleFinishing === "full"
        ? f.finishingFull
        : resaleFinishing === "semi"
          ? f.finishingSemi
          : f.finishingCore
      : null,
    districtLabel !== dict.hero.allDistricts ? districtLabel : null,
    propertyType ? typeLabel : null,
  ].filter(Boolean);

  return (
    <div className="min-w-0 overflow-hidden rounded-3xl border border-black/12 bg-white p-5 shadow-2xl sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs font-bold tracking-wide text-black uppercase">
          <Search className="h-3.5 w-3.5" />
          {f.title}
        </p>
        {step !== "category" && step !== "success" ? (
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1 text-xs font-medium text-black/45 transition hover:text-black"
          >
            <ChevronRight className="h-3.5 w-3.5" />
            {f.back}
          </button>
        ) : null}
      </div>

      {step !== "success" && step !== "category" ? (
        <p className="mb-3 text-[11px] font-semibold text-black/40">{stepLabels[step]}</p>
      ) : null}

      {step !== "success" ? (
        <div className="mb-4 h-1 overflow-hidden rounded-full bg-black/6">
          <div
            className="h-full rounded-full bg-black transition-all duration-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}

      {step === "category" ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[#0a0a0a]">{f.stepCategory}</p>
          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => selectCategory("primary")}
              className="flex items-start gap-4 rounded-2xl border border-black/10 bg-[#fafafa] p-4 text-start transition hover:border-black hover:bg-white"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-[#0a0a0a]">{f.primary}</p>
                <p className="mt-1 text-xs leading-relaxed text-black/50">{f.primaryHint}</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => selectCategory("resale")}
              className="flex items-start gap-4 rounded-2xl border border-black/10 bg-[#fafafa] p-4 text-start transition hover:border-black hover:bg-white"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-[#0a0a0a]">{f.resale}</p>
                <p className="mt-1 text-xs leading-relaxed text-black/50">{f.resaleHint}</p>
              </div>
            </button>
          </div>
        </div>
      ) : null}

      {step === "delivery" ? (
        <div className="space-y-4">
          <FlowField label={f.stepDelivery}>
            <OptionGrid
              columns={2}
              value={primaryDelivery}
              onChange={setPrimaryDelivery}
              options={[
                { value: "ready", label: f.deliveryReady },
                { value: "1y", label: f.delivery1y },
                { value: "2026", label: f.delivery2026 },
                { value: "2027", label: f.delivery2027 },
                { value: "2028plus", label: f.delivery2028 },
                { value: "flexible", label: f.deliveryFlexible },
              ]}
            />
          </FlowField>
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <button
            type="button"
            onClick={() => validateAndNext("delivery")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-sm font-bold text-white"
          >
            {f.next}
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {step === "payment" ? (
        <div className="space-y-4">
          <FlowField label={f.installmentYears}>
            <select
              value={installmentYears}
              onChange={(e) => setInstallmentYears(e.target.value)}
              className={selectClass}
            >
              <option value="">{f.yearsAny}</option>
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={String(y)}>
                  {y} {locale === "en" ? "years" : "سنوات"}
                </option>
              ))}
            </select>
          </FlowField>
          <FlowField label={f.downPayment}>
            <OptionGrid
              columns={3}
              value={downPayment as "" | "5" | "10" | "15"}
              onChange={(v) => setDownPayment(v)}
              options={[
                ...DOWN_OPTIONS.map((d) => ({ value: String(d) as "5" | "10" | "15", label: `${d}%` })),
              ]}
            />
            <button
              type="button"
              onClick={() => setDownPayment("")}
              className={`mt-2 w-full rounded-xl border px-3 py-2 text-xs font-medium ${
                !downPayment ? "border-black bg-black/5" : "border-black/10 text-black/50"
              }`}
            >
              {f.downAny}
            </button>
          </FlowField>
          <button
            type="button"
            onClick={goNext}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-sm font-bold text-white"
          >
            {f.next}
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {step === "resaleDetails" ? (
        <div className="space-y-4">
          <FlowField label={f.moveIn}>
            <OptionGrid
              value={resaleMoveIn}
              onChange={setResaleMoveIn}
              options={[
                { value: "ready", label: f.resaleMoveReady },
                { value: "soon", label: f.resaleMoveSoon },
              ]}
            />
          </FlowField>
          <FlowField label={f.finishing}>
            <OptionGrid
              columns={3}
              value={resaleFinishing}
              onChange={setResaleFinishing}
              options={[
                { value: "full", label: f.finishingFull },
                { value: "semi", label: f.finishingSemi },
                { value: "core", label: f.finishingCore },
              ]}
            />
          </FlowField>
          <FlowField label={locale === "en" ? "Payment" : "طريقة السداد"}>
            <OptionGrid
              value={resalePayment}
              onChange={setResalePayment}
              options={[
                { value: "cash", label: f.paymentCash },
                { value: "flexible", label: f.paymentFlexible },
              ]}
            />
          </FlowField>
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <button
            type="button"
            onClick={() => validateAndNext("resaleDetails")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-sm font-bold text-white"
          >
            {f.next}
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {step === "preferences" ? (
        <div className="space-y-4">
          {summaryChips.length ? (
            <div className="flex flex-wrap gap-1.5">
              {summaryChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-black/6 px-2.5 py-1 text-[10px] font-semibold text-black/55"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}

          <FlowField label={f.district}>
            <select value={district} onChange={(e) => setDistrict(e.target.value)} className={selectClass}>
              <option value="">{dict.hero.allDistricts}</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {t(d.name)}
                </option>
              ))}
            </select>
          </FlowField>

          <FlowField label={f.propertyType}>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className={selectClass}
            >
              <option value="">{dict.hero.allTypes}</option>
              {typeOptions.map((id) => (
                <option key={id} value={id}>
                  {propertyTypeLabel(id, locale)}
                </option>
              ))}
            </select>
          </FlowField>

          <FlowField label={f.budget}>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={selectClass}
            >
              {budgets.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </FlowField>

          <button
            type="button"
            onClick={goNext}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-sm font-bold text-white"
          >
            {f.next}
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {step === "needs" ? (
        <div className="space-y-4">
          <FlowField label={f.bedrooms}>
            <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={selectClass}>
              <option value="">{f.bedroomsAny}</option>
              {BEDROOM_OPTIONS.map((n) => (
                <option key={n} value={String(n)}>
                  {n}+ {locale === "en" ? "beds" : "غرف"}
                </option>
              ))}
            </select>
          </FlowField>

          <FlowField label={f.minArea}>
            <select value={minArea} onChange={(e) => setMinArea(e.target.value)} className={selectClass}>
              <option value="">{f.areaAny}</option>
              {AREA_OPTIONS.map((a) => (
                <option key={a} value={String(a)}>
                  {a}+ {locale === "en" ? "m²" : "م²"}
                </option>
              ))}
            </select>
          </FlowField>

          <FlowField label={`${f.purchaseGoal} *`}>
            <OptionGrid
              value={purchaseGoal}
              onChange={setPurchaseGoal}
              options={[
                { value: "live", label: f.goalLive },
                { value: "invest", label: f.goalInvest },
                { value: "both", label: f.goalBoth },
              ]}
            />
          </FlowField>

          <FlowField label={`${f.timeline} *`}>
            <OptionGrid
              columns={3}
              value={timeline}
              onChange={setTimeline}
              options={[
                { value: "asap", label: f.timelineAsap },
                { value: "1m", label: f.timeline1m },
                { value: "3m", label: f.timeline3m },
                { value: "6m", label: f.timeline6m },
                { value: "browse", label: f.timelineBrowse },
              ]}
            />
          </FlowField>

          {error ? <p className="text-xs text-red-600">{error}</p> : null}

          <button
            type="button"
            onClick={() => validateAndNext("needs")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-sm font-bold text-white"
          >
            {f.next}
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {step === "contact" ? (
        <form onSubmit={validateContactAndSubmit} className="max-h-[min(70vh,520px)] space-y-3 overflow-y-auto pe-1">
          {summaryChips.length ? (
            <div className="flex flex-wrap gap-1.5 rounded-xl bg-black/[0.04] p-3">
              {summaryChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-black/60"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}

          <FlowField label={`${f.name} *`}>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="dam-contact-input w-full text-sm"
              placeholder={f.namePlaceholder}
            />
          </FlowField>
          <FlowField label={`${f.phone} *`}>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="dam-contact-input w-full text-sm"
              placeholder={f.phonePlaceholder}
              dir="ltr"
            />
          </FlowField>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-medium text-black/55">
              <input
                type="checkbox"
                checked={whatsappSame}
                onChange={(e) => setWhatsappSame(e.target.checked)}
                className="accent-black"
              />
              {f.whatsappSame}
            </label>
            {!whatsappSame ? (
              <input
                required
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="dam-contact-input w-full text-sm"
                placeholder={f.phonePlaceholder}
                dir="ltr"
              />
            ) : null}
          </div>

          <FlowField label={f.altPhone}>
            <input
              type="tel"
              value={altPhone}
              onChange={(e) => setAltPhone(e.target.value)}
              className="dam-contact-input w-full text-sm"
              placeholder={f.phonePlaceholder}
              dir="ltr"
            />
          </FlowField>

          <FlowField label={f.email}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="dam-contact-input w-full text-sm"
              placeholder={f.emailPlaceholder}
              dir="ltr"
            />
          </FlowField>

          <FlowField label={f.city}>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="dam-contact-input w-full text-sm"
              placeholder={f.cityPlaceholder}
            />
          </FlowField>

          <FlowField label={f.contactTime}>
            <OptionGrid
              columns={2}
              value={contactTime || "any"}
              onChange={(v) => setContactTime(v)}
              options={[
                { value: "morning", label: f.timeMorning },
                { value: "afternoon", label: f.timeAfternoon },
                { value: "evening", label: f.timeEvening },
                { value: "any", label: f.timeAny },
              ]}
            />
          </FlowField>

          <FlowField label={f.note}>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="dam-contact-input w-full resize-none text-sm"
              placeholder={f.notePlaceholder}
            />
          </FlowField>

          {error ? <p className="text-xs text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? f.submitting : f.submit}
          </button>
        </form>
      ) : null}

      {step === "success" ? (
        <div className="py-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </div>
          <p className="mt-4 text-lg font-bold text-[#0a0a0a]">{f.successTitle}</p>
          <p className="mt-2 text-sm text-black/50">{f.successDesc}</p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href={propertiesUrl()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-sm font-bold text-white"
            >
              {f.browseMatches}
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={resetFlow}
              className="text-sm text-black/45 transition hover:text-black"
            >
              {locale === "en" ? "New search" : "بحث جديد"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
