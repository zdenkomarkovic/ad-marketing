import { getCachedProducts } from "@/lib/product-cache";
import GroupedFilteredProductsView from "@/components/GroupedFilteredProductsView";
import { Suspense } from "react";

function ProductsViewSkeleton() {
  return (
    <div className="py-40 bg-background">
      <div className="max-w-[90rem] mx-auto px-4 md:px-8">
        <div className="flex gap-6">
          {/* Sidebar skeleton */}
          <div className="hidden lg:block w-64 xl:w-72">
            <div className="bg-card border border-border rounded-lg p-4 h-[600px] animate-pulse" />
          </div>

          {/* Products skeleton */}
          <div className="flex-1">
            <div className="h-20 bg-card border border-border rounded-lg mb-6 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-lg overflow-hidden border border-border animate-pulse"
                >
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
        </div>
      </div>
    </div>
  );
}

export default async function ProizvodiFilterPage() {
  const products = await getCachedProducts("sr-Latin-CS");

  return (
    <>
      {/* Hero Section */}
      <div className="pt-20 pb-16 bg-gradient-to-b from-primary/10 via-background to-background"></div>

      <Suspense fallback={<ProductsViewSkeleton />}>
        <GroupedFilteredProductsView products={products} />
      </Suspense>
    </>
  );
}
