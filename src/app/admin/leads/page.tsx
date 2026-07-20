"use client";

import { Suspense } from "react";
import AdminLeadsContent from "./LeadsContent";

export default function AdminLeadsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-3 py-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="admin-shimmer h-28" />
          ))}
        </div>
      }
    >
      <AdminLeadsContent />
    </Suspense>
  );
}
