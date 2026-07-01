import type { Metadata, Viewport } from "next";
import { Cairo, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/providers/AppProvider";
import { PropertiesProvider } from "@/providers/PropertiesProvider";
import { FavoritesProvider, CompareProvider } from "@/providers/FavoritesProvider";
import { PublicChrome } from "@/components/layout/PublicChrome";
import { company } from "@/lib/data/company";

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} ${cormorant.variable} min-h-screen font-[family-name:var(--font-cairo)] antialiased`}>
        <AppProvider>
          <PropertiesProvider>
            <FavoritesProvider>
              <CompareProvider>
                <PublicChrome>{children}</PublicChrome>
              </CompareProvider>
            </FavoritesProvider>
          </PropertiesProvider>
        </AppProvider>
      </body>
    </html>
  );
}
