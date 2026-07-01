"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useApp } from "@/providers/AppProvider";
import { LogoMark } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const SPLASH_KEY = "dam-splash-seen";
const EXIT_MS = 650;
const TYPE_MS = 36;
const LINE_PAUSE_MS = 450;
const FADE_MS = 280;
const AFTER_LINES_MS = 900;

const easeCinema = [0.76, 0, 0.24, 1] as const;

type SplashLine = {
  text: string;
  side: "right" | "left" | "center";
  highlight?: boolean;
};

const HOOK_LINES: SplashLine[] = [
  { text: "مش بس عقار…", side: "right" },
  { text: "استثمار في مستقبلك", side: "left" },
  { text: "في أرقى أحياء العبور", side: "right" },
  { text: "بيتك القادم يبدأ من هنا", side: "center", highlight: true },
];

const sideStyles: Record<
  SplashLine["side"],
  { wrap: string; text: string; enter: number; ghost: string }
> = {
  right: {
    wrap: "items-end pe-6 ps-16 md:pe-16 md:ps-28",
    text: "text-end",
    enter: 48,
    ghost: "end-4 md:end-12",
  },
  left: {
    wrap: "items-start pe-16 ps-6 md:pe-28 md:ps-16",
    text: "text-start",
    enter: -48,
    ghost: "start-4 md:start-12",
  },
  center: {
    wrap: "items-center px-6",
    text: "text-center",
    enter: 0,
    ghost: "inset-x-6",
  },
};

function SplashTypewriter({
  lines,
  active,
  onComplete,
}: {
  lines: SplashLine[];
  active: boolean;
  onComplete: () => void;
}) {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const doneRef = useRef(false);

  const current = lines[lineIdx];
  const line = current?.text ?? "";
  const text = line.slice(0, charIdx);
  const style = sideStyles[current?.side ?? "center"];

  useEffect(() => {
    if (!active || doneRef.current) return;

    if (charIdx < line.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), TYPE_MS);
      return () => clearTimeout(t);
    }

    if (lineIdx < lines.length - 1) {
      const t = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          setLineIdx((i) => i + 1);
          setCharIdx(0);
          setVisible(true);
        }, FADE_MS);
      }, LINE_PAUSE_MS);
      return () => clearTimeout(t);
    }

    doneRef.current = true;
    const t = setTimeout(onComplete, LINE_PAUSE_MS);
    return () => clearTimeout(t);
  }, [active, charIdx, line.length, lineIdx, lines.length, onComplete]);

  if (!active || !current) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center">
      {/* ghost كبير في الخلفية */}
      <motion.div
        key={`ghost-${lineIdx}`}
        aria-hidden
        className={cn(
          "dam-splash-ghost pointer-events-none absolute top-1/2 -translate-y-1/2 font-serif leading-none select-none",
          style.ghost,
          current.side === "center" ? "text-center" : "",
        )}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: visible ? 0.07 : 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {line}
      </motion.div>

      {/* المحتوى */}
      <motion.div
        key={lineIdx}
        className={cn("flex w-full flex-col", style.wrap)}
        initial={{ opacity: 0, x: style.enter, filter: "blur(6px)" }}
        animate={{
          opacity: visible ? 1 : 0,
          x: visible ? 0 : style.enter * -0.4,
          filter: visible ? "blur(0px)" : "blur(4px)",
        }}
        transition={{ duration: FADE_MS / 1000, ease: easeCinema }}
      >
        <span className="mb-3 font-mono text-[10px] tracking-[0.5em] text-gold/70 md:text-xs">
          {String(lineIdx + 1).padStart(2, "0")} / {String(lines.length).padStart(2, "0")}
        </span>

        <div className={cn("relative max-w-[min(92vw,40rem)]", style.text)}>
          {/* brackets كريتيف */}
          <span
            aria-hidden
            className={cn(
              "absolute -top-3 font-mono text-gold/50 text-lg leading-none",
              current.side === "left" ? "start-0" : current.side === "right" ? "end-0" : "start-1/2 -translate-x-1/2",
            )}
          >
            {current.side === "left" ? "⌜" : current.side === "right" ? "⌝" : "◆"}
          </span>

          <p
            dir="rtl"
            className={cn(
              "dam-splash-headline text-balance leading-[1.15] tracking-tight",
              current.highlight
                ? "dam-splash-highlight text-4xl font-semibold sm:text-5xl md:text-7xl"
                : "text-3xl font-medium text-white sm:text-4xl md:text-6xl",
              style.text,
            )}
          >
            {text}
            <span
              className="ms-2 inline-block h-[0.85em] w-[3px] animate-pulse bg-gold align-middle"
              aria-hidden
            />
          </p>

          <motion.span
            className={cn(
              "mt-4 block h-[2px] bg-gradient-to-l from-gold via-gold/60 to-transparent",
              current.side === "center" ? "mx-auto w-32" : "w-24 md:w-36",
              current.side === "left" ? "ms-0 me-auto" : current.side === "right" ? "ms-auto me-0" : "",
            )}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: visible ? 1 : 0 }}
            transition={{ duration: 0.5, ease: easeCinema }}
            style={{ transformOrigin: current.side === "right" ? "right" : current.side === "left" ? "left" : "center" }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export function LoadingScreen() {
  const { setLoaded } = useApp();
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(true);
  const [done, setDone] = useState(false);
  const [phase, setPhase] = useState<"open" | "type" | "hold" | "close">("open");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    try {
      sessionStorage.setItem(SPLASH_KEY, "1");
    } catch {
      /* private browsing */
    }
    setPhase("close");
    setShow(false);
  }, []);

  const skipSplash = useCallback(() => {
    setDone(true);
    setLoaded(true);
  }, [setLoaded]);

  const onTypeComplete = useCallback(() => {
    setPhase("hold");
    timerRef.current = setTimeout(finish, AFTER_LINES_MS);
  }, [finish]);

  useEffect(() => {
    const seen = sessionStorage.getItem(SPLASH_KEY) === "1";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduced) {
      skipSplash();
      return;
    }

    setMounted(true);
    const typeTimer = setTimeout(() => setPhase("type"), 800);

    return () => {
      clearTimeout(typeTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [skipSplash]);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = show ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted, show]);

  if (!mounted || done) return null;

  const barHeight = phase === "open" ? "44%" : phase === "close" ? "52%" : "6%";

  return createPortal(
    <AnimatePresence mode="wait" onExitComplete={skipSplash}>
      {show && (
        <motion.button
          key="splash"
          type="button"
          aria-label="تخطي المقدمة"
          onClick={finish}
          className="fixed inset-0 z-[99999] cursor-pointer border-0 bg-black p-0 outline-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_MS / 1000, ease: easeCinema }}
        >
          <div aria-hidden className="dam-splash-grain pointer-events-none absolute inset-0 opacity-[0.04]" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"
          />

          {/* خطوط جانبية */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute start-[8%] top-0 z-[5] h-full w-px bg-gradient-to-b from-transparent via-gold/25 to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1, ease: easeCinema }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute end-[8%] top-0 z-[5] h-full w-px bg-gradient-to-b from-transparent via-gold/25 to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: easeCinema }}
          />

          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.14)_0%,transparent_50%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "close" ? 0 : 1 }}
            transition={{ duration: 0.9 }}
          />

          <motion.div
            aria-hidden
            className="absolute inset-x-0 top-0 z-20 bg-black"
            animate={{ height: barHeight }}
            transition={{ duration: phase === "close" ? 0.55 : 0.85, ease: easeCinema }}
          />
          <motion.div
            aria-hidden
            className="absolute inset-x-0 bottom-0 z-20 bg-black"
            animate={{ height: barHeight }}
            transition={{ duration: phase === "close" ? 0.55 : 0.85, ease: easeCinema }}
          />

          {/* لوجو فوق */}
          <motion.div
            className="absolute start-1/2 top-[max(1.25rem,env(safe-area-inset-top))] z-30 -translate-x-1/2"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: phase === "close" ? 0 : 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeCinema }}
          >
            <LogoMark
              size="md"
              priority
              className="dam-splash-glow border-gold/25 shadow-[0_0_40px_rgba(201,162,39,0.2)]"
            />
          </motion.div>

          <SplashTypewriter
            lines={HOOK_LINES}
            active={phase === "type" || phase === "hold"}
            onComplete={onTypeComplete}
          />

          {/* sweep */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 start-0 z-[15] w-2/5 bg-gradient-to-l from-transparent via-white/[0.05] to-transparent -skew-x-12"
            initial={{ x: "-130%" }}
            animate={{ x: "280%" }}
            transition={{ delay: 0.2, duration: 1.4, ease: easeCinema }}
          />

          {/* تخطي */}
          <motion.span
            className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] start-1/2 z-30 -translate-x-1/2 text-[10px] tracking-[0.35em] text-white/25 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.2 }}
          >
            اضغط للتخطي
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>,
    document.body,
  );
}
