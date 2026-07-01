"use client";

import { Phone, MessageCircle, Share2, Building2 } from "lucide-react";
import { company, whatsappUrl, facebookUrl } from "@/lib/data/company";
import { Num } from "@/components/ui/Num";
import { formatPhoneLocal } from "@/lib/utils";

const items = [
  {
    icon: Phone,
    label: "اتصل الآن",
    value: formatPhoneLocal(company.phoneLocal),
    href: `tel:${company.phone}`,
  },
  {
    icon: MessageCircle,
    label: "واتساب",
    value: "رد سريع",
    href: whatsappUrl(),
  },
  {
    icon: Share2,
    label: "فيسبوك",
    value: `${company.facebookLikes}+ متابع`,
    href: facebookUrl(),
    external: true,
  },
  {
    icon: Building2,
    label: "تخصصنا",
    value: "مدينة العبور",
    href: "/districts",
  },
];

export function TrustBar() {
  return (
    <section className="relative z-20 -mt-14 bg-white pb-4 md:-mt-16">
      <div className="dam-container">
        <div className="dam-trust-bar grid grid-cols-2 overflow-hidden rounded-2xl lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            const className = `group flex flex-col gap-1 px-5 py-5 transition hover:bg-gold/5 ${
              i > 0 ? "border-t border-black/6 lg:border-t-0 lg:border-s lg:border-black/6" : ""
            } ${i === 1 ? "border-s border-black/6 lg:border-s-0" : ""}`;
            const inner = (
              <>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-gold" />
                  <span className="text-[10px] tracking-wider text-black/40 uppercase">
                    {item.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-[#0a0a0a] group-hover:text-gold">
                  {item.label === "اتصل الآن" ? (
                    <Num>{item.value}</Num>
                  ) : (
                    item.value
                  )}
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
