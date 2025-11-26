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

function ProductGridSkeleton() {
  return (
    <section className="py-40 bg-background">
      <div className="max-w-[80rem] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-card rounded-lg overflow-hidden border border-border animate-pulse">
              <div className="aspect-square bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-8 bg-muted rounded w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
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
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid page={page} />
      </Suspense>
    </>
  );
}
