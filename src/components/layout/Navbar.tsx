"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  MessageCircle,
  Search,
  ChevronDown,
  Crown,
  Building2,
  Sparkles,
} from "lucide-react";
import { useCompare } from "@/providers/FavoritesProvider";
import {
  districtGroups,
  getDistrictsByGroup,
  premiumDistrictMeta,
  getDistrictOrdinal,
} from "@/lib/data/districts";
import { company, whatsappUrl } from "@/lib/data/company";
import { t, cn } from "@/lib/utils";
import { useApp } from "@/providers/AppProvider";
import { Logo } from "@/components/ui/Logo";

const navLinks = [
  { href: "/properties", label: "العقارات", mega: true },
  { href: "/about", label: "من نحن" },
  { href: "/districts", label: "الأحياء" },
  { href: "/market", label: "السوق" },
  { href: "/contact", label: "تواصل" },
];

export function Navbar() {
  const { loaded } = useApp();
  const pathname = usePathname();
  const { compare } = useCompare();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMega(false);
  }, [pathname]);

  const premiumDistricts = getDistrictsByGroup("premium");
  const residentialDistricts = getDistrictsByGroup("residential");
  const isHomeHero = pathname === "/" && !scrolled;

  return (
    <>
      <motion.header
        initial={false}
        animate={loaded ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 z-50 w-full max-w-full transition-all duration-500",
          scrolled ? "top-2 md:top-3" : "top-3 md:top-5",
          "pt-[env(safe-area-inset-top)]",
        )}
        onMouseLeave={() => setMega(false)}
      >
        <div className="mx-auto w-full max-w-5xl px-3 sm:px-4">
          <div
            className={cn(
              "dam-nav-shell px-3 py-2 transition-all duration-500 md:px-4",
              scrolled && "dam-nav-scrolled",
              isHomeHero && "dam-nav-hero",
            )}
          >
          <div className="flex items-center justify-between gap-3">
            <Logo
              size="sm"
              showTagline
              tagline="عقارات فاخرة"
              taglineClassName={cn(
                "hidden sm:block",
                isHomeHero ? "text-white/50" : "text-black/40",
              )}
              className="ps-1"
              priority
            />

            <nav
              className={cn(
                "hidden items-center rounded-full p-1 lg:flex",
                isHomeHero ? "bg-white/8" : "bg-black/[0.04]",
              )}
            >
              {navLinks.map((link) => {
                const active =
                  link.href === "/properties"
                    ? pathname.startsWith("/properties")
                    : pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative flex items-center gap-1 rounded-full px-4 py-2 text-sm transition-all duration-300",
                      active
                        ? isHomeHero
                          ? "bg-gold/20 text-gold-bright shadow-inner"
                          : "bg-gold/15 text-gold shadow-inner"
                        : isHomeHero
                          ? "text-white/75 hover:bg-white/10 hover:text-white"
                          : "text-black/60 hover:bg-black/[0.04] hover:text-black",
                    )}
                    onMouseEnter={() => link.mega && setMega(true)}
                  >
                    {link.label}
                    {link.mega && <ChevronDown className="h-3 w-3 opacity-60" />}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/properties"
                aria-label="بحث"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border transition hover:border-gold/50 hover:bg-gold/10 hover:text-gold",
                  isHomeHero
                    ? "border-white/15 bg-white/8 text-white/70"
                    : "border-black/10 bg-black/[0.03] text-black/60",
                )}
              >
                <Search className="h-4 w-4" />
              </Link>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-l from-gold to-[#e8d48a] px-4 py-2 text-xs font-semibold text-black shadow-[0_4px_20px_rgba(201,162,39,0.35)] transition hover:brightness-110"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                واتساب
              </a>
              {compare.length > 0 && (
                <Link
                  href="/compare"
                  className="rounded-full border border-gold/40 bg-gold/15 px-3 py-1.5 text-xs font-bold text-gold"
                >
                  {compare.length} مقارنة
                </Link>
              )}
            </div>

            <button
              type="button"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border lg:hidden",
                isHomeHero
                  ? "border-white/15 bg-white/8 text-white"
                  : "border-black/10 bg-black/[0.03] text-black",
              )}
              onClick={() => setOpen(!open)}
              aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          </div>
        </div>

        <AnimatePresence>
          {mega && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onMouseEnter={() => setMega(true)}
              className="mx-auto w-full max-w-5xl px-3 pt-3 sm:px-4"
            >
              <div className="dam-nav-shell dam-nav-scrolled overflow-hidden rounded-3xl !rounded-[1.75rem]">
                <div className="grid gap-0 md:grid-cols-2">
                  <div className="border-b border-black/8 p-5 md:border-b-0 md:border-e">
                    <div className="mb-4 flex items-center gap-2">
                      <Crown className="h-4 w-4 text-gold" />
                      <span className="text-sm font-semibold text-[#0a0a0a]">
                        {districtGroups[0].label}
                      </span>
                      <Sparkles className="h-3 w-3 text-gold/60" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {premiumDistricts.map((d) => {
                        const meta = premiumDistrictMeta[d.id];
                        return (
                          <Link
                            key={d.id}
                            href={`/properties?district=${d.id}`}
                            className="group rounded-xl border border-gold/15 bg-ivory p-3 transition hover:border-gold/40 hover:bg-gold/10"
                          >
                            <span className="text-[9px] tracking-wider text-gold/80">
                              {meta?.badge}
                            </span>
                            <p className="mt-1 text-sm font-medium text-[#0a0a0a] group-hover:text-gold">
                              {t(d.name)}
                            </p>
                            <p className="mt-0.5 text-[10px] text-black/40">
                              من {meta?.priceFrom}
                            </p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-black/40" />
                      <span className="text-sm font-semibold text-[#0a0a0a]">
                        {districtGroups[1].label}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {residentialDistricts.map((d) => (
                        <Link
                          key={d.id}
                          href={`/properties?district=${d.id}`}
                          className="flex flex-col items-center rounded-lg border border-black/8 bg-ivory px-2 py-2.5 text-center transition hover:border-gold/30 hover:bg-gold/5"
                        >
                          <span className="font-serif text-lg text-gold">
                            {getDistrictOrdinal(d.id)}
                          </span>
                          <span className="mt-0.5 text-[10px] leading-tight text-black/60">
                            {t(d.name).replace("الحي ", "")}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/districts"
                      className="mt-4 block text-center text-xs text-gold/80 transition hover:text-gold"
                    >
                      كل الأحياء ←
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-white/95 backdrop-blur-md pt-[calc(5.5rem+env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] lg:hidden"
          >
            <nav className="dam-container flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl border border-black/8 bg-white px-5 py-4 font-serif text-2xl text-[#0a0a0a] shadow-sm"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <a
                href={whatsappUrl()}
                className="mt-4 inline-flex w-fit rounded-full bg-gradient-to-l from-gold to-[#e8d48a] px-6 py-3 text-sm font-semibold text-black"
              >
                واتساب
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
