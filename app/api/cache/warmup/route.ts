import { NextResponse } from 'next/server';
import { warmupCache, getCacheStats } from '@/lib/product-cache';

/**
 * API endpoint to manually trigger cache warmup
 * Useful for:
 * - Health checks
 * - Manual cache refresh
 * - Testing
 */
export async function GET() {
  try {
    console.log('[API] Manual cache warmup requested');
    const startTime = Date.now();

    await warmupCache('sr-Latin-CS');

    const duration = Date.now() - startTime;
    const stats = getCacheStats();

    return NextResponse.json({
      success: true,
      message: 'Cache warmed up successfully',
      duration: `${duration}ms`,
      stats,
    });
  } catch (error) {
    console.error('[API] Cache warmup failed:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Cache warmup failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET cache stats without warming up
 */
export async function POST() {
  return GET(); // Just alias POST to GET for convenience
}
