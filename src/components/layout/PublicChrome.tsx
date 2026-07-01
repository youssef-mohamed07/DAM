"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { useApp } from "@/providers/AppProvider";
import { cn } from "@/lib/utils";

export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loaded } = useApp();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <LoadingScreen />
      <div
        className={cn(
          "w-full max-w-full overflow-x-clip transition-opacity duration-500",
          loaded ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <Navbar />
        <main className="w-full max-w-full min-w-0 overflow-x-clip">{children}</main>
        <Footer />
      </div>
    </>
  );
}
