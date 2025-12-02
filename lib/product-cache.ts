// Server-side product cache to avoid re-fetching all products on every request
import { Product, fetchProducts as apiFetchProducts, fetchCategories as apiFetchCategories, Category } from "./promosolution-api";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// In-memory cache (survives across requests in the same process)
let productsCache: CacheEntry<Product[]> | null = null;
let categoriesCache: CacheEntry<Category[]> | null = null;

// Cache TTL - 30 minutes (in milliseconds)
const CACHE_TTL = 30 * 60 * 1000;

/**
 * Get products from cache or fetch if expired
 */
export async function getCachedProducts(language: string = "sr-Latin-CS"): Promise<Product[]> {
  const now = Date.now();

  if (productsCache && (now - productsCache.timestamp) < CACHE_TTL) {
    return productsCache.data;
  }

  console.log("[Cache] Fetching fresh products from API");
  const products = await apiFetchProducts(language);

  productsCache = {
    data: products,
    timestamp: now,
  };

  return products;
}

/**
 * Get categories from cache or fetch if expired
 */
export async function getCachedCategories(language: string = "sr-Latin-CS"): Promise<Category[]> {
  const now = Date.now();

  if (categoriesCache && (now - categoriesCache.timestamp) < CACHE_TTL) {
    return categoriesCache.data;
  }

  console.log("[Cache] Fetching fresh categories from API");
  const categories = await apiFetchCategories(language);

  categoriesCache = {
    data: categories,
    timestamp: now,
  };

  return categories;
}

/**
 * Manually clear the cache
 */
export function clearProductCache() {
  productsCache = null;
  categoriesCache = null;
}

/**
 * Get cache stats for debugging
 */
export function getCacheStats() {
  const now = Date.now();
  return {
    products: productsCache ? {
      count: productsCache.data.length,
      age: Math.round((now - productsCache.timestamp) / 1000),
      expiresIn: Math.round((CACHE_TTL - (now - productsCache.timestamp)) / 1000),
    } : null,
    categories: categoriesCache ? {
      count: categoriesCache.data.length,
      age: Math.round((now - categoriesCache.timestamp) / 1000),
      expiresIn: Math.round((CACHE_TTL - (now - categoriesCache.timestamp)) / 1000),
    } : null,
  };
}

/**
 * Pre-warm the cache by loading data in the background
 */
export async function warmupCache(language: string = "sr-Latin-CS"): Promise<void> {
  console.log("[Cache Warmup] Starting...");
  const startTime = Date.now();

  try {
    await Promise.all([
      getCachedProducts(language),
      getCachedCategories(language),
    ]);

    const duration = Date.now() - startTime;
    console.log(`[Cache Warmup] Done in ${duration}ms`);
  } catch (error) {
    console.error("[Cache Warmup] Failed:", error);
  }
}

// Track if warmup is in progress
let warmupPromise: Promise<void> | null = null;

/**
 * Warm up cache only once (idempotent)
 */
export function warmupCacheOnce(language: string = "sr-Latin-CS"): Promise<void> {
  if (!warmupPromise) {
    warmupPromise = warmupCache(language);
  }
  return warmupPromise;
}
