"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError("اسم المستخدم أو كلمة المرور غير صحيحة");
        return;
      }

      const from = searchParams.get("from") || "/admin";
      router.push(from);
      router.refresh();
    } catch {
      setError("حدث خطأ — حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute -start-32 top-20 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 font-serif text-xl text-gold shadow-[0_0_40px_rgba(201,162,39,0.2)]">
            D
          </div>
          <h1 className="font-serif text-2xl tracking-[0.2em] text-white">DAM</h1>
          <p className="mt-2 text-sm text-white/45">لوحة التحكم — دخول المسؤولين فقط</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center gap-2 text-gold">
            <Shield className="h-4 w-4" />
            <span className="text-xs font-semibold tracking-widest uppercase">تسجيل الدخول</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs text-white/40">اسم المستخدم</label>
              <div className="relative">
                <User className="absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-gold/60" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pe-4 ps-10 text-sm text-white outline-none transition focus:border-gold/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs text-white/40">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-gold/60" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pe-10 ps-10 text-sm text-white outline-none transition focus:border-gold/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute top-1/2 end-3 -translate-y-1/2 text-white/30 hover:text-white/60"
                  aria-label={showPass ? "إخفاء" : "إظهار"}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-center text-xs text-red-400">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-gold py-3.5 text-sm font-bold text-black transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "جاري الدخول…" : "دخول لوحة التحكم"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-white/25">
          DAM Properties · مدينة العبور
        </p>
      </motion.div>
    </div>
  );
}
