import { NextResponse } from 'next/server';
import { getCacheStats } from '@/lib/product-cache';

/**
 * API endpoint to get cache statistics
 * Returns information about cache status, size, and expiration
 */
export async function GET() {
  const stats = getCacheStats();

  return NextResponse.json({
    success: true,
    stats,
    status: {
      products: stats.products ? 'cached' : 'not cached',
      categories: stats.categories ? 'cached' : 'not cached',
    },
  });
}
