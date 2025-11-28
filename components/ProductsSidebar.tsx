"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { Button } from "./ui/button";

interface FilterOption {
  id: string;
  name: string;
  count?: number;
}

interface SelectedFilters {
  categories: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  materials: string[];
  minPrice: number;
  maxPrice: number;
}

interface ProductsSidebarProps {
  categories: FilterOption[];
  brands: FilterOption[];
  colors: FilterOption[];
  sizes: FilterOption[];
  materials: FilterOption[];
  selectedFilters: SelectedFilters;
  onFilterChange: (filters: SelectedFilters) => void;
}

export default function ProductsSidebar({
  categories,
  brands,
  colors,
  sizes,
  materials,
  selectedFilters,
  onFilterChange,
}: ProductsSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: false,
    colors: false,
    sizes: false,
    materials: false,
    price: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCheckboxChange = (
    filterType: keyof typeof selectedFilters,
    value: string
  ) => {
    const currentValues = selectedFilters[filterType] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFilterChange({
      ...selectedFilters,
      [filterType]: newValues,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
      materials: [],
      minPrice: 0,
      maxPrice: 10000,
    });
  };

  const hasActiveFilters =
    selectedFilters.categories.length > 0 ||
    selectedFilters.brands.length > 0 ||
    selectedFilters.colors.length > 0 ||
    selectedFilters.sizes.length > 0 ||
    selectedFilters.materials.length > 0 ||
    selectedFilters.minPrice > 0 ||
    selectedFilters.maxPrice < 10000;

  return (
    <aside className="w-full lg:w-64 xl:w-72 bg-card border border-border rounded-lg p-4 h-fit sticky top-32">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Filteri</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs"
          >
            <X className="w-4 h-4 mr-1" />
            Obriši sve
          </Button>
        )}
      </div>

      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Kategorije */}
        <div className="border-b border-border pb-4">
          <button
            onClick={() => toggleSection("categories")}
            className="flex items-center justify-between w-full text-left font-medium text-foreground mb-2"
          >
            <span>Kategorije</span>
            {expandedSections.categories ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {expandedSections.categories && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center space-x-2 text-sm cursor-pointer hover:text-primary"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.categories.includes(category.id)}
                    onChange={() => handleCheckboxChange("categories", category.id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="flex-1">{category.name}</span>
                  {category.count !== undefined && (
                    <span className="text-muted-foreground text-xs">
                      ({category.count})
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Brendovi */}
        <div className="border-b border-border pb-4">
          <button
            onClick={() => toggleSection("brands")}
            className="flex items-center justify-between w-full text-left font-medium text-foreground mb-2"
          >
            <span>Brendovi</span>
            {expandedSections.brands ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {expandedSections.brands && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <label
                  key={brand.id}
                  className="flex items-center space-x-2 text-sm cursor-pointer hover:text-primary"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.brands.includes(brand.id)}
                    onChange={() => handleCheckboxChange("brands", brand.id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="flex-1">{brand.name}</span>
                  {brand.count !== undefined && (
                    <span className="text-muted-foreground text-xs">
                      ({brand.count})
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Boje */}
        <div className="border-b border-border pb-4">
          <button
            onClick={() => toggleSection("colors")}
            className="flex items-center justify-between w-full text-left font-medium text-foreground mb-2"
          >
            <span>Boje</span>
            {expandedSections.colors ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {expandedSections.colors && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {colors.map((color) => (
                <label
                  key={color.id}
                  className="flex items-center space-x-2 text-sm cursor-pointer hover:text-primary"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.colors.includes(color.id)}
                    onChange={() => handleCheckboxChange("colors", color.id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="flex-1">{color.name}</span>
                  {color.count !== undefined && (
                    <span className="text-muted-foreground text-xs">
                      ({color.count})
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Veličine */}
        <div className="border-b border-border pb-4">
          <button
            onClick={() => toggleSection("sizes")}
            className="flex items-center justify-between w-full text-left font-medium text-foreground mb-2"
          >
            <span>Veličine</span>
            {expandedSections.sizes ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {expandedSections.sizes && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sizes.map((size) => (
                <label
                  key={size.id}
                  className="flex items-center space-x-2 text-sm cursor-pointer hover:text-primary"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.sizes.includes(size.id)}
                    onChange={() => handleCheckboxChange("sizes", size.id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="flex-1">{size.name}</span>
                  {size.count !== undefined && (
                    <span className="text-muted-foreground text-xs">
                      ({size.count})
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Materijali */}
        <div className="border-b border-border pb-4">
          <button
            onClick={() => toggleSection("materials")}
            className="flex items-center justify-between w-full text-left font-medium text-foreground mb-2"
          >
            <span>Materijali</span>
            {expandedSections.materials ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {expandedSections.materials && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {materials.map((material) => (
                <label
                  key={material.id}
                  className="flex items-center space-x-2 text-sm cursor-pointer hover:text-primary"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.materials.includes(material.id)}
                    onChange={() => handleCheckboxChange("materials", material.id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="flex-1">{material.name}</span>
                  {material.count !== undefined && (
                    <span className="text-muted-foreground text-xs">
                      ({material.count})
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Cena */}
        <div className="pb-4">
          <button
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full text-left font-medium text-foreground mb-2"
          >
            <span>Cena (€)</span>
            {expandedSections.price ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {expandedSections.price && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Od:</label>
                <input
                  type="number"
                  min="0"
                  value={selectedFilters.minPrice}
                  onChange={(e) =>
                    onFilterChange({
                      ...selectedFilters,
                      minPrice: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Do:</label>
                <input
                  type="number"
                  min="0"
                  value={selectedFilters.maxPrice}
                  onChange={(e) =>
                    onFilterChange({
                      ...selectedFilters,
                      maxPrice: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
