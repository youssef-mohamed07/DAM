import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; href: string };
};

export function AdminEmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="admin-empty flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 bg-white/60 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10">
        <Icon className="h-7 w-7 text-gold/60" />
      </div>
      <p className="mt-4 font-medium text-[#0a0a0a]">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-sm text-black/45">{description}</p> : null}
      {action ? (
        <Link
          href={action.href}
          className="mt-5 inline-flex rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-black transition hover:brightness-110"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
