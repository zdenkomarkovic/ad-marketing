"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/promosolution-api";
import { groupProductsByBaseId, GroupedProduct } from "@/lib/product-grouping";
import GroupedProductCard from "./GroupedProductCard";
import ProductsToolbar from "./ProductsToolbar";

interface SimpleCategoryViewProps {
  categoryId: string;
}

export default function SimpleCategoryView({
  categoryId,
}: SimpleCategoryViewProps) {
  const [products, setProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 64;

  const [sortBy, setSortBy] = useState("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products directly from API (like the other site)
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`[Client] Fetching products for category: ${categoryId}`);
        const startTime = Date.now();

        // Direct API call - simple, no cache (like the other site)
        const response = await fetch(
          `/api/products/category/${encodeURIComponent(categoryId)}/simple`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const rawProducts: Product[] = await response.json();

        // Group products on client-side
        const grouped = groupProductsByBaseId(rawProducts);

        const duration = Date.now() - startTime;
        console.log(`[Client] Loaded ${grouped.length} grouped products in ${duration}ms`);

        setProducts(grouped);
      } catch (err) {
        console.error("[Client] Error fetching products:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryId]);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "price-asc":
        return (a.minPrice || 0) - (b.minPrice || 0);
      case "price-desc":
        return (b.maxPrice || 0) - (a.maxPrice || 0);
      default:
        return 0;
    }
  });

  // Filter by search
  const filteredProducts = searchTerm.trim()
    ? sortedProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.baseId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sortedProducts;

  // Pagination
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="py-8 md:py-12 bg-background">
      <div className="max-w-[90rem] mx-auto px-4 md:px-8">
        <ProductsToolbar
          totalProducts={totalProducts}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          itemsPerPage={productsPerPage}
          onItemsPerPageChange={() => {}}
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
        />

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-lg overflow-hidden border border-border animate-pulse"
              >
                <div className="aspect-square bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-8 bg-muted rounded w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-lg text-red-500">Greška: {error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Nema dostupnih proizvoda.
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && paginatedProducts.length > 0 && (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-6"
                  : "flex flex-col gap-4 mt-6"
              }
            >
              {paginatedProducts.map((product) => (
                <GroupedProductCard key={product.baseId} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prethodna
                </button>
                <span className="text-muted-foreground">
                  Stranica {currentPage} od {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sledeća
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
