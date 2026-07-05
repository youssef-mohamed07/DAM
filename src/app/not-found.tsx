import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-serif text-8xl font-light text-gold/30">404</p>
      <h1 className="mt-4 font-serif text-2xl text-[#0a0a0a] sm:text-3xl">
        الصفحة غير موجودة
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-black/50">
        الرابط اللي فتحته مش موجود في موقع DAM Properties. ارجع للصفحة الرئيسية أو
        تصفّح العقارات.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-black shadow-[0_4px_20px_rgba(201,162,39,0.35)] transition hover:brightness-110"
        >
          <Home className="h-4 w-4" />
          الصفحة الرئيسية
        </Link>
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-sm font-medium text-[#0a0a0a] transition hover:border-gold/40 hover:text-gold"
        >
          <Search className="h-4 w-4" />
          العقارات
        </Link>
      </div>
    </div>
  );
}
