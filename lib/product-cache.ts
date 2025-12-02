// Server-side product cache to avoid re-fetching all products on every request
import { Product, fetchProducts as apiFetchProducts, fetchCategories as apiFetchCategories, fetchProduct as apiFetchProduct, Category } from "./promosolution-api";

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
 * This significantly improves performance by avoiding repeated API calls
 */
export async function getCachedProducts(language: string = "sr-Latin-CS"): Promise<Product[]> {
  const now = Date.now();

  // Check if cache exists and is still valid
  if (productsCache && (now - productsCache.timestamp) < CACHE_TTL) {
    console.log("[Cache] Returning cached products");
    return productsCache.data;
  }

  console.log("[Cache] Fetching fresh products from API");
  const products = await apiFetchProducts(language);

  // Update cache
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

  // Check if cache exists and is still valid
  if (categoriesCache && (now - categoriesCache.timestamp) < CACHE_TTL) {
    console.log("[Cache] Returning cached categories");
    return categoriesCache.data;
  }

  console.log("[Cache] Fetching fresh categories from API");
  const categories = await apiFetchCategories(language);

  // Update cache
  categoriesCache = {
    data: categories,
    timestamp: now,
  };

  return categories;
}

/**
 * Manually clear the cache (useful for testing or after data updates)
 */
export function clearProductCache() {
  productsCache = null;
  categoriesCache = null;
  console.log("[Cache] Cache cleared");
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
 * This ensures the first user request is fast
 */
export async function warmupCache(language: string = "sr-Latin-CS"): Promise<void> {
  console.log("[Cache Warmup] Starting cache warmup...");
  const startTime = Date.now();

  try {
    // Load both in parallel for faster warmup
    await Promise.all([
      getCachedProducts(language),
      getCachedCategories(language),
    ]);

    const duration = Date.now() - startTime;
    console.log(`[Cache Warmup] ✅ Cache warmed up successfully in ${duration}ms`);
  } catch (error) {
    console.error("[Cache Warmup] ❌ Failed to warm up cache:", error);
  }
}

// Track if warmup is in progress to avoid duplicate warmups
let warmupPromise: Promise<void> | null = null;

/**
 * Warm up cache only once (idempotent)
 * Safe to call multiple times - will only warm up once
 */
export function warmupCacheOnce(language: string = "sr-Latin-CS"): Promise<void> {
  if (!warmupPromise) {
    warmupPromise = warmupCache(language);
  }
  return warmupPromise;
}

/**
 * Get products for a specific category (FAST - only returns filtered products)
 * This is MUCH faster than returning all products and filtering on client
 */
export async function getProductsByCategory(
  categoryId: string,
  language: string = "sr-Latin-CS"
): Promise<Product[]> {
  console.log(`[Cache] Filtering products for category: ${categoryId}`);
  const startTime = Date.now();

  // Get all products from cache (instant if already cached)
  const allProducts = await getCachedProducts(language);
  const allCategories = await getCachedCategories(language);

  // Find the category to check if it's a subcategory
  const category = allCategories.find((c) => c.Id === categoryId);
  const isSubcategory = category?.Parent !== "*";

  // Filter products by category or subcategory
  const filteredProducts = allProducts.filter((product) => {
    let categoryMatch = false;
    if (typeof product.Category === "object" && product.Category !== null) {
      categoryMatch = product.Category.Id === categoryId;
    } else if (typeof product.Category === "string") {
      categoryMatch = product.Category === categoryId;
    }

    let subCategoryMatch = false;
    if (product.SubCategory) {
      if (
        typeof product.SubCategory === "object" &&
        product.SubCategory !== null
      ) {
        subCategoryMatch = product.SubCategory.Id === categoryId;
      } else if (typeof product.SubCategory === "string") {
        subCategoryMatch = product.SubCategory === categoryId;
      }
    }

    // If we're viewing a subcategory, also include products where
    // the parent category matches and no subcategory is specified
    let parentCategoryMatch = false;
    if (isSubcategory && category?.Parent) {
      if (typeof product.Category === "object" && product.Category !== null) {
        parentCategoryMatch = product.Category.Id === category.Parent;
      } else if (typeof product.Category === "string") {
        parentCategoryMatch = product.Category === category.Parent;
      }
    }

    return (
      categoryMatch ||
      subCategoryMatch ||
      (parentCategoryMatch && !product.SubCategory)
    );
  });

  const duration = Date.now() - startTime;
  console.log(`[Cache] Filtered ${filteredProducts.length} products for category ${categoryId} in ${duration}ms`);

  return filteredProducts;
}

/**
 * Check if cache is warm (has data)
 */
export function isCacheWarm(): boolean {
  return productsCache !== null && categoriesCache !== null;
}

/**
 * Get a single product - uses cache if available, otherwise direct API call
 * This provides fast response (~0.4s) even when cache is cold
 */
export async function getProduct(
  productId: string,
  language: string = "sr-Latin-CS"
): Promise<Product | null> {
  const startTime = Date.now();

  // If cache is warm, use it (instant lookup)
  if (productsCache) {
    const product = productsCache.data.find((p) => p.Id === productId);
    if (product) {
      console.log(`[Cache] Found product ${productId} in cache in ${Date.now() - startTime}ms`);
      return product;
    }
  }

  // Cache miss or not warm - fetch directly from API (fast ~0.4s)
  console.log(`[Cache] Product ${productId} not in cache, fetching from API...`);
  const product = await apiFetchProduct(productId, language);
  console.log(`[Cache] Fetched product ${productId} from API in ${Date.now() - startTime}ms`);

  return product;
}
