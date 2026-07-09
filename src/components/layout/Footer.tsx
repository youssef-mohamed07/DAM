"use client";

import Link from "next/link";
import { Phone, Mail, Send, Share2 } from "lucide-react";
import { facebookUrl } from "@/lib/data/company";
import { Num } from "@/components/ui/Num";
import { Logo } from "@/components/ui/Logo";
import { formatPhoneIntl } from "@/lib/utils";
import { company } from "@/lib/data/company";
import { useLocale } from "@/providers/LocaleProvider";

export function Footer() {
  const { dict, path, company: co } = useLocale();

  const footerLinks = [
    ["/properties", dict.nav.properties],
    ["/dam-family", dict.nav.about],
    ["/districts", dict.nav.districts],
    ["/market", dict.nav.market],
    ["/compare", dict.footer.compare],
    ["/blog", dict.footer.blog],
    ["/contact", dict.nav.contact],
  ] as const;

  return (
    <footer className="border-t border-black/8 bg-white">
      <div className="dam-container py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo size="lg" showTagline tagline={co.name} href={path("/")} />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-black/50">{co.about.lead}</p>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-semibold tracking-widest text-black uppercase">
              {dict.footer.links}
            </h4>
            <ul className="space-y-2 text-sm text-black/55">
              {footerLinks.map(([href, label]) => (
                <li key={href}>
                  <Link href={path(href)} className="transition hover:text-black">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-semibold tracking-widest text-black uppercase">
              {dict.footer.contact}
            </h4>
            <ul className="space-y-3 text-sm text-black/55">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-black" />{" "}
                <Num>{formatPhoneIntl(company.phone)}</Num>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-black" /> {company.email}
              </li>
              <li>
                <a
                  href={facebookUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-black"
                >
                  <Share2 className="h-3.5 w-3.5 text-black" />
                  Facebook · {company.facebookLikes}+ {dict.footer.facebookFollowers}
                </a>
              </li>
              <li>{co.address}</li>
            </ul>
            <div className="mt-5 flex gap-2">
              <input
                type="email"
                placeholder={dict.footer.emailPlaceholder}
                className="flex-1 rounded-lg border border-black/10 bg-ivory px-3 py-2 text-sm text-black outline-none focus:border-black"
              />
              <button
                type="button"
                aria-label={dict.footer.subscribe}
                className="rounded-lg bg-black px-3 text-white"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="dam-divider mt-12" />
        <p className="mt-6 text-center text-xs text-black/35">
          © {new Date().getFullYear()} {co.name}. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
