"use client";

import { Phone, MessageCircle, Share2, Building2 } from "lucide-react";
import { company, whatsappUrl, facebookUrl } from "@/lib/data/company";
import { Num } from "@/components/ui/Num";
import { formatPhoneLocal } from "@/lib/utils";
import { useLocale } from "@/providers/LocaleProvider";

export function TrustBar() {
  const { dict, path } = useLocale();

  const items = [
    {
      icon: Phone,
      label: dict.trustBar.call,
      value: formatPhoneLocal(company.phoneLocal),
      href: `tel:${company.phone}`,
      isPhone: true,
    },
    {
      icon: MessageCircle,
      label: dict.trustBar.whatsapp,
      value: dict.trustBar.quickReply,
      href: whatsappUrl(),
    },
    {
      icon: Share2,
      label: dict.trustBar.facebook,
      value: `${company.facebookLikes}+ ${dict.trustBar.followers}`,
      href: facebookUrl(),
      external: true,
    },
    {
      icon: Building2,
      label: dict.trustBar.specialty,
      value: dict.trustBar.obour,
      href: path("/districts"),
    },
  ];

  return (
    <section className="relative z-20 -mt-10 w-full max-w-full overflow-x-clip bg-white pb-4 sm:-mt-14 md:-mt-16">
      <div className="dam-container">
        <div className="dam-trust-bar grid grid-cols-2 overflow-hidden rounded-xl sm:rounded-2xl lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            const className = `group flex flex-col gap-1 px-3 py-4 transition hover:bg-black/5 sm:px-5 sm:py-5 ${
              i > 0 ? "border-t border-black/6 lg:border-t-0 lg:border-s lg:border-black/6" : ""
            } ${i === 1 ? "border-s border-black/6 lg:border-s-0" : ""}`;
            const inner = (
              <>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-black" />
                  <span className="text-[10px] tracking-wider text-black/40 uppercase">
                    {item.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-[#0a0a0a] group-hover:text-black">
                  {item.isPhone ? <Num>{item.value}</Num> : item.value}
                </span>
              </>
            );

            return item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {inner}
              </a>
            ) : (
              <a key={item.label} href={item.href} className={className}>
                {inner}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
