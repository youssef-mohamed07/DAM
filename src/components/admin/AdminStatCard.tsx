import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  accent?: "gold" | "blue" | "emerald" | "purple";
};

const accents = {
  gold: "from-gold/20 via-gold/5 to-white border-gold/15",
  blue: "from-blue-500/15 via-blue-500/5 to-white border-blue-500/10",
  emerald: "from-emerald-500/15 via-emerald-500/5 to-white border-emerald-500/10",
  purple: "from-purple-500/15 via-purple-500/5 to-white border-purple-500/10",
};

const iconBg = {
  gold: "bg-gold/15 text-gold",
  blue: "bg-blue-500/10 text-blue-600",
  emerald: "bg-emerald-500/10 text-emerald-600",
  purple: "bg-purple-500/10 text-purple-600",
};

export function AdminStatCard({ label, value, icon: Icon, trend, accent = "gold" }: Props) {
  return (
    <div
      className={cn(
        "admin-stat-card relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5",
        accents[accent],
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconBg[accent])}>
          <Icon className="h-5 w-5" />
        </div>
        {trend ? (
          <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-black/45">
            {trend}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-[#0a0a0a]">{value}</p>
      <p className="mt-0.5 text-sm text-black/50">{label}</p>
    </div>
  );
}
