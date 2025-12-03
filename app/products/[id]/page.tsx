import { getCachedProducts } from "@/lib/product-cache";
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
          <p className="text-sm text-muted-foreground">
            Učitavanje proizvoda...
          </p>
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

  console.log(`[ProductPage] Loading product: ${productId}`);
  const startTime = Date.now();

  // Fetch all products (from cache - FAST!)
  const allProducts = await getCachedProducts("sr-Latin-CS");

  // Get product data FIRST (before expensive grouping)
  const fullProduct = allProducts.find((p) => p.Id === productId);

  if (!fullProduct) {
    console.log(`[ProductPage] Product not found: ${productId}`);
    notFound();
  }

  // Extract base ID from the current product ID
  const baseId = getBaseId(productId);

  // Filter only products with same base ID (much smaller set to group!)
  const relatedProducts = allProducts.filter((p) => getBaseId(p.Id) === baseId);

  console.log(`[ProductPage] Found ${relatedProducts.length} variants for baseId: ${baseId}`);

  // Group only the related products (FAST - only 5-20 products instead of 5000!)
  const groupedProducts = groupProductsByBaseId(relatedProducts);
  const groupedProduct = groupedProducts[0]; // Should be only one group

  if (!groupedProduct) {
    console.log(`[ProductPage] Grouped product not found for baseId: ${baseId}`);
    notFound();
  }

  const duration = Date.now() - startTime;
  console.log(`[ProductPage] ✅ Loaded product in ${duration}ms`);

  return (
    <>
      <div className="pt-20 pb-10 bg-gradient-to-b from-primary/10 via-background to-background"></div>
      <main className="min-h-screen pb-12 bg-background">
        <div className="max-w-[80rem] mx-auto px-4 md:px-8">
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
