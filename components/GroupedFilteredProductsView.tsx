"use client";

import { useState, useMemo } from "react";
import ProductsToolbar from "./ProductsToolbar";
import GroupedProductCard from "./GroupedProductCard";
import Pagination from "./Pagination";
import { Product } from "@/lib/promosolution-api";
import { groupProductsByBaseId } from "@/lib/product-grouping";

interface GroupedFilteredProductsViewProps {
  products: Product[];
  initialCategoryFilter?: string;
}

export default function GroupedFilteredProductsView({
  products,
  initialCategoryFilter,
}: GroupedFilteredProductsViewProps) {
  const [selectedFilters, setSelectedFilters] = useState({
    categories: initialCategoryFilter ? [initialCategoryFilter] : ([] as string[]),
    brands: [] as string[],
    colors: [] as string[],
    sizes: [] as string[],
    materials: [] as string[],
    minPrice: 0,
    maxPrice: 10000,
  });

  const [sortBy, setSortBy] = useState("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Group products by base ID
  const groupedProducts = useMemo(() => {
    return groupProductsByBaseId(products);
  }, [products]);

  // Extract unique filter options from grouped products
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filterOptions = useMemo(() => {
    const categoriesMap = new Map<string, { id: string; name: string; count: number }>();
    const brandsMap = new Map<string, { id: string; name: string; count: number }>();
    const colorsMap = new Map<string, { id: string; name: string; count: number }>();
    const sizesMap = new Map<string, { id: string; name: string; count: number }>();

    groupedProducts.forEach((product) => {
      // Categories
      if (product.category) {
        const categoryId = typeof product.category === "string" ? product.category : product.category.id;
        const categoryName = typeof product.category === "string" ? product.category : product.category.name;
        const existing = categoriesMap.get(categoryId);
        categoriesMap.set(categoryId, {
          id: categoryId,
          name: categoryName,
          count: existing ? existing.count + 1 : 1,
        });
      }

      // Brands
      if (product.brand) {
        const brandId = typeof product.brand === "string" ? product.brand : product.brand.id;
        const existing = brandsMap.get(brandId);
        brandsMap.set(brandId, {
          id: brandId,
          name: brandId,
          count: existing ? existing.count + 1 : 1,
        });
      }

      // Colors
      product.availableColors.forEach((color) => {
        const existing = colorsMap.get(color.id);
        colorsMap.set(color.id, {
          id: color.id,
          name: color.name,
          count: existing ? existing.count + 1 : 1,
        });
      });

      // Sizes
      product.availableSizes.forEach((size) => {
        const existing = sizesMap.get(size.id);
        sizesMap.set(size.id, {
          id: size.id,
          name: size.name,
          count: existing ? existing.count + 1 : 1,
        });
      });
    });

    return {
      categories: Array.from(categoriesMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
      brands: Array.from(brandsMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
      colors: Array.from(colorsMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
      sizes: Array.from(sizesMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
      materials: [],
    };
  }, [groupedProducts]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return groupedProducts.filter((product) => {
      // Search filter - search by name or base ID
      if (searchTerm.trim()) {
        const search = searchTerm.toLowerCase().trim();
        const nameMatch = product.name.toLowerCase().includes(search);
        const idMatch = product.baseId.toLowerCase().includes(search);

        // Also search through variant IDs
        const variantIdMatch = product.variants.some(v =>
          v.id.toLowerCase().includes(search)
        );

        if (!nameMatch && !idMatch && !variantIdMatch) {
          return false;
        }
      }

      // Category filter
      if (selectedFilters.categories.length > 0) {
        const categoryId = typeof product.category === "string" ? product.category : product.category?.id;
        if (!categoryId || !selectedFilters.categories.includes(categoryId)) {
          return false;
        }
      }

      // Brand filter
      if (selectedFilters.brands.length > 0) {
        const brandId = typeof product.brand === "string" ? product.brand : product.brand?.id;
        if (!brandId || !selectedFilters.brands.includes(brandId)) {
          return false;
        }
      }

      // Color filter - check if product has any of the selected colors
      if (selectedFilters.colors.length > 0) {
        const hasColor = product.availableColors.some((color) =>
          selectedFilters.colors.includes(color.id)
        );
        if (!hasColor) {
          return false;
        }
      }

      // Size filter - check if product has any of the selected sizes
      if (selectedFilters.sizes.length > 0) {
        const hasSize = product.availableSizes.some((size) =>
          selectedFilters.sizes.includes(size.id)
        );
        if (!hasSize) {
          return false;
        }
      }

      // Price filter
      if (product.minPrice !== undefined && product.maxPrice !== undefined) {
        // Product is outside the price range if its max price is below filter min OR min price is above filter max
        if (
          product.maxPrice < selectedFilters.minPrice ||
          product.minPrice > selectedFilters.maxPrice
        ) {
          return false;
        }
      }

      return true;
    });
  }, [groupedProducts, selectedFilters, searchTerm]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        sorted.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
        break;
      case "price-desc":
        sorted.sort((a, b) => (b.maxPrice || 0) - (a.maxPrice || 0));
        break;
      case "newest":
        // Keep original order
        break;
    }

    return sorted;
  }, [filteredProducts, sortBy]);

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // Reset to page 1 when filters change
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleFilterChange = (newFilters: typeof selectedFilters) => {
    setSelectedFilters(newFilters);
    setCurrentPage(1);
  };

  // Remove single filter
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRemoveFilter = (filterType: string, value: string) => {
    if (filterType === "minPrice") {
      setSelectedFilters({ ...selectedFilters, minPrice: 0 });
    } else if (filterType === "maxPrice") {
      setSelectedFilters({ ...selectedFilters, maxPrice: 10000 });
    } else {
      const currentValues = selectedFilters[filterType as keyof typeof selectedFilters] as string[];
      const newValues = currentValues.filter((v) => v !== value);
      setSelectedFilters({
        ...selectedFilters,
        [filterType]: newValues,
      });
    }
    setCurrentPage(1);
  };

  // Clear all filters
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
      materials: [],
      minPrice: 0,
      maxPrice: 10000,
    });
    setCurrentPage(1);
  };

  return (
    <div className="py-8 md:py-12 bg-background">
      <div className="max-w-[90rem] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1">
            <ProductsToolbar
              totalProducts={sortedProducts.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={(items) => {
                setItemsPerPage(items);
                setCurrentPage(1);
              }}
              searchTerm={searchTerm}
              onSearchChange={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
            />

            {/* Products grid/list */}
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  Nema dostupnih proizvoda.
                </p>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
                      : "flex flex-col gap-4"
                  }
                >
                  {paginatedProducts.map((product) => (
                    <GroupedProductCard key={product.baseId} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      basePath="/proizvodi-filter"
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
