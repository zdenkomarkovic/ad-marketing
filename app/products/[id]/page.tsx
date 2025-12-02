import { getCachedProducts, getProduct, isCacheWarm } from "@/lib/product-cache";
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

  // Extract base ID from the current product ID
  const baseId = getBaseId(productId);

  let groupedProduct;
  let cachedProduct;

  // Check if cache is warm - if so, use it for full grouping
  if (isCacheWarm()) {
    // Cache is warm - use full grouping (instant)
    const allProducts = await getCachedProducts("sr-Latin-CS");
    const groupedProducts = groupProductsByBaseId(allProducts);
    groupedProduct = groupedProducts.find((gp) => gp.baseId === baseId);
    cachedProduct = allProducts.find((p) => p.Id === productId);
  } else {
    // Cache is cold - fetch single product directly (~0.4s)
    // This provides fast initial load without waiting for full cache
    cachedProduct = await getProduct(productId, "sr-Latin-CS");

    if (cachedProduct) {
      // Create a minimal grouped product from single product
      const color = typeof cachedProduct.Color === "object" ? cachedProduct.Color : null;
      const size = typeof cachedProduct.Size === "object" ? cachedProduct.Size : null;

      // Normalize category to match GroupedProduct type
      const category = typeof cachedProduct.Category === "object"
        ? { id: cachedProduct.Category.Id, name: cachedProduct.Category.Name }
        : cachedProduct.Category;

      // Normalize brand to match GroupedProduct type
      const brand = cachedProduct.Brand && typeof cachedProduct.Brand === "object"
        ? { id: cachedProduct.Brand.Id }
        : cachedProduct.Brand;

      groupedProduct = {
        baseId,
        name: cachedProduct.Name,
        category,
        brand,
        description: cachedProduct.Description,
        model: cachedProduct.Model,
        variants: [{
          id: cachedProduct.Id,
          color: color ? {
            id: color.Id,
            name: color.Name,
            htmlColor: color.HtmlColor,
          } : undefined,
          size: size ? {
            id: size.Id,
            name: size.Id,
          } : undefined,
          price: cachedProduct.Price,
          stock: cachedProduct.Stocks?.reduce((sum, s) => sum + s.Qty, 0),
          image: cachedProduct.Model?.Image,
        }],
        defaultVariant: {
          id: cachedProduct.Id,
          color: color ? {
            id: color.Id,
            name: color.Name,
            htmlColor: color.HtmlColor,
          } : undefined,
          price: cachedProduct.Price,
          stock: cachedProduct.Stocks?.reduce((sum, s) => sum + s.Qty, 0),
          image: cachedProduct.Model?.Image,
        },
        minPrice: cachedProduct.Price,
        maxPrice: cachedProduct.Price,
        availableColors: color ? [{
          id: color.Id,
          name: color.Name,
          htmlColor: color.HtmlColor,
        }] : [],
        availableSizes: size ? [{
          id: size.Id,
          name: size.Id,
        }] : [],
      };
    }
  }

  if (!groupedProduct) {
    notFound();
  }

  // Check if the specific variant exists
  const variantExists = groupedProduct.variants.some((v) => v.id === productId);
  if (!variantExists) {
    notFound();
  }

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
            fullProduct={cachedProduct || undefined}
          />
        </div>
      </main>
    </>
  );
}
