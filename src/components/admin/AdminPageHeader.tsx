import Link from "next/link";
import { Plus } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  badge?: string;
  action?: { label: string; href: string };
};

export function AdminPageHeader({ title, description, badge, action }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/6 bg-white px-6 py-6 shadow-sm">
      <div className="absolute -start-8 -top-8 h-32 w-32 rounded-full bg-gold/8 blur-2xl" />
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          {badge ? (
            <span className="admin-section-title mb-2 block">{badge}</span>
          ) : null}
          <h1 className="text-2xl font-bold text-[#0a0a0a] lg:text-3xl">{title}</h1>
          {description ? <p className="mt-1.5 text-sm leading-relaxed text-black/50">{description}</p> : null}
        </div>
        {action ? (
          <Link
            href={action.href}
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            {action.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
