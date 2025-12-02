"use client";

interface ProductsToolbarProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
}

export default function ProductsToolbar({
  sortBy,
  onSortChange,
  searchTerm,
  onSearchChange,
}: ProductsToolbarProps) {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 p-4 bg-card border border-border rounded-lg">
      {/* Middle - Search bar */}
      <div className="relative w-full lg:w-80 xl:w-96">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Pretraži po imenu ili šifri..."
          className="w-full text-muted px-4 py-1.5 placeholder:text-muted pl-9 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
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
            <svg
              className="w-4 h-4 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
            className="px-3 py-1.5 text-sm text-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          >
            <option value="name-asc">Naziv (A-Z)</option>
            <option value="name-desc">Naziv (Z-A)</option>
            <option value="price-asc">Cena (niža prvo)</option>
            <option value="price-desc">Cena (viša prvo)</option>
            <option value="newest">Najnovije</option>
          </select>
        </div>
      </div>
    </div>
  );
}
