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
}

export default function ConditionalLayout({
  children,
  categories,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <>
      <Header categories={categories} />
      {children}
      <ButtonToTop />
      <Footer />
    </>
  );
}
