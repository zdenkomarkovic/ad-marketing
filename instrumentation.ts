/**
 * Next.js Instrumentation
 * Warms up cache in background so first user gets fast response
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[Instrumentation] Server starting...');

    // Import dynamically to avoid edge runtime issues
    const { warmupCacheOnce } = await import('@/lib/product-cache');

    // Run warmup in background - don't await to avoid blocking server startup
    warmupCacheOnce().then(() => {
      console.log('[Instrumentation] Cache warmup completed in background');
    }).catch((err) => {
      console.error('[Instrumentation] Cache warmup failed:', err);
    });

    console.log('[Instrumentation] Server ready (cache warming up in background)');
  }
}
