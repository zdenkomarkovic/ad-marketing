import { getCachedProducts, getCachedCategories } from "@/lib/product-cache";
import { Suspense } from "react";
import dynamic from "next/dynamic";

interface Props {
  params: Promise<{
    categoryId: string;
  }>;
}

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

// Dynamically import the heavy client component
const GroupedFilteredProductsView = dynamic(
  () => import("@/components/GroupedFilteredProductsView"),
  {
    loading: () => <ProductsViewSkeleton />,
  }
);

export default async function CategoryPage({ params }: Props) {
  const { categoryId } = await params;
  const decodedCategoryId = decodeURIComponent(categoryId);

  const allProducts = await getCachedProducts("sr-Latin-CS");
  const allCategories = await getCachedCategories("sr-Latin-CS");

  const category = allCategories.find((c) => c.Id === decodedCategoryId);
  const categoryName = category?.Name || decodedCategoryId;
  const isSubcategory = category?.Parent !== "*";

  // Filter products by category or subcategory
  const filteredProducts = allProducts.filter((product) => {
    let categoryMatch = false;
    if (typeof product.Category === "object" && product.Category !== null) {
      categoryMatch = product.Category.Id === decodedCategoryId;
    } else if (typeof product.Category === "string") {
      categoryMatch = product.Category === decodedCategoryId;
    }

    let subCategoryMatch = false;
    if (product.SubCategory) {
      if (
        typeof product.SubCategory === "object" &&
        product.SubCategory !== null
      ) {
        subCategoryMatch = product.SubCategory.Id === decodedCategoryId;
      } else if (typeof product.SubCategory === "string") {
        subCategoryMatch = product.SubCategory === decodedCategoryId;
      }
    }

    // If we're viewing a subcategory, also include products where
    // the parent category matches and no subcategory is specified
    let parentCategoryMatch = false;
    if (isSubcategory && category?.Parent) {
      if (typeof product.Category === "object" && product.Category !== null) {
        parentCategoryMatch = product.Category.Id === category.Parent;
      } else if (typeof product.Category === "string") {
        parentCategoryMatch = product.Category === category.Parent;
      }
    }

    return (
      categoryMatch ||
      subCategoryMatch ||
      (parentCategoryMatch && !product.SubCategory)
    );
  });

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
