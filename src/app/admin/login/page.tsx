import { Suspense } from "react";
import AdminLoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080808]" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
