"use client";

import { MessageCircle } from "lucide-react";
import { usePropertyInterest } from "@/components/leads/usePropertyInterest";

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
  const { open, modal } = usePropertyInterest({
    id: propertyId,
    slug: propertySlug,
    title: propertyTitle,
  });

  return (
    <>
      <button type="button" onClick={open} className={className}>
        {children ?? (
          <>
            <MessageCircle className="h-4 w-4" /> مهتم؟ تواصل
          </>
        )}
      </button>
      {modal}
    </>
  );
}
