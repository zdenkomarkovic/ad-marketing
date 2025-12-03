import { NextRequest, NextResponse } from "next/server";
import { getCachedProducts } from "@/lib/product-cache";

/**
 * OPTIMIZED Product Detail API
 * Uses cache instead of external API call
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = decodeURIComponent(id);

    console.log(`[API Product] Fetching product: ${productId}`);
    const startTime = Date.now();

    // Get product from cache (FAST - no external API call!)
    const allProducts = await getCachedProducts("sr-Latin-CS");
    const product = allProducts.find((p) => p.Id === productId);

    if (!product) {
      console.log(`[API Product] Product not found: ${productId}`);
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const duration = Date.now() - startTime;
    console.log(`[API Product] ✅ Returned product in ${duration}ms`);

    return NextResponse.json(product);
  } catch (error) {
    console.error("[API Product] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
