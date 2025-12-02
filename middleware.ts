import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Flag to track if warmup has been triggered
let warmupTriggered = false;

export async function middleware(request: NextRequest) {
  // Trigger cache warmup on first request (lazy initialization)
  if (!warmupTriggered) {
    warmupTriggered = true;

    // Import and warmup cache in the background (don't await - let it run async)
    import('@/lib/product-cache').then(({ warmupCacheOnce }) => {
      warmupCacheOnce('sr-Latin-CS').catch(err => {
        console.error('[Middleware] Cache warmup failed:', err);
      });
    });

    console.log('[Middleware] Cache warmup initiated in background');
  }

  return NextResponse.next();
}

// Only run middleware on specific paths to avoid unnecessary overhead
export const config = {
  matcher: [
    '/',
    '/categories/:path*',
    '/products/:path*',
    '/proizvodi-filter',
  ],
};
