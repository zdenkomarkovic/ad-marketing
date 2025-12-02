import { getCachedProducts } from "@/lib/product-cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { groupProductsByBaseId, getBaseId } from "@/lib/product-grouping";
import dynamic from "next/dynamic";

// Dynamically import the heavy client component
const DetailedProductView = dynamic(
  () => import("@/components/DetailedProductView"),
  {
    loading: () => (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Učitavanje proizvoda...</p>
        </div>
      </div>
    ),
  }
);

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

  // Fetch all products (from cache)
  const allProducts = await getCachedProducts("sr-Latin-CS");

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

  // Get product data from cache (already loaded above)
  const fullProduct = allProducts.find((p) => p.Id === productId);

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
