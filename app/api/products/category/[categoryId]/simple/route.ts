import { NextResponse } from 'next/server';
import { fetchProducts, fetchCategories } from '@/lib/promosolution-api';

/**
 * Simple API endpoint - fetches products directly like the other site
 * No caching, straightforward approach
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const decodedCategoryId = decodeURIComponent(categoryId);

    console.log(`[API Simple] Fetching products for category: ${decodedCategoryId}`);
    const startTime = Date.now();

    // Fetch everything directly (like the other site)
    const [allProducts, allCategories] = await Promise.all([
      fetchProducts("sr-Latin-CS"),
      fetchCategories("sr-Latin-CS"),
    ]);

    const category = allCategories.find((c) => c.Id === decodedCategoryId);
    const isSubcategory = category?.Parent !== "*";

    // Filter products for this category
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

    const duration = Date.now() - startTime;
    console.log(`[API Simple] Filtered ${filteredProducts.length} products in ${duration}ms`);

    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error('[API Simple] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
