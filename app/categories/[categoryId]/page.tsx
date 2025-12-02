import { getProductsByCategory, getCachedCategories } from "@/lib/product-cache";
import GroupedFilteredProductsView from "@/components/GroupedFilteredProductsView";
import { Suspense } from "react";

interface Props {
  params: Promise<{
    categoryId: string;
  }>;
}

function ProductsViewSkeleton() {
  return (
    <div className="py-8 md:py-12 bg-background">
      <div className="max-w-[90rem] mx-auto px-4 md:px-8">
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
  );
}

export default async function CategoryPage({ params }: Props) {
  const { categoryId } = await params;
  const decodedCategoryId = decodeURIComponent(categoryId);

  // Get categories and filtered products from cache (instant!)
  const [allCategories, filteredProducts] = await Promise.all([
    getCachedCategories("sr-Latin-CS"),
    getProductsByCategory(decodedCategoryId, "sr-Latin-CS"),
  ]);

  const category = allCategories.find((c) => c.Id === decodedCategoryId);
  const categoryName = category?.Name || decodedCategoryId;

  return (
    <>
      {/* Hero Section */}
      <div className="pt-32 pb-10 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="max-w-[80rem] mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-primary">{categoryName}</span>
          </h1>
        </div>
      </div>

      <Suspense fallback={<ProductsViewSkeleton />}>
        <GroupedFilteredProductsView products={filteredProducts} />
      </Suspense>
    </>
  );
}
