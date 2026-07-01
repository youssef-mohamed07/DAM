"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useApp } from "@/providers/AppProvider";
import { IMAGES } from "@/lib/images";
import { company } from "@/lib/data/company";

const EXIT_MS = 750;
const MUSIC_URL =
  "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3";
const MUSIC_VOLUME = 0.18;

const TYPE_MS = 58;
const HOLD_MS = 1100;
const FADE_MS = 500;

const scenes = [
  {
    bg: IMAGES.villa1,
    line: "عقارات تليق بطموحك",
    sub: "مدينة العبور · القاهرة",
  },
  {
    bg: IMAGES.pool,
    line: "فرص استثنائية في أرقى المشاريع",
    sub: "جولف سيتي · روك فيلا · ريفيل",
  },
  {
    bg: IMAGES.modern,
    line: "دي إيه إم للعقارات",
    sub: company.tagline,
    finale: true,
  },
];

type Phase = "typing" | "hold" | "fade";

function TypewriterLine({
  text,
  onDone,
  onProgress,
}: {
  text: string;
  onDone: () => void;
  onProgress: (p: number) => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  const [fade, setFade] = useState(1);

  useEffect(() => {
    setDisplayed("");
    setPhase("typing");
    setFade(1);
  }, [text]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (displayed.length < text.length) {
        timer = setTimeout(() => {
          setDisplayed(text.slice(0, displayed.length + 1));
        }, TYPE_MS);
      } else {
        timer = setTimeout(() => setPhase("hold"), HOLD_MS);
      }
    } else if (phase === "hold") {
      timer = setTimeout(() => setPhase("fade"), 350);
    } else if (fade > 0.02) {
      timer = setTimeout(() => {
        setFade((f) => Math.max(0, f - 0.12));
      }, FADE_MS / 9);
    } else {
      onDone();
    }

    return () => clearTimeout(timer);
  }, [phase, displayed, text, fade, onDone]);

  useEffect(() => {
    const typeW = text.length * TYPE_MS;
    const total = typeW + HOLD_MS + FADE_MS + 350;
    let done = 0;

    if (phase === "typing") done = displayed.length * TYPE_MS;
    else if (phase === "hold") done = typeW + HOLD_MS * 0.5;
    else done = typeW + HOLD_MS + 350 + (1 - fade) * FADE_MS;

    onProgress(Math.min(done / total, 1));
  }, [phase, displayed, text, fade, onProgress]);

  const lastChar = displayed.slice(-1);
  const body = displayed.slice(0, -1);

  return (
    <motion.div
      className="relative min-h-[3.5rem] md:min-h-[4.5rem]"
      animate={{ opacity: fade, y: phase === "fade" ? -10 : 0, filter: `blur(${(1 - fade) * 6}px)` }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <p
        className="max-w-2xl text-balance text-3xl leading-snug font-semibold text-white md:text-5xl"
        dir="rtl"
      >
        {body}
        {lastChar ? (
          <span className="text-gradient-gold">{lastChar}</span>
        ) : null}
        {phase !== "fade" ? (
          <motion.span
            aria-hidden
            className="me-1 inline-block w-[2px] rounded-full bg-gold/80 align-middle"
            style={{ height: "0.75em" }}
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}
      </p>
    </motion.div>
  );
}

export function LoadingScreen() {
  const { setLoaded } = useApp();
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(true);
  const [done, setDone] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scene = scenes[sceneIndex];

  const stopMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const fade = setInterval(() => {
      if (audio.volume > 0.04) {
        audio.volume = Math.max(0, audio.volume - 0.04);
      } else {
        audio.pause();
        clearInterval(fade);
      }
    }, 40);
  }, []);

  const finish = useCallback(() => {
    stopMusic();
    setShow(false);
  }, [stopMusic]);

  const handleSceneDone = useCallback(() => {
    if (sceneIndex < scenes.length - 1) {
      setSceneIndex((i) => i + 1);
      setSceneProgress(0);
    } else {
      finish();
    }
  }, [sceneIndex, finish]);

  const handleProgress = useCallback((p: number) => {
    setSceneProgress(p);
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => stopMusic();
  }, [stopMusic]);

  useEffect(() => {
    if (!mounted || !show) return;

    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    const play = async () => {
      try {
        await audio.play();
        const fadeIn = setInterval(() => {
          if (!audioRef.current) {
            clearInterval(fadeIn);
            return;
          }
          if (audioRef.current.volume < MUSIC_VOLUME) {
            audioRef.current.volume = Math.min(
              MUSIC_VOLUME,
              audioRef.current.volume + 0.02
            );
          } else {
            clearInterval(fadeIn);
          }
        }, 60);
      } catch {
        /* المتصفح قد يمنع التشغيل التلقائي */
      }
    };

    play();
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [mounted, show]);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = show ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted, show]);

  const handleExitComplete = () => {
    setDone(true);
    setLoaded(true);
  };

  const globalProgress = useMemo(() => {
    const base = sceneIndex / scenes.length;
    return Math.min(base + sceneProgress / scenes.length, 1);
  }, [sceneIndex, sceneProgress]);

  if (!mounted || done) return null;

  return createPortal(
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      {show && (
        <motion.div
          key="splash"
          role="status"
          aria-label="جاري تحميل DAM Properties"
          className="fixed inset-0 z-[99999] overflow-hidden bg-[#080808]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* خلفية ناعمة */}
          <div className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={scene.bg}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${scene.bg})` }}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 0.45, scale: 1.08 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/90 via-[#080808]/75 to-[#080808]/95" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#080808_75%)]" />
          </div>

          {/* شعار علوي خفيف */}
          <motion.div
            className="absolute inset-x-0 top-8 z-20 flex justify-center"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <span
              className="font-serif text-sm tracking-[0.45em] text-white/35"
              dir="ltr"
            >
              DAM
            </span>
          </motion.div>

          {/* المحتوى */}
          <div
            className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
            onClick={finish}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={sceneIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                {scene.finale ? (
                  <motion.div
                    className="mb-5 flex items-center gap-2"
                    dir="ltr"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {["D", "A", "M"].map((letter, i) => (
                      <motion.span
                        key={letter}
                        className="dam-splash-logo font-serif text-4xl font-light tracking-[0.3em] text-white/90 md:text-5xl"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </motion.div>
                ) : null}

                <TypewriterLine
                  text={scene.line}
                  onDone={handleSceneDone}
                  onProgress={handleProgress}
                />

                <motion.p
                  className="mt-6 max-w-md text-sm leading-relaxed text-white/40"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: sceneProgress > 0.2 ? 1 : 0,
                    y: sceneProgress > 0.2 ? 0 : 8,
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {scene.sub}
                </motion.p>

                <motion.div
                  className="mt-8 h-px w-16 bg-gradient-to-l from-transparent via-gold/50 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: sceneProgress > 0.1 ? 1 : 0 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* أسفل */}
          <div className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-4 px-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                finish();
              }}
              className="text-[11px] tracking-[0.2em] text-white/30 transition hover:text-gold/80"
            >
              تخطي
            </button>
            <div className="h-px w-full max-w-xs overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full origin-right bg-gold/70"
                style={{ width: `${globalProgress * 100}%` }}
                transition={{ duration: 0.15 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
