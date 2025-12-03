import { NextResponse, NextRequest } from 'next/server';
import { getPaginatedGroupedProducts } from '@/lib/product-cache';

/**
 * OPTIMIZED API endpoint with server-side pagination
 * Returns ONLY the products needed for the current page (e.g., 32 products)
 * instead of ALL products for a category (e.g., 500 products)
 *
 * This dramatically reduces:
 * - Network transfer size
 * - JSON parsing time on client
 * - Memory usage on client
 * - Initial render time
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const decodedCategoryId = decodeURIComponent(categoryId);

    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '32', 10);

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    console.log(`[API Paginated] Fetching page ${page} (limit ${limit}) for category: ${decodedCategoryId}`);
    const startTime = Date.now();

    // Get paginated products from cache (FAST!)
    const result = await getPaginatedGroupedProducts(
      decodedCategoryId,
      page,
      limit,
      "sr-Latin-CS"
    );

    const duration = Date.now() - startTime;
    console.log(
      `[API Paginated] Returned ${result.products.length} products ` +
      `(page ${result.page}/${result.totalPages}, total: ${result.total}) in ${duration}ms`
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API Paginated] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
