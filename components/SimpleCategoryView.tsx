"use client";

import useSWR from "swr";
import { useState } from "react";
import { Product } from "@/lib/promosolution-api";
import { groupProductsByBaseId, GroupedProduct } from "@/lib/product-grouping";
import GroupedProductCard from "./GroupedProductCard";
import ProductsToolbar from "./ProductsToolbar";

interface SimpleCategoryViewProps {
  categoryId: string;
}

// Fetcher function for SWR
const fetcher = async (url: string): Promise<GroupedProduct[]> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch");
  const rawProducts: Product[] = await response.json();
  return groupProductsByBaseId(rawProducts);
};

export default function SimpleCategoryView({
  categoryId,
}: SimpleCategoryViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 32;
  const [sortBy, setSortBy] = useState("name-asc");

  const [searchTerm, setSearchTerm] = useState("");

  // SWR handles caching - won't refetch on back navigation
  const {
    data: products,
    error,
    isLoading,
  } = useSWR(
    `/api/products/category/${encodeURIComponent(categoryId)}/simple`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  // Sort products
  const sortedProducts = [...(products || [])].sort((a, b) => {
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
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

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

        {/* Loading State */}
        {isLoading && (
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
        {error && !isLoading && (
          <div className="text-center py-12">
            <p className="text-lg text-red-500">Greška pri učitavanju</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Nema dostupnih proizvoda.
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && paginatedProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-6">
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
                  className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
                >
                  Prethodna
                </button>
                <span className="text-muted-foreground">
                  Stranica {currentPage} od {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
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
