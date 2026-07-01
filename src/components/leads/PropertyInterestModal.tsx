"use client";

import { useState } from "react";
import { X, MessageCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type InterestFormData = {
  clientName: string;
  clientPhone: string;
  message?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  propertyTitle: string;
  onSubmit: (data: InterestFormData) => Promise<void>;
};

export function PropertyInterestModal({ open, onClose, propertyTitle, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);
    try {
      await onSubmit({
        clientName: name.trim(),
        clientPhone: phone.trim(),
        message: note.trim() || undefined,
      });
      setDone(true);
      setTimeout(() => {
        setDone(false);
        setName("");
        setPhone("");
        setNote("");
        onClose();
      }, 2000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-label="إغلاق"
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute end-4 top-4 rounded-lg p-1 text-black/40 hover:bg-black/5"
            >
              <X className="h-5 w-5" />
            </button>

            {done ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
                  <MessageCircle className="h-7 w-7 text-emerald-600" />
                </div>
                <p className="mt-4 text-lg font-semibold text-[#0a0a0a]">تم تسجيل اهتمامك!</p>
                <p className="mt-2 text-sm text-black/50">هيتواصل معاك المندوب على واتساب قريباً</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-[#0a0a0a]">مهتم بالعقار؟</h2>
                <p className="mt-1 text-sm text-gold">{propertyTitle}</p>
                <p className="mt-2 text-sm text-black/50">
                  سجّل بياناتك وهنوزّعك على مندوب من فريقنا يتواصل معاك فوراً
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-black/50">الاسم *</label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="dam-contact-input w-full text-sm"
                      placeholder="محمد أحمد"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-black/50">رقم الموبايل *</label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="dam-contact-input w-full text-sm"
                      placeholder="01xxxxxxxxx"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-black/50">ملاحظة (اختياري)</label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                      className="dam-contact-input w-full resize-none text-sm"
                      placeholder="مثال: عايز معاينة نهاية الأسبوع"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-sm font-bold text-black disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MessageCircle className="h-4 w-4" />
                    )}
                    إرسال الطلب
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
