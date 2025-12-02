import { NextResponse } from 'next/server';
import { getProductsByCategory } from '@/lib/product-cache';
import { groupProductsByBaseId } from '@/lib/product-grouping';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const { searchParams } = new URL(request.url);

    // Get pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24'); // Load 24 products at once

    console.log(`[API] Fetching category ${categoryId}, page ${page}, limit ${limit}`);

    // Get all products for this category from cache (fast!)
    const categoryProducts = await getProductsByCategory(decodeURIComponent(categoryId));

    // Group products by base ID (merge variants)
    const groupedProducts = groupProductsByBaseId(categoryProducts);

    // Calculate pagination
    const total = groupedProducts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Get products for this page
    const paginatedProducts = groupedProducts.slice(startIndex, endIndex);

    console.log(`[API] Returning ${paginatedProducts.length} products (${startIndex}-${endIndex} of ${total})`);

    return NextResponse.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('[API] Error fetching category products:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
