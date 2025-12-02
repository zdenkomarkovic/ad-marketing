import ConditionalLayout from "@/components/ConditionalLayout";
import { getCachedCategories } from "@/lib/product-cache";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "S.Z.T.R. AD-MARKETING - Reklamni materijal, veleprodaja i maloprodaja",
  description: "S.Z.T.R. AD-MARKETING - 17 godina iskustva u štampanju i prodaji reklamnog materijala. Sito štampa, vez, tampon štampa, zlatotisak. Veleprodaja i maloprodaja.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  keywords: [
    "reklamni materijal",
    "veleprodaja",
    "maloprodaja",
    "sito štampa",
    "vez",
    "tampon štampa",
    "zlatotisak",
    "AD-MARKETING",
    "štampanje",
    "promocija",
    "brendiranje",
    "reklamne usluge",
  ],
  alternates: {
    canonical: "https://www.adm.rs/",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Only fetch categories - fast and lightweight!
  const categories = await getCachedCategories("sr-Latin-CS");

  return (
    <html lang="sr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-muted-foreground bg-muted  text-base md:text-xl`}
      >
        <ConditionalLayout categories={categories}>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
