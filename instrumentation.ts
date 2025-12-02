/**
 * Next.js Instrumentation
 * This file is executed when the Next.js server starts
 * Perfect for cache warming and initialization tasks
 */

export async function register() {
  // Only run on server, not in Edge runtime
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[Instrumentation] Server starting - warming up cache...');

    // Import cache module dynamically to avoid issues
    const { warmupCacheOnce } = await import('./lib/product-cache');

    // Warm up the cache on server startup
    warmupCacheOnce('sr-Latin-CS').catch((error) => {
      console.error('[Instrumentation] Cache warmup failed:', error);
    });
  }
}
