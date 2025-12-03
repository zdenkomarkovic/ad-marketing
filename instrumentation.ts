/**
 * Next.js Instrumentation File
 *
 * NOTE: Cache warmup is disabled in instrumentation because Next.js 15
 * runs instrumentation in a separate process from API routes.
 * Cache will be populated on first API request instead.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[Instrumentation] Server ready - cache will populate on first request');
  }
}
