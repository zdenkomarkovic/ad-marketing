"use client";

import { useState, useEffect } from "react";
import { GroupedProduct } from "@/lib/product-grouping";
import GroupedProductCard from "./GroupedProductCard";
import ProductsToolbar from "./ProductsToolbar";
import Pagination from "./Pagination";

interface PaginatedCategoryViewProps {
  categoryId: string;
}

export default function PaginatedCategoryView({
  categoryId,
}: PaginatedCategoryViewProps) {
  const [products, setProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [sortBy, setSortBy] = useState("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products when page or category changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/products/category/${encodeURIComponent(categoryId)}?page=${currentPage}&limit=24`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
          setProducts(data.data);
          setTotalPages(data.pagination.totalPages);
          setTotal(data.pagination.total);
        } else {
          throw new Error(data.error || "Failed to fetch products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, currentPage]);

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

  // Filter by search term
  const filteredProducts = searchTerm.trim()
    ? sortedProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.baseId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sortedProducts;

  return (
    <div className="py-8 md:py-12 bg-background">
      <div className="max-w-[90rem] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1">
            <ProductsToolbar
              totalProducts={total}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              itemsPerPage={24}
              onItemsPerPageChange={() => {}} // Fixed at 24
              searchTerm={searchTerm}
              onSearchChange={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
            />

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
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

            {/* Products grid/list */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  Nema dostupnih proizvoda.
                </p>
              </div>
            )}

            {!loading && !error && filteredProducts.length > 0 && (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
                      : "flex flex-col gap-4"
                  }
                >
                  {filteredProducts.map((product) => (
                    <GroupedProductCard key={product.baseId} product={product} />
                  ))}
                </div>

                {totalPages > 1 && !searchTerm && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      basePath={`/categories/${categoryId}`}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
