import { Product } from "./promosolution-api";
import { getColorForProductId, getColorNameForProductId } from "./color-mapping";

export interface ProductVariant {
  id: string;
  color?: {
    id: string;
    name: string;
    htmlColor?: string;
  };
  size?: {
    id: string;
    name: string;
  };
  price?: number;
  stock?: number;
  image?: string;
}

export interface GroupedProduct {
  baseId: string;
  name: string;
  category: { id: string; name: string } | string;
  brand?: { id: string } | string;
  description?: string;
  variants: ProductVariant[];
  defaultVariant: ProductVariant;
  minPrice?: number;
  maxPrice?: number;
  availableColors: Array<{ id: string; name: string; htmlColor?: string }>;
  availableSizes: Array<{ id: string; name: string }>;
  model?: Product["Model"];
}

/**
 * Extract base ID from product ID
 *
 * This function handles multiple product ID formats:
 *
 * Format 1 - With dots (dot separates base from color code):
 *   - "11.079.20" -> "11.079"
 *   - "10.182.10" -> "10.182"
 *
 * Format 2 - Without dots (last 2 digits are color code):
 *   - "1018210" -> "10182"
 *   - "1018290" -> "10182"
 *   - "5001090" -> "50010"
 *
 * Format 3 - With size suffix:
 *   - "5001090-XL" -> "50010"
 *   - "10.182.10-XL" -> "10.182"
 *   - "5003830-3XL" -> "50038"
 */
export function getBaseId(productId: string): string {
  let baseId = productId;

  // Step 1: Remove size suffixes
  // Handles:
  // - Combined sizes with letters/numbers: XXL/3XL, XS/S, M/L, 40/44, 45/48 (MUST come first!)
  // - Standard sizes: XS, S, M, L, XL, XXL, etc.
  // - Numeric sizes with X: 3XL, 4XL, 5XL
  // - Decimal sizes: 39.5, 48.5 (shoes)
  // - Numeric sizes: 37, 38, 39, 40-60, 02, 04, 06, 08, 10, 12
  // Order matters - combined patterns must come before single patterns!
  baseId = baseId.replace(/-(XXS|XS|S|M|L|XL|XXL|XXXL|XXXXL|[0-9]XL)\/([A-Z0-9]+)$/i, "");  // Combined letter sizes first
  baseId = baseId.replace(/-\d+\/\d+$/i, "");  // Combined numeric sizes
  baseId = baseId.replace(/-(XXS|XS|S|M|L|XL|XXL|XXXL|XXXXL|[0-9]XL|\d+\.\d+|\d+)$/i, "");  // Single sizes

  // Step 2: Check if ID contains dots (format with dots)
  if (baseId.includes(".")) {
    // Format with dots: remove last segment if it's 1-3 digits
    // Examples:
    // - "11.079.20" -> "11.079"
    // - "10.182.10" -> "10.182"
    const colorCodePattern = /^(.+)\.(\d{1,3})$/;
    const colorMatch = baseId.match(colorCodePattern);
    if (colorMatch) {
      baseId = colorMatch[1];
    }
  } else {
    // Format without dots: remove last 2 digits if ID is at least 5 digits long
    // Examples:
    // - "1018210" (7 digits) -> "10182" (remove last 2)
    // - "1018290" (7 digits) -> "10182" (remove last 2)
    // - "5001090" (7 digits) -> "50010" (remove last 2)
    // - "ABC123" (6 chars) -> "ABC1" (remove last 2 if all digits)

    // Only process if baseId is purely numeric and at least 5 characters
    if (/^\d+$/.test(baseId) && baseId.length >= 5) {
      baseId = baseId.slice(0, -2);
    }
  }

  return baseId;
}

/**
 * Get product ID without size suffix (but keep color code)
 * Used for generating image URLs
 *
 * Examples:
 *   - "5003850-L" -> "5003850"
 *   - "5003830-3XL" -> "5003830"
 *   - "10.182.10-XL" -> "10.182.10"
 *   - "5008290-XS/S" -> "5008290"
 *   - "5812510-XXL/3XL" -> "5812510"
 *   - "5812311-45/48" -> "5812311"
 *   - "5812810-39.5" -> "5812810"
 */
export function getIdWithoutSize(productId: string): string {
  let id = productId;
  // Remove combined sizes first
  id = id.replace(/-(XXS|XS|S|M|L|XL|XXL|XXXL|XXXXL|[0-9]XL)\/([A-Z0-9]+)$/i, "");  // Combined letter sizes
  id = id.replace(/-\d+\/\d+$/i, "");  // Combined numeric sizes
  // Then remove single sizes
  id = id.replace(/-(XXS|XS|S|M|L|XL|XXL|XXXL|XXXXL|[0-9]XL|\d+\.\d+|\d+)$/i, "");
  return id;
}

/**
 * Group products by their base ID
 */
export function groupProductsByBaseId(products: Product[]): GroupedProduct[] {
  const grouped = new Map<string, Product[]>();

  // Group products by base ID
  products.forEach((product) => {
    const baseId = getBaseId(product.Id);
    if (!grouped.has(baseId)) {
      grouped.set(baseId, []);
    }
    grouped.get(baseId)!.push(product);

    // Debug: Log products with specific base IDs
    if (baseId === "10.182" || baseId === "10182") {
      console.log(`[DEBUG] Grouped product ${product.Id} -> base: ${baseId}`);
    }
  });

  // Convert to GroupedProduct array
  const groupedProducts: GroupedProduct[] = [];

  grouped.forEach((variants, baseId) => {
    // Sort variants by ID to have consistent default
    variants.sort((a, b) => a.Id.localeCompare(b.Id));

    const firstVariant = variants[0];

    // Extract unique colors
    const colorsMap = new Map<string, { id: string; name: string; htmlColor?: string }>();
    variants.forEach((v) => {
      if (v.Color) {
        if (typeof v.Color === "object") {
          // Get color from product ID if API doesn't provide htmlColor
          const htmlColor = v.Color.HtmlColor || getColorForProductId(v.Id) || undefined;
          const colorName = getColorNameForProductId(v.Id) || v.Color.Name;

          colorsMap.set(v.Color.Id, {
            id: v.Color.Id,
            name: colorName,
            htmlColor,
          });
        } else if (typeof v.Color === "string") {
          // Handle color as string
          // First try to get color from the color string itself (e.g., "B - PL")
          // Then fallback to extracting from product ID
          const htmlColor = getColorForProductId(v.Color) || getColorForProductId(v.Id) || undefined;
          const colorName = getColorNameForProductId(v.Color) || getColorNameForProductId(v.Id) || v.Color;

          colorsMap.set(v.Color, {
            id: v.Color,
            name: colorName,
            htmlColor,
          });
        }
      }
    });

    // Extract unique sizes
    const sizesMap = new Map<string, { id: string; name: string }>();
    variants.forEach((v) => {
      if (v.Size && v.Size !== "*" && typeof v.Size === "object") {
        sizesMap.set(v.Size.Id, {
          id: v.Size.Id,
          name: v.Size.Id,
        });
      } else if (v.Size && v.Size !== "*" && typeof v.Size === "string") {
        sizesMap.set(v.Size, {
          id: v.Size,
          name: v.Size,
        });
      }
    });

    // Create variant objects
    const productVariants: ProductVariant[] = variants.map((v) => {
      // Calculate total stock from all warehouses
      let totalStock: number | undefined = undefined;
      if (v.Stocks && v.Stocks.length > 0) {
        totalStock = v.Stocks.reduce((sum, stock) => sum + stock.Qty, 0);
      }

      return {
        id: v.Id,
        color: v.Color ?
          (typeof v.Color === "object" ? {
            id: v.Color.Id,
            name: getColorNameForProductId(v.Id) || v.Color.Name,
            htmlColor: v.Color.HtmlColor || getColorForProductId(v.Id) || undefined,
          } : {
            id: v.Color,
            name: getColorNameForProductId(v.Color) || getColorNameForProductId(v.Id) || v.Color,
            htmlColor: getColorForProductId(v.Color) || getColorForProductId(v.Id) || undefined,
          }) : undefined,
        size: v.Size && v.Size !== "*" ?
          (typeof v.Size === "object" ? {
            id: v.Size.Id,
            name: v.Size.Id,
          } : {
            id: v.Size,
            name: v.Size,
          }) : undefined,
        price: v.Price,
        stock: totalStock,
        image: v.Image || `https://apiv2.promosolution.services/content/ModelItem/${getIdWithoutSize(v.Id)}_001.jpg`,
      };
    });

    // Calculate price range
    const prices = variants.filter((v) => v.Price).map((v) => v.Price!);
    const minPrice = prices.length > 0 ? Math.min(...prices) : undefined;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : undefined;

    // Convert Brand to lowercase id format
    let brand: { id: string } | string | undefined;
    if (firstVariant.Brand) {
      if (typeof firstVariant.Brand === "string") {
        brand = firstVariant.Brand;
      } else {
        brand = { id: firstVariant.Brand.Id };
      }
    }

    // Convert Category to lowercase id format
    let category: { id: string; name: string } | string;
    if (typeof firstVariant.Category === "string") {
      category = firstVariant.Category;
    } else {
      category = {
        id: firstVariant.Category.Id,
        name: firstVariant.Category.Name,
      };
    }

    groupedProducts.push({
      baseId,
      name: firstVariant.Name,
      category,
      brand,
      description: firstVariant.Description,
      variants: productVariants,
      defaultVariant: productVariants[0],
      minPrice,
      maxPrice,
      availableColors: Array.from(colorsMap.values()),
      availableSizes: Array.from(sizesMap.values()),
      model: firstVariant.Model,
    });
  });

  return groupedProducts;
}

/**
 * Get a specific variant from grouped product
 */
export function getVariantById(
  groupedProduct: GroupedProduct,
  variantId: string
): ProductVariant | undefined {
  return groupedProduct.variants.find((v) => v.id === variantId);
}

/**
 * Get variant by color and size
 */
export function getVariantByColorAndSize(
  groupedProduct: GroupedProduct,
  colorId?: string,
  sizeId?: string
): ProductVariant | undefined {
  return groupedProduct.variants.find((v) => {
    const colorMatch = !colorId || v.color?.id === colorId;
    const sizeMatch = !sizeId || v.size?.id === sizeId;
    return colorMatch && sizeMatch;
  });
}
