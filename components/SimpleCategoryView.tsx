"use client";

import useSWR from "swr";
import { useState, useMemo } from "react";
import { GroupedProduct } from "@/lib/product-grouping";
import GroupedProductCard from "./GroupedProductCard";
import ProductsToolbar from "./ProductsToolbar";

interface SimpleCategoryViewProps {
  categoryId: string;
}

interface PaginatedResponse {
  products: GroupedProduct[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

// Fetcher function for SWR - now uses paginated endpoint
const fetcher = async (url: string): Promise<PaginatedResponse> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
};

export default function SimpleCategoryView({
  categoryId,
}: SimpleCategoryViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 32;
  const [sortBy, setSortBy] = useState("name-asc");
  const [searchTerm, setSearchTerm] = useState("");

  // Build URL with pagination parameters
  const apiUrl = useMemo(() => {
    return `/api/products/category/${encodeURIComponent(categoryId)}/paginated?page=${currentPage}&limit=${productsPerPage}`;
  }, [categoryId, currentPage, productsPerPage]);

  // SWR handles caching - won't refetch on back navigation
  const {
    data: paginatedData,
    error,
    isLoading,
    isValidating,
  } = useSWR(
    apiUrl,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
      keepPreviousData: true, // Show previous page while loading next page
    }
  );

  // Determine if we're truly loading (no data yet) vs just fetching new page
  const isInitialLoading = isLoading && !paginatedData;

  // Sort products from server
  const sortedProducts = useMemo(() => {
    if (!paginatedData?.products) return [];

    return [...paginatedData.products].sort((a, b) => {
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
  }, [paginatedData?.products, sortBy]);

  // Filter by search (client-side for current page only)
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return sortedProducts;

    return sortedProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.baseId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedProducts, searchTerm]);

  // Use server pagination data
  const totalPages = paginatedData?.totalPages || 1;
  const totalProducts = paginatedData?.total || 0;

  return (
    <div className="py-8 md:py-12 bg-background">
      <div className="max-w-[90rem] mx-auto px-4 md:px-8">
        <ProductsToolbar
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
        />

        {/* Loading State - Only show on initial load */}
        {isInitialLoading && (
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
        {error && !isInitialLoading && (
          <div className="text-center py-12">
            <p className="text-lg text-red-500">Greška pri učitavanju</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded"
            >
              Pokušaj ponovo
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isInitialLoading && !error && filteredProducts.length === 0 && paginatedData && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Nema dostupnih proizvoda.
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!isInitialLoading && !error && filteredProducts.length > 0 && (
          <>
            <div className="relative">
              {/* Loading overlay when fetching new page */}
              {isValidating && !isInitialLoading && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                  <div className="bg-card p-4 rounded-lg shadow-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Učitavanje...</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-6">
                {filteredProducts.map((product) => (
                  <GroupedProductCard key={product.baseId} product={product} />
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1 || isValidating}
                  className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50 transition-opacity"
                >
                  Prethodna
                </button>
                <span className="text-muted-foreground">
                  Stranica {currentPage} od {totalPages} (ukupno: {totalProducts} proizvoda)
                </span>
                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages || isValidating}
                  className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50 transition-opacity"
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
