"use client";

interface SectionHeaderProps {
  label: { en: string; ar: string };
  title: { en: string; ar: string };
  description?: { en: string; ar: string };
  align?: "left" | "center";
  light?: boolean;
  inverted?: boolean;
  size?: "default" | "large";
  className?: string;
}

export function SectionHeader({
  label,
  title,
  description,
  align = "left",
  light = false,
  inverted = false,
  size = "default",
  className = "",
}: SectionHeaderProps) {
  const centered = align === "center";
  const titleSize =
    size === "large"
      ? "text-4xl md:text-5xl lg:text-[3.25rem]"
      : "text-3xl md:text-[2.75rem]";
  const onDark = inverted;

  return (
    <header className={`${centered ? "text-center" : ""} ${className}`}>
      <p className="text-[11px] font-semibold tracking-[0.35em] text-gold uppercase">
        {label.ar}
      </p>
      <h2
        className={`font-serif mt-3 leading-[1.12] ${titleSize} ${
          onDark ? "text-white" : "text-[#0a0a0a]"
        }`}
      >
        {title.ar}
      </h2>
      {description && (
        <p
          className={`mt-4 max-w-2xl text-base leading-relaxed md:text-lg ${
            centered ? "mx-auto" : ""
          } ${onDark ? "text-white/55" : "text-black/55"}`}
        >
          {description.ar}
        </p>
      )}
      <div
        className={`dam-divider mt-7 ${centered ? "mx-auto max-w-[140px]" : "max-w-[100px]"}`}
      />
    </header>
  );
}
