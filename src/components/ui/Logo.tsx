import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const LOGO_SRC = "/logo.png";
export const LOGO_ALT = "DAM Properties";

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
  splash: 112,
} as const;

export type LogoSize = keyof typeof sizeMap;

type LogoProps = {
  size?: LogoSize;
  showTagline?: boolean;
  tagline?: string;
  href?: string | false;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  taglineClassName?: string;
};

export function Logo({
  size = "md",
  showTagline = false,
  tagline = "عقارات فاخرة",
  href = "/",
  className,
  imageClassName,
  priority = false,
  taglineClassName,
}: LogoProps) {
  const px = sizeMap[size];

  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full border border-gold/30 bg-white shadow-[0_0_20px_rgba(201,162,39,0.12)]",
          size === "splash" && "dam-splash-glow border-gold/40 shadow-[0_0_40px_rgba(201,162,39,0.25)]",
        )}
        style={{ width: px, height: px }}
      >
        <Image
          src={LOGO_SRC}
          alt={LOGO_ALT}
          width={px}
          height={px}
          priority={priority}
          className={cn("h-full w-full object-cover", imageClassName)}
        />
      </span>
      {showTagline ? (
        <span className="min-w-0">
          <span className="sr-only">{LOGO_ALT}</span>
          {tagline ? (
            <span
              className={cn(
                "block text-[9px] tracking-[0.3em] text-black/40 sm:text-[10px] sm:tracking-[0.35em]",
                taglineClassName,
              )}
            >
              {tagline}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );

  if (href === false) return content;

  return (
    <Link href={href} className="group shrink-0">
      {content}
    </Link>
  );
}

/** صورة اللوجو فقط — للشاشات والأماكن اللي مش محتاجة لينك */
export function LogoMark({
  size = "md",
  className,
  imageClassName,
  priority = false,
}: Pick<LogoProps, "size" | "className" | "imageClassName" | "priority">) {
  const px = sizeMap[size];
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full border border-gold/30 bg-white shadow-[0_0_20px_rgba(201,162,39,0.12)]",
        className,
      )}
      style={{ width: px, height: px }}
    >
      <Image
        src={LOGO_SRC}
        alt={LOGO_ALT}
        width={px}
        height={px}
        priority={priority}
        className={cn("h-full w-full object-cover", imageClassName)}
      />
    </span>
  );
}
