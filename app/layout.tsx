import ConditionalLayout from "@/components/ConditionalLayout";
import { getCachedCategories, getCachedProducts } from "@/lib/product-cache";
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
  const [categories, products] = await Promise.all([
    getCachedCategories("sr-Latin-CS"),
    getCachedProducts("sr-Latin-CS"),
  ]);

  // Count products per category
  const categoryProductCount = new Map<string, number>();

  products.forEach((product) => {
    // Add main category
    if (product.Category) {
      const categoryId = typeof product.Category === "object" ? product.Category.Id : product.Category;
      categoryProductCount.set(categoryId, (categoryProductCount.get(categoryId) || 0) + 1);
    }
    // Add subcategory
    if (product.SubCategory) {
      const subCategoryId = typeof product.SubCategory === "object" ? product.SubCategory.Id : product.SubCategory;
      categoryProductCount.set(subCategoryId, (categoryProductCount.get(subCategoryId) || 0) + 1);
    }
  });

  // Filter categories to only include those with products or with subcategories that have products
  const filteredCategories = categories.filter((cat) => {
    if (cat.Parent === "*") {
      // Parent category - check if has direct products OR any subcategory with products
      const hasDirectProducts = (categoryProductCount.get(cat.Id) || 0) > 0;
      const hasSubcategoriesWithProducts = categories.some(
        (subcat) => subcat.Parent === cat.Id && (categoryProductCount.get(subcat.Id) || 0) > 0
      );
      return hasDirectProducts || hasSubcategoriesWithProducts;
    } else {
      // Subcategory - only include if it has products
      return (categoryProductCount.get(cat.Id) || 0) > 0;
    }
  });

  // Convert Map to plain object for serialization
  const categoryProductCountObj = Object.fromEntries(categoryProductCount);

  return (
    <html lang="sr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-muted-foreground bg-muted  text-base md:text-xl`}
      >
        <ConditionalLayout categories={filteredCategories} categoryProductCount={categoryProductCountObj}>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
