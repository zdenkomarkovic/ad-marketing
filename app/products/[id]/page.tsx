import { fetchProduct, fetchProductImages } from "@/lib/promosolution-api";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";

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

  // Fetch product data
  const product = await fetchProduct(productId);

  if (!product) {
    notFound();
  }

  // Extract base ID (remove size suffix like -XL, -XXL, etc.)
  const baseId = productId.split("-")[0];

  // Use product.Images if available, otherwise fetch from API
  let allImages: string[] = [];

  if (product.Images && product.Images.length > 0) {
    // Use Images array from product data
    allImages = product.Images.map((img) => img.Image);
  } else {
    // Fallback to fetching images
    try {
      const images = await fetchProductImages(baseId);
      allImages = images.filter(
        (img): img is string => typeof img === "string"
      );
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }

  // If still no images, use default
  if (allImages.length === 0) {
    const defaultImage = `https://apiv2.promosolution.services/content/ModelItem/${baseId}_001.jpg`;
    allImages = [defaultImage];
  }

  return (
    <main className="min-h-screen py-10 md:py-20 bg-background">
      <div className="max-w-[80rem] mx-auto px-4 md:px-8">
        {/* Back button */}
        <Link
          href="/proizvodi"
          className="inline-flex items-center text-primary hover:underline mb-6"
        >
          ← Nazad na proizvode
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <ProductGallery images={allImages} productName={product.Name} />

          {/* Product Info */}
          <div className="space-y-6">
            {product.Brand && (
              <div className="inline-block bg-primary text-primary-foreground text-sm px-3 py-1 rounded">
                {typeof product.Brand === "string"
                  ? product.Brand
                  : product.Brand.Id}
              </div>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              {product.Name}
            </h1>

            <div className="text-sm text-muted-foreground">
              Šifra proizvoda: <span className="font-mono">{product.Id}</span>
            </div>

            {product.Price && (
              <div className="text-4xl font-bold text-primary">
                €
                {product.Price.toLocaleString("sr-RS", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            )}

            {/* Product Details */}
            <div className="border-t border-border pt-6 space-y-4">
              <h2 className="text-xl font-semibold">Detalji proizvoda</h2>

              <div className="grid grid-cols-2 gap-4">
                {product.Category && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Kategorija
                    </div>
                    <div className="font-medium">
                      {typeof product.Category === "string"
                        ? product.Category
                        : product.Category.Name}
                    </div>
                  </div>
                )}

                {product.SubCategory && product.SubCategory !== "*" && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Podkategorija
                    </div>
                    <div className="font-medium">
                      {typeof product.SubCategory === "string"
                        ? product.SubCategory
                        : product.SubCategory.Name}
                    </div>
                  </div>
                )}

                {product.Color && (
                  <div>
                    <div className="text-sm text-muted-foreground">Boja</div>
                    <div className="font-medium">
                      {typeof product.Color === "string"
                        ? product.Color
                        : product.Color.Name}
                    </div>
                  </div>
                )}

                {product.Size && product.Size !== "*" && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Veličina
                    </div>
                    <div className="font-medium">
                      {typeof product.Size === "string"
                        ? product.Size
                        : product.Size.Id}
                    </div>
                  </div>
                )}

                {product.Shade && (
                  <div>
                    <div className="text-sm text-muted-foreground">Nijanša</div>
                    <div className="font-medium">
                      {typeof product.Shade === "string"
                        ? product.Shade
                        : product.Shade.Name}
                    </div>
                  </div>
                )}

                {product.Stock !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Na stanju
                    </div>
                    <div className="font-medium">
                      {product.Stock > 0 ? "Dostupno" : "Nije dostupno"}
                    </div>
                  </div>
                )}

                {product.Status && (
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          product.Status === "active" ||
                          product.Status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.Status}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {(product.Description ||
              product.Model?.Description ||
              product.Model?.Description2) && (
              <div className="border-t border-border pt-6">
                <h2 className="text-xl font-semibold mb-3">Opis</h2>
                <div className="text-muted-foreground leading-relaxed space-y-2">
                  {product.Description && <p>{product.Description}</p>}
                  {product.Model?.Description && (
                    <p>{product.Model.Description}</p>
                  )}
                  {product.Model?.Description2 && (
                    <p>{product.Model.Description2}</p>
                  )}
                </div>
              </div>
            )}

            {/* Contact CTA */}
            <div className="border-t border-border pt-6">
              <Link
                href="/kontakt"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Kontaktirajte nas za ponudu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
