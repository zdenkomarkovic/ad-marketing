import { NextRequest, NextResponse } from "next/server";
import { getCachedProducts } from "@/lib/product-cache";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = decodeURIComponent(id);

    // Get product from cache instead of making API call
    const allProducts = await getCachedProducts("sr-Latin-CS");
    const product = allProducts.find((p) => p.Id === productId);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
