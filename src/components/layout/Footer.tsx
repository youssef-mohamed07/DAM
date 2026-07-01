"use client";

import Link from "next/link";
import { Phone, Mail, Send, Share2 } from "lucide-react";
import { company, facebookUrl } from "@/lib/data/company";
import { Num } from "@/components/ui/Num";
import { Logo } from "@/components/ui/Logo";
import { formatPhoneIntl, formatPhoneLocal } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t border-black/8 bg-white">
      <div className="dam-container py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo size="lg" showTagline tagline="عقارات فاخرة" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-black/50">
              {company.about.lead}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-semibold tracking-widest text-gold uppercase">
              روابط
            </h4>
            <ul className="space-y-2 text-sm text-black/55">
              {[
                ["/properties", "العقارات"],
                ["/about", "من نحن"],
                ["/districts", "الأحياء"],
                ["/market", "السوق"],
                ["/compare", "مقارنة"],
                ["/blog", "المقالات"],
                ["/contact", "تواصل"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="transition hover:text-gold">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-semibold tracking-widest text-gold uppercase">
              تواصل
            </h4>
            <ul className="space-y-3 text-sm text-black/55">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-gold" />{" "}
                <Num>{formatPhoneIntl(company.phone)}</Num>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-gold" /> {company.email}
              </li>
              <li>
                <a
                  href={facebookUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-gold"
                >
                  <Share2 className="h-3.5 w-3.5 text-gold" />
                  فيسبوك · {company.facebookLikes}+ متابع
                </a>
              </li>
              <li>{company.address}</li>
            </ul>
            <div className="mt-5 flex gap-2">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 rounded-lg border border-black/10 bg-ivory px-3 py-2 text-sm text-black outline-none focus:border-gold"
              />
              <button
                type="button"
                aria-label="اشتراك"
                className="rounded-lg bg-gold px-3 text-black"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="dam-divider mt-12" />
        <p className="mt-6 text-center text-xs text-black/35">
          © {new Date().getFullYear()} {company.name}. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
