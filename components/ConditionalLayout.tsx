"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import ButtonToTop from "./ButtonToTop";

interface Category {
  Id: string;
  Name: string;
  Parent: string;
}

interface ConditionalLayoutProps {
  children: React.ReactNode;
  categories: Category[];
  categoryProductCount?: Record<string, number>;
}

export default function ConditionalLayout({
  children,
  categories,
  categoryProductCount,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <>
      <Header categories={categories} categoryProductCount={categoryProductCount} />
      {children}
      <ButtonToTop />
      <Footer />
    </>
  );
}
