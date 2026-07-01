import { cn } from "@/lib/utils";

/** يعرض أرقاماً وهواتفاً وأسعاراً باتجاه LTR صحيح داخل واجهة عربية */
export function Num({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("ltr-num", className)}>{children}</span>;
}
