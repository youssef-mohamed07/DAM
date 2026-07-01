"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PropertyForm } from "@/components/admin/PropertyForm";
import type { Property } from "@/types";

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    fetch(`/api/admin/properties/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then(setProperty);
  }, [id]);

  if (!property) {
    return <p className="py-20 text-center text-black/40">جاري التحميل…</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/admin/properties" className="inline-flex items-center gap-2 text-sm text-black/45 hover:text-gold">
        <ArrowRight className="h-4 w-4" />
        العودة للعقارات
      </Link>
      <AdminPageHeader title="تعديل العقار" description={property.title.ar} />
      <PropertyForm
        initial={property}
        submitLabel="حفظ التعديلات"
        onSubmit={async (data) => {
          const res = await fetch(`/api/admin/properties/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("fail");
          router.push("/admin/properties");
        }}
      />
    </div>
  );
}
