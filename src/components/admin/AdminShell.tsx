"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Building2,
  LogOut,
  Menu,
  Bell,
  ExternalLink,
  Zap,
  Download,
  MessageCircle,
  Kanban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo, LogoMark } from "@/components/ui/Logo";

const nav = [
  { icon: LayoutDashboard, label: "CRM", href: "/admin" },
  { icon: Kanban, label: "العملاء والبايبلاين", href: "/admin/leads" },
  { icon: Zap, label: "التوزيع والإشعارات", href: "/admin/operations" },
  { icon: MessageCircle, label: "واتساب", href: "/admin/whatsapp" },
  { icon: Users, label: "فريق المبيعات", href: "/admin/sales" },
  { icon: Building2, label: "العقارات", href: "/admin/properties" },
  { icon: Download, label: "استيراد تليجرام", href: "/admin/telegram-import" },
  { icon: ExternalLink, label: "الموقع", href: "/", external: true },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [alerts, setAlerts] = useState({ newLeads: 0, unassigned: 0, failed: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/leads/stats", { credentials: "include" }).then((r) =>
        r.ok ? r.json() : null,
      ),
      fetch("/api/admin/operations", { credentials: "include" }).then((r) =>
        r.ok ? r.json() : null,
      ),
    ])
      .then(([stats, ops]) => {
        setAlerts({
          newLeads: stats?.byStatus?.new ?? 0,
          unassigned: ops?.unassigned ?? 0,
          failed: ops?.notifications?.failed ?? 0,
        });
      })
      .catch(() => setAlerts({ newLeads: 0, unassigned: 0, failed: 0 }));
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const alertCount = alerts.unassigned + alerts.failed + alerts.newLeads;

  const Sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/8 px-5 py-5">
        <Logo
          size="sm"
          href="/admin"
          showTagline
          tagline="CRM"
          taglineClassName="text-white/40 text-xs tracking-[0.2em] uppercase"
        />
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {nav.map((item) => {
          const active =
            !item.external &&
            (item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href));

          const className = cn(
            "flex items-center gap-3 px-3 py-2.5 text-sm transition",
            active
              ? "bg-white/10 font-medium text-white"
              : "text-white/55 hover:bg-white/5 hover:text-white",
          );

          if (item.external) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                <ExternalLink className="ms-auto h-3 w-3 opacity-40" />
              </a>
            );
          }

          const badge =
            item.href === "/admin/leads"
              ? alerts.newLeads
              : item.href === "/admin"
                ? alerts.unassigned
                : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={className}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {badge > 0 ? (
                <span className="ms-auto bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/8 p-3">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-white/50 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-clip admin-main-bg">
      <aside className="hidden w-60 shrink-0 bg-[#121212] lg:block">{Sidebar}</aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-label="إغلاق"
          />
          <aside className="absolute start-0 top-0 h-full w-72 bg-[#121212] shadow-2xl">
            {Sidebar}
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex min-w-0 items-center justify-between border-b border-black/8 bg-white/95 px-3 py-3 sm:px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="border border-black/10 p-2 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="القائمة"
            >
              <Menu className="h-5 w-5" />
            </button>
            <LogoMark size="xs" className="hidden sm:inline-flex" />
            <div>
              <p className="text-sm font-semibold text-[#121212]">DAM CRM</p>
              <p className="text-[11px] text-black/40">إدارة العملاء والمبيعات</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="relative border border-black/10 p-2 text-black/50 transition hover:border-black/25 hover:text-black"
              aria-label="تنبيهات"
              title={
                alertCount
                  ? `${alerts.unassigned} بدون مندوب · ${alerts.newLeads} جديد · ${alerts.failed} إشعار فاشل`
                  : "لا تنبيهات"
              }
            >
              <Bell className="h-4 w-4" />
              {alertCount > 0 ? (
                <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-red-500 px-1 text-[9px] font-bold text-white">
                  {alertCount > 99 ? "99+" : alertCount}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              onClick={logout}
              className="hidden border border-black/10 px-3 py-2 text-xs text-black/55 transition hover:border-red-200 hover:text-red-500 sm:block"
            >
              خروج
            </button>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-clip p-3 sm:p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
