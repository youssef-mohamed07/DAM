import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const LOGO_SRC = "/logo.png";
export const LOGO_ALT = "DAM Properties";

const sizeMap = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 64,
  xl: 88,
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

function LogoImage({
  px,
  priority,
  imageClassName,
  className,
}: {
  px: number;
  priority?: boolean;
  imageClassName?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black shadow-[0_0_24px_rgba(0,0,0,0.15)]",
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
        className={cn("h-full w-full object-contain p-1", imageClassName)}
      />
    </span>
  );
}

export function Logo({
  size = "md",
  showTagline = false,
  tagline = "DAM Properties",
  href = "/",
  className,
  imageClassName,
  priority = false,
  taglineClassName,
}: LogoProps) {
  const px = sizeMap[size];

  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoImage px={px} priority={priority} imageClassName={imageClassName} />
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
    <Link href={href} className="group shrink-0 transition hover:opacity-90">
      {content}
    </Link>
  );
}

export function LogoMark({
  size = "md",
  className,
  imageClassName,
  priority = false,
}: Pick<LogoProps, "size" | "className" | "imageClassName" | "priority">) {
  const px = sizeMap[size];
  return (
    <LogoImage
      px={px}
      priority={priority}
      imageClassName={imageClassName}
      className={className}
    />
  );
}
