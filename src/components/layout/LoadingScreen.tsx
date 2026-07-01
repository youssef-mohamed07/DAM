"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useApp } from "@/providers/AppProvider";
import { company } from "@/lib/data/company";

const SPLASH_KEY = "dam-splash-seen";
const AUTO_MS = 2400;
const EXIT_MS = 500;

export function LoadingScreen() {
  const { setLoaded } = useApp();
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(true);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    try {
      sessionStorage.setItem(SPLASH_KEY, "1");
    } catch {
      /* private browsing */
    }
    setShow(false);
  }, []);

  const skipSplash = useCallback(() => {
    setDone(true);
    setLoaded(true);
  }, [setLoaded]);

  useEffect(() => {
    const seen = sessionStorage.getItem(SPLASH_KEY) === "1";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduced) {
      skipSplash();
      return;
    }

    setMounted(true);
    timerRef.current = setTimeout(finish, AUTO_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [finish, skipSplash]);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = show ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted, show]);

  if (!mounted || done) return null;

  return createPortal(
    <AnimatePresence mode="wait" onExitComplete={skipSplash}>
      {show && (
        <motion.div
          key="splash"
          role="status"
          aria-label="جاري تحميل DAM Properties"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#080808] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.12)_0%,transparent_55%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]" />
          </div>

          <motion.div
            className="relative z-10 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="dam-splash-glow mb-6 flex h-20 w-20 items-center justify-center rounded-full sm:h-24 sm:w-24">
              <span
                className="dam-splash-logo font-serif text-3xl font-light tracking-[0.35em] text-white sm:text-4xl"
                dir="ltr"
              >
                DAM
              </span>
            </div>

            <p className="max-w-xs text-balance text-lg font-semibold leading-snug text-white sm:max-w-sm sm:text-xl">
              {company.name}
            </p>
            <p className="mt-3 max-w-xs text-balance text-sm leading-relaxed text-white/45 sm:max-w-sm">
              {company.tagline}
            </p>

            <motion.div
              className="mt-8 h-px w-16 bg-gradient-to-l from-transparent via-gold/60 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
          </motion.div>

          <div className="absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-20 flex flex-col items-center gap-3 px-6">
            <button
              type="button"
              onClick={finish}
              className="rounded-full border border-white/15 px-5 py-2 text-xs tracking-wider text-white/50 transition hover:border-gold/40 hover:text-gold"
            >
              تخطي
            </button>
            <div className="h-px w-full max-w-[200px] overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gold/70"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
