"use client";

import Link from "next/link";
import { Home, Search } from "lucide-react";
import { useLocale } from "@/providers/LocaleProvider";

export default function NotFound() {
  const { dict, path } = useLocale();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-serif text-8xl font-light text-black/15">404</p>
      <h1 className="mt-4 font-serif text-2xl text-[#0a0a0a] sm:text-3xl">{dict.notFound.title}</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-black/50">{dict.notFound.description}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={path("/")}
          className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition hover:brightness-110"
        >
          <Home className="h-4 w-4" />
          {dict.notFound.home}
        </Link>
        <Link
          href={path("/properties")}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-sm font-medium text-[#0a0a0a] transition hover:border-black/30 hover:text-black"
        >
          <Search className="h-4 w-4" />
          {dict.notFound.properties}
        </Link>
      </div>
    </div>
  );
}
