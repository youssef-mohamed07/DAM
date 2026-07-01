"use client";

import { useState, useCallback } from "react";
import { submitLead } from "@/lib/leads/client";
import { PropertyInterestModal, type InterestFormData } from "@/components/leads/PropertyInterestModal";

type PropertyRef = {
  id: string;
  slug: string;
  title: string;
};

export function usePropertyInterest(property: PropertyRef) {
  const [open, setOpen] = useState(false);

  const submit = useCallback(
    async (data: InterestFormData) => {
      const result = await submitLead({
        source: "property",
        propertyId: property.id,
        propertySlug: property.slug,
        propertyTitle: property.title,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        message: data.message,
        goal: "اهتمام بعقار",
      });

      if (!result) throw new Error("failed");
    },
    [property],
  );

  const modal = (
    <PropertyInterestModal
      open={open}
      onClose={() => setOpen(false)}
      propertyTitle={property.title}
      onSubmit={submit}
    />
  );

  return { open: () => setOpen(true), close: () => setOpen(false), modal };
}
