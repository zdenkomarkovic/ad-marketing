"use client";

import { LayoutGrid, List } from "lucide-react";
import { Button } from "./ui/button";

interface ProductsToolbarProps {
  totalProducts: number;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
}

export default function ProductsToolbar({
  totalProducts,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  itemsPerPage,
  onItemsPerPageChange,
  searchTerm,
  onSearchChange,
}: ProductsToolbarProps) {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 p-4 bg-card border border-border rounded-lg">
      {/* Left side - Product count and items per page */}
      <div className="flex items-center gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground">
          Ukupno proizvoda: <span className="font-semibold text-foreground">{totalProducts}</span>
        </p>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Prikaži po:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={36}>36</option>
            <option value={48}>48</option>
          </select>
        </div>
      </div>

      {/* Middle - Search bar */}
      <div className="relative w-full lg:w-80 xl:w-96">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Pretraži po imenu ili šifri..."
          className="w-full px-4 py-1.5 pl-9 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Right side - Sort and view mode */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Sortiranje:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          >
            <option value="name-asc">Naziv (A-Z)</option>
            <option value="name-desc">Naziv (Z-A)</option>
            <option value="price-asc">Cena (niža prvo)</option>
            <option value="price-desc">Cena (viša prvo)</option>
            <option value="newest">Najnovije</option>
          </select>
        </div>

        <div className="flex items-center gap-1 border border-border rounded-md p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="h-8 w-8 p-0"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="h-8 w-8 p-0"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
