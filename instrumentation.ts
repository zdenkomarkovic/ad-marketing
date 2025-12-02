/**
 * Next.js Instrumentation
 * Disabled warmup to avoid blocking server startup
 */

export async function register() {
  // Warmup disabled - cache will load on first request
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[Instrumentation] Server ready (cache warmup disabled)');
  }
}
