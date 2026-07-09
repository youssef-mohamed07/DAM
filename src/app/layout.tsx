import type { Metadata, Viewport } from "next";
import { Cairo, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/providers/AppProvider";
import { LocaleProvider } from "@/providers/LocaleProvider";
import { PropertiesProvider } from "@/providers/PropertiesProvider";
import { FavoritesProvider, CompareProvider } from "@/providers/FavoritesProvider";
import { PublicChrome } from "@/components/layout/PublicChrome";
import { company } from "@/lib/data/company";
import { LOGO_ALT, LOGO_SRC } from "@/components/ui/Logo";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080808",
};

export const metadata: Metadata = {
  title: `${company.name} | ${company.tagline}`,
  description: company.about.lead,
  keywords: [
    "عقارات العبور",
    "جولف سيتي العبور",
    "روك فيلا",
    "ريفيل العبور",
    "زغلول هولدينج",
    "DAM Properties",
    "وساطة عقارية",
  ],
  icons: {
    icon: [{ url: LOGO_SRC, type: "image/png" }],
    shortcut: LOGO_SRC,
    apple: LOGO_SRC,
  },
  openGraph: {
    title: company.name,
    description: company.tagline,
    images: [{ url: LOGO_SRC, width: 500, height: 500, alt: LOGO_ALT }],
  },
  twitter: {
    card: "summary",
    title: company.name,
    description: company.tagline,
    images: [LOGO_SRC],
  },
  appleWebApp: {
    title: company.name,
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} ${cormorant.variable} min-h-screen font-[family-name:var(--font-cairo)] antialiased`}>
        <AppProvider>
          <LocaleProvider>
            <PropertiesProvider>
              <FavoritesProvider>
                <CompareProvider>
                  <PublicChrome>{children}</PublicChrome>
                </CompareProvider>
              </FavoritesProvider>
            </PropertiesProvider>
          </LocaleProvider>
        </AppProvider>
      </body>
    </html>
  );
}
