"use client";

import { X } from "lucide-react";
import { Button } from "./ui/button";

interface ActiveFiltersProps {
  selectedFilters: {
    categories: string[];
    brands: string[];
    colors: string[];
    sizes: string[];
    materials: string[];
    minPrice: number;
    maxPrice: number;
  };
  filterOptions: {
    categories: Array<{ id: string; name: string }>;
    brands: Array<{ id: string; name: string }>;
    colors: Array<{ id: string; name: string }>;
    sizes: Array<{ id: string; name: string }>;
    materials: Array<{ id: string; name: string }>;
  };
  onRemoveFilter: (filterType: string, value: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilters({
  selectedFilters,
  filterOptions,
  onRemoveFilter,
  onClearAll,
}: ActiveFiltersProps) {
  const getFilterName = (type: string, id: string) => {
    const optionsList = filterOptions[type as keyof typeof filterOptions];
    const option = optionsList.find((o) => o.id === id);
    return option ? option.name : id;
  };

  const hasActiveFilters =
    selectedFilters.categories.length > 0 ||
    selectedFilters.brands.length > 0 ||
    selectedFilters.colors.length > 0 ||
    selectedFilters.sizes.length > 0 ||
    selectedFilters.materials.length > 0 ||
    selectedFilters.minPrice > 0 ||
    selectedFilters.maxPrice < 10000;

  if (!hasActiveFilters) return null;

  return (
    <div className="mb-4 p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground">Aktivni filteri:</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-xs h-7"
        >
          <X className="w-3 h-3 mr-1" />
          Obriši sve
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedFilters.categories.map((cat) => (
          <span
            key={cat}
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
          >
            {getFilterName("categories", cat)}
            <button
              onClick={() => onRemoveFilter("categories", cat)}
              className="hover:text-primary/80"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {selectedFilters.brands.map((brand) => (
          <span
            key={brand}
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
          >
            Brend: {getFilterName("brands", brand)}
            <button
              onClick={() => onRemoveFilter("brands", brand)}
              className="hover:text-primary/80"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {selectedFilters.colors.map((color) => (
          <span
            key={color}
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
          >
            Boja: {getFilterName("colors", color)}
            <button
              onClick={() => onRemoveFilter("colors", color)}
              className="hover:text-primary/80"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {selectedFilters.sizes.map((size) => (
          <span
            key={size}
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
          >
            Veličina: {getFilterName("sizes", size)}
            <button
              onClick={() => onRemoveFilter("sizes", size)}
              className="hover:text-primary/80"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {selectedFilters.materials.map((material) => (
          <span
            key={material}
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
          >
            Materijal: {getFilterName("materials", material)}
            <button
              onClick={() => onRemoveFilter("materials", material)}
              className="hover:text-primary/80"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {(selectedFilters.minPrice > 0 || selectedFilters.maxPrice < 10000) && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
            Cena: €{selectedFilters.minPrice} - €{selectedFilters.maxPrice}
            <button
              onClick={() => {
                onRemoveFilter("minPrice", "0");
                onRemoveFilter("maxPrice", "10000");
              }}
              className="hover:text-primary/80"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
