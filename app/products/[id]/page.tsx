import { fetchProducts, fetchProduct } from "@/lib/promosolution-api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { groupProductsByBaseId, getBaseId } from "@/lib/product-grouping";
import DetailedProductView from "@/components/DetailedProductView";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Await params in Next.js 15
  const resolvedParams = await params;
  // Decode the ID from URL
  const productId = decodeURIComponent(resolvedParams.id);

  // Fetch all products
  const allProducts = await fetchProducts("sr-Latin-CS");

  // Group products
  const groupedProducts = groupProductsByBaseId(allProducts);

  // Extract base ID from the current product ID
  const baseId = getBaseId(productId);

  // Find the grouped product that contains this variant
  const groupedProduct = groupedProducts.find((gp) => gp.baseId === baseId);

  if (!groupedProduct) {
    notFound();
  }

  // Check if the specific variant exists
  const variantExists = groupedProduct.variants.some((v) => v.id === productId);
  if (!variantExists) {
    notFound();
  }

  // Fetch full product details for the current variant
  const fullProduct = await fetchProduct(productId, "sr-Latin-CS");

  return (
    <>
      <div className="pt-20 pb-10 bg-gradient-to-b from-primary/10 via-background to-background"></div>
      <main className="min-h-screen pb-12 bg-background">
        <div className="max-w-[80rem] mx-auto px-4 md:px-8">
          {/* Back button */}
          <Link
            href="/proizvodi-filter"
            className="inline-flex items-center text-white hover:underline mb-6"
          >
            ← Nazad na proizvode
          </Link>

          <DetailedProductView
            groupedProduct={groupedProduct}
            currentVariantId={productId}
            fullProduct={fullProduct || undefined}
          />
        </div>
      </main>
    </>
  );
}
