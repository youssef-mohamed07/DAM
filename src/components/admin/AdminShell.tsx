"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Building2,
  LogOut,
  Menu,
  Bell,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { icon: LayoutDashboard, label: "لوحة التحكم", href: "/admin" },
  { icon: Building2, label: "العقارات", href: "/admin/properties" },
  { icon: MessageSquare, label: "العملاء", href: "/admin/leads" },
  { icon: MessageCircle, label: "واتساب", href: "/admin/whatsapp" },
  { icon: Users, label: "فريق المبيعات", href: "/admin/sales" },
  { icon: ExternalLink, label: "الموقع", href: "/", external: true },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const Sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/8 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/40 bg-gold/10 font-serif text-gold">
            D
          </div>
          <div>
            <div className="font-serif text-lg tracking-[0.15em] text-white">DAM</div>
            <div className="text-[9px] tracking-[0.35em] text-white/35 uppercase">Admin Panel</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {nav.map((item) => {
          const active =
            !item.external &&
            (item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href));

          const className = cn(
            "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition",
            active
              ? "bg-gold/15 font-medium text-gold shadow-[inset_0_0_0_1px_rgba(201,162,39,0.2)]"
              : "text-white/55 hover:bg-white/5 hover:text-white",
          );

          if (item.external) {
            return (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
                <item.icon className="h-4 w-4" />
                {item.label}
                <ExternalLink className="ms-auto h-3 w-3 opacity-40" />
              </a>
            );
          }

          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={className}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/8 p-4">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/50 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-clip admin-main-bg">
      <aside className="hidden w-64 shrink-0 bg-[#0c0c0c] lg:block">{Sidebar}</aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} aria-label="إغلاق" />
          <aside className="absolute start-0 top-0 h-full w-72 bg-[#0c0c0c] shadow-2xl">{Sidebar}</aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex min-w-0 items-center justify-between border-b border-black/8 bg-white/90 px-3 py-3 backdrop-blur-md sm:px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button type="button" className="rounded-lg border border-black/10 p-2 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="القائمة">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-sm font-semibold text-[#0a0a0a]">لوحة تحكم DAM</p>
              <p className="text-[11px] text-black/40">مرحباً، Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-[10px] font-medium text-gold sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              متصل
            </span>
            <button type="button" className="rounded-lg border border-black/10 p-2 text-black/50" aria-label="إشعارات">
              <Bell className="h-4 w-4" />
            </button>
            <button type="button" onClick={logout} className="hidden rounded-lg border border-black/10 px-3 py-2 text-xs text-black/55 sm:block hover:border-red-200 hover:text-red-500">
              خروج
            </button>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-clip p-3 sm:p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
