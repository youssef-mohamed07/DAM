"use client";

import { MessageCircle } from "lucide-react";
import { submitLead } from "@/lib/leads/client";
import { buildClientWhatsAppMessage } from "@/lib/leads/messages";
import { whatsappUrl } from "@/lib/data/company";

type Props = {
  propertyId: string;
  propertySlug: string;
  propertyTitle: string;
  className?: string;
  children?: React.ReactNode;
};

export function PropertyInquiryButton({
  propertyId,
  propertySlug,
  propertyTitle,
  className,
  children,
}: Props) {
  async function handleClick() {
    await submitLead({
      source: "property",
      propertyId,
      propertySlug,
      propertyTitle,
      message: buildClientWhatsAppMessage({ propertyTitle }),
    });

    const msg = buildClientWhatsAppMessage({ propertyTitle });
    window.open(whatsappUrl(msg), "_blank", "noopener,noreferrer");
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children ?? (
        <>
          <MessageCircle className="h-4 w-4" /> واتساب
        </>
      )}
    </button>
  );
}
