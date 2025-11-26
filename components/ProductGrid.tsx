import { Product, fetchProducts } from "@/lib/promosolution-api";
import Pagination from "./Pagination";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  limit?: number;
  title?: string;
  page?: number;
  itemsPerPage?: number;
}

export default async function ProductGrid({
  limit,
  page = 1,
  itemsPerPage = 12,
}: ProductGridProps) {
  let products: Product[] = [];
  let allProducts: Product[] = [];
  let error: string | null = null;

  try {
    allProducts = await fetchProducts("sr-Latin-CS");

    // If limit is provided (for showing limited products on homepage), use it
    if (limit) {
      products = allProducts.slice(0, limit);
    } else {
      // Otherwise, use pagination
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      products = allProducts.slice(startIndex, endIndex);
    }
  } catch (err) {
    console.error("Error loading products:", err);
    error =
      "Došlo je do greške pri učitavanju proizvoda. Molimo pokušajte ponovo kasnije.";
  }

  const totalPages = limit ? 0 : Math.ceil(allProducts.length / itemsPerPage);

  return (
    <section className="py-40 bg-background">
      <div className="max-w-[80rem] mx-auto px-4 md:px-8">
        {error && (
          <div className="text-center text-red-600 mb-8 p-4 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {!error && products.length === 0 && (
          <div className="text-center text-muted-foreground mb-8">
            Trenutno nema dostupnih proizvoda.
          </div>
        )}

        {!error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.Id} product={product} />
            ))}
          </div>
        )}

        {/* Show pagination only if limit is not set */}
        {!limit && totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/proizvodi"
          />
        )}

        {/* Show info when limit is set */}
        {limit && products.length >= limit && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Prikazano {products.length} od {allProducts.length} proizvoda
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
