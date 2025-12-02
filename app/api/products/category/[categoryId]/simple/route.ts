import { NextResponse } from 'next/server';
import { getCachedProducts, getCachedCategories } from '@/lib/product-cache';
import { groupProductsByBaseId } from '@/lib/product-grouping';

/**
 * Server-side paginated API endpoint
 * Returns only the requested page of GROUPED products for fast loading
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const decodedCategoryId = decodeURIComponent(categoryId);

    // Get pagination params from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '32');

    console.log(`[API Paginated] Category: ${decodedCategoryId}, Page: ${page}, Limit: ${limit}`);
    const startTime = Date.now();

    // Fetch from cache (instant if already cached, ~30min TTL)
    const [allProducts, allCategories] = await Promise.all([
      getCachedProducts("sr-Latin-CS"),
      getCachedCategories("sr-Latin-CS"),
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

    // GROUP FIRST - before pagination!
    const groupedProducts = groupProductsByBaseId(filteredProducts);

    const totalProducts = groupedProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);

    // Apply pagination to GROUPED products
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = groupedProducts.slice(startIndex, endIndex);

    const duration = Date.now() - startTime;
    console.log(`[API Paginated] Returning ${paginatedProducts.length} GROUPED products of ${totalProducts} (page ${page}/${totalPages}) in ${duration}ms`);

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        productsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    });
  } catch (error) {
    console.error('[API Paginated] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
