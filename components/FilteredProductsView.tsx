"use client";

import { useState, useMemo } from "react";
import ProductsSidebar from "./ProductsSidebar";
import ProductsToolbar from "./ProductsToolbar";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import ActiveFilters from "./ActiveFilters";
import { Product } from "@/lib/promosolution-api";
import { Filter } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface FilteredProductsViewProps {
  products: Product[];
}

export default function FilteredProductsView({
  products,
}: FilteredProductsViewProps) {
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    colors: [] as string[],
    sizes: [] as string[],
    materials: [] as string[],
    minPrice: 0,
    maxPrice: 10000,
  });

  const [sortBy, setSortBy] = useState("name-asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Extract unique filter options from products
  const filterOptions = useMemo(() => {
    const categoriesMap = new Map<
      string,
      { id: string; name: string; count: number }
    >();
    const brandsMap = new Map<
      string,
      { id: string; name: string; count: number }
    >();
    const colorsMap = new Map<
      string,
      { id: string; name: string; count: number }
    >();
    const sizesMap = new Map<
      string,
      { id: string; name: string; count: number }
    >();
    const materialsSet = new Set<string>();

    products.forEach((product) => {
      // Categories
      if (product.Category) {
        const categoryId =
          typeof product.Category === "string"
            ? product.Category
            : product.Category.Id;
        const categoryName =
          typeof product.Category === "string"
            ? product.Category
            : product.Category.Name;
        const existing = categoriesMap.get(categoryId);
        categoriesMap.set(categoryId, {
          id: categoryId,
          name: categoryName,
          count: existing ? existing.count + 1 : 1,
        });
      }

      // Brands
      if (product.Brand) {
        const brandId =
          typeof product.Brand === "string" ? product.Brand : product.Brand.Id;
        const existing = brandsMap.get(brandId);
        brandsMap.set(brandId, {
          id: brandId,
          name: brandId,
          count: existing ? existing.count + 1 : 1,
        });
      }

      // Colors
      if (product.Color) {
        const colorId =
          typeof product.Color === "string" ? product.Color : product.Color.Id;
        const colorName =
          typeof product.Color === "string"
            ? product.Color
            : product.Color.Name;
        const existing = colorsMap.get(colorId);
        colorsMap.set(colorId, {
          id: colorId,
          name: colorName,
          count: existing ? existing.count + 1 : 1,
        });
      }

      // Sizes
      if (product.Size && product.Size !== "*") {
        const sizeId =
          typeof product.Size === "string" ? product.Size : product.Size.Id;
        const existing = sizesMap.get(sizeId);
        sizesMap.set(sizeId, {
          id: sizeId,
          name: sizeId,
          count: existing ? existing.count + 1 : 1,
        });
      }

      // Materials (this would need to come from product description or custom field)
      // For now, we'll leave it empty as the API doesn't provide this directly
    });

    return {
      categories: Array.from(categoriesMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
      brands: Array.from(brandsMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
      colors: Array.from(colorsMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
      sizes: Array.from(sizesMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
      materials: Array.from(materialsSet).map((m) => ({ id: m, name: m })),
    };
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter - search by name or product ID
      if (searchTerm.trim()) {
        const search = searchTerm.toLowerCase().trim();
        const nameMatch = product.Name.toLowerCase().includes(search);
        const idMatch = product.Id.toLowerCase().includes(search);

        if (!nameMatch && !idMatch) {
          return false;
        }
      }

      // Category filter
      if (selectedFilters.categories.length > 0) {
        const categoryId =
          typeof product.Category === "string"
            ? product.Category
            : product.Category?.Id;
        if (!categoryId || !selectedFilters.categories.includes(categoryId)) {
          return false;
        }
      }

      // Brand filter
      if (selectedFilters.brands.length > 0) {
        const brandId =
          typeof product.Brand === "string" ? product.Brand : product.Brand?.Id;
        if (!brandId || !selectedFilters.brands.includes(brandId)) {
          return false;
        }
      }

      // Color filter
      if (selectedFilters.colors.length > 0) {
        const colorId =
          typeof product.Color === "string" ? product.Color : product.Color?.Id;
        if (!colorId || !selectedFilters.colors.includes(colorId)) {
          return false;
        }
      }

      // Size filter
      if (selectedFilters.sizes.length > 0) {
        const sizeId =
          typeof product.Size === "string" ? product.Size : product.Size?.Id;
        if (
          !sizeId ||
          sizeId === "*" ||
          !selectedFilters.sizes.includes(sizeId)
        ) {
          return false;
        }
      }

      // Price filter
      if (product.Price) {
        if (
          product.Price < selectedFilters.minPrice ||
          product.Price > selectedFilters.maxPrice
        ) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedFilters, searchTerm]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case "name-asc":
        sorted.sort((a, b) => a.Name.localeCompare(b.Name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.Name.localeCompare(a.Name));
        break;
      case "price-asc":
        sorted.sort((a, b) => (a.Price || 0) - (b.Price || 0));
        break;
      case "price-desc":
        sorted.sort((a, b) => (b.Price || 0) - (a.Price || 0));
        break;
      case "newest":
        // Keep original order (assuming it's from newest to oldest)
        break;
    }

    return sorted;
  }, [filteredProducts, sortBy]);

  // Paginate products

  // Reset to page 1 when filters change
  const handleFilterChange = (newFilters: typeof selectedFilters) => {
    setSelectedFilters(newFilters);
    setCurrentPage(1);
  };

  // Remove single filter
  const handleRemoveFilter = (filterType: string, value: string) => {
    if (filterType === "minPrice") {
      setSelectedFilters({ ...selectedFilters, minPrice: 0 });
    } else if (filterType === "maxPrice") {
      setSelectedFilters({ ...selectedFilters, maxPrice: 10000 });
    } else {
      const currentValues = selectedFilters[
        filterType as keyof typeof selectedFilters
      ] as string[];
      const newValues = currentValues.filter((v) => v !== value);
      setSelectedFilters({
        ...selectedFilters,
        [filterType]: newValues,
      });
    }
    setCurrentPage(1);
  };

  // Clear all filters
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
    <div className="py-40 bg-background">
      <div className="max-w-[90rem] mx-auto px-4 md:px-8">
        {/* Mobile sidebar toggle */}
        <div className="lg:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-full" variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filteri i pretraga
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[300px] sm:w-[400px] overflow-y-auto"
            >
              <SheetHeader>
                <SheetTitle>Filteri</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <ProductsSidebar
                  categories={filterOptions.categories}
                  brands={filterOptions.brands}
                  colors={filterOptions.colors}
                  sizes={filterOptions.sizes}
                  materials={filterOptions.materials}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:sticky lg:top-32 lg:self-start">
            <ProductsSidebar
              categories={filterOptions.categories}
              brands={filterOptions.brands}
              colors={filterOptions.colors}
              sizes={filterOptions.sizes}
              materials={filterOptions.materials}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Main content */}
          <div className="flex-1">
            <ProductsToolbar
              sortBy={sortBy}
              onSortChange={setSortBy}
              searchTerm={searchTerm}
              onSearchChange={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
            />

            <ActiveFilters
              selectedFilters={selectedFilters}
              filterOptions={filterOptions}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />

            {/* Products grid/list */}
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  Nema proizvoda koji odgovaraju izabranim filterima.
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
                    <ProductCard key={product.Id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      basePath="/proizvodi"
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
