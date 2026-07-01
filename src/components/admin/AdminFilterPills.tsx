import { cn } from "@/lib/utils";

type Option<T extends string> = { id: T; label: string; count?: number };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (id: T) => void;
};

export function AdminFilterPills<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition",
            value === opt.id
              ? "bg-[#0a0a0a] text-white shadow-md"
              : "border border-black/10 bg-white text-black/55 hover:border-gold/40 hover:text-gold",
          )}
        >
          {opt.label}
          {opt.count !== undefined ? (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px]",
                value === opt.id ? "bg-white/20" : "bg-black/5",
              )}
            >
              {opt.count}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
