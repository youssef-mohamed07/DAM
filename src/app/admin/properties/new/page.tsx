"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PropertyForm } from "@/components/admin/PropertyForm";

export default function NewPropertyPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/admin/properties" className="inline-flex items-center gap-2 text-sm text-black/45 hover:text-gold">
        <ArrowRight className="h-4 w-4" />
        العودة للعقارات
      </Link>
      <AdminPageHeader title="إضافة عقار جديد" description="املأ البيانات وانشر العقار على الموقع" />
      <PropertyForm
        submitLabel="نشر العقار"
        onSubmit={async (data) => {
          const res = await fetch("/api/admin/properties", {
            method: "POST",
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
