import ProductGrid from "@/components/ProductGrid";
import CategoriesNav from "@/components/CategoriesNav";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<{
    page?: string;
  }>;
}

function CategoriesNavSkeleton() {
  return (
    <nav className="flex justify-center bg-transparent fixed top-20 left-0 right-0 z-[40]">
      <div className="w-[80rem] mx-auto px-4 md:px-8">
        <div className="hidden md:flex justify-between items-center min-w-full py-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-8 w-20 bg-muted/50 rounded animate-pulse" />
          ))}
        </div>
        <div className="md:hidden py-3">
          <div className="h-10 w-48 bg-muted/50 rounded animate-pulse" />
        </div>
      </div>
    </nav>
  );
}

export default async function ProizvodiPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);

  return (
    <>
      <Suspense fallback={<CategoriesNavSkeleton />}>
        <CategoriesNav />
      </Suspense>
      <div className="">
        <ProductGrid page={page} />
      </div>
    </>
  );
}
